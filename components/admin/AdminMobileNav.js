"use client";

import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Bell,
  ShieldCheck,
} from "lucide-react";
import AdminNavItem from "@/components/admin/AdminNavItem";

const navItems = [
  {
    label: "Home",
    href: "/admin",
    icon: LayoutGrid,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Alerts",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    label: "Access",
    href: "/admin/access",
    icon: ShieldCheck,
  },
];

export default function AdminMobileNav() {
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e8dfd1] bg-[#fcfbf8]/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-12px_40px_rgba(17,17,17,0.08)] backdrop-blur xl:hidden">
      <nav className="mx-auto flex max-w-xl items-center gap-2 rounded-[1.75rem] border border-[#e8dfd1] bg-white p-2 shadow-[0_12px_30px_rgba(17,17,17,0.06)]">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <AdminNavItem
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