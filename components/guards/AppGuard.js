"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { checkIsAdmin } from "@/lib/admin";

function requiresEmailVerification(user) {
  if (!user) return false;

  const usesPasswordProvider = user.providerData.some(
    (provider) => provider.providerId === "password"
  );

  return usesPasswordProvider && !user.emailVerified;
}

export default function AppGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setChecking(true);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const isHomeRoute = pathname === "/";
      const isDashboardRoute = pathname.startsWith("/dashboard");
      const isAdminRoute = pathname.startsWith("/admin");
      const isAdminLoginRoute = pathname === "/admin/login";

      try {
        if (isHomeRoute) {
          if (!user) {
            setChecking(false);
            return;
          }

          if (requiresEmailVerification(user)) {
            setChecking(false);
            return;
          }

          const isAdmin = await checkIsAdmin(user.uid);

          if (isAdmin) {
            router.replace("/admin");
            return;
          }

          router.replace("/dashboard");
          return;
        }

        if (isDashboardRoute) {
          if (!user) {
            router.replace("/");
            return;
          }

          if (requiresEmailVerification(user)) {
            await auth.signOut();
            router.replace("/");
            return;
          }

          const isAdmin = await checkIsAdmin(user.uid);

          if (isAdmin) {
            router.replace("/admin");
            return;
          }

          setChecking(false);
          return;
        }

        if (isAdminLoginRoute) {
          if (!user) {
            setChecking(false);
            return;
          }

          if (requiresEmailVerification(user)) {
            await auth.signOut();
            router.replace("/");
            return;
          }

          const isAdmin = await checkIsAdmin(user.uid);

          if (isAdmin) {
            router.replace("/admin");
            return;
          }

          router.replace("/dashboard");
          return;
        }

        if (isAdminRoute) {
          if (!user) {
            router.replace("/admin/login");
            return;
          }

          if (requiresEmailVerification(user)) {
            await auth.signOut();
            router.replace("/");
            return;
          }

          const isAdmin = await checkIsAdmin(user.uid);

          if (!isAdmin) {
            router.replace("/dashboard");
            return;
          }

          setChecking(false);
          return;
        }

        setChecking(false);
      } catch (error) {
        console.error("AppGuard error:", error);
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f6f2]">
        <div className="rounded-3xl border border-[#e8e1d5] bg-white px-6 py-5 text-sm font-medium text-[#333333] shadow-[0_20px_50px_rgba(17,17,17,0.06)]">
          Verifying secure session...
        </div>
      </div>
    );
  }

  return children;
}