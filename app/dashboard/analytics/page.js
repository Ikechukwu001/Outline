"use client";

import {
  ChartColumn,
  TrendingUp,
  Wallet,
  Bell,
  Activity,
  ShieldCheck,
  BadgeDollarSign,
  ArrowDownRight,
  ArrowUpRight,
  ReceiptText,
} from "lucide-react";
import useDashboardData from "@/components/dashboard/useDashboardData";

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function AnalyticsPage() {
  const { userName, userRecord, notifications, transactions, loadingData } =
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

  const creditTransactions = transactions.filter((item) => item.type === "credit");
  const debitTransactions = transactions.filter((item) => item.type !== "credit");

  const totalCredits = creditTransactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalDebits = debitTransactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalTransactions = transactions.length;
  const transferCount = transactions.filter((item) => item.type === "transfer").length;
  const creditCount = creditTransactions.length;
  const debitCount = debitTransactions.length;

  const netFlow = totalCredits - totalDebits;

  const activityGroups = [
    {
      label: "Credits",
      count: creditCount,
      amount: totalCredits,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      label: "Debits",
      count: debitCount,
      amount: totalDebits,
      color: "bg-red-500",
      textColor: "text-red-600",
    },
    {
      label: "Transfers",
      count: transferCount,
      amount: totalDebits,
      color: "bg-[#111111]",
      textColor: "text-[#111111]",
    },
  ];

  const highestTransaction = transactions.reduce((largest, current) => {
    const currentAmount = Number(current.amount || 0);
    const largestAmount = Number(largest?.amount || 0);
    return currentAmount > largestAmount ? current : largest;
  }, null);

  const analyticsCards = [
    {
      title: "Available Balance",
      value: formatMoney(balance),
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

  const totalActivityAmount = totalCredits + totalDebits;
  const creditWidth =
    totalActivityAmount > 0
      ? `${Math.max((totalCredits / totalActivityAmount) * 100, 8)}%`
      : "12%";
  const debitWidth =
    totalActivityAmount > 0
      ? `${Math.max((totalDebits / totalActivityAmount) * 100, 8)}%`
      : "12%";

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#e9dfd1] bg-white/92 p-6 shadow-[0_24px_60px_rgba(17,17,17,0.05)] sm:p-7">
        <div className="absolute right-[-30px] top-[-20px] h-32 w-32 rounded-full bg-[#eadfc8]/55 blur-3xl" />
        <div className="absolute bottom-[-30px] left-[-20px] h-28 w-28 rounded-full bg-[#efe8dd]/70 blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#948d83]">
              Analytics
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#111111] sm:text-[2rem]">
              Financial insights for {userName || "your account"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#666666]">
              Review live account movement, inflow and outflow activity, and
              transaction intelligence generated from your actual banking records.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#e9e1d5] bg-[#faf8f4] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-[#6e695f]">
            <ShieldCheck size={15} />
            Live account intelligence
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
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
                  Money Flow
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
                  Credit vs debit activity
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white">
                <ChartColumn size={19} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.4rem] bg-[#f8fbf8] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                  <ArrowDownRight size={18} />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#7d7d7d]">
                  Total Credits
                </p>
                <p className="mt-2 text-xl font-semibold text-green-600">
                  {formatMoney(totalCredits)}
                </p>
              </div>

              <div className="rounded-[1.4rem] bg-[#fff8f8] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                  <ArrowUpRight size={18} />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#7d7d7d]">
                  Total Debits
                </p>
                <p className="mt-2 text-xl font-semibold text-red-600">
                  {formatMoney(totalDebits)}
                </p>
              </div>

              <div className="rounded-[1.4rem] bg-[#faf7f1] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
                  <TrendingUp size={18} />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#7d7d7d]">
                  Net Flow
                </p>
                <p
                  className={`mt-2 text-xl font-semibold ${
                    netFlow >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {netFlow >= 0 ? "+" : "-"}
                  {formatMoney(Math.abs(netFlow))}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-[#111111]">Credits</span>
                  <span className="text-[#666666]">{creditCount} item(s)</span>
                </div>
                <div className="h-3 rounded-full bg-[#edf1ec]">
                  <div
                    className="h-3 rounded-full bg-green-500"
                    style={{ width: creditWidth }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-[#111111]">Debits</span>
                  <span className="text-[#666666]">{debitCount} item(s)</span>
                </div>
                <div className="h-3 rounded-full bg-[#f4eaea]">
                  <div
                    className="h-3 rounded-full bg-red-500"
                    style={{ width: debitWidth }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
                  Activity Metrics
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
                  Real account numbers
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white">
                <ReceiptText size={19} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {activityGroups.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.4rem] border border-[#ece4d8] bg-[#fcfaf6] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-[#8a847a]">
                    {item.label}
                  </p>
                  <p className={`mt-3 text-2xl font-semibold ${item.textColor}`}>
                    {item.count}
                  </p>
                  <p className="mt-2 text-sm text-[#666666]">
                    Total value: {formatMoney(item.amount)}
                  </p>
                </div>
              ))}

              <div className="rounded-[1.4rem] border border-[#ece4d8] bg-[#fcfaf6] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8a847a]">
                  Total Transactions
                </p>
                <p className="mt-3 text-2xl font-semibold text-[#111111]">
                  {totalTransactions}
                </p>
                <p className="mt-2 text-sm text-[#666666]">
                  All credits and debits recorded
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">

          <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
              Largest Recorded Movement
            </p>

            <div className="mt-4 rounded-[1.4rem] bg-[#faf7f1] p-4">
              {!highestTransaction ? (
                <p className="text-sm text-[#666666]">
                  No transaction data available yet.
                </p>
              ) : (
                <>
                  <p className="text-sm font-semibold text-[#111111]">
                    {highestTransaction.type === "credit"
                      ? highestTransaction.title || "Account Credit"
                      : highestTransaction.type === "transfer"
                      ? `Transfer to ${highestTransaction.recipientName || "Recipient"}`
                      : highestTransaction.title || "Transaction"}
                  </p>
                  <p className="mt-2 text-sm text-[#666666]">
                    {highestTransaction.description || "Recorded account activity"}
                  </p>
                  <p
                    className={`mt-3 text-lg font-semibold ${
                      highestTransaction.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {highestTransaction.type === "credit" ? "+" : "-"}
                    {formatMoney(highestTransaction.amount)}
                  </p>
                </>
              )}
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
                  {formatMoney(balance)}
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

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666]">Transaction Count</span>
                <span className="font-medium text-[#111111]">
                  {totalTransactions}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}