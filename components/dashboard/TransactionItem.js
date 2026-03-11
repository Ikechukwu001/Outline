export default function TransactionItem({
  title,
  subtitle,
  amount,
  amountType,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-[#eee5d9] bg-[#fcfaf6] px-4 py-4 transition hover:bg-white">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#161616]">{title}</p>
        <p className="mt-1 truncate text-xs text-[#7a7a7a]">{subtitle}</p>
      </div>

      <p
        className={`shrink-0 text-sm font-semibold ${
          amountType === "credit" ? "text-green-600" : "text-[#111111]"
        }`}
      >
        {amount}
      </p>
    </div>
  );
}