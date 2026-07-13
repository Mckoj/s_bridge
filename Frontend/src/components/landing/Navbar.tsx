import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "../../assets/logo/sbridge-logo.png";
import { NAVIGATION } from "../../constants/navigation";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ticking = useRef(false);

  // Lenis overrides native scroll so we listen to the scroll event it emits
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      // Let Lenis handle the smooth scroll
      target.scrollIntoView({ block: "start" });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#020817]/90 backdrop-blur-xl border-b border-slate-800/70 py-3 shadow-2xl shadow-black/20"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("#home")}
            className="flex items-center gap-2"
          >
            <img src={logo} alt="SBridge" className="h-10 w-auto select-none" />
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAVIGATION.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 text-sm font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-all duration-200"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20"
            >
              Get Started
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-[60px] z-40 md:hidden bg-[#020817]/98 border-b border-slate-800 backdrop-blur-xl px-6 py-8 flex flex-col gap-6 shadow-2xl"
          >
            <div className="flex flex-col gap-1">
              {NAVIGATION.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-left text-base font-semibold text-slate-300 hover:text-blue-400 transition-colors py-3 border-b border-slate-800/50 last:border-0"
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate("/login"); }}
                className="w-full py-3 text-center text-sm font-semibold text-slate-300 hover:text-white border border-slate-700 rounded-xl transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate("/signup"); }}
                className="w-full py-3 text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}