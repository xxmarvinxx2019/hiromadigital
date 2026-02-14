"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/lib/firebase/client";
import Input from "@/components/Input";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
  console.error("Login error:", err);

  switch (err.code) {
    case "auth/invalid-email":
      setError("Please enter a valid email address.");
      break;

    case "auth/invalid-credential":
      setError("Invalid email or password.");
      break;

    case "auth/user-disabled":
      setError("This account has been disabled. Please contact support.");
      break;

    case "auth/too-many-requests":
      setError("Too many attempts. Please try again later.");
      break;

    case "auth/network-request-failed":
      setError("Network error. Please check your internet connection.");
      break;

    default:
      setError("Login failed. Please try again.");
  }
}
 finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2 overflow-hidden">

      {/* ================= LEFT BRAND ================= */}
      <div className="hidden md:flex relative items-center justify-center bg-[var(--hiroma-navy)]">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent animate-pulse" />

        <div className="relative z-10 text-center px-10">
          <Image src="/logo.jpg" alt="HIROMA" width={96} height={96} priority />
          <h2 className="mt-6 text-white">Welcome to HIROMA</h2>
          <p className="mt-3 text-white/80 max-w-sm mx-auto">
            A fragrance business built on quality products and structured growth.
          </p>
        </div>
      </div>

      {/* ================= LOGIN ================= */}
      <div className="flex items-center justify-center bg-[var(--hiroma-bg)] px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md hiroma-card shadow-lg"
        >
          <h3 className="text-center">Login</h3>
          <p className="text-center mt-2 text-sm text-[var(--hiroma-muted)]">
            Access your account to manage your business.
          </p>

          {/* ERROR */}
          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              hiroma-btn hiroma-btn-primary
              w-full mt-6
              transition
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="mt-6 text-center text-xs text-[var(--hiroma-muted)]">
            Authorized users only.
          </p>
        </form>
      </div>
    </main>
  );
}
