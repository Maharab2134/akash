import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppFloat from "../common/WhatsAppFloat";

export default function Layout() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowScrollTop(window.scrollY > 300);
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      clearTimeout(timeoutId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />

      {/* WhatsApp Floating Button */}
      <WhatsAppFloat offset={showScrollTop ? 72 : 0} />

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed z-40 flex items-center justify-center w-12 h-12 text-white transition-all duration-300 rounded-full shadow-2xl bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-blue-500/50 hover:scale-110 group"
          aria-label="Back to top"
        >
          <ChevronUpIcon className="w-6 h-6 group-hover:animate-bounce" />
        </button>
      )}
    </div>
  );
}
