"use client";

export default function AdminTransferSuspensionEditor({
  transferSuspended,
  onToggle,
  loading,
}) {
  return (
    <section className="rounded-[2rem] border border-[#e8dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
        Transfer Control
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
        Manage transfer access
      </h2>
      <p className="mt-2 text-sm leading-7 text-[#666666]">
        Suspend or restore this user’s ability to send money without affecting
        the card activation state.
      </p>

      <div className="mt-5 rounded-[1.4rem] bg-[#faf7f1] p-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847a]">
          Current Transfer State
        </p>
        <p
          className={`mt-2 text-lg font-semibold ${
            transferSuspended ? "text-red-600" : "text-green-600"
          }`}
        >
          {transferSuspended ? "Suspended" : "Allowed"}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onToggle(false)}
          disabled={loading || !transferSuspended}
          className={`inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-medium transition ${
            !transferSuspended
              ? "bg-green-600 text-white shadow-[0_12px_26px_rgba(22,163,74,0.22)]"
              : "border border-[#ddd3c5] bg-[#faf8f4] text-[#111111] hover:bg-white"
          } disabled:opacity-70`}
        >
          {loading && transferSuspended ? "Saving..." : "Allow Transfers"}
        </button>

        <button
          type="button"
          onClick={() => onToggle(true)}
          disabled={loading || transferSuspended}
          className={`inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-medium transition ${
            transferSuspended
              ? "bg-red-600 text-white shadow-[0_12px_26px_rgba(220,38,38,0.22)]"
              : "border border-[#ddd3c5] bg-[#faf8f4] text-[#111111] hover:bg-white"
          } disabled:opacity-70`}
        >
          {loading && !transferSuspended ? "Saving..." : "Suspend Transfers"}
        </button>
      </div>
    </section>
  );
}