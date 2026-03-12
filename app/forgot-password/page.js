"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, MailCheck } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getFirebaseAuthMessage } from "@/lib/firebase-errors";

const actionCodeSettings = {
  url: "http://localhost:3000",
  handleCodeInApp: false,
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    text: "",
  });

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", text: "" });

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);

      setFeedback({
        type: "success",
        text: "Password reset email sent. Please check your inbox.",
      });

      setEmail("");
    } catch (err) {
      setFeedback({
        type: "error",
        text: getFirebaseAuthMessage(err.code),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.95fr] lg:gap-14">
          <section className="order-2 space-y-8 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e7dfd2] bg-white/90 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#6b655d] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#b89a68]" />
              Password Recovery
            </div>

            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#111111] sm:text-5xl lg:text-6xl">
                Recover access to your REFUND ACCOUNT.
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-8 text-[#5f5f5f] sm:text-lg">
                Enter your email address and we’ll send a secure password reset
                link so you can restore account access safely.
              </p>
            </div>
          </section>

          <section className="order-1 lg:order-2">
            <div className="mx-auto w-full max-w-md rounded-[2.1rem] border border-[#e8dfd1] bg-white/92 p-5 shadow-[0_30px_70px_rgba(17,17,17,0.10)] sm:p-7">
              <div className="mb-7">
                <p className="text-[11px] uppercase tracking-[0.26em] text-[#9b9489]">
                  Reset Password
                </p>
                <h2 className="mt-3 text-[1.7rem] font-semibold tracking-[-0.03em] text-[#111111]">
                  Request a reset link
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#6a6a6a]">
                  We’ll send a password reset email to the address linked to
                  your account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] px-4 text-sm font-medium text-white shadow-[0_14px_30px_rgba(17,17,17,0.18)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <KeyRound size={18} />
                  {loading ? "Sending reset link..." : "Send Reset Link"}
                </button>
              </form>

              {feedback.text && (
                <div
                  className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                    feedback.type === "error"
                      ? "border border-red-200 bg-red-50 text-red-700"
                      : "border border-green-200 bg-green-50 text-green-700"
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <Link
                href="/"
                className="mt-5 block text-center text-sm font-medium text-[#111111] underline underline-offset-4"
              >
                Back to sign in
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}