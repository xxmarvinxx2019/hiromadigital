export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <Header
        title="System Overview"
        subtitle="Monitor distributors, resellers, inventory, and payouts"
      />

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4">
        <Stat title="Distributors" value="128" trend="+5%" />
        <Stat title="Resellers" value="4,320" trend="+132" />
        <Stat title="Active PINs" value="1,240" />
        <Stat title="Pending Withdrawals" value="42" alert />
      </div>

      {/* PANELS */}
      <div className="grid md:grid-cols-2 gap-6">
        <Panel title="Recent Activity">
          <ul className="text-sm space-y-2 text-slate-600">
            <li>• Distributor PH-North requested inventory</li>
            <li>• 12 new resellers registered today</li>
            <li>• 5 withdrawal requests awaiting approval</li>
          </ul>
        </Panel>

        <Panel title="Admin Actions">
          <Action>Generate PIN codes</Action>
          <Action>Manage distributors</Action>
          <Action>Review withdrawals</Action>
        </Panel>
      </div>
    </div>
  );
}
function Header({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function Stat({ title, value, trend, alert }) {
  return (
    <div
      className={`rounded-xl p-4 shadow-sm bg-white ${
        alert ? "ring-1 ring-red-300" : ""
      }`}
    >
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
      {trend && (
        <p className="text-xs text-green-600 mt-1">{trend}</p>
      )}
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

function Action({ children }) {
  return (
    <button className="block w-full text-left px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm">
      {children}
    </button>
  );
}
