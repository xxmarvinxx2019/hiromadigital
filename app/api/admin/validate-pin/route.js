import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase/admin";

export async function POST(req) {
  try {
    /* ================= AUTH ================= */
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await adminAuth.verifyIdToken(token);

    if (!decoded?.uid) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    /* ================= BODY ================= */
    const { pinCode } = await req.json();

    if (!pinCode) {
      return NextResponse.json(
        { error: "PIN code is required" },
        { status: 400 }
      );
    }

    /* ================= PIN LOOKUP ================= */
    const snap = await adminDb
      .collection("pins")
      .where("code", "==", pinCode)
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json(
        { error: "Invalid PIN" },
        { status: 404 }
      );
    }

    const pinDoc = snap.docs[0];
    const pin = pinDoc.data();

    /* ================= STATUS CHECK ================= */
    if (pin.status !== "Assigned") {
      return NextResponse.json(
        { error: "PIN already used or assigned" },
        { status: 400 }
      );
    }

    /* ================= SUCCESS ================= */
    return NextResponse.json({
      valid: true,
      pinId: pinDoc.id,
      package: pin.package,
      distributorId: pin.assignedTo,
    });

  } catch (err) {
    console.error("VALIDATE PIN ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
