'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function OutlinedLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
   <div className="min-h-screen relative overflow-hidden bg-white">
    {/* Background Glow */}
<div className="pointer-events-none absolute inset-0">
  <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 opacity-40 blur-[120px]" />
</div>

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 animate-fade-in-left">
            <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
            </div>
            <span className="text-2xl font-bold text-gray-900">Outlined</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 animate-fade-in-down">
            <a href="#" className="text-gray-900 hover:text-blue-600 transition-colors font-medium">Home</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Our Work</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Tools</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Testimonials</a>
          </div>

          {/* Desktop CTA Button */}
          <button className="hidden md:block bg-black text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-all hover:scale-105 animate-fade-in-right">
            Get in touch
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMenu}
            className="md:hidden z-50 relative text-black transition-transform duration-300"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 w-full h-screen bg-white z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <a href="#" className="text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">Home</a>
          <a href="#" className="text-3xl font-semibold text-gray-600 hover:text-blue-600 transition-colors">Our Work</a>
          <a href="#" className="text-3xl font-semibold text-gray-600 hover:text-blue-600 transition-colors">Tools</a>
          <a href="#" className="text-3xl font-semibold text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
          <button className="bg-black text-white px-8 py-3 rounded-full font-medium text-xl mt-4 hover:bg-gray-800 transition-colors">
            Get in touch
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-5xl mx-auto text-black">
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-6">
  Everything You Need to Sell
  <br />
  Online —{" "}
  <span className="italic bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
    In One App✨
  </span>
</h1>

<p className="text-gray-500 text-base md:text-lg mb-8 max-w-xl mx-auto">
  Minimalist, on-brand videos designed to
  <br />
  captivate viewers and drive sales
</p>

<button className="bg-black text-white px-7 py-3 rounded-full text-base font-medium">
  Explore your style
</button>
<div className="flex justify-center mt-8 md:mt-10">
  <img
    src="/grok1-Photoroom.png"
    alt="App preview mockups"
    className="w-full max-w-4xl drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)]"
  />
</div>

</div>
      </main>

      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px) rotate(-8deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(-8deg);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px) rotate(8deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(8deg);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.6s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.6s ease-out forwards;
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1200 {
          animation-delay: 1.2s;
        }
      `}</style>
    </div>
  );
}