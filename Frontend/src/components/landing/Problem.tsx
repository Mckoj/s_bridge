import { useEffect, useRef } from "react";
import { GraduationCap, Building2, Briefcase } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROBLEMS = [
  {
    icon: GraduationCap,
    who: "Students",
    headline: "Lost in the process",
    description:
      "Students spend weeks chasing letters, emailing companies cold, and printing forms — only to find out a placement fell through two months in.",
    color: "border-blue-500/30 bg-blue-500/8",
    iconColor: "text-blue-400",
    glow: "from-blue-600/10",
  },
  {
    icon: Briefcase,
    who: "Recruiters",
    headline: "Buried in paperwork",
    description:
      "HR teams receive hundreds of unstructured CVs with no way to verify university eligibility, sign agreements digitally, or track intern progress.",
    color: "border-emerald-500/30 bg-emerald-500/8",
    iconColor: "text-emerald-400",
    glow: "from-emerald-600/10",
  },
  {
    icon: Building2,
    who: "Universities",
    headline: "Flying blind",
    description:
      "Coordinators have no real-time view of where students are placed, whether logbooks are being submitted, or if companies are meeting standards.",
    color: "border-violet-500/30 bg-violet-500/8",
    iconColor: "text-violet-400",
    glow: "from-violet-600/10",
  },
];

export default function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
        }
      );

      const cards = cardsRef.current?.querySelectorAll(".problem-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: { trigger: cardsRef.current, start: "top 80%", once: true },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="problem" ref={sectionRef} className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_28%),linear-gradient(180deg,_#07111f_0%,_#0f172a_100%)] py-28 md:py-36">
      <div className="absolute top-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
      <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div ref={headingRef} className="mb-20 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400">The Problem</span>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Students struggle. Recruiters are overwhelmed.
            <br />
            <span className="text-slate-400">Universities are blind.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-400">
            The internship system is broken for everyone involved — not because people aren't trying, but because the tools were never built for this.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PROBLEMS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.who}
                className={`problem-card group relative rounded-3xl border ${p.color} p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/70`}
              >
                <div className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${p.glow} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

                <div className={`mb-5 inline-flex items-center gap-2 rounded-full border border-current/20 px-3 py-1 text-xs font-bold ${p.iconColor}`}>
                  <Icon size={13} />
                  {p.who}
                </div>

                <h3 className="mb-3 text-2xl font-extrabold text-white">{p.headline}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{p.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-24 text-center">
          <p className="text-lg font-semibold text-slate-400">
            SBridge fixes all three —
            <span className="font-extrabold text-white"> here's how.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
