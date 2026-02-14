"use client";

import { X, Copy } from "lucide-react";

export default function GeneratedPinPreviewModal({ open, pins, onClose }) {
  if (!open || !pins?.length) return null;

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

      {/* MODAL */}
      <div className="fixed z-50 inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-modal-in">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">PINs Generated</h3>
            <button onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-auto">
            {pins.map((pin) => (
              <div
                key={pin}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 font-mono text-sm"
              >
                {pin}
                <button
                  onClick={() => navigator.clipboard.writeText(pin)}
                  className="text-slate-500 hover:text-black"
                >
                  <Copy size={14} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="hiroma-btn hiroma-btn-primary w-full mt-6"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
