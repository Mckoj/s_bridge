import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const STEPS = [
  {
    number: "01",
    title: "Create your profile",
    description:
      "Sign up with your university email, verify your account, and fill in your profile. Students list their skills and department. Recruiters add their company and open roles. Universities configure their coordinators.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    number: "02",
    title: "Connect and match",
    description:
      "Students browse verified listings and apply. Recruiters receive structured applications and can shortlist or offer directly. Universities can see every connection happening in real time.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    number: "03",
    title: "Track until completion",
    description:
      "Weekly logbooks, supervisor sign-offs, tripartite agreements, and final evaluations all happen inside SBridge. No printouts. No scattered emails. Everyone sees what they need to see.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

function Step({
  step,
  index,
}: {
  step: (typeof STEPS)[0];
  index: number;
}) {
  const ref = useScrollAnimation<HTMLDivElement>();
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row items-start gap-8 md:gap-16 ${
        isEven ? "" : "md:flex-row-reverse"
      }`}
    >
      {/* Number + connector */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`w-16 h-16 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center`}
        >
          <span className={`text-2xl font-black ${step.color}`}>{step.number}</span>
        </div>
        {index < STEPS.length - 1 && (
          <div className="w-px flex-1 mt-4 bg-gradient-to-b from-slate-700 to-transparent min-h-[60px]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <h3 className="text-2xl font-extrabold text-white mb-3">{step.title}</h3>
        <p className="text-slate-400 text-base leading-relaxed max-w-xl">{step.description}</p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const headingRef = useScrollAnimation<HTMLDivElement>();

  return (
    <section
      id="how-it-works"
      className="relative bg-[#020817] py-28 md:py-36 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
      <div className="absolute top-1/2 right-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-emerald-600/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-3xl px-6">

        <div ref={headingRef} className="text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">How It Works</span>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Three steps. That's it.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-slate-400">
            We removed everything complicated. What's left is a clear, fast path from sign-up to completed placement.
          </p>
        </div>

        <div className="space-y-0">
          {STEPS.map((step, i) => (
            <Step key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
