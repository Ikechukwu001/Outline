"use client";

import { LogOut, Bell } from "lucide-react";

export default function DashboardHeader({
  userName,
  onLogout,
  loadingLogout,
}) {
  return (
    <header className="relative overflow-hidden rounded-[2rem] border border-[#e9dfd1] bg-white/90 p-5 shadow-[0_24px_60px_rgba(17,17,17,0.06)] backdrop-blur sm:p-6">
      <div className="absolute right-[-40px] top-[-30px] h-32 w-32 rounded-full bg-[#e9dcc2]/55 blur-3xl" />
      <div className="absolute bottom-[-30px] left-[-20px] h-28 w-28 rounded-full bg-[#ece6da]/70 blur-3xl" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ece3d6] bg-[#faf7f1] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#6f695f]">
            <Bell size={14} />
            Premium Banking Workspace
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#111111] sm:text-[2rem]">
            Welcome back, {userName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#666666]">
            Your account overview, live balance, notifications, and recent
            financial activity are all in one polished dashboard.
          </p>
        </div>

        <button
          onClick={onLogout}
          disabled={loadingLogout}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#111111] px-5 text-sm font-medium text-white shadow-[0_14px_30px_rgba(17,17,17,0.16)] transition hover:opacity-95 disabled:opacity-70"
        >
          <LogOut size={18} />
          {loadingLogout ? "Signing out..." : "Logout"}
        </button>
      </div>
    </header>
  );
}