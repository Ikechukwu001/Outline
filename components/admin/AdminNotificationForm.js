"use client";

export default function AdminNotificationForm({
  title,
  message,
  onTitleChange,
  onMessageChange,
  onSubmit,
  loading,
}) {
  return (
    <section className="rounded-[2rem] border border-[#e8dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
        Notification Control
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
        Send user notification
      </h2>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-2.5 block text-sm font-medium text-[#232323]">
            Notification Title
          </label>
          <input
            type="text"
            value={title}
            onChange={onTitleChange}
            placeholder="Enter notification title"
            className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2.5 block text-sm font-medium text-[#232323]">
            Notification Message
          </label>
          <textarea
            value={message}
            onChange={onMessageChange}
            rows={5}
            placeholder="Write the message the user should see"
            className="w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 py-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#111111] px-5 text-sm font-medium text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)] transition hover:opacity-95 disabled:opacity-70"
        >
          {loading ? "Sending..." : "Create Notification"}
        </button>
      </form>
    </section>
  );
}