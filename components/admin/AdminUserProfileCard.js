export default function AdminUserProfileCard({ userData }) {
  const initials =
    userData?.fullName?.trim()?.charAt(0)?.toUpperCase() ||
    userData?.email?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <section className="rounded-[2rem] border border-[#e8dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
        User Profile
      </p>

      <div className="mt-5 flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-[#111111] text-lg font-semibold uppercase text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)]">
          {initials}
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#111111]">
            {userData?.fullName || "Unnamed User"}
          </h2>
          <p className="mt-1 text-sm text-[#666666]">{userData?.email}</p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#7c766d]">
            <span className="rounded-full bg-[#f3eee6] px-3 py-1">
              UID: {userData?.uid}
            </span>
            <span className="rounded-full bg-[#f3eee6] px-3 py-1">
              Status: {userData?.status || "active"}
            </span>
            <span className="rounded-full bg-[#f3eee6] px-3 py-1">
              Balance: ${Number(userData?.balance || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}