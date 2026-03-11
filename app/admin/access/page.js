import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminAccessPage() {
  return (
    <div className="space-y-6">
      <AdminTopbar
        title="Access control"
        subtitle="Review the current admin access model used to protect your back-office environment."
        onLogout={() => {}}
        loggingOut={false}
      />

      <section className="rounded-[2rem] border border-[#e8dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
          Access
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
          Admin role structure
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#666666]">
          This area can later show admin roles, permissions, and access checks
          for your project demo.
        </p>
      </section>
    </div>
  );
}