"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BalanceCard from "@/components/dashboard/BalanceCard";
import SummaryStatsRow from "@/components/dashboard/SummaryStatsRow";
import QuickActionsGrid from "@/components/dashboard/QuickActionsGrid";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import NotificationPanel from "@/components/dashboard/NotificationPanel";
import ProfilePanel from "@/components/dashboard/ProfilePanel";
import useDashboardData from "@/components/dashboard/useDashboardData";
import { useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [loadingLogout, setLoadingLogout] = useState(false);

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
      amount: `${isCredit ? "+" : "-"}$${Number(item.amount || 0).toLocaleString()}`,
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
  );
}