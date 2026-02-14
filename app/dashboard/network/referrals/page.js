"use client";

const REFERRALS = [
  {
    id: 1,
    name: "Maria Santos",
    package: "Builder",
    status: "Active",
    joined: "Jan 15, 2026",
  },
  {
    id: 2,
    name: "John Dela Cruz",
    package: "Starter",
    status: "Active",
    joined: "Jan 18, 2026",
  },
  {
    id: 3,
    name: "Anna Reyes",
    package: "Entrepreneurship",
    status: "Inactive",
    joined: "Jan 22, 2026",
  },
];

export default function MyReferralsPage() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <Header
        title="My Referrals"
        subtitle="People you personally invited"
      />

      {/* SUMMARY */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat title="Total Referrals" value={REFERRALS.length} />
        <Stat
          title="Active"
          value={REFERRALS.filter(r => r.status === "Active").length}
        />
        <Stat
          title="Inactive"
          value={REFERRALS.filter(r => r.status === "Inactive").length}
        />
      </div>

      {/* TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Package</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {REFERRALS.map(r => (
              <tr key={r.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3">{r.package}</td>
                <td className="px-4 py-3">
                  <StatusPill status={r.status} />
                </td>
                <td className="px-4 py-3 text-slate-500">{r.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="md:hidden space-y-3">
        {REFERRALS.map(r => (
          <div key={r.id} className="hiroma-card space-y-2">
            <p className="font-medium">{r.name}</p>
            <InfoRow label="Package" value={r.package} />
            <InfoRow label="Status" value={r.status} />
            <InfoRow label="Joined" value={r.joined} />
          </div>
        ))}
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

function StatusPill({ status }) {
  const styles = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
      {status}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}
