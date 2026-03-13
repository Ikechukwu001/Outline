"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, MailCheck } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  setPersistence,
  sendEmailVerification,
  signOut,
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
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);

  useEffect(() => {
    const pendingVerificationEmail = sessionStorage.getItem(
      "pendingVerificationEmail"
    );

    if (pendingVerificationEmail) {
      setActiveTab("login");
      setShowVerificationNotice(true);
      setMessage(
        `Account created successfully. We sent a verification email to ${pendingVerificationEmail}. Please check your inbox or spam folder, then verify your email before signing in.`
      );
      sessionStorage.removeItem("pendingVerificationEmail");
    }
  }, [setActiveTab]);

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
    setShowVerificationNotice(false);

    try {
      await setPersistence(auth, localPersistence);

      const trimmedName = signupData.fullName.trim();
      const signupEmail = signupData.email;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupData.email,
        signupData.password
      );

      const user = userCredential.user;

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

      await sendEmailVerification(user);
      await signOut(auth);

      sessionStorage.setItem("pendingVerificationEmail", signupEmail);

      setSignupData({
        fullName: "",
        email: "",
        password: "",
      });

      setLoginData({
        email: signupEmail,
        password: "",
      });

      setActiveTab("login");
      setShowVerificationNotice(true);
      setMessage(
        `Account created successfully. We sent a verification email to ${signupEmail}. Please check your inbox or spam folder, then verify your email before signing in.`
      );
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
    setShowVerificationNotice(false);

    try {
      await setPersistence(auth, localPersistence);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );

      await userCredential.user.reload();

      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        setShowVerificationNotice(true);
        setError(
          "Your email address has not been verified yet. Please check your inbox or spam folder, open the verification email, and confirm your account before signing in."
        );
        return;
      }

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

  const handleResendVerification = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    setShowVerificationNotice(false);

    try {
      if (!loginData.email || !loginData.password) {
        setError(
          "Enter your email address and password to resend the verification email."
        );
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );

      await userCredential.user.reload();

      if (userCredential.user.emailVerified) {
        await signOut(auth);
        setMessage("This email address is already verified. You can sign in now.");
        return;
      }

      await sendEmailVerification(userCredential.user);
      await signOut(auth);

      setShowVerificationNotice(true);
      setMessage(
        `A new verification email has been sent to ${loginData.email}. Please check your inbox or spam folder and verify your email before signing in.`
      );
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
    setShowVerificationNotice(false);

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
              ? "Join a modern banking experience built with elegance, security, and trust."
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
            onResendVerification={handleResendVerification}
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

        {showVerificationNotice && (
          <div className="mt-5 rounded-[1.75rem] border border-[#e8dfd1] bg-[#faf7f1] p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#111111] text-white">
                <MailCheck size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#111111]">
                  Check your inbox or spam folder
                </p>
                <p className="mt-2 text-sm leading-7 text-[#666666]">
                  We have sent a verification email to your registered email
                  address. Please open the email, verify your account, and then
                  return to sign in.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}