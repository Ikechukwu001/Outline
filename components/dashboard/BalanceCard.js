export default function BalanceCard({
  balance,
  tier,
  cardNumber,
  expiry,
  accountType,
  accountNumber,
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-[#111111] p-6 text-white shadow-[0_28px_70px_rgba(17,17,17,0.16)] sm:p-7">
      <div className="absolute right-[-30px] top-[-20px] h-40 w-40 rounded-full bg-[#d3b88a]/18 blur-3xl" />
      <div className="absolute bottom-[-40px] left-[-20px] h-40 w-40 rounded-full bg-white/5 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">
              Total Balance
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-[3rem]">
              ${Number(balance || 0).toLocaleString()}
            </h2>
          </div>

          <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/80">
            {tier}
          </div>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.4rem] bg-white/6 px-4 py-4 backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
              Card
            </p>
            <p className="mt-2 text-sm text-white/90">{cardNumber}</p>
          </div>

          <div className="rounded-[1.4rem] bg-white/6 px-4 py-4 backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
              Valid Thru
            </p>
            <p className="mt-2 text-sm text-white/90">{expiry}</p>
          </div>

          <div className="rounded-[1.4rem] bg-white/6 px-4 py-4 backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
              Account
            </p>
            <p className="mt-2 text-sm text-white/90">
              {accountNumber || accountType}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}