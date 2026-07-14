import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import logo from "../../assets/logo/sbridge-logo.png";

const portalPills = [
  { label: "Students", tone: "border-blue-400/30 bg-blue-500/12 text-blue-200" },
  { label: "Universities", tone: "border-violet-400/30 bg-violet-500/12 text-violet-200" },
  { label: "Recruiters", tone: "border-emerald-400/30 bg-emerald-500/12 text-emerald-200" },
];

export default function Hero() {
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set([headingRef.current, subRef.current, ctaRef.current, statsRef.current, logoRef.current], {
      opacity: 0,
    });
    gsap.set(headingRef.current, { y: 80 });
    gsap.set(subRef.current, { y: 40 });
    gsap.set(ctaRef.current, { y: 20, scale: 0.95 });
    gsap.set(statsRef.current, { y: 20 });
    gsap.set(logoRef.current, { y: 30, scale: 0.95 });

    tl.to(headingRef.current, { opacity: 1, y: 0, duration: 1 })
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
      .to(ctaRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, "-=0.4")
      .to(statsRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
      .to(logoRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.9 }, "-=0.8");
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_36%),linear-gradient(135deg,_#07111f_0%,_#0f172a_55%,_#111827_100%)] pt-28 pb-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_25%),radial-gradient(circle_at_center_left,_rgba(139,92,246,0.16),_transparent_22%)] pointer-events-none" />
      <div className="absolute -top-32 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[180px] pointer-events-none animate-pulse" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-1.5 mb-6 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide uppercase text-slate-200">Internship & Attachment Portal</span>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {portalPills.map((pill) => (
              <span key={pill.label} className={`rounded-full border px-3 py-1 text-xs font-semibold ${pill.tone}`}>
                {pill.label}
              </span>
            ))}
          </div>

          <h1
            ref={headingRef}
            className="text-4xl font-extrabold leading-[1.12] text-white md:text-5xl lg:text-6xl"
          >
            There's a gap between{" "}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              students
            </span>{" "}
and{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              opportunity
            </span>
          </h1>

          <p ref={subRef} className="mt-6 max-w-xl text-base leading-7 text-slate-300">
            SBridge connects students, universities, and recruiters in one calm, structured experience so every placement stays visible and moving.
          </p>

          <div ref={ctaRef} className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-emerald-500/25"
            >
              Get Started — It's Free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-slate-700/80 px-7 py-3 text-sm font-bold text-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-500 hover:text-white"
            >
              Sign In
            </button>
          </div>

          <div ref={statsRef} className="mt-12 flex flex-wrap gap-4">
            {[
              { value: "1,240", label: "Active Placements", color: "text-blue-300", bg: "bg-blue-500/10" },
              { value: "150+", label: "Verified Employers", color: "text-violet-300", bg: "bg-violet-500/10" },
              { value: "98%", label: "Success Rate", color: "text-emerald-300", bg: "bg-emerald-500/10" },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl border border-slate-800/80 ${s.bg} px-4 py-3 backdrop-blur-sm`}>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div ref={logoRef} className="flex flex-col items-center justify-center">
          <div className="relative group flex flex-col items-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 via-violet-500/15 to-emerald-500/20 blur-3xl opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
            <img
              src={logo}
              alt="SBridge"
              className="w-[200px] sm:w-[260px] md:w-[300px] lg:w-[360px] drop-shadow-[0_0_80px_rgba(59,130,246,0.24)] select-none transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}