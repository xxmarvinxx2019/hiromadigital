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
    const uid = decoded.uid;

    const userSnap = await adminDb.collection("users").doc(uid).get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userSnap.data();

    const txSnap = await adminDb
      .collection("transactions")
      .where("userId", "==", uid)
      .where("type", "==", "pairing")
      .get();

    const rows = txSnap.docs.map(d => ({
      id: d.id,
      type: "Pairing",
      left: d.data().points,
      right: d.data().points,
      used: d.data().points,
      remaining: 0,
      date: d.data().createdAt?.toDate().toLocaleDateString(),
    }));

    const usedPoints = rows.reduce((s, r) => s + r.used, 0);

    return NextResponse.json({
      summary: {
        left: user.leftPoints || 0,
        right: user.rightPoints || 0,
        used: usedPoints,
        remaining: (user.leftPoints || 0) + (user.rightPoints || 0),
      },
      rows,
    });
  } catch (err) {
    console.error("POINTS API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load points" },
      { status: 500 }
    );
  }
}
