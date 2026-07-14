import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.1),_transparent_35%),linear-gradient(180deg,_#07111f_0%,_#0f172a_100%)] py-28 md:py-36">
      <div className="absolute top-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div
          ref={sectionRef}
          className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-blue-600/15 via-slate-900/80 to-violet-600/15 p-12 text-center backdrop-blur-sm md:p-20"
        >
          <div className="absolute -top-24 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 left-1/4 h-[300px] w-[400px] rounded-full bg-emerald-600/10 blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Join Today</span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Ready to close the gap?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              Join thousands of students, recruiters, and university coordinators who've replaced the chaos with clarity.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/signup")}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-emerald-500/25"
              >
                Create Free Account
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-8 py-4 text-sm font-bold text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-500 hover:text-white"
              >
                Already have an account? Sign In
              </button>
            </div>

            <p className="mt-6 text-xs text-slate-600">No credit card required · Takes 2 minutes to set up</p>
          </div>
        </div>
      </div>
    </section>
  );
}
