"use client";

import { useState } from "react";

/* ================= TEMP ROLE (CHANGE FOR TESTING) ================= */
const CURRENT_ROLE = "city_distributor";
// const CURRENT_ROLE = "regional_distributor";
// const CURRENT_ROLE = "provincial_distributor";
// const CURRENT_ROLE = "city_distributor";
// const CURRENT_ROLE = "reseller";

/* ================= INPUT STYLES ================= */

const INPUT =
  "w-full rounded-lg bg-slate-100 px-4 py-2 text-sm border border-slate-200 " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

const LABEL = "text-sm font-medium text-slate-600";

/* ================= PAGE ================= */

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "Juan",
    middleName: "",
    lastName: "Dela Cruz",
    email: "juan@hiroma.com",
    username: "juan_dc",
    address: "Sample address",
  });

  const isAdmin = CURRENT_ROLE === "admin";
  const isDistributor = CURRENT_ROLE.includes("distributor");

  return (
    <div className="space-y-8 max-w-3xl">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-slate-500">
          Manage your account information and preferences
        </p>
      </div>

      {/* ================= PROFILE ================= */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold">Profile Information</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>First Name</label>
            <input
              className={INPUT}
              value={profile.firstName}
              onChange={e =>
                setProfile({ ...profile, firstName: e.target.value })
              }
            />
          </div>

          <div>
            <label className={LABEL}>Middle Name</label>
            <input
              className={INPUT}
              value={profile.middleName}
              onChange={e =>
                setProfile({ ...profile, middleName: e.target.value })
              }
            />
          </div>

          <div>
            <label className={LABEL}>Last Name</label>
            <input
              className={INPUT}
              value={profile.lastName}
              onChange={e =>
                setProfile({ ...profile, lastName: e.target.value })
              }
            />
          </div>

          <div>
            <label className={LABEL}>Email Address</label>
            <input
              type="email"
              className={INPUT}
              value={profile.email}
              onChange={e =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>
        </div>

        {(isDistributor || CURRENT_ROLE === "reseller") && (
          <div>
            <label className={LABEL}>Address</label>
            <textarea
              rows={3}
              className={`${INPUT} resize-none`}
              value={profile.address}
              onChange={e =>
                setProfile({ ...profile, address: e.target.value })
              }
            />
          </div>
        )}

        <div className="flex justify-end">
          <button className="hiroma-btn hiroma-btn-primary">
            Save Profile
          </button>
        </div>
      </section>

      {/* ================= ACCOUNT ================= */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold">Account Credentials</h2>

        <div>
          <label className={LABEL}>Username</label>
          <input
            className={INPUT}
            value={profile.username}
            onChange={e =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
        </div>

        <div>
          <label className={LABEL}>New Password</label>
          <input
            type="password"
            className={INPUT}
            placeholder="Leave blank to keep current password"
          />
        </div>

        <div className="flex justify-end">
          <button className="hiroma-btn hiroma-btn-primary">
            Update Credentials
          </button>
        </div>
      </section>

      {/* ================= ADMIN INFO ================= */}
      {isAdmin && (
        <section className="bg-slate-50 rounded-xl p-6 text-sm text-slate-600">
          <p>
            ℹ️ As an <b>Admin</b>, your account controls system configuration,
            distributor creation, inventory, and financial operations.
          </p>
        </section>
      )}
    </div>
  );
}
