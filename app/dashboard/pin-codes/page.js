"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase/client";
import { query, where, orderBy } from "firebase/firestore";
import GeneratePinModal from "@/components/dashboard/GeneratePinModal";
import ConfirmGeneratePinModal from "@/components/dashboard/ConfirmGeneratePinModal";
import GeneratedPinPreviewModal from "@/components/dashboard/GeneratedPinPreviewModal";
import AssignPinModal from "@/components/dashboard/AssignPinModal";

/* ================= PACKAGE PRICES ================= */

const PACKAGE_PRICES = {
  Starter: 300,
  Builder: 500,
  Entrepreneurship: 1000,
};

const ITEMS_PER_PAGE = 5;

/* ================= PAGE ================= */

export default function AdminPinCodesPage() {
  const [pins, setPins] = useState([]);
  const [distributors, setDistributors] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  /* ===== Generate PIN ===== */
  const [openGenerate, setOpenGenerate] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [pendingGeneration, setPendingGeneration] = useState(null);
  const [generatedPins, setGeneratedPins] = useState([]);
const [generating, setGenerating] = useState(false);
  /* ===== Assign PIN ===== */
  const [openAssign, setOpenAssign] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    fetchPins();
    fetchDistributors();
  }, []);

  async function fetchPins() {
    const snap = await getDocs(collection(db, "pins"));
    setPins(
      snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  }

  async function fetchDistributors() {
    const q = query(
  collection(db, "users"),
  where("role", "in", [
    "regional_distributor",
    "provincial_distributor",
    "city_distributor",
  ]),
  orderBy("createdAt", "desc")
);

const snap = await getDocs(q);

setDistributors(
  snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
);
  }

  /* ================= HELPERS ================= */

  const isSold = p => p.status === "Assigned" || p.status === "Used";

  const sumRevenue = pins =>
    pins.reduce(
      (sum, p) =>
        sum + (isSold(p) ? PACKAGE_PRICES[p.package] : 0),
      0
    );

  const totalPages = Math.ceil(pins.length / ITEMS_PER_PAGE);

  const paginatedPins = pins.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ================= ASSIGN PIN ================= */
  async function handleAssignPin(distributor) {
  if (!selectedPin || !distributor) return;
  if (!auth.currentUser) return;

  const payload = {
    assignedTo: distributor.id,
    assignedToName: `${distributor.firstName} ${distributor.lastName}`,
    assignedRole: distributor.role,

    // ✅ SAFE FALLBACK (VERY IMPORTANT)
    assignedLocation: distributor.location || "—",

    status: "Assigned",
    assignedAt: serverTimestamp(),
    assignedBy: auth.currentUser.uid,
  };

  try {
    await updateDoc(doc(db, "pins", selectedPin.id), payload);

    setOpenAssign(false);
    setSelectedPin(null);
    fetchPins();
  } catch (err) {
    console.error("Failed to assign PIN:", err);
  }
}

  /* ================= UI ================= */

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">PIN Codes</h2>
        <p className="text-sm text-[var(--hiroma-muted)]">
          Generate, assign, and track reseller registration PINs.
        </p>
      </div>

      {/* ACTION BAR */}
      <div className="flex justify-between gap-4 flex-wrap">
        <button
          className="hiroma-btn hiroma-btn-primary"
          onClick={() => setOpenGenerate(true)}
        >
          Generate PIN
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <SummaryCard title="Total PINs" value={pins.length} />
        <SummaryCard
          title="Available"
          value={pins.filter(p => p.status === "Available").length}
        />
        <SummaryCard
          title="Sold"
          value={pins.filter(isSold).length}
        />
        <SummaryCard
          title="Revenue"
          value={`₱${sumRevenue(pins).toLocaleString()}`}
        />
      </div>

      {/* TABLE */}
      <div className="hiroma-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">PIN</th>
              <th className="px-4 py-3 text-left">Package</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Assigned To</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedPins.map(p => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-mono">{p.code}</td>
                <td className="px-4 py-3">{p.package}</td>
                <td className="px-4 py-3">
                  <StatusPill status={p.status} />
                </td>
                <td className="px-4 py-3">
                  {p.assignedToName || "—"}
                </td>
                <td className="px-4 py-3">
                  {p.status === "Available" && (
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() => {
                        setSelectedPin(p);
                        setOpenAssign(true);
                      }}
                    >
                      Assign
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className="hiroma-btn hiroma-btn-secondary disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-[var(--hiroma-muted)]">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
          className="hiroma-btn hiroma-btn-secondary disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* ===== MODALS ===== */}

      <GeneratePinModal
        open={openGenerate}
        onClose={() => setOpenGenerate(false)}
        onGenerate={(data) => {
          setPendingGeneration(data);
          setOpenGenerate(false);
          setOpenConfirm(true);
        }}
      />

      <ConfirmGeneratePinModal
        open={openConfirm}
        data={pendingGeneration}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() => {
          const pins = Array.from(
            { length: pendingGeneration.quantity },
            () => Math.random().toString(36).substring(2, 8).toUpperCase()
          );
          setGeneratedPins(pins);
          setOpenConfirm(false);
          setOpenPreview(true);
          fetchPins();
        }}
      />

      <GeneratedPinPreviewModal
        open={openPreview}
        pins={generatedPins}
        onClose={() => setOpenPreview(false)}
      />

      <AssignPinModal
        open={openAssign}
        pin={selectedPin}
        distributors={distributors}
        onClose={() => setOpenAssign(false)}
        onAssign={handleAssignPin}
      />
    </div>
  );
}

/* ================= UI HELPERS ================= */

function SummaryCard({ title, value }) {
  return (
    <div className="hiroma-card">
      <p className="text-sm text-[var(--hiroma-muted)]">{title}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function StatusPill({ status }) {
  const styles = {
    Available: "bg-green-100 text-green-700",
    Assigned: "bg-amber-100 text-amber-700",
    Used: "bg-blue-100 text-blue-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
      {status}
    </span>
  );
}
