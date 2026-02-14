"use client";

const POINTS = [
  {
    id: 1,
    type: "Pairing",
    left: 500,
    right: 500,
    used: 500,
    remaining: 0,
    date: "Jan 22, 2026",
  },
  {
    id: 2,
    type: "Pairing",
    left: 1000,
    right: 500,
    used: 500,
    remaining: 500,
    date: "Jan 20, 2026",
  },
  {
    id: 3,
    type: "Spillover",
    left: 300,
    right: 0,
    used: 0,
    remaining: 300,
    date: "Jan 18, 2026",
  },
];

export default function PointsPage() {
  const totalLeft = POINTS.reduce((s, p) => s + p.left, 0);
  const totalRight = POINTS.reduce((s, p) => s + p.right, 0);
  const usedPoints = POINTS.reduce((s, p) => s + p.used, 0);
  const remainingPoints = POINTS.reduce((s, p) => s + p.remaining, 0);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <Header
        title="Points & Pairing"
        subtitle="Track your pairing points and spillovers"
      />

      {/* SUMMARY */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Stat title="Left Points" value={totalLeft} />
        <Stat title="Right Points" value={totalRight} />
        <Stat title="Used Points" value={usedPoints} />
        <Stat title="Remaining Points" value={remainingPoints} />
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
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
            {POINTS.map(p => (
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
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {POINTS.map(p => (
          <div key={p.id} className="hiroma-card space-y-2">
            <div className="flex justify-between font-medium">
              <span>{p.type}</span>
              <span className="text-slate-500">{p.date}</span>
            </div>
            <InfoRow label="Left" value={p.left} />
            <InfoRow label="Right" value={p.right} />
            <InfoRow label="Used" value={p.used} accent="blue" />
            <InfoRow label="Remaining" value={p.remaining} accent="green" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= UI HELPERS ================= */

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

function InfoRow({ label, value, accent }) {
  const color =
    accent === "blue"
      ? "text-blue-600"
      : accent === "green"
      ? "text-green-600"
      : "text-slate-800";

  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`font-medium ${color}`}>{value}</span>
    </div>
  );
}
