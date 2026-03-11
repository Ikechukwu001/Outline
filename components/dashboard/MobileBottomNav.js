"use client";

import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ArrowRightLeft,
  CreditCard,
  ChartColumn,
  UserRound,
} from "lucide-react";
import NavItem from "@/components/dashboard/NavItem";

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    label: "Send",
    href: "/dashboard/transfer",
    icon: ArrowRightLeft,
  },
  {
    label: "Cards",
    href: "/dashboard/cards",
    icon: CreditCard,
  },
  {
    label: "Stats",
    href: "/dashboard/analytics",
    icon: ChartColumn,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: UserRound,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#ece4d8] bg-[#fcfbf8]/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-12px_40px_rgba(17,17,17,0.08)] backdrop-blur xl:hidden">
      <nav className="mx-auto flex max-w-xl items-center gap-2 rounded-[1.75rem] border border-[#ece4d8] bg-white p-2 shadow-[0_12px_30px_rgba(17,17,17,0.06)]">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={active}
              mobile
            />
          );
        })}
      </nav>
    </div>
  );
}