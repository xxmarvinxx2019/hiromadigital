import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await adminAuth.verifyIdToken(token);

    const rootUid = decoded.uid;

    // 🔥 Get ALL resellers (NO distributor filter)
    const usersSnap = await adminDb
      .collection("users")
      .where("role", "==", "reseller")
      .get();

    const map = {};

    usersSnap.forEach(doc => {
      const u = doc.data();

      map[doc.id] = {
        id: doc.id,
        name: `${u.firstName} ${u.lastName}`,
        username: u.email,
        parentId: u.parentId,
        leg: u.leg,
        leftPoints: u.leftPoints || 0,
        rightPoints: u.rightPoints || 0,
        referralEarnings: u.referralEarnings || 0,
        pairingEarnings: u.pairingEarnings || 0,
        totalEarnings:
          (u.referralEarnings || 0) + (u.pairingEarnings || 0),
        left: null,
        right: null,
      };
    });

    // 🔥 Link by parentId ONLY
    Object.values(map).forEach(node => {
      if (node.parentId && map[node.parentId]) {
        if (node.leg === "left") {
          map[node.parentId].left = node;
        } else if (node.leg === "right") {
          map[node.parentId].right = node;
        }
      }
    });

    const tree = map[rootUid] || null;

    return NextResponse.json({ tree });

  } catch (err) {
    console.error("TREE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load tree" },
      { status: 500 }
    );
  }
}
