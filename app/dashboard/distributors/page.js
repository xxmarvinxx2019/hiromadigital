"use client";

import { useEffect, useState } from "react";
import RegisterDistributorModal from "@/components/dashboard/RegisterDistributorModal";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

/* ================= PAGE ================= */

export default function DistributorPage() {
  const [openRegister, setOpenRegister] = useState(false);
  const [loading, setLoading] = useState(true);
  const [distributors, setDistributors] = useState([]);

  async function fetchDistributors() {
    setLoading(true);

    try {
      const q = query(
        collection(db, "users"),
        where("role", "in", [
          "regional_distributor",
          "provincial_distributor",
          "city_distributor",
        ]),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDistributors(data);
    } catch (err) {
      console.error("Failed to fetch distributors:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDistributors();
  }, []);

  const activeCount = distributors.filter(d => d.status === "active").length;
  const suspendedCount = distributors.filter(d => d.status === "suspended").length;

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Distributors</h1>
          <p className="text-sm text-slate-500">
            Create and manage regional, provincial, and city distributors
          </p>
        </div>

        <button
          className="hiroma-btn hiroma-btn-primary"
          onClick={() => setOpenRegister(true)}
        >
          + Register Distributor
        </button>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="grid sm:grid-cols-3 gap-4">
        <SummaryCard title="Total Distributors" value={distributors.length} />
        <SummaryCard title="Active" value={activeCount} />
        <SummaryCard title="Suspended" value={suspendedCount} />
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="text-sm text-slate-500">Loading distributors…</div>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && distributors.length === 0 && (
        <div className="hiroma-card text-center text-slate-500">
          No distributors registered yet.
        </div>
      )}

      {/* ================= DESKTOP TABLE ================= */}
      {!loading && distributors.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Joined</th>
              </tr>
            </thead>
            <tbody>
              {distributors.map(d => (
                <tr key={d.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium">
                    {d.firstName}{" "}
                    {d.middleName && `${d.middleName} `}
                    {d.lastName}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {formatRole(d.role)}
                  </td>
                  <td className="px-4 py-3">{d.location}</td>
                  <td className="px-4 py-3">{d.email}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={d.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {formatDate(d.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= MOBILE CARDS ================= */}
      {!loading && (
        <div className="md:hidden space-y-3">
          {distributors.map(d => (
            <div key={d.id} className="hiroma-card space-y-2">
              <div className="flex justify-between items-start">
                <p className="font-medium">
                  {d.firstName} {d.lastName}
                </p>
                <StatusPill status={d.status} />
              </div>

              <InfoRow label="Role" value={formatRole(d.role)} />
              <InfoRow label="Location" value={d.location} />
              <InfoRow label="Email" value={d.email} />
              <InfoRow label="Joined" value={formatDate(d.createdAt)} />
            </div>
          ))}
        </div>
      )}

      {/* ================= REGISTER MODAL ================= */}
      {openRegister && (
        <RegisterDistributorModal
          onClose={() => {
            setOpenRegister(false);
            fetchDistributors(); // 🔥 refresh list after creation
          }}
        />
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

function SummaryCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function StatusPill({ status }) {
  const styles = {
    active: "bg-green-100 text-green-700",
    suspended: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status?.toUpperCase()}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function formatRole(role) {
  return role
    ?.replace("_distributor", "")
    ?.replace("_", " ")
    ?.replace(/\b\w/g, l => l.toUpperCase());
}

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "—";
  return timestamp.toDate().toLocaleDateString();
}
