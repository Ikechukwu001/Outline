export default function AuthTabs({ activeTab, setActiveTab }) {
  return (
    <div className="mb-7 flex rounded-full bg-[#f3efe8] p-1.5">
      <button
        onClick={() => setActiveTab("signup")}
        className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${
          activeTab === "signup"
            ? "bg-[#111111] text-white shadow-[0_10px_22px_rgba(17,17,17,0.18)]"
            : "text-[#6b675f]"
        }`}
      >
        Sign Up
      </button>

      <button
        onClick={() => setActiveTab("login")}
        className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${
          activeTab === "login"
            ? "bg-[#111111] text-white shadow-[0_10px_22px_rgba(17,17,17,0.18)]"
            : "text-[#6b675f]"
        }`}
      >
        Login
      </button>
    </div>
  );
}