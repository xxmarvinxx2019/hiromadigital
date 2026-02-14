import { NextResponse } from "next/server";
import { adminDb, admin } from "@/lib/firebase/admin";

export async function POST(req) {
  const { pinId, distributorUid } = await req.json();

  await adminDb.collection("pins").doc(pinId).update({
    status: "assigned",
    assignedTo: distributorUid,
    assignedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ success: true });
}
