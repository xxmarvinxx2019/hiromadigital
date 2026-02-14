"use client";

import { auth, db } from "@/lib/firebase/client";
import { signInAnonymously } from "firebase/auth";

export default function FirebaseTest() {
  return (
    <div className="p-6">
      <button
        className="hiroma-btn hiroma-btn-primary"
        onClick={async () => {
          await signInAnonymously(auth);
          console.log("Firebase connected");
        }}
      >
        Test Firebase
      </button>
    </div>
  );
}
