"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="
      w-full sticky top-0 z-50
      bg-gradient-to-r
      from-[var(--hiroma-navy)]
      via-[#0b1a5a]
      to-[var(--hiroma-blue)]
      backdrop-blur
      shadow-sm
    ">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="HIROMA"
            width={36}
            height={36}
            priority
          />
          <span className="font-semibold text-white tracking-wide">
            HIROMA
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
  <a
    href="#features"
    className="text-white/80 hover:text-white visited:text-white/80 transition"
  >
    Platform
  </a>
  <a
    href="#how"
    className="text-white/80 hover:text-white visited:text-white/80 transition"
  >
    How It Works
  </a>
  <a
    href="#contact"
    className="text-white/80 hover:text-white visited:text-white/80 transition"
  >
    Contact
  </a>
</nav>

        {/* Login */}
        <div className="flex items-center">
          <Link
            href="/login"
            className="
              px-4 py-2 rounded-lg
              text-sm font-medium
              bg-white/10 text-white
              hover:bg-white/20
              transition
            "
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
