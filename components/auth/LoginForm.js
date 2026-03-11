import AuthInput from "@/components/ui/AuthInput";

export default function LoginForm({
  formData,
  onChange,
  onSubmit,
  onGoogleAuth,
  loading,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthInput
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={onChange}
      />

      <AuthInput
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={onChange}
      />

      <div className="flex items-center justify-between gap-3 px-1">
        <label className="flex items-center gap-2 text-sm text-[#666666]">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-[#d9d2c8]"
          />
          Remember me
        </label>

        <button type="button" className="text-sm font-medium text-[#111111]">
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 h-14 w-full rounded-2xl bg-[#111111] px-4 text-sm font-medium text-white shadow-[0_14px_30px_rgba(17,17,17,0.18)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Please wait..." : "Login"}
      </button>

      <button
        type="button"
        onClick={onGoogleAuth}
        disabled={loading}
        className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-white px-4 text-sm font-medium text-[#111111] transition hover:bg-[#faf7f2] disabled:cursor-not-allowed disabled:opacity-70"
      >
        Continue with Google
      </button>
    </form>
  );
}