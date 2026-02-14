"use client";

import { useAuth } from "@/lib/auth/AuthContext";

import AdminDashboard from "./dashboards/AdminDashboard";
import DistributorDashboard from "./dashboards/DistributorDashboard";
import ResellerDashboard from "./dashboards/ResellerDashboard";

export default function DashboardPage() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-[var(--hiroma-muted)]">
        Loading dashboard...
      </div>
    );
  }

  if (!profile?.role) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-600">
        Account role not found.
      </div>
    );
  }

  /* ================= ROLE-BASED DASHBOARD ================= */

  if (profile.role === "admin") {
    return <AdminDashboard />;
  }

  if (
    profile.role === "regional_distributor" ||
    profile.role === "provincial_distributor" ||
    profile.role === "city_distributor"
  ) {
    return <DistributorDashboard />;
  }

  if (profile.role === "reseller") {
    return <ResellerDashboard />;
  }

  return (
    <div className="flex items-center justify-center py-20 text-sm text-red-600">
      Unauthorized role.
    </div>
  );
}
