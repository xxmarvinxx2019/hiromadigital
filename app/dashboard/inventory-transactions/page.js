"use client";

import { useState } from "react";

/* ================= ROLE ================= */
const role = "admin";

/* ================= MOCK DATA ================= */

const PRODUCTS = [
  { id: 1, name: "HIROMA Clio Eau de Parfum" },
  { id: 2, name: "HIROMA Luna Eau de Parfum" },
  { id: 3, name: "HIROMA Nova Eau de Parfum" },
];

const TRANSACTIONS = [
  {
    id: 1,
    product: "HIROMA Clio Eau de Parfum",
    type: "Stock In",
    quantity: 200,
    reason: "New supply from manufacturer",
    date: "Jan 20, 2026",
  },
  {
    id: 2,
    product: "HIROMA Luna Eau de Parfum",
    type: "Stock Out",
    quantity: 40,
    reason: "Distributed to Cebu Distributor",
    date: "Jan 22, 2026",
  },
  {
    id: 3,
    product: "HIROMA Nova Eau de Parfum",
    type: "Adjustment",
    quantity: -5,
    reason: "Damaged bottles",
    date: "Jan 23, 2026",
  },
];

/* ================= PAGE ================= */

export default function InventoryTransactionsPage() {
  if (role !== "admin") return null;

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">Inventory Transactions</h2>
        <p className="text-sm text-[var(--hiroma-muted)]">
          Track all stock movements and adjustments.
        </p>
      </div>

      {/* ACTION BAR */}
      <div className="flex justify-end">
        <button
          className="hiroma-btn hiroma-btn-primary"
          onClick={() => setOpenModal(true)}
        >
          New Transaction
        </button>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block hiroma-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-right font-medium">Qty</th>
              <th className="px-4 py-3 text-left font-medium">Reason</th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map(t => (
              <tr key={t.id} className="border-b last:border-b-0 hover:bg-slate-50">
                <td className="px-4 py-3 text-[var(--hiroma-muted)]">
                  {t.date}
                </td>
                <td className="px-4 py-3 font-medium">
                  {t.product}
                </td>
                <td className="px-4 py-3">
                  <TransactionType type={t.type} />
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {t.quantity > 0 ? `+${t.quantity}` : t.quantity}
                </td>
                <td className="px-4 py-3">
                  {t.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {TRANSACTIONS.map(t => (
          <div key={t.id} className="hiroma-card space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-[var(--hiroma-muted)]">
                {t.date}
              </span>
              <TransactionType type={t.type} />
            </div>

            <p className="font-medium">{t.product}</p>

            <InfoRow label="Quantity" value={t.quantity} />
            <InfoRow label="Reason" value={t.reason} />
          </div>
        ))}
      </div>

      {/* MODAL */}
      <TransactionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}

/* ================= COMPONENTS ================= */

function TransactionModal({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed z-50 bottom-0 sm:bottom-auto left-0 right-0 sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 animate-modal-in">
        <h3 className="text-lg font-semibold mb-4">
          New Inventory Transaction
        </h3>

        <div className="space-y-4">
          <Select label="Product" options={PRODUCTS.map(p => p.name)} />
          <Select label="Transaction Type" options={["Stock In", "Stock Out", "Adjustment"]} />
          <Input label="Quantity" type="number" />
          <Input label="Reason / Notes" placeholder="Explain why this stock changed" />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            className="hiroma-btn hiroma-btn-secondary w-full"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="hiroma-btn hiroma-btn-primary w-full">
            Save Transaction
          </button>
        </div>
      </div>
    </>
  );
}

function TransactionType({ type }) {
  const styles = {
    "Stock In": "bg-green-100 text-green-700",
    "Stock Out": "bg-blue-100 text-blue-700",
    Adjustment: "bg-amber-100 text-amber-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
      {type}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--hiroma-muted)]">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      <input
        {...props}
        className="w-full px-3 py-2 rounded-lg border border-[var(--hiroma-border)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      />
    </div>
  );
}

function Select({ label, options }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      <select className="w-full px-3 py-2 rounded-lg border border-[var(--hiroma-border)] text-sm">
        <option value="">Select {label}</option>
        {options.map(o => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
