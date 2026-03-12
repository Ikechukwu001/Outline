"use client";

export default function AdminBalanceEditor({
  amountValue,
  onChange,
  onSubmit,
  loading,
  currentBalance,
}) {
  return (
    <section className="rounded-[2rem] border border-[#e8dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
        Balance Control
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
        Fund user account
      </h2>
      <p className="mt-2 text-sm leading-7 text-[#666666]">
        Add money to the user’s current balance instead of replacing it.
      </p>

      <div className="mt-5 rounded-[1.4rem] bg-[#faf7f1] p-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847a]">
          Current Balance
        </p>
        <p className="mt-2 text-xl font-semibold text-[#111111]">
          ${Number(currentBalance || 0).toLocaleString()}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-2.5 block text-sm font-medium text-[#232323]">
            Amount to Add
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amountValue}
            onChange={onChange}
            placeholder="Enter amount to fund"
            className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#111111] px-5 text-sm font-medium text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)] transition hover:opacity-95 disabled:opacity-70"
        >
          {loading ? "Funding..." : "Add Funds"}
        </button>
      </form>
    </section>
  );
}