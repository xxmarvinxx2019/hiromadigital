import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

/* ================= PURE LEFT/RIGHT TREE BUILDER ================= */

async function buildTree(uid, visited = new Set()) {
  if (!uid) return null;
  if (visited.has(uid)) return null;

  visited.add(uid);

  const snap = await adminDb.collection("users").doc(uid).get();
  if (!snap.exists) return null;

  const u = snap.data();

  let leftNode = null;
  let rightNode = null;

  // Only build if actual child exists
  if (u.left) {
    const leftSnap = await adminDb.collection("users").doc(u.left).get();
    if (leftSnap.exists) {
      leftNode = await buildTree(u.left, visited);
    }
  }

  if (u.right) {
    const rightSnap = await adminDb.collection("users").doc(u.right).get();
    if (rightSnap.exists) {
      rightNode = await buildTree(u.right, visited);
    }
  }

  return {
    id: uid,
    name: `${u.firstName} ${u.lastName}`,
    username: u.email,

    leftPoints: u.leftPoints || 0,
    rightPoints: u.rightPoints || 0,

    referralEarnings: u.referralEarnings || 0,
    pairingEarnings: u.pairingEarnings || 0,
    totalEarnings:
      (u.referralEarnings || 0) + (u.pairingEarnings || 0),

    left: leftNode,
    right: rightNode,
  };
}

/* ================= HANDLER ================= */

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    await adminAuth.verifyIdToken(token);

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ tree: null });
    }

    const referralSnap = await adminDb
      .collection("users")
      .where("email", "==", email)
      .where("role", "==", "reseller")
      .limit(1)
      .get();

    if (referralSnap.empty) {
      return NextResponse.json({ tree: null });
    }

    const referralUid = referralSnap.docs[0].id;

    const tree = await buildTree(referralUid);

    return NextResponse.json({ tree });

  } catch (err) {
    console.error("REFERRAL TREE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load referral tree" },
      { status: 500 }
    );
  }
}
