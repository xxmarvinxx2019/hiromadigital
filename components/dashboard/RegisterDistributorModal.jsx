"use client";

import { useState } from "react";

/* ================= INPUT STYLES ================= */

const INPUT =
  "w-full rounded-lg bg-slate-100 px-4 py-2 text-sm border border-slate-200 " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

const SELECT =
  "w-full rounded-lg bg-slate-100 px-4 py-2 pr-10 text-sm border border-slate-200 appearance-none " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

const LABEL = "text-sm font-medium text-slate-600";

/* ================= MODAL ================= */

export default function RegisterDistributorModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    middleName: "", // OPTIONAL
    lastName: "",
    birthdate: "",
    address: "",
    email: "",
    username: "", // OPTIONAL
    password: "",
    role: "",
    location: "",
  });

  const update = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  /* ================= STEP VALIDATION ================= */

  function isStepValid() {
    if (step === 1) {
      return form.firstName && form.lastName && form.birthdate;
    }
    if (step === 2) {
      return form.email && form.password;
    }
    if (step === 3) {
      return form.role && form.location && form.address;
    }
    return true;
  }

  /* ================= SUBMIT ================= */

  async function handleCreate() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/create-distributor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,

          firstName: form.firstName,
          middleName: form.middleName || null,
          lastName: form.lastName,

          birthday: form.birthdate,
          address: form.address,
          username: form.username || null,

          roleLevel: form.role,
          location: form.location,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create distributor.");

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-6">
        <h3 className="text-lg font-semibold">Register Distributor</h3>

        {/* ================= STEP INDICATOR ================= */}
        <div className="flex gap-2 text-xs">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`flex-1 h-1 rounded ${
                step >= s ? "bg-blue-600" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="space-y-4">
            <Field label="First Name *">
              <input className={INPUT} value={form.firstName} onChange={e => update("firstName", e.target.value)} />
            </Field>

            <Field label="Middle Name (optional)">
              <input className={INPUT} value={form.middleName} onChange={e => update("middleName", e.target.value)} />
            </Field>

            <Field label="Last Name *">
              <input className={INPUT} value={form.lastName} onChange={e => update("lastName", e.target.value)} />
            </Field>

            <Field label="Birthdate *">
              <input type="date" className={INPUT} value={form.birthdate} onChange={e => update("birthdate", e.target.value)} />
            </Field>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="space-y-4">
            <Field label="Email Address *">
              <input type="email" className={INPUT} value={form.email} onChange={e => update("email", e.target.value)} />
            </Field>

            <Field label="Username (optional)">
              <input className={INPUT} value={form.username} onChange={e => update("username", e.target.value)} />
            </Field>

            <Field label="Password *">
              <input type="password" className={INPUT} value={form.password} onChange={e => update("password", e.target.value)} />
            </Field>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="space-y-4">
            <Field label="Distributor Role *">
              <select className={SELECT} value={form.role} onChange={e => update("role", e.target.value)}>
                <option value="">Select role</option>
                <option value="regional">Regional Distributor</option>
                <option value="provincial">Provincial Distributor</option>
                <option value="city">City Distributor</option>
              </select>
            </Field>

            <Field label="Assigned Location *">
              <input className={INPUT} value={form.location} onChange={e => update("location", e.target.value)} />
            </Field>

            <Field label="Full Address *">
              <textarea rows={3} className={`${INPUT} resize-none`} value={form.address} onChange={e => update("address", e.target.value)} />
            </Field>
          </div>
        )}

        {/* ================= STEP 4 ================= */}
        {step === 4 && (
          <div className="space-y-2 text-sm">
            <p><b>Name:</b> {form.firstName} {form.middleName} {form.lastName}</p>
            <p><b>Email:</b> {form.email}</p>
            <p><b>Username:</b> {form.username || "—"}</p>
            <p><b>Role:</b> {form.role}</p>
            <p><b>Location:</b> {form.location}</p>
            <p><b>Address:</b> {form.address}</p>
          </div>
        )}

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-between pt-4">
          <button
            className="hiroma-btn hiroma-btn-secondary"
            onClick={step === 1 ? onClose : () => setStep(step - 1)}
            disabled={loading}
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          <button
            className="hiroma-btn hiroma-btn-primary"
            disabled={loading || !isStepValid()}
            onClick={() => {
              if (step < 4) setStep(step + 1);
              else handleCreate();
            }}
          >
            {loading ? "Creating..." : step < 4 ? "Next" : "Create Distributor"}
          </button>
        </div>

        <p className="text-xs text-slate-500">
          ℹ️ Fields marked with * are required. Middle name is optional.
        </p>
      </div>
    </div>
  );
}

/* ================= FIELD ================= */

function Field({ label, children }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      {children}
    </div>
  );
}
