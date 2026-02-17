import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

async function collectTree(uid, results = []) {
  const snap = await adminDb.collection("users").doc(uid).get();
  if (!snap.exists) return;

  const u = snap.data();

  results.push({
    id: uid,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    left: u.left || null,
    right: u.right || null,
  });

  if (u.left) await collectTree(u.left, results);
  if (u.right) await collectTree(u.right, results);

  return results;
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer "))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    await adminAuth.verifyIdToken(token);

    const { rootId, keyword } = await req.json();

    if (!rootId || !keyword)
      return NextResponse.json({ results: [] });

    const all = await collectTree(rootId);

    const filtered = all.filter((u) =>
      u.name.toLowerCase().includes(keyword.toLowerCase()) ||
      u.email.toLowerCase().includes(keyword.toLowerCase())
    );

    return NextResponse.json({ results: filtered });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
