"use client";

import { X } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const PACKAGE_PRICE = {
  Starter: 300,
  Builder: 500,
  Entrepreneurship: 1000,
};

export default function ConfirmGeneratePinModal({
  open,
  data,
  onCancel,
  onConfirm,
  loading,
}) {
  if (!open || !data) return null;

  async function handleConfirm() {
    const pinsRef = collection(db, "pins");

    const createdPins = [];

    for (let i = 0; i < data.quantity; i++) {
      const code = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      const docRef = await addDoc(pinsRef, {
        code,
        package: data.selectedPackage,
        price: PACKAGE_PRICE[data.selectedPackage],
        status: "Available",
        assignedToUid: null,
        assignedToName: null,
        createdAt: serverTimestamp(),
      });

      createdPins.push(code);
    }

    onConfirm(createdPins);
  }

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

      {/* MODAL */}
      <div className="fixed z-50 inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-modal-in">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Confirm PIN Generation</h3>
            <button onClick={onCancel}>
              <X size={18} />
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <p><b>Package:</b> {data.selectedPackage}</p>
            <p><b>Quantity:</b> {data.quantity}</p>
            <p><b>Price per PIN:</b> ₱{PACKAGE_PRICE[data.selectedPackage]}</p>
            <p className="pt-2 font-medium">
              Total: ₱{(PACKAGE_PRICE[data.selectedPackage] * data.quantity).toLocaleString()}
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onCancel}
              className="hiroma-btn hiroma-btn-secondary w-full"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="hiroma-btn hiroma-btn-primary w-full"
            >
              Confirm & Generate
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
