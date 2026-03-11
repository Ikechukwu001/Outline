import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AdminUserRow({ user }) {
  const initials =
    user.fullName?.trim()?.charAt(0)?.toUpperCase() ||
    user.email?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <div className="flex flex-col gap-4 rounded-[1.5rem] border border-[#ece3d7] bg-[#fcfbf8] p-4 transition hover:border-[#d8cdbd] hover:bg-white sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#111111] text-sm font-semibold uppercase text-white shadow-[0_10px_24px_rgba(17,17,17,0.15)]">
          {initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#111111]">
            {user.fullName || "Unnamed User"}
          </p>
          <p className="mt-1 truncate text-sm text-[#666666]">{user.email}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#7c766d]">
            <span className="rounded-full bg-[#f3eee6] px-3 py-1">
              Balance: ${Number(user.balance || 0).toLocaleString()}
            </span>
            <span className="rounded-full bg-[#f3eee6] px-3 py-1">
              Acct: {user.accountNumber || "Not assigned"}
            </span>
            <span className="rounded-full bg-[#f3eee6] px-3 py-1">
              Status: {user.status || "active"}
            </span>
          </div>
        </div>
      </div>

      <Link
        href={`/admin/users/${user.uid}`}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#111111] px-5 text-sm font-medium text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)] transition hover:opacity-95"
      >
        Manage User
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}