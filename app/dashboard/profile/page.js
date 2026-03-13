"use client";

import {
  UserRound,
  Mail,
  ShieldCheck,
  Wallet,
  BadgeCheck,
  Hash,
  Sparkles,
  Bell,
  ReceiptText,
  Landmark,
  Crown,
  CheckCircle2,
} from "lucide-react";
import useDashboardData from "@/components/dashboard/useDashboardData";

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function ProfilePage() {
  const {
    userName,
    userEmail,
    userRecord,
    notifications,
    transactions,
    loadingData,
  } = useDashboardData();

  if (loadingData) {
    return (
      <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-8 text-sm text-[#666666] shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
        Loading profile...
      </div>
    );
  }

  const initials =
    userName?.trim()?.charAt(0)?.toUpperCase() ||
    userEmail?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  const balance = Number(userRecord?.balance || 0);
  const accountNumber = userRecord?.accountNumber || "Not assigned";
  const status = userRecord?.status || "active";
  const transactionCount = transactions.length;
  const notificationCount = notifications.length;

  const latestTransaction = transactions[0] || null;
  const latestNotification = notifications[0] || null;

  const profileDetails = [
    {
      label: "Full Name",
      value: userName || "Customer",
      icon: UserRound,
    },
    {
      label: "Email Address",
      value: userEmail || "No email",
      icon: Mail,
    },
    {
      label: "Account Number",
      value: accountNumber,
      icon: Hash,
    },
    {
      label: "Account Status",
      value: status,
      icon: BadgeCheck,
    },
  ];

  const quickStats = [
    {
      label: "Available Balance",
      value: formatMoney(balance),
      icon: Wallet,
    },
    {
      label: "Transactions",
      value: transactionCount,
      icon: ReceiptText,
    },
    {
      label: "Notifications",
      value: notificationCount,
      icon: Bell,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#e9dfd1] bg-white/92 p-6 shadow-[0_24px_60px_rgba(17,17,17,0.05)] sm:p-7">
        <div className="absolute right-[-30px] top-[-20px] h-36 w-36 rounded-full bg-[#eadfc8]/60 blur-3xl" />
        <div className="absolute bottom-[-30px] left-[-20px] h-28 w-28 rounded-full bg-[#efe8dd]/70 blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#948d83]">
              Profile
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#111111] sm:text-[2rem]">
              Personal banking identity
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#666666]">
              A premium view of your account ownership, banking identity,
              account details, and recent profile-linked activity.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#e9e1d5] bg-[#faf8f4] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-[#6e695f]">
            <ShieldCheck size={15} />
            Verified customer identity
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#111111] p-6 text-white shadow-[0_28px_70px_rgba(17,17,17,0.16)]">
            <div className="absolute right-[-30px] top-[-20px] h-40 w-40 rounded-full bg-[#d3b88a]/18 blur-3xl" />
            <div className="absolute bottom-[-40px] left-[-20px] h-40 w-40 rounded-full bg-white/5 blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/50">
                    REFUND ACCOUNT
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
                    {userName || "Customer"}
                  </h2>
                  <p className="mt-2 text-sm text-white/70">{userEmail}</p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-white/10 text-lg font-semibold uppercase text-white backdrop-blur">
                  {initials}
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                <div className="rounded-[1.35rem] bg-white/6 px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                    Account Number
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/90">
                    {accountNumber}
                  </p>
                </div>

                <div className="rounded-[1.35rem] bg-white/6 px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                    Current Status
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-white/90">
                    <CheckCircle2 size={16} className="text-green-400" />
                    <span className="text-sm font-medium capitalize">
                      {status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/75">
                <Crown size={14} />
                Premium customer profile
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-[#e9dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
                Account Value
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#111111]">
                Balance spotlight
              </h2>

              <div className="mt-6 rounded-[1.6rem] bg-[#faf7f1] p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847a]">
                  Available Balance
                </p>
                <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#111111]">
                  {formatMoney(balance)}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#666666]">
                  This reflects the current balance after credits, transfers, and
                  admin-managed account updates.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {quickStats.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-[1.6rem] border border-[#ece4d8] bg-white p-5 shadow-[0_14px_34px_rgba(17,17,17,0.05)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4ede2] text-[#111111]">
                      <Icon size={18} />
                    </div>

                    <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#8e877c]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#111111]">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {profileDetails.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-[1.75rem] border border-[#ece4d8] bg-white p-5 shadow-[0_14px_34px_rgba(17,17,17,0.05)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-[0_10px_24px_rgba(17,17,17,0.14)]">
                    <Icon size={19} />
                  </div>

                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#8e877c]">
                    {card.label}
                  </p>
                  <p className="mt-2 break-words text-base font-semibold capitalize tracking-[-0.02em] text-[#111111]">
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
                  <ReceiptText size={17} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111111]">
                    Latest Transaction
                  </p>
                </div>
              </div>

              {!latestTransaction ? (
                <p className="mt-4 text-sm text-[#666666]">
                  No transaction recorded yet.
                </p>
              ) : (
                <div className="mt-4 rounded-[1.35rem] bg-[#faf7f1] p-4">
                  <p className="text-sm font-semibold text-[#111111]">
                    {latestTransaction.type === "credit"
                      ? latestTransaction.title || "Account Credit"
                      : latestTransaction.type === "transfer"
                      ? `Transfer to ${latestTransaction.recipientName || "Recipient"}`
                      : latestTransaction.title || "Transaction"}
                  </p>
                  <p className="mt-2 text-sm text-[#666666]">
                    {latestTransaction.description || "Recorded account activity"}
                  </p>
                  <p
                    className={`mt-3 text-sm font-semibold ${
                      latestTransaction.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {latestTransaction.type === "credit" ? "+" : "-"}
                    {formatMoney(latestTransaction.amount)}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
                  <Landmark size={17} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111111]">
                    Latest Notification
                  </p>
                </div>
              </div>

              {!latestNotification ? (
                <p className="mt-4 text-sm text-[#666666]">
                  No notification available yet.
                </p>
              ) : (
                <div className="mt-4 rounded-[1.35rem] bg-[#faf7f1] p-4">
                  <p className="text-sm font-semibold text-[#111111]">
                    {latestNotification.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#666666]">
                    {latestNotification.message}
                  </p>
                  <p className="mt-3 text-xs text-[#8a847a]">
                    {latestNotification.createdAtLabel || "Recently added"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}