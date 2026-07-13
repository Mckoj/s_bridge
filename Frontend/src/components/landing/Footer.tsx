import logo from "../../assets/logo/sbridge-logo.png";
import { NAVIGATION } from "../../constants/navigation";
import { Mail, ArrowRight } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="bg-[#020817] border-t border-slate-900 text-slate-400">
      {/* Upper Footer: Branding, Links, and Newsletter */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1: Branding */}
        <div className="flex flex-col gap-6">
          <a href="#home" onClick={(e) => handleNavLinkClick(e, "#home")} className="inline-block self-start">
            <img src={logo} alt="SBridge" className="h-10 w-auto select-none" />
          </a>
          <p className="text-sm leading-relaxed max-w-xs text-slate-400">
            Connecting university students, academic coordinators, and employers across Ghana. Developed by M-Corp Technologies.
          </p>
          {/* Social Icons */}
          <div className="flex gap-4 text-slate-500">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
              <FaGithub size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
              <FaLinkedin size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
            Platform
          </h3>
          <ul className="space-y-4">
            {NAVIGATION.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link.href)}
                  className="text-sm hover:text-blue-400 transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Resources / Legal */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
            Resources
          </h3>
          <ul className="space-y-4 text-sm">
            <li>
              <a href="#terms" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            </li>
            <li>
              <a href="#privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#support" className="hover:text-blue-400 transition-colors">Help & Support</a>
            </li>
            <li>
              <a href="#compliance" className="hover:text-blue-400 transition-colors">Regulatory Compliance</a>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
              Subscribe to Updates
            </h3>
            <p className="text-sm leading-relaxed">
              Get news about upcoming features, recruitment periods, and partner integrations.
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-500">
              <Mail size={16} />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-12 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-900 focus:outline-none transition duration-200"
            />
            <button
              type="submit"
              className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              aria-label="Submit newsletter form"
            >
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Lower Footer: Copyright */}
      <div className="border-t border-slate-900 py-8 bg-[#010612]/70">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>© {new Date().getFullYear()} SBridge. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms</a>
            <a href="#cookies" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
