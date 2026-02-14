"use client";

import { useState } from "react";

/* ================= TEMP ROLE (CHANGE MANUALLY) ================= */
const CURRENT_ROLE = "city_distributor";
// const CURRENT_ROLE = "regional_distributor";
// const CURRENT_ROLE = "provincial_distributor";
// const CURRENT_ROLE = "city_distributor";
// const CURRENT_ROLE = "reseller";

/* ================= MOCK DATA ================= */
const INPUT =
  "w-full rounded-lg bg-slate-100 px-4 py-2 text-sm " +
  "border border-slate-200 transition " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

const SELECT =
  "w-full rounded-lg bg-slate-100 px-4 py-2 pr-10 text-sm " +
  "border border-slate-200 appearance-none transition " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

const LABEL = "text-sm font-medium text-slate-600";

const INITIAL_INVENTORY = [
  { productId: "clio", name: "Clio Perfume", received: 100, sold: 35 },
  { productId: "aria", name: "Aria Perfume", received: 60, sold: 20 },
];

const TRANSACTIONS = [
  {
    id: 1,
    product: "Clio Perfume",
    qty: 10,
    type: "OUT",
    from: "Admin",
    to: "Manila Distributor",
    date: "Jan 20, 2026",
  },
  {
    id: 2,
    product: "Aria Perfume",
    qty: 5,
    type: "OUT",
    from: "Distributor",
    to: "Reseller Maria",
    date: "Jan 22, 2026",
  },
];

/* ================= PAGE ================= */

export default function InventoryPage() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [showAdd, setShowAdd] = useState(false);
  const [showRefill, setShowRefill] = useState(false);

  if (CURRENT_ROLE === "admin") {
    return (
      <>
        <AdminInventory
          inventory={inventory}
          onAdd={() => setShowAdd(true)}
          onRefill={() => setShowRefill(true)}
        />
        <AddProductModal
          open={showAdd}
          onClose={() => setShowAdd(false)}
          onSave={(product) =>
            setInventory([...inventory, product])
          }
        />
        <RefillStockModal
          open={showRefill}
          onClose={() => setShowRefill(false)}
          inventory={inventory}
          onRefill={(id, qty) =>
            setInventory(
              inventory.map(p =>
                p.productId === id
                  ? { ...p, received: p.received + qty }
                  : p
              )
            )
          }
        />
      </>
    );
  }

  if (CURRENT_ROLE.includes("distributor")) {
    return <DistributorInventory inventory={inventory} />;
  }

  return <ResellerInventory inventory={inventory} />;
}

/* ================= ADMIN ================= */

function AdminInventory({ inventory, onAdd, onRefill }) {
  const totalReceived = inventory.reduce((s, i) => s + i.received, 0);
  const totalSold = inventory.reduce((s, i) => s + i.sold, 0);

  return (
    <div className="space-y-8">
      <Header
        title="Inventory Overview"
        subtitle="System-wide stock and sales"
      />

      <div className="flex gap-3">
        <button className="hiroma-btn hiroma-btn-primary" onClick={onAdd}>
          + Add Product
        </button>
        <button className="hiroma-btn hiroma-btn-secondary" onClick={onRefill}>
          Refill Stock
        </button>
      </div>

      <Summary
        items={[
          { label: "Total Stock In", value: totalReceived },
          { label: "Total Sold", value: totalSold },
          { label: "Remaining", value: totalReceived - totalSold },
        ]}
      />

      <InventoryTable inventory={inventory} />
      <Transactions />
    </div>
  );
}

/* ================= DISTRIBUTOR ================= */

function DistributorInventory({ inventory }) {
  return (
    <div className="space-y-8">
      <Header
        title="My Inventory"
        subtitle="Stock you currently hold"
      />
      <InventoryTable inventory={inventory} showRequest />
      <Transactions />
    </div>
  );
}

/* ================= RESELLER ================= */

