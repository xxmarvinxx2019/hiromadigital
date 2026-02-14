export default function ResellerDashboard() {
  return (
    <div className="space-y-8">
      <Header
        title="Welcome Back 👋"
        subtitle="Here’s how your business is growing"
      />

      <div className="grid md:grid-cols-3 gap-4">
        <Stat title="Total Points" value="3,450" />
        <Stat title="Available Balance" value="₱12,300" />
        <Stat title="Direct Referrals" value="18" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Panel title="Network Growth">
          <p className="text-sm text-slate-500">
            Your left and right teams are growing steadily.
          </p>
          <div className="mt-4 h-24 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
            Network chart placeholder
          </div>
        </Panel>

        <Panel title="Next Steps">
          <Action>Invite a new reseller</Action>
          <Action>View network tree</Action>
          <Action>Request withdrawal</Action>
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
