"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { X, Headphones, Landmark } from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BalanceCard from "@/components/dashboard/BalanceCard";
import SummaryStatsRow from "@/components/dashboard/SummaryStatsRow";
import QuickActionsGrid from "@/components/dashboard/QuickActionsGrid";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import NotificationPanel from "@/components/dashboard/NotificationPanel";
import ProfilePanel from "@/components/dashboard/ProfilePanel";
import useDashboardData from "@/components/dashboard/useDashboardData";

export default function DashboardPage() {
  const router = useRouter();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);

  const {
    userName,
    userEmail,
    userRecord,
    notifications,
    transactions,
    loadingData,
  } = useDashboardData();

  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoadingLogout(false);
    }
  };

  const stats = [
    {
      title: "Main Wallet",
      value: `$${Number(userRecord?.balance || 0).toLocaleString()}`,
      type: "wallet",
    },
    {
      title: "Account Status",
      value: userRecord?.status || "active",
      type: "card",
    },
    {
      title: "Notifications",
      value: String(notifications.length),
      type: "transfer",
    },
  ];

  const quickActions = [
    {
      title: "Transfer Money",
      description: "Send funds instantly",
      type: "transfer",
      href: "/dashboard/transfer",
    },
    {
      title: "Loan",
      description: "Request loan assistance",
      type: "wallet",
      onClick: () => setShowLoanModal(true),
    },
    {
      title: "Cards",
      description: "Manage virtual and debit cards",
      type: "card",
      href: "/dashboard/cards",
    },
    {
      title: "Analytics",
      description: "Track your spending",
      type: "chart",
      href: "/dashboard/analytics",
    },
    {
      title: "Profile",
      description: "Manage account details",
      type: "card",
      href: "/dashboard/profile",
    },
  ];

  const mappedTransactions = transactions.map((item) => {
    const isCredit = item.type === "credit";

    return {
      id: item.id,
      title: isCredit
        ? item.title || "Account Credit"
        : item.type === "transfer"
        ? `Transfer to ${item.recipientName || "Recipient"}`
        : item.title || "Transaction",
      subtitle: isCredit
        ? item.description || "Credit received"
        : item.bankName
        ? `${item.bankName} • ${item.status || "completed"}`
        : item.description || "Completed",
      amount: `${isCredit ? "+" : "-"}$${Number(
        item.amount || 0
      ).toLocaleString()}`,
      amountType: isCredit ? "credit" : "debit",
    };
  });

  if (loadingData) {
    return (
      <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-8 text-sm text-[#666666] shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <DashboardHeader
          userName={userName}
          onLogout={handleLogout}
          loadingLogout={loadingLogout}
        />

        <section className="grid gap-5 2xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-5">
            <BalanceCard
              balance={userRecord?.balance || 0}
              tier="Platinum"
              cardNumber="**** 2849"
              expiry="09/29"
              accountType="Premium"
              accountNumber={userRecord?.accountNumber || ""}
            />

            <SummaryStatsRow stats={stats} />
            <QuickActionsGrid actions={quickActions} />
            <RecentTransactions transactions={mappedTransactions} />
          </div>

          <div className="space-y-5">
            <NotificationPanel notifications={notifications} />
            <ProfilePanel
              userName={userName}
              userEmail={userEmail}
              accountNumber={userRecord?.accountNumber || ""}
              status={userRecord?.status || "active"}
            />
          </div>
        </section>
      </div>

      {showLoanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
            <button
              onClick={() => setShowLoanModal(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f1eb] text-[#111111] transition hover:bg-[#ece4d8]"
            >
              <X size={18} />
            </button>

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-lg">
              <Landmark size={24} />
            </div>

            <h2 className="text-xl font-bold tracking-[-0.02em] text-[#111111]">
              Loan Service Unavailable Online
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Loan requests are currently handled directly by our customer care
              department. Please contact customer support for eligibility review,
              available loan options, and approval guidance.
            </p>

            <div className="mt-6 rounded-2xl border border-[#ece4d8] bg-[#faf7f2] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#111111] shadow-sm">
                  <Headphones size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#111111]">
                    Contact Customer Care
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#777777]">
                    Our support team will assist you with loan application
                    instructions.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLoanModal(false)}
              className="mt-6 w-full rounded-2xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </>
  );
}