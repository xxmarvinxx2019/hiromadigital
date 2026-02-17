import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

/* ================= BUILD TREE (IDENTICAL TO RESELLER) ================= */

async function buildTree(uid, depth = 10) {
  if (!uid || depth === 0) return null;

  const snap = await adminDb.collection("users").doc(uid).get();
  if (!snap.exists) return null;

  const user = snap.data();

  const referral = user.referralEarnings || 0;
  const pairing = user.pairingEarnings || 0;

  return {
    id: uid,
    name: `${user.firstName} ${user.lastName}`,
    username: user.email,

    leftPoints: user.leftPoints || 0,
    rightPoints: user.rightPoints || 0,

    referralEarnings: referral,
    pairingEarnings: pairing,
    totalEarnings: referral + pairing,

    left: user.left
      ? await buildTree(user.left, depth - 1)
      : null,
    right: user.right
      ? await buildTree(user.right, depth - 1)
      : null,
  };
}

/* ================= FIND GLOBAL ROOT ================= */

async function findRootReseller() {
  const snap = await adminDb
    .collection("users")
    .where("role", "==", "reseller")
    .where("parentId", "==", null)
    .limit(1)
    .get();

  if (snap.empty) return null;
  return snap.docs[0].id;
}

/* ================= HANDLER ================= */

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    await adminAuth.verifyIdToken(token);

    const rootUid = await findRootReseller();
    if (!rootUid) {
      return NextResponse.json({ tree: null });
    }

    const tree = await buildTree(rootUid, 10);
    return NextResponse.json({ tree });

  } catch (err) {
    console.error("PLACEMENT TREE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load placement tree" },
      { status: 500 }
    );
  }
}
