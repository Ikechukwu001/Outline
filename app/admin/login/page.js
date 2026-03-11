"use client";

import { useState } from "react";
import { ShieldCheck, LockKeyhole } from "lucide-react";
import {
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, localPersistence } from "@/lib/firebase";
import { getFirebaseAuthMessage } from "@/lib/firebase-errors";
import { checkIsAdmin } from "@/lib/admin";

export default function AdminLoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await setPersistence(auth, localPersistence);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const isAdmin = await checkIsAdmin(userCredential.user.uid);

      if (!isAdmin) {
        setError("This account does not have admin access.");
        return;
      }

      setMessage("Admin access granted.");
      router.replace("/admin");
    } catch (err) {
      setError(getFirebaseAuthMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f3ee] px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-2 lg:gap-14">
          <section className="order-2 space-y-8 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e7dfd2] bg-white/90 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#6b655d] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#b89a68]" />
              Back Office Access
            </div>

            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#111111] sm:text-5xl lg:text-6xl">
                Administrative control for REFUND ACCOUNT.
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-8 text-[#5f5f5f] sm:text-lg">
                Manage customer records, assign account numbers, update balances,
                and publish user notifications from one secure back-office space.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#e9e1d5] bg-white/90 p-5 shadow-[0_24px_60px_rgba(17,17,17,0.06)] sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-[#111111] text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)]">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#111111]">
                    Admin-only entry
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#666666]">
                    Only authenticated Firebase users listed in your Firestore
                    <span className="mx-1 font-medium text-[#111111]">admins</span>
                    collection can access this panel.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="order-1 lg:order-2">
            <div className="mx-auto w-full max-w-md rounded-[2.1rem] border border-[#e8dfd1] bg-white/92 p-5 shadow-[0_30px_70px_rgba(17,17,17,0.10)] sm:p-7">
              <div className="mb-7">
                <p className="text-[11px] uppercase tracking-[0.26em] text-[#9b9489]">
                  Admin Portal
                </p>
                <h2 className="mt-3 text-[1.7rem] font-semibold tracking-[-0.03em] text-[#111111]">
                  Sign in to continue
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#6a6a6a]">
                  Enter your administrative credentials to manage user banking
                  records and account controls.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                    Admin Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter admin email"
                    className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] px-4 text-sm font-medium text-white shadow-[0_14px_30px_rgba(17,17,17,0.18)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <LockKeyhole size={18} />
                  {loading ? "Verifying access..." : "Access Admin Panel"}
                </button>
              </form>

              {(message || error) && (
                <div
                  className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                    error
                      ? "border border-red-200 bg-red-50 text-red-700"
                      : "border border-green-200 bg-green-50 text-green-700"
                  }`}
                >
                  {error || message}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}