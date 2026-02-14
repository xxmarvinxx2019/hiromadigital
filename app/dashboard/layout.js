"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth/AuthContext";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({ children }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[var(--hiroma-muted)]">
        Loading dashboard...
      </div>
    );
  }

  if (!user) return null;

  /* ================= DASHBOARD UI ================= */
  return (
    <div className="flex min-h-screen bg-[var(--hiroma-bg)]">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={collapsed}
          role={profile?.role}
        />
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Sidebar
          collapsed={false}
          role={profile?.role}
          onNavigate={() => setMobileOpen(false)}
        />
      </MobileSidebar>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col w-full">
        {/* TOPBAR */}
        <Topbar
          onToggleSidebar={() => setCollapsed(!collapsed)}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-6 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
