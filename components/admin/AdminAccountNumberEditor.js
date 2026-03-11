"use client";

export default function AdminAccountNumberEditor({
  accountNumber,
  onChange,
  onSubmit,
  onGenerate,
  loading,
}) {
  return (
    <section className="rounded-[2rem] border border-[#e8dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
        Account Number
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
        Assign or update account number
      </h2>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-2.5 block text-sm font-medium text-[#232323]">
            Account Number
          </label>
          <input
            type="text"
            value={accountNumber}
            onChange={onChange}
            placeholder="Enter 10-digit account number"
            className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm tracking-[0.15em] text-[#111111] outline-none transition placeholder:tracking-normal placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onGenerate}
            disabled={loading}
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#ddd3c5] bg-[#faf8f4] px-5 text-sm font-medium text-[#111111] transition hover:bg-white disabled:opacity-70"
          >
            Generate 10-digit Number
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#111111] px-5 text-sm font-medium text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)] transition hover:opacity-95 disabled:opacity-70"
          >
            {loading ? "Saving..." : "Save Account Number"}
          </button>
        </div>
      </form>
    </section>
  );
}