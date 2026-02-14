import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

async function buildTree(uid, depth = 3) {
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

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await adminAuth.verifyIdToken(token);

    const tree = await buildTree(decoded.uid, 4);

    return NextResponse.json({ tree });
  } catch (err) {
    console.error("TREE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load tree" },
      { status: 500 }
    );
  }
}
