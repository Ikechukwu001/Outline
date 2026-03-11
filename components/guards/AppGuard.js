"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { checkIsAdmin } from "@/lib/admin";

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

      // PUBLIC LANDING PAGE RULES
      if (isHomeRoute) {
        if (!user) {
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

      // CUSTOMER DASHBOARD RULES
      if (isDashboardRoute) {
        if (!user) {
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

      // ADMIN LOGIN RULES
      if (isAdminLoginRoute) {
        if (!user) {
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

      // ADMIN PANEL RULES
      if (isAdminRoute) {
        if (!user) {
          router.replace("/admin/login");
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

      // ANY OTHER ROUTE
      setChecking(false);
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