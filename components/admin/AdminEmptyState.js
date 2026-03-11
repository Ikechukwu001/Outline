import { Users } from "lucide-react";

export default function AdminEmptyState({ title, description }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-[#ddd3c5] bg-[#fcfbf8] p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-[0_12px_24px_rgba(17,17,17,0.14)]">
        <Users size={22} />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#111111]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#666666]">
        {description}
      </p>
    </div>
  );
}