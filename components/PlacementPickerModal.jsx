"use client";

import PlacementTree from "./PlacementTree";

export default function PlacementPickerModal({
  open,
  onClose,
  tree,
  onSelect,
  currentDistributorId,
  mode
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-5xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Select Placement</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-slate-500 mb-6">
          Click an <b>empty slot</b> to place the new reseller
        </p>

        <div className="overflow-x-auto">
          <div className="min-w-[1000px] py-4">
            <PlacementTree node={tree} onSelect={onSelect} currentDistributorId={currentDistributorId} mode={mode}/>
          </div>
        </div>
      </div>
    </div>
  );
}
