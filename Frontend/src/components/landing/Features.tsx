import { motion } from "framer-motion";
import { Sparkles, Calendar, FileText, CheckSquare, MessageSquare, ShieldAlert } from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Intelligent Matching",
    description: "Matches university students with industrial attachment roles at verified companies like MTN, GCB Bank, and M-Corp Technologies based on skill profiling.",
    color: "text-blue-400",
    glowColor: "rgba(37,99,235,0.15)"
  },
  {
    icon: Calendar,
    title: "Digital Logbooks",
    description: "Students easily submit weekly progress logs, record daily tasks, and receive digital supervisor signatures directly within the web dashboard.",
    color: "text-indigo-400",
    glowColor: "rgba(99,102,241,0.15)"
  },
  {
    icon: FileText,
    title: "Tripartite Agreement Hub",
    description: "Review, edit, and sign attachment agreements digitally, securing 3-way authorization (Student, Employer, and University Coordinator) in minutes.",
    color: "text-purple-400",
    glowColor: "rgba(168,85,247,0.15)"
  },
  {
    icon: CheckSquare,
    title: "Evaluation Rubrics",
    description: "Standardized evaluation scorecards for company mentors and academic supervisors make grading clear, transparent, and fair.",
    color: "text-emerald-400",
    glowColor: "rgba(34,197,94,0.15)"
  },
  {
    icon: MessageSquare,
    title: "In-Context Chats",
    description: "Keeps a clear, direct communication channel open between students, company mentors, and academic supervisors for queries and support.",
    color: "text-cyan-400",
    glowColor: "rgba(6,182,212,0.15)"
  },
  {
    icon: ShieldAlert,
    title: "Compliance Audit",
    description: "Automated checks verify company credentials, check weekly hours, and alert coordinators to students falling behind on attachment targets.",
    color: "text-rose-400",
    glowColor: "rgba(244,63,94,0.15)"
  }
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative bg-[#020817] py-24 md:py-32 overflow-hidden border-t border-slate-900"
    >
      {/* Background Orbs */}
      <div className="absolute top-1/4 right-0 h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 h-[600px] w-[600px] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section Title */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-wider text-blue-400"
          >
            Capabilities
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Intelligent Placement Management
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-slate-400"
          >
            SBridge digitizes the complex logistics of university industrial attachments, ensuring high-quality placements and supervision.
          </motion.p>
        </div>

        {/* Features Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/30 p-8 hover:bg-slate-900/50 hover:border-slate-700/80 transition-all duration-300 backdrop-blur-sm"
              >
                {/* Custom Glow Background on Hover */}
                <div
                  className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at 10% 10%, ${feature.glowColor} 0%, rgba(2,8,23,0) 70%)`
                  }}
                />

                {/* Feature Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700/60 text-white mb-6 transition-transform group-hover:scale-105">
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-slate-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
