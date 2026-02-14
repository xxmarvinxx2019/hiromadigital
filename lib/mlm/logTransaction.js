import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";

export async function logTransaction(tx, data) {
  const ref = adminDb.collection("transactions").doc();
  tx.set(ref, {
    ...data,
    createdAt: Timestamp.now(),
  });
}
