"use client";

import Link from "next/link";

export default function AdminNavItem({
  href,
  icon: Icon,
  label,
  active,
  mobile = false,
}) {
  if (mobile) {
    return (
      <Link
        href={href}
        className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 transition ${
          active
            ? "bg-[#111111] text-white shadow-[0_10px_24px_rgba(17,17,17,0.16)]"
            : "text-[#7a746b]"
        }`}
      >
        <Icon size={18} strokeWidth={2} />
        <span className="text-[10px] font-medium">{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition ${
        active
          ? "bg-[#111111] text-white shadow-[0_14px_28px_rgba(17,17,17,0.16)]"
          : "text-[#5f5a53] hover:bg-[#f4efe7] hover:text-[#111111]"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
          active ? "bg-white/10" : "bg-[#f6f2eb]"
        }`}
      >
        <Icon size={18} strokeWidth={2} />
      </div>
      <span>{label}</span>
    </Link>
  );
}