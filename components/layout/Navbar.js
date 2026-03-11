"use client";

export default function Navbar({ menuOpen, setMenuOpen }) {
  return (
    <header className="sticky top-0 z-40 pt-4">
      <div className="rounded-full border border-white/70 bg-white/80 px-4 py-3 shadow-[0_12px_40px_rgba(17,17,17,0.06)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#111111] text-sm font-semibold tracking-[0.22em] text-white shadow-[0_10px_25px_rgba(17,17,17,0.18)]">
              RA
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] uppercase tracking-[0.35em] text-[#8b8b8b] sm:text-[11px]">
                Premium Digital Banking
              </p>
              <h1 className="truncate text-sm font-semibold tracking-[0.08em] text-[#111111] sm:text-base">
                REFUND ACCOUNT
              </h1>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-[#545454] transition hover:text-[#111111]"
            >
              Features
            </a>
            <a
              href="#security"
              className="text-sm font-medium text-[#545454] transition hover:text-[#111111]"
            >
              Security
            </a>
            <a
              href="#auth"
              className="rounded-full border border-[#161616] px-5 py-2.5 text-sm font-medium text-[#111111] transition hover:bg-[#111111] hover:text-white"
            >
              Sign in
            </a>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e9e2d7] bg-white text-[#111111] shadow-[0_8px_20px_rgba(17,17,17,0.06)] md:hidden"
            aria-label="Toggle menu"
          >
            <div className="relative flex h-5 w-5 items-center justify-center">
              <span
                className={`absolute block h-[2px] w-5 rounded-full bg-[#111111] transition duration-300 ${
                  menuOpen ? "rotate-45" : "-translate-y-[6px]"
                }`}
              />
              <span
                className={`absolute block h-[2px] w-5 rounded-full bg-[#111111] transition duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute block h-[2px] w-5 rounded-full bg-[#111111] transition duration-300 ${
                  menuOpen ? "-rotate-45" : "translate-y-[6px]"
                }`}
              />
            </div>
          </button>
        </div>

        {menuOpen && (
          <div className="mt-4 rounded-[1.75rem] border border-[#ece5da] bg-[#fcfbf8]/95 p-4 shadow-[0_24px_60px_rgba(17,17,17,0.08)] backdrop-blur md:hidden">
            <div className="flex flex-col gap-2">
              <a
                href="#features"
                className="rounded-2xl px-4 py-3.5 text-sm font-medium text-[#232323] transition hover:bg-[#f2eee6]"
                onClick={() => setMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#security"
                className="rounded-2xl px-4 py-3.5 text-sm font-medium text-[#232323] transition hover:bg-[#f2eee6]"
                onClick={() => setMenuOpen(false)}
              >
                Security
              </a>
              <a
                href="#auth"
                className="mt-1 rounded-2xl bg-[#111111] px-4 py-3.5 text-sm font-medium text-white shadow-[0_12px_24px_rgba(17,17,17,0.16)]"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}