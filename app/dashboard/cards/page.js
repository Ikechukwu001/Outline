"use client";

import { CreditCard, ShieldCheck, WalletCards, Sparkles } from "lucide-react";
import useDashboardData from "@/components/dashboard/useDashboardData";

export default function CardsPage() {
  const { userName, userRecord, loadingData } = useDashboardData();

  if (loadingData) {
    return (
      <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-8 text-sm text-[#666666] shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
        Loading cards data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[#ece4d8] bg-white/92 p-6 shadow-[0_24px_60px_rgba(17,17,17,0.05)] sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#948d83]">
              Cards
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#111111] sm:text-[2rem]">
              Premium card experience
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#666666]">
              Manage your premium banking card experience with a polished,
              luxury-driven interface built for your digital account.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#e9e1d5] bg-[#faf8f4] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-[#6e695f]">
            <ShieldCheck size={15} />
            Secure card controls
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="rounded-[2rem] bg-[#111111] p-6 text-white shadow-[0_24px_60px_rgba(17,17,17,0.12)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/55">
                  Premium Card
                </p>
                <h2 className="mt-5 text-2xl font-semibold tracking-[0.18em] sm:text-3xl">
                  REFUND ACCOUNT
                </h2>
              </div>

              <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/75">
                Platinum
              </div>
            </div>

            <div className="mt-12">
              <p className="text-lg tracking-[0.35em] text-white/90">
                {userRecord?.accountNumber
                  ? `${userRecord.accountNumber.slice(0, 4)} ${userRecord.accountNumber.slice(4, 8)} ${userRecord.accountNumber.slice(8, 10)}`
                  : "•••• •••• ••"}
              </p>

              <div className="mt-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                    Card Holder
                  </p>
                  <p className="mt-2 text-sm text-white/88">
                    {userName || "Customer"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                    Valid Thru
                  </p>
                  <p className="mt-2 text-sm text-white/88">09/29</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-[#ece4d8] bg-white p-5 shadow-[0_14px_34px_rgba(17,17,17,0.05)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white">
                <WalletCards size={19} />
              </div>
              <p className="mt-4 text-sm font-semibold text-[#111111]">
                Linked Balance
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#111111]">
                ${Number(userRecord?.balance || 0).toLocaleString()}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-[#ece4d8] bg-white p-5 shadow-[0_14px_34px_rgba(17,17,17,0.05)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white">
                <CreditCard size={19} />
              </div>
              <p className="mt-4 text-sm font-semibold text-[#111111]">
                Card Status
              </p>
              <p className="mt-2 text-2xl font-semibold capitalize tracking-[-0.02em] text-[#111111]">
                {userRecord?.status || "active"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-6 shadow-[0_14px_34px_rgba(17,17,17,0.05)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
              Card Details
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
              Account-linked card information
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666]">Account Number</span>
                <span className="font-medium text-[#111111]">
                  {userRecord?.accountNumber || "Not assigned"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666]">Account Holder</span>
                <span className="font-medium text-[#111111]">
                  {userName || "Customer"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666]">Tier</span>
                <span className="font-medium text-[#111111]">Platinum</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666]">Status</span>
                <span className="font-medium capitalize text-[#111111]">
                  {userRecord?.status || "active"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-6 shadow-[0_14px_34px_rgba(17,17,17,0.05)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
              Card Controls
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="h-12 rounded-2xl border border-[#ddd3c5] bg-[#faf8f4] px-4 text-sm font-medium text-[#111111] transition hover:bg-white"
              >
                Freeze Card
              </button>
              <button
                type="button"
                className="h-12 rounded-2xl bg-[#111111] px-4 text-sm font-medium text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)] transition hover:opacity-95"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}