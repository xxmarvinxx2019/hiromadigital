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

    const userId = req.nextUrl.searchParams.get("userId") || decoded.uid;

    const snap = await adminDb
  .collection("transactions")
  .where("userId", "==", userId)
  .limit(50)
  .get();


    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate().toISOString(),
    }));

    return NextResponse.json({ transactions: data });
  } catch (err) {
    console.error("EARNINGS API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load earnings" },
      { status: 500 }
    );
  }
}
