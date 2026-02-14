"use client";

import { useState } from "react";

/* ================= MOCK AVAILABLE PRODUCTS ================= */

const AVAILABLE_PRODUCTS = [
  {
    productId: "clio",
    name: "Clio Perfume",
    available: 65,
  },
  {
    productId: "aria",
    name: "Aria Perfume",
    available: 40,
  },
];

/* ================= INPUT STYLES (TAILWIND SAFE) ================= */

const INPUT =
  "w-full rounded-lg bg-slate-100 px-4 py-2 text-sm " +
  "border border-slate-200 transition " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

const SELECT =
  "w-full rounded-lg bg-slate-100 px-4 py-2 pr-10 text-sm " +
  "border border-slate-200 appearance-none transition " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

const LABEL = "text-sm font-medium text-slate-600";

/* ================= PAGE ================= */

export default function RequestStockPage() {
  const [items, setItems] = useState([
    { productId: "", qty: 1 },
  ]);

  const addItem = () => {
    setItems([...items, { productId: "", qty: 1 }]);
  };

  const updateItem = (index, field, value) => {
    setItems(
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Request Stock</h1>
        <p className="text-sm text-slate-500">
          Request products from your upline distributor
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {items.map((item, idx) => {
          const selectedProduct = AVAILABLE_PRODUCTS.find(
            p => p.productId === item.productId
          );

          return (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
            >
              {/* PRODUCT SELECT */}
              <div>
                <label className={LABEL}>Product</label>
                <div className="relative">
                  <select
                    className={SELECT}
                    value={item.productId}
                    onChange={e =>
                      updateItem(idx, "productId", e.target.value)
                    }
                  >
                    <option value="">Select product</option>
                    {AVAILABLE_PRODUCTS.map(p => (
                      <option key={p.productId} value={p.productId}>
                        {p.name} (Available: {p.available})
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    ▼
                  </span>
                </div>
              </div>

              {/* QUANTITY */}
              <div>
                <label className={LABEL}>Quantity</label>
                <input
                  type="number"
                  min="1"
                  className={INPUT}
                  value={item.qty}
                  onChange={e =>
                    updateItem(idx, "qty", Number(e.target.value))
                  }
                />
              </div>

              {/* REMOVE */}
              <div className="flex md:justify-end">
                <button
                  onClick={() => removeItem(idx)}
                  className="hiroma-btn hiroma-btn-secondary"
                >
                  Remove
                </button>
              </div>

              {/* AVAILABLE INFO */}
              {selectedProduct && (
                <div className="md:col-span-3 text-xs text-slate-500">
                  Available stock for <b>{selectedProduct.name}</b>:{" "}
                  {selectedProduct.available}
                </div>
              )}
            </div>
          );
        })}

        {/* ADD PRODUCT */}
        <button
          onClick={addItem}
          className="hiroma-btn hiroma-btn-secondary"
        >
          + Add Another Product
        </button>

        {/* SUBMIT */}
        <div className="flex justify-end pt-4">
          <button className="hiroma-btn hiroma-btn-primary">
            Submit Stock Request
          </button>
        </div>
      </div>

      {/* INFO */}
      <div className="hiroma-card text-sm text-slate-600">
        ℹ️ Stock requests are manually reviewed by your distributor or admin.
      </div>
    </div>
  );
}
