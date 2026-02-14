"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AssignPinModal({
  open,
  pin,
  distributors,
  onClose,
  onAssign,
}) {
  const [selectedDistributor, setSelectedDistributor] = useState(null);

  if (!open || !pin) return null;

  return (
    <>
      {/* ================= BACKDROP ================= */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ================= MODAL ================= */}
      <div className="fixed z-50 top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Assign PIN</h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-slate-500">PIN Code</p>
            <p className="font-mono">{pin.code}</p>
          </div>

          <div>
            <p className="text-slate-500">Package</p>
            <p>{pin.package}</p>
          </div>

          {/* Distributor Select */}
          <div>
            <label className="block mb-1 text-slate-500">
              Assign to Distributor
            </label>

            <select
              value={selectedDistributor?.id || ""}
              onChange={(e) => {
                const distributor = distributors.find(
                  (d) => d.id === e.target.value
                );
                setSelectedDistributor(distributor || null);
              }}
              className="
                w-full rounded-lg
                border border-slate-300
                bg-white
                px-3 py-2.5
                text-sm
                shadow-sm
                transition
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
              "
            >
              <option value="">Select distributor</option>
              {distributors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.firstName} {d.lastName} — {d.location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="hiroma-btn hiroma-btn-secondary w-full"
          >
            Cancel
          </button>

          <button
            disabled={!selectedDistributor}
            onClick={() => onAssign(selectedDistributor)}
            className="hiroma-btn hiroma-btn-primary w-full disabled:opacity-50"
          >
            Confirm Assignment
          </button>
        </div>
      </div>
    </>
  );
}
