import { ArrowRightLeft, ShieldCheck, ReceiptText } from "lucide-react";
import FeatureCard from "@/components/ui/FeatureCard";

export default function HeroSection() {
  return (
    <div className="order-2 space-y-8 lg:order-1 lg:space-y-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#e8e0d4] bg-white/85 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#6d685f] shadow-sm backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-[#c7a970]" />
        Global Premium Banking Experience
      </div>

      <div className="max-w-2xl">
        <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#111111] sm:text-5xl lg:text-6xl">
          Banking, redefined for a global generation.
        </h2>

        <p className="mt-6 max-w-xl text-[15px] leading-8 text-[#5f5f5f] sm:text-lg">
          REFUND ACCOUNT delivers a polished digital banking experience with
          elegant money movement, secure account access, and smart payment tools
          designed for the modern lifestyle.
        </p>
      </div>

      <div id="features" className="grid gap-4 sm:grid-cols-3">
        <FeatureCard
          icon={ArrowRightLeft}
          title="Instant Transfers"
          description="Move money smoothly with a fast, premium digital flow."
        />
        <FeatureCard
          icon={ShieldCheck}
          title="Secure Authentication"
          description="Elegant onboarding with a trust-first, security-led feel."
          id="security"
        />
        <FeatureCard
          icon={ReceiptText}
          title="Bill Payments"
          description="Clean utility and subscription payment experiences."
        />
      </div>

      <div className="rounded-[2rem] border border-[#ebe3d8] bg-white/85 p-4 shadow-[0_28px_65px_rgba(17,17,17,0.08)] backdrop-blur sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.7rem] bg-[#121212] p-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.30em] text-white/55">
                  Total Balance
                </p>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight sm:text-[2rem]">
                  $48,240.90
                </h3>
              </div>

              <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/78">
                Platinum
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                  Card
                </p>
                <p className="mt-2 text-sm text-white/88">**** 2849</p>
              </div>

              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                  Valid Thru
                </p>
                <p className="mt-2 text-sm text-white/88">09/29</p>
              </div>

              <div className="rounded-2xl bg-white/5 px-4 py-3 sm:col-span-1 col-span-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                  Account Tier
                </p>
                <p className="mt-2 text-sm text-white/88">Premium</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.5rem] bg-[#f4f1ea] p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#222222]">Transfers</p>
                <span className="text-xs uppercase tracking-[0.15em] text-[#7b7b7b]">
                  Today
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-white px-4 py-3.5 shadow-[0_8px_18px_rgba(17,17,17,0.04)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#1d1d1d]">
                        International
                      </p>
                      <p className="mt-1 text-xs text-[#7a7a7a]">Completed</p>
                    </div>
                    <p className="text-sm font-semibold text-[#111111]">
                      -$820.00
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3.5 shadow-[0_8px_18px_rgba(17,17,17,0.04)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#1d1d1d]">
                        Utility Bill
                      </p>
                      <p className="mt-1 text-xs text-[#7a7a7a]">Scheduled</p>
                    </div>
                    <p className="text-sm font-semibold text-[#111111]">
                      -$120.00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#ece5da] bg-white px-5 py-4 shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a8479]">
                Trusted Experience
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5d5d5d]">
                Designed to feel private, premium, and globally modern from the
                very first screen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}