"use client";

import {
  ChartColumn,
  TrendingUp,
  Wallet,
  Bell,
  Activity,
  ShieldCheck,
  BadgeDollarSign,
} from "lucide-react";
import useDashboardData from "@/components/dashboard/useDashboardData";

export default function AnalyticsPage() {
  const { userName, userRecord, notifications, loadingData } =
    useDashboardData();

  if (loadingData) {
    return (
      <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-8 text-sm text-[#666666] shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
        Loading analytics...
      </div>
    );
  }

  const balance = Number(userRecord?.balance || 0);
  const notificationCount = notifications.length;
  const accountStatus = userRecord?.status || "active";
  const accountNumber = userRecord?.accountNumber || "Not assigned";

  const analyticsCards = [
    {
      title: "Available Balance",
      value: `$${balance.toLocaleString()}`,
      note: "Live value from your account record",
      icon: Wallet,
    },
    {
      title: "Account Status",
      value: accountStatus,
      note: "Current account condition",
      icon: Activity,
    },
    {
      title: "Notifications",
      value: String(notificationCount),
      note: "Admin-created account alerts",
      icon: Bell,
    },
    {
      title: "Account Number",
      value: accountNumber,
      note: "Assigned from admin workspace",
      icon: BadgeDollarSign,
    },
  ];

  const spendingInsights = [
    {
      label: "Transfers",
      percent: "68%",
      width: "w-[68%]",
    },
    {
      label: "Card Activity",
      percent: "44%",
      width: "w-[44%]",
    },
    {
      label: "Savings Pattern",
      percent: "57%",
      width: "w-[57%]",
    },
    {
      label: "Account Growth",
      percent: "81%",
      width: "w-[81%]",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[#ece4d8] bg-white/92 p-6 shadow-[0_24px_60px_rgba(17,17,17,0.05)] sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#948d83]">
              Analytics
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#111111] sm:text-[2rem]">
              Financial insights for {userName || "your account"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#666666]">
              Review a refined summary of your account health, financial
              movement, and activity signals in one premium analytics view.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#e9e1d5] bg-[#faf8f4] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-[#6e695f]">
            <ShieldCheck size={15} />
            Premium account intelligence
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {analyticsCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-[1.75rem] border border-[#ece4d8] bg-white p-5 shadow-[0_14px_34px_rgba(17,17,17,0.05)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-[0_10px_24px_rgba(17,17,17,0.14)]">
                <Icon size={19} />
              </div>

              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#8e877c]">
                {card.title}
              </p>
              <p className="mt-2 break-words text-2xl font-semibold capitalize tracking-[-0.02em] text-[#111111]">
                {card.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#666666]">
                {card.note}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
                Insight Signals
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
                Activity distribution
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white">
              <ChartColumn size={19} />
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {spendingInsights.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-[#111111]">{item.label}</span>
                  <span className="text-[#666666]">{item.percent}</span>
                </div>

                <div className="h-3 rounded-full bg-[#f1ece4]">
                  <div
                    className={`h-3 rounded-full bg-[#111111] ${item.width}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-[#111111] text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)]">
                <TrendingUp size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#111111]">
                  Account trend summary
                </p>
                <p className="mt-2 text-sm leading-7 text-[#666666]">
                  Your analytics now reflect live data coming from your admin-
                  managed account profile, making this dashboard feel more
                  connected and realistic.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
              Snapshot
            </p>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666]">User Name</span>
                <span className="font-medium text-[#111111]">{userName}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666]">Current Balance</span>
                <span className="font-medium text-[#111111]">
                  ${balance.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666]">Status</span>
                <span className="font-medium capitalize text-[#111111]">
                  {accountStatus}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666]">Notification Count</span>
                <span className="font-medium text-[#111111]">
                  {notificationCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}