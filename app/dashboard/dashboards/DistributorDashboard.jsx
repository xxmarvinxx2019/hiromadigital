export default function DistributorDashboard() {
  return (
    <div className="space-y-8">
      <Header
        title="Distributor Dashboard"
        subtitle="Manage resellers, inventory, and payouts"
      />

      <div className="grid md:grid-cols-3 gap-4">
        <Stat title="My Resellers" value="312" />
        <Stat title="Inventory Balance" value="980 units" />
        <Stat title="Pending Withdrawals" value="17" alert />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Panel title="Quick Actions">
          <Action>Register New Reseller</Action>
          <Action>Request Inventory</Action>
          <Action>Process Withdrawal</Action>
        </Panel>

        <Panel title="Recent Registrations">
          <ul className="text-sm space-y-2 text-slate-600">
            <li>• Maria S. (Builder Package)</li>
            <li>• John D. (Starter Package)</li>
            <li>• Alex P. (Entrepreneur)</li>
          </ul>
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
