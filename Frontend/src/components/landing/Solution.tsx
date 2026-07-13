import { GraduationCap, Building2, Briefcase, CheckCircle2 } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const SOLUTIONS = [
  {
    icon: GraduationCap,
    who: "For Students",
    tagline: "Everything you need to land and complete your internship.",
    color: "from-blue-600 to-indigo-600",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    perks: [
      "Browse verified attachment opportunities",
      "Submit weekly digital logbooks",
      "Get supervisor sign-offs instantly",
      "Track your placement progress end-to-end",
    ],
  },
  {
    icon: Briefcase,
    who: "For Recruiters",
    tagline: "Filter, hire, and manage interns without the admin chaos.",
    color: "from-emerald-600 to-teal-600",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    perks: [
      "Screen students by skill and university",
      "Sign tripartite agreements digitally",
      "Approve weekly tasks from a single dashboard",
      "Rate and give feedback on completion",
    ],
  },
  {
    icon: Building2,
    who: "For Universities",
    tagline: "Full oversight of every student, every placement, in real time.",
    color: "from-purple-600 to-violet-600",
    border: "border-purple-500/20",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    perks: [
      "Real-time placement dashboards by department",
      "Automated company eligibility checks",
      "Standardised grading rubrics built in",
      "Flag at-risk students before it's too late",
    ],
  },
];

export default function Solution() {
  const headingRef = useScrollAnimation<HTMLDivElement>();
  const card0Ref = useScrollAnimation<HTMLDivElement>();
  const card1Ref = useScrollAnimation<HTMLDivElement>();
  const card2Ref = useScrollAnimation<HTMLDivElement>();

  const cardRefs = [card0Ref, card1Ref, card2Ref];

  return (
    <section
      id="solution"
      className="relative bg-[#020817] py-28 md:py-36 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
      <div className="absolute top-1/4 right-0 h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 h-[500px] w-[500px] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        <div ref={headingRef} className="text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">The Solution</span>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Here's what each person gets
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-400">
            SBridge isn't one product — it's three tailored portals that talk to each other, so every stakeholder has exactly what they need.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {SOLUTIONS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.who}
                ref={cardRefs[idx]}
                className={`group relative rounded-3xl border ${s.border} bg-slate-900/40 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/60`}
              >
                {/* Gradient accent top bar */}
                <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r ${s.color} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className={`w-14 h-14 rounded-2xl ${s.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} className={s.iconColor} />
                </div>

                <p className={`text-xs font-bold uppercase tracking-widest ${s.iconColor} mb-2`}>{s.who}</p>
                <h3 className="text-xl font-extrabold text-white mb-4">{s.tagline}</h3>

                <ul className="space-y-3">
                  {s.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3">
                      <CheckCircle2 size={15} className={`${s.iconColor} shrink-0 mt-0.5`} />
                      <span className="text-sm text-slate-300 leading-snug">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
