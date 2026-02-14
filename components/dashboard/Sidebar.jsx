"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navConfig } from "./navConfig";

export default function Sidebar({ collapsed, role, onNavigate }) {
  const pathname = usePathname();

  // 🔧 FIX #2: exact match for leaf routes
  /*function isActive(href) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(href + "/");
  }*/

    function isActive(href) {
  // 1️⃣ Dashboard must be exact only
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  // 2️⃣ Exact match always active
  if (pathname === href) return true;

  // 3️⃣ Allow parent highlight EXCEPT for form pages
  if (
    pathname.startsWith(href + "/") &&
    !pathname.match(/\/(register|create|edit|request)/)
  ) {
    return true;
  }

  return false;
}



  return (
    <aside
      className={`
        flex flex-col
        min-h-screen
        h-full                /* 🔧 FIX #1 */
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        bg-gradient-to-b
        from-[var(--hiroma-navy)]
        via-[#0b1a5a]
        to-[var(--hiroma-blue)]
        text-white
      `}
    >
      {/* ================= BRAND ================= */}
      <div className="h-20 flex items-center justify-center border-b border-white/10">
        <Image
          src="/logo.jpg"
          alt="HIROMA"
          width={collapsed ? 40 : 52}
          height={collapsed ? 40 : 52}
          priority
          className="transition-all duration-300"
        />
      </div>

      {/* ================= NAV ================= */}
      <nav className="flex-1 px-2 py-4 space-y-1 text-sm">
        {navConfig.map((item, idx) => {
          /* ---------- SINGLE ITEM ---------- */
          if (item.type === "item") {
            if (!item.roles.includes(role)) return null;

            const active = isActive(item.href);

            return (
              <Link
                key={idx}
                href={item.href}
                onClick={onNavigate}
                className={`
                  group relative flex items-center
                  ${collapsed ? "justify-center" : "gap-3 px-3"}
                  py-2 rounded-md transition
                  ${active
                    ? "bg-white/20"
                    : "text-white/80 hover:bg-white/10"}
                `}
              >
                <item.icon size={18} />

                {!collapsed && <span>{item.label}</span>}

                {collapsed && (
                  <span
                    className="
                      absolute left-full ml-3 px-2 py-1
                      text-xs rounded bg-black/80 text-white
                      opacity-0 group-hover:opacity-100
                      whitespace-nowrap transition
                    "
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          }

          /* ---------- GROUP ---------- */
          if (item.type === "group") {
            if (!item.roles.includes(role)) return null;

            const visibleItems = item.items.filter(sub =>
              sub.roles ? sub.roles.includes(role) : true
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="mt-4">
                {!collapsed && (
                  <p className="px-3 mb-1 text-xs uppercase tracking-wide text-white/50">
                    {item.label}
                  </p>
                )}

                <div className="space-y-1">
                  {visibleItems.map((sub, subIdx) => {
                    const active = isActive(sub.href);

                    return (
                      <Link
                        key={subIdx}
                        href={sub.href}
                        onClick={onNavigate}
                        className={`
                          group relative flex items-center
                          ${collapsed ? "justify-center" : "gap-3 px-3"}
                          py-2 rounded-md transition
                          ${active
                            ? "bg-white/20"
                            : "text-white/80 hover:bg-white/10"}
                        `}
                      >
                        <sub.icon size={18} />

                        {!collapsed && <span>{sub.label}</span>}

                        {collapsed && (
                          <span
                            className="
                              absolute left-full ml-3 px-2 py-1
                              text-xs rounded bg-black/80 text-white
                              opacity-0 group-hover:opacity-100
                              whitespace-nowrap transition
                            "
                          >
                            {sub.label}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          return null;
        })}
      </nav>

      {/* ================= FOOTER ================= */}
      {!collapsed && (
        <div className="px-6 py-4 text-xs text-white/60 border-t border-white/10">
          © {new Date().getFullYear()} HIROMA
        </div>
      )}
    </aside>
  );
}
