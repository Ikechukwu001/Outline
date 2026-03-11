export default function AuthInput({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2.5 block text-sm font-medium text-[#232323]">
        {label}
      </label>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
      />
    </div>
  );
}