"use client";

import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
} from "lucide-react";
import AdminNavItem from "@/components/admin/AdminNavItem";

const navItems = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutGrid,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden xl:flex xl:w-[300px] xl:flex-col">
      <div className="sticky top-6 rounded-[2rem] border border-[#e8dfd1] bg-white/92 p-5 shadow-[0_24px_60px_rgba(17,17,17,0.06)] backdrop-blur">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-sm font-semibold tracking-[0.2em] text-white shadow-[0_12px_26px_rgba(17,17,17,0.18)]">
            RA
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#948d83]">
              Back Office
            </p>
            <h2 className="mt-1 text-sm font-semibold tracking-[0.08em] text-[#111111]">
              REFUND ACCOUNT ADMIN
            </h2>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <AdminNavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={active}
              />
            );
          })}
        </nav>

        <div className="mt-8 rounded-[1.6rem] bg-[#f6f2eb] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
            Admin Control
          </p>
          <p className="mt-2 text-sm font-medium text-[#111111]">
            Manual banking operations
          </p>
          <p className="mt-2 text-sm leading-6 text-[#666666]">
            Assign account numbers, update balances, and push user
            notifications from one secure operational space.
          </p>
        </div>
      </div>
    </aside>
  );
}