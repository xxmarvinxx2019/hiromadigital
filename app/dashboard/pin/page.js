"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase/client";

/* ================= CONFIG ================= */

const PAGE_SIZE = 10;

/* ================= HELPERS ================= */

// Merge pins uniquely by ID (prevents duplicate React keys)
function mergeUniquePins(existing, incoming) {
  const map = new Map();

  for (const p of existing) map.set(p.id, p);
  for (const p of incoming) map.set(p.id, p);

  return Array.from(map.values());
}

/* ================= PAGE ================= */

export default function DistributorPinsPage() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [assignedCursor, setAssignedCursor] = useState(null);
  const [usedCursor, setUsedCursor] = useState(null);
  const [phase, setPhase] = useState("Assigned"); // Assigned → Used
  const [hasMore, setHasMore] = useState(true);

  // Global stats (NOT page based)
  const [stats, setStats] = useState({
    available: 0,
    used: 0,
    total: 0,
  });

  useEffect(() => {
    if (!auth.currentUser) return;
    fetchStats();
    fetchPins();
  }, []);

  /* ================= STATS ================= */

  async function fetchStats() {
    const base = collection(db, "pins");

    const assignedSnap = await getDocs(
      query(
        base,
        where("assignedTo", "==", auth.currentUser.uid),
        where("status", "==", "Assigned")
      )
    );

    const usedSnap = await getDocs(
      query(
        base,
        where("assignedTo", "==", auth.currentUser.uid),
        where("status", "==", "Used")
      )
    );

    setStats({
      available: assignedSnap.size,
      used: usedSnap.size,
      total: assignedSnap.size + usedSnap.size,
    });
  }

  /* ================= TABLE DATA ================= */

  async function fetchPins() {
    if (!auth.currentUser || !hasMore) return;
    setLoading(true);

    const base = collection(db, "pins");
    let fetched = [];

    /* ---------- PHASE 1: ASSIGNED (AVAILABLE) ---------- */
    if (phase === "Assigned") {
      const q = query(
        base,
        where("assignedTo", "==", auth.currentUser.uid),
        where("status", "==", "Assigned"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE),
        ...(assignedCursor ? [startAfter(assignedCursor)] : [])
      );

      const snap = await getDocs(q);

      fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAssignedCursor(snap.docs[snap.docs.length - 1] || null);

      setPins(prev => mergeUniquePins(prev, fetched));

      if (snap.size < PAGE_SIZE) {
        setPhase("Used"); // move to used pins
      }

      if (snap.size === PAGE_SIZE) {
        setLoading(false);
        return;
      }
    }

    /* ---------- PHASE 2: USED ---------- */
    if (phase === "Used") {
      const remaining = PAGE_SIZE - fetched.length;

      const q = query(
        base,
        where("assignedTo", "==", auth.currentUser.uid),
        where("status", "==", "Used"),
        orderBy("createdAt", "desc"),
        limit(remaining),
        ...(usedCursor ? [startAfter(usedCursor)] : [])
      );

      const snap = await getDocs(q);

      const usedPins = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));

      setUsedCursor(snap.docs[snap.docs.length - 1] || null);
      setPins(prev => mergeUniquePins(prev, usedPins));

      if (snap.size < remaining) {
        setHasMore(false);
      }
    }

    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <Header
        title="My PINs"
        subtitle="Manage your available and used registration PINs"
      />

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-3 gap-4">
        <Stat title="Available PINs" value={stats.available} />
        <Stat title="Used PINs" value={stats.used} />
        <Stat title="Total PINs" value={stats.total} />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {pins.length === 0 && !loading ? (
          <div className="p-6 text-center text-sm text-slate-500">
            No PINs assigned to you yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left">PIN</th>
                <th className="text-left">Package</th>
                <th className="text-left">Status</th>
                <th className="text-left">Date Assigned</th>
              </tr>
            </thead>
            <tbody>
              {pins.map(pin => (
                <tr key={pin.id} className="border-t">
                  <td className="px-4 py-3 font-mono">{pin.code}</td>
                  <td>{pin.package}</td>
                  <td>
                    <StatusPill status={pin.status} />
                  </td>
                  <td>
                    {pin.assignedAt?.toDate
                      ? pin.assignedAt.toDate().toLocaleDateString()
                      : pin.createdAt?.toDate
                      ? pin.createdAt.toDate().toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            className="hiroma-btn hiroma-btn-secondary"
            disabled={loading}
            onClick={fetchPins}
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
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

function Stat({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function StatusPill({ status }) {
  const styles =
    status === "Assigned"
      ? "bg-green-100 text-green-700"
      : status === "Used"
      ? "bg-slate-200 text-slate-700"
      : "bg-slate-100 text-slate-500";

  return (
    <span className={`px-2 py-1 rounded text-xs ${styles}`}>
      {status}
    </span>
  );
}
