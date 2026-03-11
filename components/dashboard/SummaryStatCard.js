import { Wallet, CreditCard, ArrowUpRight } from "lucide-react";

const iconMap = {
  wallet: Wallet,
  card: CreditCard,
  transfer: ArrowUpRight,
};

export default function SummaryStatCard({ title, value, type }) {
  const Icon = iconMap[type] || Wallet;

  return (
    <div className="rounded-[1.7rem] border border-[#ebe1d4] bg-white/95 p-5 shadow-[0_16px_38px_rgba(17,17,17,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-[0_10px_24px_rgba(17,17,17,0.14)]">
          <Icon size={19} />
        </div>

        <div className="rounded-full bg-[#f4ede2] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#7c7468]">
          Live
        </div>
      </div>

      <p className="mt-5 text-xs uppercase tracking-[0.16em] text-[#8e877c]">
        {title}
      </p>
      <p className="mt-2 text-lg font-semibold capitalize tracking-[-0.03em] text-[#111111]">
        {value}
      </p>
    </div>
  );
}