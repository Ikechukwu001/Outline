export default function ProfilePanel({
  userName,
  userEmail,
  accountNumber,
  status,
}) {
  return (
    <section className="rounded-[1.85rem] border border-[#e9dfd1] bg-white p-5 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
        Account Holder
      </p>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111111] text-base font-semibold uppercase text-white shadow-[0_10px_24px_rgba(17,17,17,0.15)]">
          {userName?.charAt(0) || "C"}
        </div>

        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-[#111111]">
            {userName}
          </p>
          <p className="truncate text-sm text-[#666666]">{userEmail}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3 rounded-[1.4rem] bg-[#faf7f1] p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#666666]">Account Number</span>
          <span className="font-medium text-[#111111]">
            {accountNumber || "Not assigned"}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-[#666666]">Status</span>
          <span className="font-medium capitalize text-[#111111]">
            {status || "active"}
          </span>
        </div>
      </div>
    </section>
  );
}