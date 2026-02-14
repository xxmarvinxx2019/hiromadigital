"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  getDocs,
  getDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase/client";

/* ================= PAGE ================= */

export default function ResellerWithdrawals() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pending: 0,
    withdrawn: 0,
    available: 0,
  });

  useEffect(() => {
    if (!auth.currentUser) return;
    fetchData();
  }, []);

  /* ================= FETCH ================= */

  async function fetchData() {
    setLoading(true);

    try {
      const uid = auth.currentUser.uid;

      /* ---------- USER ---------- */
      const userSnap = await getDoc(doc(db, "users", uid));
      if (!userSnap.exists()) throw new Error("User not found");

      const user = userSnap.data();
      console.log(user)
      const totalEarnings = user.totalEarnings || 0;

      /* ---------- WITHDRAWALS ---------- */
      const q = query(
        collection(db, "withdrawals"),
        where("resellerId", "==", uid),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const rows = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));

      const pending = rows
        .filter(w => w.status === "pending_distributor")
        .reduce((s, w) => s + w.amount, 0);

      const withdrawn = rows
        .filter(w =>
          ["paid_by_distributor", "settled_by_admin"].includes(w.status)
        )
        .reduce((s, w) => s + w.amount, 0);

      setWithdrawals(rows);
      setStats({
        totalEarnings,
        pending,
        withdrawn,
        available: Math.max(totalEarnings - pending - withdrawn, 0),
      });
    } catch (err) {
      console.error("Failed to load withdrawals:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================= SUBMIT ================= */

  async function submitRequest() {
    if (!amount || Number(amount) <= 0) return;

    const value = Number(amount);
    if (value > stats.available) {
      alert("Amount exceeds available balance");
      return;
    }

    setSubmitting(true);

    try {
      const uid = auth.currentUser.uid;

      /* ---------- RESELLER (NO DISTRIBUTOR READ) ---------- */
      const resellerSnap = await getDoc(doc(db, "users", uid));
      if (!resellerSnap.exists()) {
        throw new Error("Reseller not found");
      }

      const reseller = resellerSnap.data();

      /* ---------- CREATE WITHDRAWAL ---------- */
      await addDoc(collection(db, "withdrawals"), {
        resellerId: uid,
        resellerName: `${reseller.firstName} ${reseller.lastName}`,
        distributorId: reseller.distributorId,
        distributorName:
          reseller.distributorName || "Unknown Distributor",
        amount: value,
        status: "pending_distributor",
        createdAt: Timestamp.now(),
      });

      setAmount("");
      setOpen(false);
      fetchData();
    } catch (err) {
      console.error("Withdrawal request failed:", err);
      alert("Failed to submit withdrawal");
    } finally {
      setSubmitting(false);
    }
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-8">
      <Header
        title="Withdrawals"
        subtitle="Request and track your earnings"
      />

      {/* STATS */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat
          title="Available Balance"
          value={`₱${stats.available.toLocaleString()}`}
        />
        <Stat
          title="Pending"
          value={`₱${stats.pending.toLocaleString()}`}
        />
        <Stat
          title="Withdrawn"
          value={`₱${stats.withdrawn.toLocaleString()}`}
        />
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <button
          className="hiroma-btn hiroma-btn-primary"
          onClick={() => setOpen(true)}
          disabled={stats.available <= 0}
        >
          Request Withdrawal
        </button>
      </div>

      {/* HISTORY */}
      <Panel title="Withdrawal History">
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : withdrawals.length === 0 ? (
          <p className="text-sm text-slate-500">
            No withdrawals yet.
          </p>
        ) : (
          withdrawals.map(w => (
            <Row key={w.id}>
              <span>₱{w.amount.toLocaleString()}</span>
              <span className="text-slate-500">
                {w.createdAt?.toDate
                  ? w.createdAt.toDate().toLocaleDateString()
                  : "—"}
              </span>
              <StatusPill status={w.status} />
            </Row>
          ))
        )}
      </Panel>

      {/* MODAL */}
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <h3 className="text-lg font-semibold mb-4">
            Request Withdrawal
          </h3>

          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full px-3 py-2 rounded-md bg-slate-100 mb-4"
          />

          <button
            className="hiroma-btn hiroma-btn-primary w-full"
            onClick={submitRequest}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Header({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
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

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl p-6 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
