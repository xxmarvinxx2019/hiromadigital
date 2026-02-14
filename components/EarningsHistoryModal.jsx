"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";

export default function EarningsHistoryModal({ open, onClose, user }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    async function load() {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(
        `/api/network/earnings?userId=${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();
      setData(json.transactions || []);
      setLoading(false);
    }

    load();
  }, [open, user]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-xl w-full max-w-lg p-6">
        <h3 className="text-lg font-semibold mb-2">
          Earnings History
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          {user.name}
        </p>

        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-slate-500">No earnings yet.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-2">
            {data.map((t) => (
              <div
                key={t.id}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <div className="flex justify-between">
                  <span className="capitalize">{t.type}</span>
                  <span className="font-medium">
                    ₱{t.amount.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {t.description}
                </p>
                <p className="text-[11px] text-slate-400">
                  {new Date(t.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 hiroma-btn hiroma-btn-secondary w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}
