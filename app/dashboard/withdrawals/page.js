"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

import ResellerWithdrawals from "./views/ResellerWithdrawals";
import DistributorWithdrawals from "./views/DistributorWithdrawals";

/* ================= ROLE GROUPS ================= */

const DISTRIBUTOR_ROLES = [
  "regional_distributor",
  "provincial_distributor",
  "city_distributor",
];

export default function WithdrawalsPage() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;
    fetchRole();
  }, []);

  async function fetchRole() {
    try {
      const uid = auth.currentUser.uid;

      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        console.error("User document not found");
        return;
      }

      setRole(snap.data().role);
    } catch (err) {
      console.error("Failed to fetch user role:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading withdrawals...
      </div>
    );
  }

  // Reseller flow
  if (role === "reseller") {
    return <ResellerWithdrawals />;
  }

  // Any distributor flow
  if (DISTRIBUTOR_ROLES.includes(role)) {
    return <DistributorWithdrawals />;
  }

  return (
    <div className="p-6 text-sm text-red-600">
      Unauthorized role.
    </div>
  );
}
