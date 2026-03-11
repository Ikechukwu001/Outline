"use client";

import {
  UserRound,
  Mail,
  ShieldCheck,
  Wallet,
  BadgeCheck,
  Hash,
  Sparkles,
} from "lucide-react";
import useDashboardData from "@/components/dashboard/useDashboardData";

export default function ProfilePage() {
  const { userName, userEmail, userRecord, notifications, loadingData } =
    useDashboardData();

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

  const profileCards = [
    {
      title: "Full Name",
      value: userName || "Customer",
      icon: UserRound,
    },
    {
      title: "Email Address",
      value: userEmail || "No email",
      icon: Mail,
    },
    {
      title: "Account Number",
      value: accountNumber,
      icon: Hash,
    },
    {
      title: "Status",
      value: status,
      icon: BadgeCheck,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[#ece4d8] bg-white/92 p-6 shadow-[0_24px_60px_rgba(17,17,17,0.05)] sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#948d83]">
              Profile
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#111111] sm:text-[2rem]">
              Your account identity
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#666666]">
              Review your premium banking profile, account details, and identity
              information in one polished personal space.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#e9e1d5] bg-[#faf8f4] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-[#6e695f]">
            <ShieldCheck size={15} />
            Verified account identity
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#111111] text-2xl font-semibold uppercase text-white shadow-[0_16px_30px_rgba(17,17,17,0.18)]">
                {initials}
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-[#111111]">
                {userName || "Customer"}
              </h2>
              <p className="mt-2 text-sm text-[#666666]">{userEmail}</p>

              <div className="mt-5 rounded-full bg-[#f3eee6] px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[#6e695f]">
                {status}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-[#111111] text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)]">
                <Sparkles size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#111111]">
                  Premium profile state
                </p>
                <p className="mt-2 text-sm leading-7 text-[#666666]">
                  Your profile now reflects the same real account record that
                  your admin panel controls, making the customer experience feel
                  more authentic and connected.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {profileCards.map((card) => {
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
                  <p className="mt-2 break-words text-base font-semibold capitalize tracking-[-0.02em] text-[#111111]">
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
              Account Summary
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
              Personal account overview
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666]">Available Balance</span>
                <span className="font-medium text-[#111111]">
                  ${balance.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666]">Account Number</span>
                <span className="font-medium text-[#111111]">
                  {accountNumber}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666]">Notification Count</span>
                <span className="font-medium text-[#111111]">
                  {notifications.length}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666]">Account Status</span>
                <span className="font-medium capitalize text-[#111111]">
                  {status}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-[#111111] text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)]">
                <Wallet size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#111111]">
                  Account-linked identity
                </p>
                <p className="mt-2 text-sm leading-7 text-[#666666]">
                  Your profile information is now synchronized with the account
                  data managed from the admin workspace, including balance,
                  account number, and status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}