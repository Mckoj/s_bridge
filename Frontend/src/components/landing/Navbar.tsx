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
      target.scrollIntoView({ block: "start" });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-slate-800/70 bg-slate-950/80 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6">
          <button onClick={() => scrollToSection("#home")} className="flex items-center gap-2">
            <img src={logo} alt="SBridge" className="h-10 w-auto select-none" />
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {NAVIGATION.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-blue-400"
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-slate-700/80 px-5 py-2 text-sm font-semibold text-slate-300 transition-all duration-200 hover:border-slate-500 hover:text-white"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:shadow-emerald-500/25"
            >
              Get Started
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 transition-colors hover:text-white focus:outline-none md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-[60px] z-40 flex flex-col gap-6 border-b border-slate-800 bg-slate-950/95 px-6 py-8 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAVIGATION.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="border-b border-slate-800/50 py-3 text-left text-base font-semibold text-slate-300 transition-colors last:border-0 hover:text-blue-400"
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate("/login"); }}
                className="w-full rounded-xl border border-slate-700 py-3 text-center text-sm font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
              >
                Login
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate("/signup"); }}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 py-3 text-center text-sm font-bold text-white transition-colors"
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