"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  ChevronDown,
  PanelLeft,
  LogOut,
  Settings,
} from "lucide-react";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useAuth } from "@/lib/auth/AuthContext";

export default function Topbar({ onOpenMobileSidebar, onToggleSidebar }) {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  const displayName =
    profile?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const roleLabel =
    profile?.role === "admin"
      ? "Administrator"
      : profile?.role?.replace(/_/g, " ") || "User";

  return (
    <header
      className="
        h-14 bg-white
        flex items-center justify-between
        px-4 md:px-6
        shadow-[0_4px_12px_rgba(0,0,0,0.06)]
        relative z-30
      "
    >
      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden text-slate-600 hover:text-black"
        >
          <Menu size={20} />
        </button>

        {/* Desktop collapse */}
        <button
          onClick={onToggleSidebar}
          className="hidden md:flex text-slate-500 hover:text-black"
        >
          <PanelLeft size={18} />
        </button>

        {/* Page context */}
        <span className="text-sm text-slate-500">
          Dashboard
        </span>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-5">
        {/* Notifications (placeholder) */}
        <button className="relative text-slate-600 hover:text-black">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setOpenProfile(v => !v)}
            className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1 rounded-md transition"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--hiroma-border)] flex items-center justify-center text-xs font-semibold uppercase">
              {displayName.charAt(0)}
            </div>

            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-sm font-medium">
                {displayName}
              </span>
              <span className="text-xs text-slate-500">
                {roleLabel}
              </span>
            </div>

            <ChevronDown size={14} />
          </button>

          {/* ================= DROPDOWN ================= */}
          {openProfile && (
            <div
              className="
                absolute right-0 mt-2 w-56
                bg-white rounded-xl shadow-lg
                border border-slate-100
                overflow-hidden
              "
            >
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium">
                  {user?.email}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {roleLabel}
                </p>
              </div>

              <button
                className="
                  w-full flex items-center gap-2
                  px-4 py-2 text-sm
                  hover:bg-slate-50
                "
                onClick={() => {
                  setOpenProfile(false);
                  router.push("/dashboard/settings");
                }}
              >
                <Settings size={16} />
                Settings
              </button>

              <button
                className="
                  w-full flex items-center gap-2
                  px-4 py-2 text-sm text-red-600
                  hover:bg-red-50
                "
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
