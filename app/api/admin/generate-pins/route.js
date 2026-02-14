import { NextResponse } from "next/server";
import { admin, adminDb } from "@/lib/firebase/admin";

function generatePin() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const PRICE_MAP = {
  starter: 300,
  builder: 500,
  entrepreneurship: 1000,
};

export async function POST(req) {
  try {
    const { quantity, packageType } = await req.json();

    const batch = adminDb.batch();

    for (let i = 0; i < quantity; i++) {
      const ref = adminDb.collection("pins").doc();
      batch.set(ref, {
        code: generatePin(),
        package: packageType,
        price: PRICE_MAP[packageType], // ✅ PRICE, NOT POINTS
        status: "available",
        assignedTo: null,
        usedBy: null,
        createdBy: "admin",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate pins" },
      { status: 500 }
    );
  }
}
