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
    <section className="relative bg-[#020817] py-28 md:py-36 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div
          ref={sectionRef}
          className="relative rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-slate-900/80 to-indigo-600/10 p-12 md:p-20 text-center backdrop-blur-sm overflow-hidden"
        >
          {/* Background glow orbs inside CTA */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-blue-600/15 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 left-1/4 w-[400px] h-[300px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Join Today</span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Ready to close the gap?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              Join thousands of students, recruiters, and university coordinators who've replaced the chaos with clarity.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/signup")}
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-8 py-4 text-sm font-bold text-white transition-all duration-200 shadow-xl shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
              >
                Create Free Account
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 hover:border-slate-500 px-8 py-4 text-sm font-bold text-slate-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
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
