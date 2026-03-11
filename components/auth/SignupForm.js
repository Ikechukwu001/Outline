import AuthInput from "@/components/ui/AuthInput";

export default function SignupForm({
  formData,
  onChange,
  onSubmit,
  onGoogleAuth,
  loading,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthInput
        label="Full Name"
        type="text"
        name="fullName"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={onChange}
      />

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
        placeholder="Create a secure password"
        value={formData.password}
        onChange={onChange}
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-2 h-14 w-full rounded-2xl bg-[#111111] px-4 text-sm font-medium text-white shadow-[0_14px_30px_rgba(17,17,17,0.18)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Please wait..." : "Create Account"}
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