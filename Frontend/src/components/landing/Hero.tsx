import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import logo from "../../assets/logo/sbridge-logo.png";

export default function Hero() {
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Set initial states
    gsap.set([headingRef.current, subRef.current, ctaRef.current, statsRef.current, logoRef.current], {
      opacity: 0,
    });
    gsap.set(headingRef.current, { y: 80 });
    gsap.set(subRef.current, { y: 40 });
    gsap.set(ctaRef.current, { y: 20, scale: 0.9 });
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
      className="relative flex min-h-screen items-center overflow-hidden bg-[#020817] pt-28 pb-20"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563EB1A_0%,#020817_65%)] pointer-events-none" />
      <div className="absolute -top-32 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[180px] pointer-events-none animate-pulse" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">

        {/* Left: Content */}
        <div>
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold text-blue-300 tracking-wide uppercase">Internship & Attachment Portal</span>
          </div>

          <h1
            ref={headingRef}
            className="text-4xl font-extrabold leading-[1.15] text-white md:text-5xl lg:text-6xl"
          >
            There's a gap between{" "}
            <span className="text-blue-400">students</span> and{" "}
            <span className="text-blue-400">opportunity</span>
          </h1>

          <p
            ref={subRef}
            className="mt-6 max-w-xl text-base leading-7 text-slate-400"
          >
            SBridge closes the gap — connecting university students with verified employers and giving universities full visibility over every placement, all in one portal.
          </p>

          <div ref={ctaRef} className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 px-7 py-3 text-sm font-bold text-white transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              Get Started — It's Free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-slate-700 hover:border-slate-600 px-7 py-3 text-sm font-bold text-slate-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
            >
              Sign In
            </button>
          </div>

          <div ref={statsRef} className="mt-12 flex flex-wrap gap-10">
            {[
              { value: "1,240", label: "Active Placements" },
              { value: "150+", label: "Verified Employers" },
              { value: "98%", label: "Success Rate" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-blue-400">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Logo visual */}
        <div ref={logoRef} className="flex flex-col items-center justify-center">
          <div className="relative group flex flex-col items-center">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
            <img
              src={logo}
              alt="SBridge"
              className="w-[200px] sm:w-[260px] md:w-[300px] lg:w-[360px] drop-shadow-[0_0_60px_rgba(37,99,235,0.35)] select-none transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

      </div>
    </section>
  );
}