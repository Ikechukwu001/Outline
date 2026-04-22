"use client";

import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ArrowRightLeft,
  CreditCard,
  ChartColumn,
  UserRound,
  Badge
} from "lucide-react";
import NavItem from "@/components/dashboard/NavItem";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    label: "Transfer",
    href: "/dashboard/transfer",
    icon: ArrowRightLeft,
  },
  {
    label: "Cards",
    href: "/dashboard/cards",
    icon: CreditCard,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartColumn,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: UserRound,
  },
    {
    label: "Kyc",
    href: "/dashboard/kyc",
    icon: Badge,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden xl:flex xl:w-[290px] xl:flex-col">
      <div className="sticky top-6 rounded-[2rem] border border-[#ece4d8] bg-white/92 p-5 shadow-[0_24px_60px_rgba(17,17,17,0.06)] backdrop-blur">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-sm font-semibold tracking-[0.2em] text-white shadow-[0_12px_26px_rgba(17,17,17,0.18)]">
            RA
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#948d83]">
              Premium Digital Banking
            </p>
            <h2 className="mt-1 text-sm font-semibold tracking-[0.08em] text-[#111111]">
              REFUND ACCOUNT
            </h2>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={active}
              />
            );
          })}
        </nav>
      </div>
    </aside>
  );
}