import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "../../assets/logo/sbridge-logo.png";
import { NAVIGATION } from "../../constants/navigation";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#020817]/85 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-lg"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2" onClick={(e) => handleNavLinkClick(e, "#home")}>
            <img src={logo} alt="SBridge Logo" className="h-10 w-auto select-none" />
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAVIGATION.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavLinkClick(e, item.href)}
                className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button variant="primary" onClick={() => navigate("/signup")}>
              Get Started
            </Button>
          </div>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden bg-[#020817]/95 border-b border-slate-800 backdrop-blur-lg px-6 py-8 flex flex-col gap-6 shadow-2xl"
          >
            <div className="flex flex-col gap-5">
              {NAVIGATION.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavLinkClick(e, item.href)}
                  className="text-lg font-medium text-slate-300 hover:text-blue-400 transition-colors py-2"
                >
                  {item.name}
                </a>
              ))}
            </div>
            
            <hr className="border-slate-800 my-2" />
            
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/login");
                }}
                className="w-full text-center py-3 text-slate-300 hover:text-white font-medium transition-colors"
              >
                Login
              </button>
              <Button
                variant="primary"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/signup");
                }}
                className="w-full text-center"
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}