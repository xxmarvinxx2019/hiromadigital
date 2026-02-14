import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req) {
  try {
    /* ===== AUTH ===== */
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await adminAuth.verifyIdToken(token);

    const adminSnap = await adminDb
      .collection("users")
      .doc(decoded.uid)
      .get();

    if (!adminSnap.exists || adminSnap.data().role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* ===== BODY ===== */
    const { distributorId, withdrawalIds } = await req.json();

    if (!Array.isArray(withdrawalIds) || withdrawalIds.length === 0) {
      return NextResponse.json({ error: "No withdrawals" }, { status: 400 });
    }

    /* ===== BATCH ===== */
    const batch = adminDb.batch();

    withdrawalIds.forEach(id => {
      const ref = adminDb.collection("withdrawals").doc(id);

      batch.update(ref, {
        status: "settled_by_admin",
        settledAt: Timestamp.now(),
      });
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ADMIN SETTLEMENT ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
