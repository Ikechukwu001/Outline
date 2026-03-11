export default function FeatureCard({ icon: Icon, title, description, id }) {
  return (
    <div
      id={id}
      className="rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-[0_12px_30px_rgba(17,17,17,0.05)] backdrop-blur sm:p-6"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[#111111] text-white shadow-[0_12px_24px_rgba(17,17,17,0.15)]">
        <Icon size={22} strokeWidth={1.9} />
      </div>

      <h3 className="text-sm font-semibold tracking-[-0.01em] text-[#111111]">
        {title}
      </h3>
      <p className="mt-2.5 text-sm leading-6 text-[#666666]">{description}</p>
    </div>
  );
}