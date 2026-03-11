import TransactionItem from "@/components/dashboard/TransactionItem";

export default function RecentTransactions({ transactions }) {
  return (
    <section className="rounded-[1.95rem] border border-[#e9dfd1] bg-white p-5 shadow-[0_18px_40px_rgba(17,17,17,0.05)] sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
            Recent Activity
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#111111]">
            Transaction timeline
          </h2>
        </div>

        <button type="button" className="text-sm font-medium text-[#111111]">
          View all
        </button>
      </div>

      {!transactions.length ? (
        <div className="rounded-[1.4rem] bg-[#faf7f1] px-4 py-4 text-sm text-[#666666]">
          No transactions yet. Completed transfers will appear here.
        </div>
      ) : (
        <div className="grid gap-3">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              title={transaction.title}
              subtitle={transaction.subtitle}
              amount={transaction.amount}
              amountType={transaction.amountType}
            />
          ))}
        </div>
      )}
    </section>
  );
}