"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/client";

/* ================= PAGE ================= */

export default function AdminWithdrawalsPage() {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    fetchPendingSettlements();
  }, []);

  /* ================= FETCH ================= */

  async function fetchPendingSettlements() {
    setLoading(true);

    try {
      const q = query(
        collection(db, "withdrawals"),
        where("status", "==", "paid_by_distributor")
      );

      const snap = await getDocs(q);

      const map = {};

      snap.docs.forEach(docSnap => {
        const w = { id: docSnap.id, ...docSnap.data() };

        if (!map[w.distributorId]) {
          map[w.distributorId] = {
            distributorId: w.distributorId,
            total: 0,
            withdrawals: [],
          };
        }

        map[w.distributorId].total += w.amount;
        map[w.distributorId].withdrawals.push(w);
      });

      setGroups(Object.values(map));
    } catch (err) {
      console.error("Failed to load admin settlements:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================= ACTION ================= */

  async function markAsSettled(group) {
    if (
      !confirm(
        `Mark ₱${group.total.toLocaleString()} as settled for this distributor?`
      )
    )
      return;

    setProcessing(true);

    try {
      const token = await auth.currentUser.getIdToken();

      const res = await fetch("/api/admin/settle-withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          withdrawalIds: group.withdrawals.map(w => w.id),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await fetchPendingSettlements();
    } catch (err) {
      console.error("Failed to settle withdrawals:", err);
      alert("Failed to mark settlements");
    } finally {
      setProcessing(false);
    }
  }

  /* ================= RENDER ================= */

  return (
    <div className="space-y-8">
      <Header
        title="Distributor Settlements"
        subtitle="Reimburse distributors for reseller payouts"
      />

      <Panel title="Pending Settlements">
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : groups.length === 0 ? (
          <p className="text-sm text-slate-500">
            No pending settlements.
          </p>
        ) : (
          groups.map(group => (
            <Row key={group.distributorId}>
              <span>{group.distributorId}</span>
              <span>₱{group.total.toLocaleString()}</span>
              <button
                className="hiroma-btn hiroma-btn-primary"
                disabled={processing}
                onClick={() => markAsSettled(group)}
              >
                Mark as Settled
              </button>
            </Row>
          ))
        )}
      </Panel>
    </div>
  );
}

/* ================= UI ================= */

function Header({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
      <h2 className="font-medium">{title}</h2>
      {children}
    </div>
  );
}

function Row({ children }) {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-b-0 text-sm">
      {children}
    </div>
  );
}
