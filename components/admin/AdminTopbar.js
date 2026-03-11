"use client";

import { LogOut, ShieldCheck } from "lucide-react";

export default function AdminTopbar({
  title,
  subtitle,
  onLogout,
  loggingOut,
}) {
  return (
    <header className="rounded-[2rem] border border-[#e8dfd1] bg-white/92 p-5 shadow-[0_24px_60px_rgba(17,17,17,0.06)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ebe2d6] bg-[#faf8f4] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#6f695f]">
            <ShieldCheck size={14} />
            Secure Admin Environment
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#111111] sm:text-[2rem]">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-7 text-[#666666]">
            {subtitle}
          </p>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            disabled={loggingOut}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#111111] px-5 text-sm font-medium text-white shadow-[0_14px_30px_rgba(17,17,17,0.16)] transition hover:opacity-95 disabled:opacity-70"
          >
            <LogOut size={18} />
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        )}
      </div>
    </header>
  );
}