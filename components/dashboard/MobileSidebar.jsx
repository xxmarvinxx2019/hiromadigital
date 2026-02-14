"use client";

import { cloneElement } from "react";

export default function MobileSidebar({ open, onClose, children }) {
  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR SLIDE */}
      <div
        className={`
          fixed z-50 inset-y-0 left-0
          w-64
          transform transition-transform duration-300 ease-in-out
          md:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Inject onNavigate into Sidebar */}
        {cloneElement(children, {
          onNavigate: onClose,
        })}
      </div>
    </>
  );
}
