"use client";

export default function WalletPage() {
  const totalEarned = 32500;
  const withdrawn = 18000;
  const available = totalEarned - withdrawn;

  const WALLET_HISTORY = [
    {
      id: 1,
      source: "Pairing Conversion",
      description: "Converted 500 points",
      amount: 2500,
      date: "Jan 22, 2026",
    },
    {
      id: 2,
      source: "Direct Referral",
      description: "Referral: Maria S.",
      amount: 1000,
      date: "Jan 20, 2026",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <Header
        title="Wallet"
        subtitle="Your withdrawable earnings converted from points"
      />

      {/* BALANCE */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat title="Available Balance" value={`₱${available.toLocaleString()}`} />
        <Stat title="Total Earned" value={`₱${totalEarned.toLocaleString()}`} />
        <Stat title="Withdrawn" value={`₱${withdrawn.toLocaleString()}`} />
      </div>

      {/* INFO */}
      <div className="hiroma-card text-sm text-slate-600">
        💡 Earnings in your wallet come from <b>converted points</b> and
        <b> direct referral bonuses</b>. Only wallet balance can be withdrawn.
      </div>

      {/* HISTORY */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Source</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {WALLET_HISTORY.map(w => (
              <tr key={w.id} className="border-b last:border-b-0">
                <td className="px-4 py-3">{w.source}</td>
                <td className="px-4 py-3 text-slate-500">{w.description}</td>
                <td className="px-4 py-3 font-medium text-green-600">
                  ₱{w.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-slate-500">{w.date}</td>
              </tr>
            ))}
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
