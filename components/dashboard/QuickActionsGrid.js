import Link from "next/link";
import QuickActionCard from "@/components/dashboard/QuickActionCard";

export default function QuickActionsGrid({ actions }) {
  return (
    <section className="rounded-[1.95rem] border border-[#e9dfd1] bg-[#fffdfa] p-5 shadow-[0_18px_40px_rgba(17,17,17,0.05)] sm:p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
            Quick Actions
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#111111]">
            Banking shortcuts
          </h2>
        </div>

        <div className="rounded-full bg-[#f4ede2] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#7b7469]">
          Fast access
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <QuickActionCard
            key={action.title}
            title={action.title}
            description={action.description}
            type={action.type}
            href={action.href}
            onClick={action.onClick}
          />
        ))}
      </div>
    </section>
  );
}