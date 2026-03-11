export default function AdminUserNotificationsList({ notifications }) {
  return (
    <section className="rounded-[2rem] border border-[#e8dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
        User Notifications
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
        Notification history
      </h2>

      <div className="mt-5 space-y-3">
        {!notifications.length ? (
          <div className="rounded-2xl bg-[#faf8f4] p-4 text-sm text-[#666666]">
            No notifications have been created for this user yet.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.4rem] border border-[#ece3d7] bg-[#fcfbf8] p-4"
            >
              <p className="text-sm font-semibold text-[#111111]">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#666666]">
                {item.message}
              </p>
              <p className="mt-3 text-xs text-[#8a847a]">
                {item.createdAtLabel || "Recently added"}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}