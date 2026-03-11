"use client";

import { Search } from "lucide-react";

export default function AdminSearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a847a]">
        <Search size={18} />
      </div>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search by full name or email"
        className="h-14 w-full rounded-2xl border border-[#e8dfd1] bg-[#fcfbf8] pl-12 pr-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
      />
    </div>
  );
}