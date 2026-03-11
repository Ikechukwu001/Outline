import { Bell } from "lucide-react";

export default function NotificationPanel({ notifications }) {
  return (
    <section className="rounded-[1.85rem] border border-[#e9dfd1] bg-white p-5 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
            Alerts
          </p>
          <p className="mt-2 text-lg font-semibold text-[#171717]">
            Notifications
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
          <Bell size={18} />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {!notifications.length ? (
          <div className="rounded-[1.4rem] bg-[#f6f2eb] p-4">
            <p className="text-sm font-medium text-[#111111]">
              No notifications yet
            </p>
            <p className="mt-1 text-sm text-[#6a6a6a]">
              Admin-created alerts will appear here.
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <div key={item.id} className="rounded-[1.4rem] bg-[#f6f2eb] p-4">
              <p className="text-sm font-semibold text-[#111111]">
                {item.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-[#6a6a6a]">
                {item.message}
              </p>
              <p className="mt-2 text-xs text-[#8a847a]">
                {item.createdAtLabel || "Recently added"}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}