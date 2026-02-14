import { NextResponse } from "next/server";
import { admin, adminAuth, adminDb } from "@/lib/firebase/admin";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      email,
      password,
      firstName,
      middleName,
      lastName,
      address,
      birthday,
      roleLevel, // regional | provincial | city
    } = body;

    /* ================= CREATE AUTH USER ================= */
    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    const uid = userRecord.uid;

    /* ================= CREATE FIRESTORE PROFILE ================= */
    await adminDb.collection("users").doc(uid).set({
      role:
        roleLevel === "regional"
          ? "regional_distributor"
          : roleLevel === "provincial"
          ? "provincial_distributor"
          : "city_distributor",

      email,
      firstName,
      middleName,
      lastName,
      address,
      birthday,

      status: "active",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Create distributor error:", err);

    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}
