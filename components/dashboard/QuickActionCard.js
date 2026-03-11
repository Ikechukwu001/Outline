import Link from "next/link";
import {
  ArrowRightLeft,
  CreditCard,
  ChartNoAxesColumn,
  UserRound,
} from "lucide-react";

const iconMap = {
  transfer: ArrowRightLeft,
  card: CreditCard,
  chart: ChartNoAxesColumn,
  profile: UserRound,
};

export default function QuickActionCard({
  title,
  description,
  type,
  href,
}) {
  const Icon = iconMap[type] || ArrowRightLeft;

  return (
    <Link
      href={href}
      className="group block rounded-[1.7rem] border border-[#ebe1d4] bg-white/95 p-5 shadow-[0_16px_38px_rgba(17,17,17,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(17,17,17,0.08)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4ede2] text-[#111111] transition group-hover:bg-[#111111] group-hover:text-white">
          <Icon size={19} />
        </div>

        <div className="rounded-full bg-[#faf7f1] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#857d71]">
          Open
        </div>
      </div>

      <h3 className="mt-5 text-sm font-semibold tracking-[-0.01em] text-[#111111]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[#666666]">{description}</p>
    </Link>
  );
}