import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6">
      <AdminTopbar
        title="Notification center"
        subtitle="Create and manage the manual notifications that appear in the user banking experience."
        onLogout={() => {}}
        loggingOut={false}
      />

      <section className="rounded-[2rem] border border-[#e8dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
          Notifications
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
          Notification tools coming next
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#666666]">
          This page will later manage notification creation, user targeting, and
          notification history.
        </p>
      </section>
    </div>
  );
}