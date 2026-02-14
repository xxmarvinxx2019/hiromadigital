"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase/client";

/* ================= PAGE ================= */

export default function DistributorWithdrawals() {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    fetchWithdrawals();
  }, []);

  /* ================= FETCH ================= */

  async function fetchWithdrawals() {
    setLoading(true);

    try {
      const uid = auth.currentUser.uid;

      const q = query(
        collection(db, "withdrawals"),
        where("distributorId", "==", uid),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      setWithdrawals(rows);
    } catch (err) {
      console.error("Failed to load distributor withdrawals:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================= ACTIONS ================= */

  async function markAsPaid(withdrawalId) {
    if (!confirm("Confirm reseller has been paid?")) return;

    setProcessing(true);

    try {
      const ref = doc(db, "withdrawals", withdrawalId);

      await updateDoc(ref, {
        status: "paid_by_distributor",
        paidAt: Timestamp.now(),
      });

      fetchWithdrawals();
    } catch (err) {
      console.error("Failed to mark as paid:", err);
      alert("Failed to update withdrawal");
    } finally {
      setProcessing(false);
    }
  }

  /* ================= RENDER ================= */

  const pending = withdrawals.filter(
    w => w.status === "pending_distributor"
  );

  const paid = withdrawals.filter(
    w => w.status === "paid_by_distributor"
  );

  return (
    <div className="space-y-8">
      <Header
        title="Withdrawal Requests"
        subtitle="Pay resellers and submit settlement to admin"
      />

      {/* ================= PENDING ================= */}
      <Panel title="Pending Requests">
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : pending.length === 0 ? (
          <p className="text-sm text-slate-500">
            No pending requests.
          </p>
        ) : (
          pending.map(w => (
            <Row key={w.id}>
              <span>{w.resellerName}</span>
              <span>₱{w.amount.toLocaleString()}</span>
              <button
                className="hiroma-btn hiroma-btn-secondary"
                disabled={processing}
                onClick={() => markAsPaid(w.id)}
              >
                Mark as Paid
              </button>
            </Row>
          ))
        )}
      </Panel>

      {/* ================= PAID ================= */}
      <Panel title="Paid (Waiting Admin)">
        {paid.length === 0 ? (
          <p className="text-sm text-slate-500">
            No paid withdrawals yet.
          </p>
        ) : (
          paid.map(w => (
            <Row key={w.id}>
              <span>{w.resellerName}</span>
              <span>₱{w.amount.toLocaleString()}</span>
              <StatusPill status="paid_by_distributor" />
            </Row>
          ))
        )}
      </Panel>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

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

function StatusPill({ status }) {
  const styles = {
    pending_distributor: "bg-amber-100 text-amber-700",
    paid_by_distributor: "bg-blue-100 text-blue-700",
    settled_by_admin: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const labels = {
    pending_distributor: "Pending (Distributor)",
    paid_by_distributor: "Paid by Distributor",
    settled_by_admin: "Settled",
    rejected: "Rejected",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
