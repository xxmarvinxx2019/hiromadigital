"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";

export default function PointsPage() {
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch("/api/earnings/points", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSummary(data.summary);
      setRows(data.rows || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading points...</p>;
  }

  return (
    <div className="space-y-8">
      <Header
        title="Points & Pairing"
        subtitle="Track how your network generates points"
      />

      {/* SUMMARY */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Stat title="Left Points" value={summary.left} />
        <Stat title="Right Points" value={summary.right} />
        <Stat title="Used Points" value={summary.used} />
        <Stat title="Remaining Points" value={summary.remaining} />
      </div>

      <div className="hiroma-card text-sm text-slate-600">
        ⚙️ Points are used for pairing computation.
        Only <b>paired points</b> are converted into wallet earnings.
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Left</th>
              <th className="px-4 py-3 text-left">Right</th>
              <th className="px-4 py-3 text-left">Used</th>
              <th className="px-4 py-3 text-left">Remaining</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No pairing activity yet.
                </td>
              </tr>
            ) : (
              rows.map(p => (
                <tr key={p.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3">{p.type}</td>
                  <td className="px-4 py-3">{p.left}</td>
                  <td className="px-4 py-3">{p.right}</td>
                  <td className="px-4 py-3 text-blue-600 font-medium">
                    {p.used}
                  </td>
                  <td className="px-4 py-3 text-green-600 font-medium">
                    {p.remaining}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{p.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ===== UI HELPERS ===== */

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
