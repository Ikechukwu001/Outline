"use client";

export default function AdminStatusEditor({
  currentStatus,
  onSetStatus,
  loading,
}) {
  const isActive = currentStatus === "active";
  const isDeactivated = currentStatus === "deactivated";

  return (
    <section className="rounded-[2rem] border border-[#e8dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
        Card / Account Status
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
        Manage activation state
      </h2>
      <p className="mt-2 text-sm leading-7 text-[#666666]">
        Control whether this user’s card/account appears active or deactivated
        across the customer experience.
      </p>

      <div className="mt-5 rounded-[1.4rem] bg-[#faf7f1] p-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847a]">
          Current Status
        </p>
        <p
          className={`mt-2 text-lg font-semibold capitalize ${
            isActive ? "text-green-600" : "text-red-600"
          }`}
        >
          {currentStatus || "active"}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onSetStatus("active")}
          disabled={loading || isActive}
          className={`inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-medium transition ${
            isActive
              ? "bg-green-600 text-white shadow-[0_12px_26px_rgba(22,163,74,0.22)]"
              : "border border-[#ddd3c5] bg-[#faf8f4] text-[#111111] hover:bg-white"
          } disabled:opacity-70`}
        >
          {loading && !isDeactivated ? "Saving..." : "Set Active"}
        </button>

        <button
          type="button"
          onClick={() => onSetStatus("deactivated")}
          disabled={loading || isDeactivated}
          className={`inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-medium transition ${
            isDeactivated
              ? "bg-red-600 text-white shadow-[0_12px_26px_rgba(220,38,38,0.22)]"
              : "border border-[#ddd3c5] bg-[#faf8f4] text-[#111111] hover:bg-white"
          } disabled:opacity-70`}
        >
          {loading && !isActive ? "Saving..." : "Set Deactivated"}
        </button>
      </div>
    </section>
  );
}