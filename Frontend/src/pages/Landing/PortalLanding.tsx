import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { GraduationCap, Building2, Briefcase, CheckCircle2, ArrowRight } from "lucide-react";
import logo from "../../assets/logo/sbridge-logo.png";

interface PortalLandingProps {
  portal?: "student" | "university" | "recruiter";
}

const portalConfig = {
  student: {
    icon: GraduationCap,
    label: "Student Portal",
    color: "from-blue-600 to-indigo-600",
    glow: "bg-blue-600/10",
    border: "border-blue-500/20",
    badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    accentText: "text-blue-400",
    headline: "Your internship journey starts here.",
    sub: "Browse verified placements, submit logbooks, and track every step of your attachment — all in one place.",
    perks: [
      "Apply to verified companies",
      "Digital weekly logbook",
      "Supervisor sign-offs instantly",
      "Real-time placement tracking",
    ],
  },
  university: {
    icon: Building2,
    label: "University Portal",
    color: "from-purple-600 to-violet-600",
    glow: "bg-purple-600/10",
    border: "border-purple-500/20",
    badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    accentText: "text-purple-400",
    headline: "Full visibility. Zero admin chaos.",
    sub: "Track every student, every placement, every logbook submission — across all departments, in real time.",
    perks: [
      "Department-level placement dashboards",
      "Automated company eligibility checks",
      "Standardised grading rubrics",
      "Flag at-risk students early",
    ],
  },
  recruiter: {
    icon: Briefcase,
    label: "Recruiter Portal",
    color: "from-emerald-600 to-teal-600",
    glow: "bg-emerald-600/10",
    border: "border-emerald-500/20",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    accentText: "text-emerald-400",
    headline: "Find and manage interns without the paperwork.",
    sub: "Screen structured student applications, sign agreements digitally, and track intern performance — from a single dashboard.",
    perks: [
      "Filter students by skill & university",
      "Digital tripartite agreement signing",
      "Weekly task approvals",
      "Structured final evaluations",
    ],
  },
};

export default function PortalLanding({ portal = "student" }: PortalLandingProps) {
  const navigate = useNavigate();
  const config = portalConfig[portal];
  const Icon = config.icon;

  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set([headingRef.current, subRef.current, ctaRef.current, cardRef.current], { opacity: 0 });
    gsap.set(headingRef.current, { y: 60 });
    gsap.set(subRef.current, { y: 30 });
    gsap.set(ctaRef.current, { y: 20, scale: 0.95 });
    gsap.set(cardRef.current, { y: 40, scale: 0.97 });

    tl.to(headingRef.current, { opacity: 1, y: 0, duration: 1 })
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
      .to(ctaRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, "-=0.4")
      .to(cardRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.8 }, "-=0.5");
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020817] text-white overflow-x-hidden selection:bg-blue-600/40">
      {/* Ambient glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full ${config.glow} blur-[120px] pointer-events-none opacity-60`} />

      {/* Minimal top nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <img src={logo} alt="SBridge" className="h-10 w-auto select-none" />
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${config.badgeColor}`}>
          <Icon size={12} />
          {config.label}
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <div>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${config.badgeColor} mb-6`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {config.label}
          </div>

          <h1 ref={headingRef} className="text-4xl font-extrabold leading-[1.15] text-white md:text-5xl lg:text-6xl">
            {config.headline}
          </h1>

          <p ref={subRef} className="mt-6 text-base leading-7 text-slate-400 max-w-lg">
            {config.sub}
          </p>

          <div ref={ctaRef} className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/login")}
              className={`group inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${config.color} shadow-lg transition-all duration-200 hover:-translate-y-0.5`}
            >
              Sign In
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-7 py-3 rounded-xl font-bold text-sm text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-all duration-200 hover:-translate-y-0.5"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Right: perks card */}
        <div ref={cardRef} className={`rounded-3xl border ${config.border} bg-slate-900/50 p-8 backdrop-blur-sm`}>
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center mb-6`}>
            <Icon size={26} className="text-white" />
          </div>
          <h3 className="text-xl font-extrabold text-white mb-2">What you get</h3>
          <p className="text-sm text-slate-500 mb-6">Everything tailored for your role.</p>

          <ul className="space-y-4">
            {config.perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <CheckCircle2 size={16} className={config.accentText} />
                <span className="text-sm text-slate-300 font-medium">{perk}</span>
              </li>
            ))}
          </ul>

          <div className={`mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500`}>
            Use your institution email address to get started.
          </div>
        </div>
      </div>
    </div>
  );
}
