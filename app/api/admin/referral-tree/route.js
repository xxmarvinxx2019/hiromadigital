import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

/* ================= TREE BUILDER (SAME AS RESELLER) ================= */

async function buildTree(uid, depth = 4) {
  if (!uid || depth === 0) return null;

  const snap = await adminDb.collection("users").doc(uid).get();
  if (!snap.exists) return null;

  const u = snap.data();

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

    left: u.left ? await buildTree(u.left, depth - 1) : null,
    right: u.right ? await buildTree(u.right, depth - 1) : null,
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

    // Find referral reseller
    const snap = await adminDb
      .collection("users")
      .where("email", "==", email)
      .where("role", "==", "reseller")
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ tree: null });
    }

    const referralUid = snap.docs[0].id;

    // 🔥 EXACT SAME TREE AS RESELLER PAGE
    const tree = await buildTree(referralUid, 4);

    return NextResponse.json({ tree });
  } catch (err) {
    console.error("REFERRAL TREE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load referral tree" },
      { status: 500 }
    );
  }
}
