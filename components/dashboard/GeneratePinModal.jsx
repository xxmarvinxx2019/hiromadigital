"use client";

import { useState } from "react";
import { X, Package } from "lucide-react";

export default function GeneratePinModal({ open, onClose, onGenerate }) {
  const [selectedPackage, setSelectedPackage] = useState("Starter");
  const [quantity, setQuantity] = useState(1);

  if (!open) return null;

  return (
    <>
      {/* ================= BACKDROP ================= */}
      <div
        className="
          fixed inset-0 z-40
          bg-black/40
          backdrop-blur-sm
          animate-fade-in
        "
        onClick={onClose}
      />

      {/* ================= MODAL ================= */}
      <div
        className="
          fixed z-50
          bottom-0 sm:bottom-auto
          left-0 right-0 sm:left-1/2
          sm:top-1/2
          sm:-translate-x-1/2 sm:-translate-y-1/2
          w-full sm:max-w-lg
          bg-white
          rounded-t-2xl sm:rounded-2xl
          shadow-2xl
          p-6
          animate-modal-in
        "
      >
        {/* ================= HEADER ================= */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Generate PIN</h3>
            <p className="text-sm text-[var(--hiroma-muted)]">
              Create reseller registration PINs
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* ================= PACKAGE SELECTION ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {["Starter", "Builder", "Entrepreneurship"].map((pkg) => (
    <button
      key={pkg}
      onClick={() => setSelectedPackage(pkg)}
      className={`
        rounded-xl p-4 text-left transition
        border border-[var(--hiroma-border)]
        ${
          selectedPackage === pkg
            ? "ring-2 ring-blue-600 bg-blue-50"
            : "hover:bg-slate-50"
        }
      `}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Package size={16} className="shrink-0" />
          <span className="font-medium">{pkg}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--hiroma-muted)] leading-relaxed">
          {pkg === "Starter" &&
            "Entry-level package for new resellers starting their fragrance business."}
          {pkg === "Builder" &&
            "Mid-tier package designed for active network builders and growing teams."}
          {pkg === "Entrepreneurship" &&
            "Full business package for serious leaders focused on long-term growth and expansion."}
        </p>
      </div>
    </button>
  ))}
</div>


        {/* ================= QUANTITY ================= */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="
              w-full
              px-3 py-2
              rounded-lg
              border border-[var(--hiroma-border)]
              text-sm
              focus:outline-none
              focus:ring-2 focus:ring-blue-500/30
            "
          />
        </div>

        {/* ================= FOOTER ACTIONS ================= */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="hiroma-btn hiroma-btn-secondary w-full"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onGenerate({
                selectedPackage,
                quantity,
              })
            }
            className="hiroma-btn hiroma-btn-primary w-full"
          >
            Generate PIN
          </button>
        </div>
      </div>
    </>
  );
}