function ResellerInventory({ inventory }) {
  return (
    <div className="space-y-8">
      <Header
        title="My Inventory"
        subtitle="Products available for selling"
      />
      <InventoryTable inventory={inventory} />
      <div className="hiroma-card text-sm text-slate-600">
        ℹ️ Sold items are deducted automatically through inventory transfers.
      </div>
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

function Summary({ items }) {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {items.map(i => (
        <div key={i.label} className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">{i.label}</p>
          <p className="text-xl font-semibold">{i.value}</p>
        </div>
      ))}
    </div>
  );
}

function InventoryTable({ inventory, showRequest }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left">Product</th>
            <th className="px-4 py-3 text-left">Received</th>
            <th className="px-4 py-3 text-left">Sold</th>
            <th className="px-4 py-3 text-left">Remaining</th>
            {showRequest && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody>
          {inventory.map(p => (
            <tr key={p.productId} className="border-b last:border-b-0">
              <td className="px-4 py-3 font-medium">{p.name}</td>
              <td className="px-4 py-3">{p.received}</td>
              <td className="px-4 py-3 text-blue-600">{p.sold}</td>
              <td className="px-4 py-3 text-green-600">
                {p.received - p.sold}
              </td>
              {showRequest && (
                <td className="px-4 py-3 text-right">
                  <button className="hiroma-btn hiroma-btn-secondary">
                    Request
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Transactions() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <h3 className="px-4 py-3 font-medium border-b">
        Inventory Transactions
      </h3>
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left">Product</th>
            <th className="px-4 py-3 text-left">Qty</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">From</th>
            <th className="px-4 py-3 text-left">To</th>
            <th className="px-4 py-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {TRANSACTIONS.map(t => (
            <tr key={t.id} className="border-b last:border-b-0">
              <td className="px-4 py-3">{t.product}</td>
              <td className="px-4 py-3">{t.qty}</td>
              <td className="px-4 py-3 font-medium">
                {t.type === "OUT" ? "Sold" : "Received"}
              </td>
              <td className="px-4 py-3">{t.from}</td>
              <td className="px-4 py-3">{t.to}</td>
              <td className="px-4 py-3 text-slate-500">{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= MODALS ================= */

function AddProductModal({ open, onClose, onSave }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");

  if (!open) return null;

  return (
    <Modal title="Add New Product" onClose={onClose}>
      <label className={LABEL}>Product Name</label>
<input
  className={INPUT}
  placeholder="e.g. Clio Perfume"
  value={name}
  onChange={e => setName(e.target.value)}
/>

<label className={LABEL}>Initial Quantity</label>
<input
  type="number"
  className={INPUT}
  placeholder="Enter quantity"
  value={qty}
  onChange={e => setQty(e.target.value)}
/>


      <ModalActions
        onCancel={onClose}
        onConfirm={() => {
          onSave({
            productId: name.toLowerCase().replace(/\s/g, "-"),
            name,
            received: Number(qty),
            sold: 0,
          });
          onClose();
        }}
      />
    </Modal>
  );
}

function RefillStockModal({ open, onClose, inventory, onRefill }) {
  const [id, setId] = useState("");
  const [qty, setQty] = useState("");

  if (!open) return null;

  return (
    <Modal title="Refill Stock" onClose={onClose}>
      <label className={LABEL}>Select Product</label>
<div className="relative">
  <select
    className={SELECT}
    value={id}
    onChange={e => setId(e.target.value)}
  >
    <option value="">Choose product</option>
    {inventory.map(p => (
      <option key={p.productId} value={p.productId}>
        {p.name}
      </option>
    ))}
  </select>

  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
    ▼
  </span>
</div>

<label className={LABEL}>Quantity</label>
<input
  type="number"
  className={INPUT}
  placeholder="Enter quantity"
  value={qty}
  onChange={e => setQty(e.target.value)}
/>

      <ModalActions
        onCancel={onClose}
        onConfirm={() => {
          onRefill(id, Number(qty));
          onClose();
        }}
      />
    </Modal>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {children}
        <p className="text-xs text-slate-500">
          ℹ️ This creates an inventory IN transaction.
        </p>
      </div>
    </div>
  );
}

function ModalActions({ onCancel, onConfirm }) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button className="hiroma-btn hiroma-btn-secondary" onClick={onCancel}>
        Cancel
      </button>
      <button className="hiroma-btn hiroma-btn-primary" onClick={onConfirm}>
        Confirm
      </button>
    </div>
  );
}
