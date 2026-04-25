import Link from "next/link";
import {
  ArrowUpRight,
  CreditCard,
  LineChart,
  Send,
  Wallet,
} from "lucide-react";

const icons = {
  transfer: Send,
  card: CreditCard,
  chart: LineChart,
  wallet: Wallet,
};

export default function QuickActionCard({
  title,
  description,
  type,
  href,
  onClick,
}) {
  const Icon = icons[type] || Wallet;

  const className =
    "group block w-full rounded-[1.7rem] border border-[#ebe1d4] bg-white/95 p-5 text-left shadow-[0_16px_38px_rgba(17,17,17,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(17,17,17,0.08)]";

  const content = (
    <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-[0_12px_24px_rgba(17,17,17,0.14)]">
          <Icon size={21} strokeWidth={1.9} />
        </div>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7efe4] text-[#7b7469] transition group-hover:bg-[#111111] group-hover:text-white">
          <ArrowUpRight size={17} />
        </span>
      </div>

      <h3 className="text-sm font-semibold tracking-[-0.01em] text-[#111111]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#70685f]">{description}</p>
    </>
  );

  if (typeof onClick === "function") {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" disabled className={`${className} opacity-60`}>
      {content}
    </button>
  );
}