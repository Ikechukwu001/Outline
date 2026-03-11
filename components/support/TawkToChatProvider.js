"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TawkToChatProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const isAdminRoute = pathname.startsWith("/admin");
    const tawkSrc = process.env.NEXT_PUBLIC_TAWK_SRC;

    if (!tawkSrc) {
      console.warn("Tawk.to script URL is missing.");
      return;
    }

    if (isAdminRoute) {
      const widgetScript = document.getElementById("tawk-script");
      if (widgetScript) widgetScript.remove();
      return;
    }

    if (typeof window !== "undefined") {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();
    }

    const existingScript = document.getElementById("tawk-script");
    if (existingScript) return;

    const script = document.createElement("script");
    script.id = "tawk-script";
    script.async = true;
    script.src = tawkSrc;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);
  }, [pathname]);

  return null;
}