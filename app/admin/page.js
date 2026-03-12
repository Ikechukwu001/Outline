import AdminShell from "@/components/admin/AdminShell";

export default function AdminPage() {
  return (
    <AdminShell>
      <main className="space-y-6">
        <section className="rounded-[2rem] border border-[#e8dfd1] bg-white p-8 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
            Admin Panel
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#111111]">
            Admin page works. Click on the Users tab to manage user accounts and view analytics.
          </h1>
        </section>
      </main>
    </AdminShell>
  );
}