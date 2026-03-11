"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AuthSection from "@/components/sections/AuthSection";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("signup");

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f6f2] text-[#111111]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-100px] h-[300px] w-[300px] rounded-full bg-[#d9c8ab]/20 blur-3xl" />
        <div className="absolute -right-20 top-45 h-[280px] w-[280px] rounded-full bg-[#dde7df]/60 blur-3xl" />
        <div className="absolute -bottom-22.5 left-[18%] h-[240px] w-[240px] rounded-full bg-[#efe6d8]/70 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <section className="flex flex-1 items-center py-8 sm:py-10 lg:py-14">
          <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <HeroSection />
            <AuthSection activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </section>
      </div>
    </main>
  );
}