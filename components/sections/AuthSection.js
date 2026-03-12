"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  setPersistence,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db, googleProvider, localPersistence } from "@/lib/firebase";
import { getFirebaseAuthMessage } from "@/lib/firebase-errors";
import AuthTabs from "@/components/ui/AuthTabs";
import SignupForm from "@/components/auth/SignupForm";
import LoginForm from "@/components/auth/LoginForm";

export default function AuthSection({ activeTab, setActiveTab }) {
  const router = useRouter();

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await setPersistence(auth, localPersistence);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupData.email,
        signupData.password
      );

      const user = userCredential.user;
      const trimmedName = signupData.fullName.trim();

      if (trimmedName) {
        await updateProfile(user, {
          displayName: trimmedName,
        });
      }

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: trimmedName || "Customer",
        email: user.email,
        balance: 0,
        accountNumber: "",
        status: "active",
        createdAt: serverTimestamp(),
      });

      setMessage("Account created successfully.");

      setSignupData({
        fullName: "",
        email: "",
        password: "",
      });

      router.replace("/dashboard");
    } catch (err) {
      setError(getFirebaseAuthMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await setPersistence(auth, localPersistence);

      await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );

      setMessage("Login successful.");
      setLoginData({
        email: "",
        password: "",
      });

      router.replace("/dashboard");
    } catch (err) {
      setError(getFirebaseAuthMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await setPersistence(auth, localPersistence);

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          fullName: user.displayName || "Customer",
          email: user.email,
          balance: 0,
          accountNumber: "",
          status: "active",
          createdAt: serverTimestamp(),
        });
      }

      setMessage("Google sign in successful.");
      router.replace("/dashboard");
    } catch (err) {
      setError(getFirebaseAuthMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth" className="order-1 lg:order-2">
      <div className="mx-auto w-full max-w-md rounded-[2.1rem] border border-[#ece4d8] bg-white/88 p-5 shadow-[0_30px_70px_rgba(17,17,17,0.10)] backdrop-blur sm:p-7">
        <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mb-7">
          <p className="text-[11px] uppercase tracking-[0.26em] text-[#9b9489]">
            Welcome to REFUND ACCOUNT
          </p>

          <h3 className="mt-3 text-[1.7rem] font-semibold tracking-[-0.03em] text-[#111111]">
            {activeTab === "signup"
              ? "Create your premium account"
              : "Access your premium account"}
          </h3>

          <p className="mt-3 text-sm leading-7 text-[#6a6a6a]">
            {activeTab === "signup"
              ? "Join a modern banking experience built with elegance, speed, and trust."
              : "Sign in securely to continue your premium banking experience."}
          </p>
        </div>

        {activeTab === "signup" ? (
          <SignupForm
            formData={signupData}
            onChange={handleSignupChange}
            onSubmit={handleSignup}
            onGoogleAuth={handleGoogleAuth}
            loading={loading}
          />
        ) : (
          <LoginForm
            formData={loginData}
            onChange={handleLoginChange}
            onSubmit={handleLogin}
            onGoogleAuth={handleGoogleAuth}
            loading={loading}
          />
        )}

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

        <div className="mt-7 rounded-[1.75rem] bg-[#f6f2eb] p-5 sm:p-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.35rem] bg-[#111111] text-white shadow-[0_12px_26px_rgba(17,17,17,0.18)]">
              <ShieldCheck size={23} strokeWidth={1.9} />
            </div>

            <div className="pt-0.5">
              <p className="text-sm font-semibold text-[#111111]">
                Protected by premium-grade security
              </p>
              <p className="mt-2 text-sm leading-7 text-[#666666]">
                Your authentication experience is designed to feel calm,
                trusted, and professionally secure without losing its premium
                visual appeal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}