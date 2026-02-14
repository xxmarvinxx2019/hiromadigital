"use client";

import { useState, useRef } from "react";
import PlacementPickerModal from "@/components/PlacementPickerModal";
import PlacementTree from "@/components/PlacementTree";
import { auth } from "@/lib/firebase/client";

const steps = [
  "PIN Verification",
  "Reseller Info",
  "Referral",
  "Placement",
  "Confirmation",
];

export default function RegisterResellerPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pinPackage, setPinPackage] = useState("");
  const [currentDistributorId, setCurrentDistributorId] = useState(null);

  const [placementModalOpen, setPlacementModalOpen] = useState(false);
  const [placement, setPlacement] = useState(null);

  const [referralTree, setReferralTree] = useState(null);

  const [form, setForm] = useState({
    pin: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    pob: "",
    dob: "",
    referral: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const formRef = useRef(null);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  /* ================= HELPERS ================= */

  function scrollToTop() {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function passwordStrength(pw) {
    if (pw.length < 6) return "Weak";
    if (/[A-Z]/.test(pw) && /\d/.test(pw)) return "Strong";
    return "Medium";
  }

  /* ================= VALIDATION ================= */

  function validateStep() {
    const errors = {};

    if (step === 0 && !form.pin) {
      errors.pin = "PIN code is required";
    }

    if (step === 1) {
      if (!form.firstName) errors.firstName = "First name is required";
      if (!form.lastName) errors.lastName = "Last name is required";
      if (!form.email) errors.email = "Email is required";
      else if (!isValidEmail(form.email))
        errors.email = "Invalid email format";

      if (!form.password) errors.password = "Password is required";
      if (!form.confirmPassword)
        errors.confirmPassword = "Please confirm password";
      if (
        form.password &&
        form.confirmPassword &&
        form.password !== form.confirmPassword
      ) {
        errors.confirmPassword = "Passwords do not match";
      }

      if (!form.address) errors.address = "Address is required";
      if (!form.pob) errors.pob = "Place of birth is required";
      if (!form.dob) errors.dob = "Date of birth is required";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      scrollToTop();
      return false;
    }

    return true;
  }

  /* ================= PIN VALIDATION ================= */

  async function validatePin() {
    setLoading(true);
    setFieldErrors({});

    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch("/api/admin/validate-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pinCode: form.pin }),
      });

      const data = await res.json();
if (!res.ok) throw new Error(data.error);

setPinPackage(data.package); // ✅ STORE PACKAGE
setCurrentDistributorId(data.distributorId);
next();

    } catch (err) {
      setFieldErrors({ pin: err.message });
      scrollToTop();
    } finally {
      setLoading(false);
    }
  }

  /* ================= REFERRAL TREE ================= */

  async function loadReferralTree(email) {
    // 🔥 IMPORTANT FIX: reset placement when referral changes
    setPlacement(null);

    if (!email) {
      setReferralTree(null);
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch("/api/admin/referral-tree", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setReferralTree(data.tree || null);
    } catch {
      setReferralTree(null);
    }
  }

  /* ================= SUBMIT ================= */

  async function handleSubmit() {
    setLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();

      const payload = {
        pinCode: form.pin,
        firstName: form.firstName,
        middleName: form.middleName || "",
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        address: form.address,
        pob: form.pob,
        dob: form.dob,
        referralEmail: form.referral || null,
        placement: placement || { leg: "root" },
      };

      const res = await fetch("/api/admin/register-reseller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setSuccess(true);
    } catch (err) {
      setFieldErrors({ submit: err.message });
      scrollToTop();
    } finally {
      setLoading(false);
    }
  }

  /* ================= SUCCESS ================= */

  if (success) {
    return (
      <div className="max-w-3xl mx-auto mt-16">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-semibold text-green-700">
            🎉 Reseller Registered Successfully
          </h2>

          <p className="text-sm text-green-700">
            The reseller account has been created successfully.
          </p>

          <div className="flex gap-3 pt-4">
            <button
              className="hiroma-btn hiroma-btn-primary"
              onClick={() => (window.location.href = "/dashboard/resellers")}
            >
              Go to Resellers
            </button>

            <button
              className="hiroma-btn hiroma-btn-secondary"
              onClick={() => window.location.reload()}
            >
              Register Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={formRef} className="max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Register New Reseller</h1>
        <p className="text-sm text-slate-500">
          Distributor-assisted registration
        </p>
      </div>

      {/* STEPPER */}
      <div className="flex justify-between text-xs">
        {steps.map((label, i) => (
          <div key={label} className="flex-1 text-center">
            <div
              className={`mx-auto h-8 w-8 rounded-full flex items-center justify-center ${
                i <= step
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {i + 1}
            </div>
            <p className={`mt-1 ${i <= step ? "text-blue-600" : "text-slate-400"}`}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
        {fieldErrors.submit && (
          <p className="text-sm text-red-600">{fieldErrors.submit}</p>
        )}

        {/* STEP 1 */}
        {step === 0 && (
          <>
            <Input label="PIN Code" value={form.pin}
              onChange={(v) => setForm({ ...form, pin: v })}
              error={fieldErrors.pin} />
            <PrimaryButton loading={loading} onClick={validatePin}>
              Validate PIN
            </PrimaryButton>
          </>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="First Name" value={form.firstName}
              onChange={(v) => setForm({ ...form, firstName: v })}
              error={fieldErrors.firstName} />
            <Input label="Middle Name (optional)" value={form.middleName}
              onChange={(v) => setForm({ ...form, middleName: v })} />
            <Input label="Last Name" value={form.lastName}
              onChange={(v) => setForm({ ...form, lastName: v })}
              error={fieldErrors.lastName} />
            <Input label="Email" type="email" value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              error={fieldErrors.email} />

            <div>
              <Input label="Password" type="password"
                value={form.password}
                onChange={(v) => setForm({ ...form, password: v })}
                error={fieldErrors.password} />
              {form.password && (
                <p className="text-xs mt-1 text-slate-500">
                  Strength: <b>{passwordStrength(form.password)}</b>
                </p>
              )}
            </div>

            <Input label="Confirm Password" type="password"
              value={form.confirmPassword}
              onChange={(v) => setForm({ ...form, confirmPassword: v })}
              error={fieldErrors.confirmPassword} />

            <Input label="Address" value={form.address}
              onChange={(v) => setForm({ ...form, address: v })}
              error={fieldErrors.address} />
            <Input label="Place of Birth" value={form.pob}
              onChange={(v) => setForm({ ...form, pob: v })}
              error={fieldErrors.pob} />
            <Input label="Date of Birth" type="date" value={form.dob}
              onChange={(v) => setForm({ ...form, dob: v })}
              error={fieldErrors.dob} />
          </div>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <>
            <Input
              label="Referral Email (optional)"
              value={form.referral}
              onChange={(v) => {
                setForm({ ...form, referral: v });
                loadReferralTree(v);
              }}
            />

            {referralTree && (
              <div className="border rounded-xl p-4 bg-slate-50">
                <PlacementTree node={referralTree} currentDistributorId={currentDistributorId}/>
              </div>
            )}
          </>
        )}

        {/* STEP 4 */}
        {step === 3 && (
          <>
            <button
              className="hiroma-btn hiroma-btn-secondary"
              onClick={() => setPlacementModalOpen(true)}
            >
              Select Placement
            </button>

            {placement && (
              <div className="bg-slate-50 p-3 rounded text-sm">
                {placement.parentName} ({placement.leg})
              </div>
            )}

            <PlacementPickerModal
              open={placementModalOpen}
              tree={referralTree}
              currentDistributorId={currentDistributorId} 
              onClose={() => setPlacementModalOpen(false)}
              onSelect={(data) => {
                setPlacement(data);
                setPlacementModalOpen(false);
              }}
            />
          </>
        )}

        {/* STEP 5 */}
        {/* STEP 5 */}
{step === 4 && (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-4 text-sm">
      <ConfirmItem
        label="Package"
        value={pinPackage || "—"}
      />

      <ConfirmItem
        label="PIN Code"
        value={form.pin}
      />

      <ConfirmItem
        label="Full Name"
        value={`${form.firstName} ${form.middleName} ${form.lastName}`}
      />

      <ConfirmItem
        label="Email"
        value={form.email}
      />

      <ConfirmItem
        label="Address"
        value={form.address}
      />

      <ConfirmItem
        label="Place of Birth"
        value={form.pob}
      />

      <ConfirmItem
        label="Date of Birth"
        value={form.dob}
      />

      <ConfirmItem
        label="Referral"
        value={form.referral || "None"}
      />

      <ConfirmItem
        label="Placement"
        value={
          placement
            ? `${placement.parentName} (${placement.leg})`
            : "ROOT"
        }
      />
    </div>

    <div className="pt-4 border-t">
      <PrimaryButton loading={loading} onClick={handleSubmit}>
        Confirm & Register
      </PrimaryButton>
    </div>
  </div>
)}

      </div>

      {/* NAV */}
      <div className="flex justify-between">
        {step > 0 && (
          <button className="hiroma-btn hiroma-btn-secondary" onClick={back}>
            Back
          </button>
        )}
        {step < steps.length - 1 && (
          <PrimaryButton
            onClick={() => {
              if (validateStep()) next();
            }}
          >
            Continue
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}

/* ================= UI HELPERS ================= */

function Input({ label, value, onChange, type = "text", error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-md bg-slate-100 px-3 py-2 text-sm ${
          error ? "border border-red-500" : ""
        }`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function PrimaryButton({ children, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="hiroma-btn hiroma-btn-primary"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
function ConfirmItem({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-medium text-slate-800 break-words">
        {value}
      </p>
    </div>
  );
}
