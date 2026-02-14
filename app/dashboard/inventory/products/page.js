"use client";

import { useState } from "react";

/* ================= MOCK DATA ================= */

const INITIAL_PRODUCTS = [
  {
    id: "clio",
    name: "Clio Perfume",
    package: "Builder",
    description: "Premium floral fragrance for daily wear",
    status: "Active",
    created: "Jan 10, 2026",
  },
  {
    id: "aria",
    name: "Aria Perfume",
    package: "Starter",
    description: "Light and fresh scent for beginners",
    status: "Active",
    created: "Jan 12, 2026",
  },
  {
    id: "noir",
    name: "Noir Perfume",
    package: "Entrepreneurship",
    description: "Luxury scent for business builders",
    status: "Disabled",
    created: "Jan 15, 2026",
  },
];

/* ================= INPUT STYLES (SAFE) ================= */

const INPUT =
  "w-full rounded-lg bg-slate-100 px-4 py-2 text-sm border border-slate-200 " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

const SELECT =
  "w-full rounded-lg bg-slate-100 px-4 py-2 pr-10 text-sm border border-slate-200 appearance-none " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

const LABEL = "text-sm font-medium text-slate-600";

/* ================= PAGE ================= */

export default function AdminProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [openAdd, setOpenAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const toggleStatus = (id) => {
    setProducts(products.map(p =>
      p.id === id
        ? { ...p, status: p.status === "Active" ? "Disabled" : "Active" }
        : p
    ));
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-slate-500">
            Manage product catalog available in the system
          </p>
        </div>

        <button
          className="hiroma-btn hiroma-btn-primary"
          onClick={() => setOpenAdd(true)}
        >
          + Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Package</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b last:border-b-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-slate-500">
                    {p.description}
                  </p>
                </td>
                <td className="px-4 py-3">{p.package}</td>
                <td className="px-4 py-3">
                  <StatusPill status={p.status} />
                </td>
                <td className="px-4 py-3 text-slate-500">{p.created}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    className="hiroma-btn hiroma-btn-secondary text-xs"
                    onClick={() => setEditing(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="hiroma-btn hiroma-btn-secondary text-xs"
                    onClick={() => toggleStatus(p.id)}
                  >
                    {p.status === "Active" ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="md:hidden space-y-3">
        {products.map(p => (
          <div key={p.id} className="hiroma-card space-y-2">
            <div className="flex justify-between">
              <p className="font-medium">{p.name}</p>
              <StatusPill status={p.status} />
            </div>
            <p className="text-sm text-slate-500">{p.description}</p>
            <InfoRow label="Package" value={p.package} />
            <InfoRow label="Created" value={p.created} />
            <div className="flex gap-2 pt-2">
              <button
                className="hiroma-btn hiroma-btn-secondary text-xs w-full"
                onClick={() => setEditing(p)}
              >
                Edit
              </button>
              <button
                className="hiroma-btn hiroma-btn-secondary text-xs w-full"
                onClick={() => toggleStatus(p.id)}
              >
                {p.status === "Active" ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      {openAdd && (
        <ProductModal
          title="Add Product"
          onClose={() => setOpenAdd(false)}
          onSave={(data) => {
            setProducts([
              ...products,
              {
                ...data,
                id: data.name.toLowerCase().replace(/\s/g, "-"),
                status: "Active",
                created: "Today",
              },
            ]);
            setOpenAdd(false);
          }}
        />
      )}

      {editing && (
        <ProductModal
          title="Edit Product"
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            setProducts(
              products.map(p =>
                p.id === editing.id ? { ...p, ...data } : p
              )
            );
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

/* ================= MODAL ================= */

function ProductModal({ title, initial = {}, onClose, onSave }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    package: initial.package || "",
    description: initial.description || "",
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>

        <div>
          <label className={LABEL}>Product Name</label>
          <input
            className={INPUT}
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className={LABEL}>Package Type</label>
          <div className="relative">
            <select
              className={SELECT}
              value={form.package}
              onChange={e => setForm({ ...form, package: e.target.value })}
            >
              <option value="">Select package</option>
              <option>Starter</option>
              <option>Builder</option>
              <option>Entrepreneurship</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              ▼
            </span>
          </div>
        </div>

        <div>
          <label className={LABEL}>Description</label>
          <textarea
            rows={3}
            className={`${INPUT} resize-none`}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            className="hiroma-btn hiroma-btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="hiroma-btn hiroma-btn-primary"
            onClick={() => onSave(form)}
          >
            Save
          </button>
        </div>

        <p className="text-xs text-slate-500">
          ℹ️ Products define what can be distributed and sold in the system.
        </p>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function StatusPill({ status }) {
  const styles = {
    Active: "bg-green-100 text-green-700",
    Disabled: "bg-slate-200 text-slate-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
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
