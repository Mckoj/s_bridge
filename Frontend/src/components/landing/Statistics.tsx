import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Target, Users, School, Landmark } from "lucide-react";

interface CountUpProps {
  end: string;
  duration?: number;
}

function CountUp({ end, duration = 2000 }: CountUpProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  // Extract the numeric portion (removing everything except digits)
  const numericEnd = parseInt(end.replace(/[^0-9]/g, ""), 10);
  // Extract suffixes (removing digits and commas)
  const suffix = end.replace(/[0-9,]/g, "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * numericEnd));
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(numericEnd);
      }
    };
    
    requestAnimationFrame(animateCount);
  }, [started, numericEnd, duration]);

  return (
    <span ref={elementRef}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const STATS = [
  {
    icon: Users,
    metric: "1,240",
    label: "Active Students",
    description: "Total registered undergraduate students searching for or tracking attachments in the current cycle.",
    color: "text-blue-400"
  },
  {
    icon: Target,
    metric: "876",
    label: "Placed Interns",
    description: "University students who have successfully secured placements at verified host organizations.",
    color: "text-emerald-400"
  },
  {
    icon: School,
    metric: "98%",
    label: "Computer Science Placements",
    description: "Placement rate for computer science departments using the SBridge portal.",
    color: "text-indigo-400"
  },
  {
    icon: Landmark,
    metric: "91%",
    label: "Engineering Placements",
    description: "Placement success rate across participating departments in engineering colleges.",
    color: "text-purple-400"
  }
];

export default function Statistics() {
  return (
    <section
      id="statistics"
      className="relative bg-[#020817] py-24 md:py-32 overflow-hidden border-t border-slate-900"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[180px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-wider text-blue-400"
          >
            Metrics
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Platform Placement Metrics
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-slate-400"
          >
            Delivering data-driven placement outcomes and transparent academic-industry partnerships.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative flex flex-col items-center text-center p-8 rounded-2xl border border-slate-800 bg-slate-900/20 backdrop-blur-sm hover:border-slate-700/60 transition-colors duration-300"
              >
                {/* Metric Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-white mb-6">
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>

                {/* Metric Value with CountUp */}
                <h3 className="text-5xl font-extrabold tracking-tight text-white">
                  <CountUp end={stat.metric} />
                </h3>

                {/* Metric Label */}
                <h4 className="mt-3 text-lg font-semibold text-slate-300">
                  {stat.label}
                </h4>

                {/* Metric Description */}
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
