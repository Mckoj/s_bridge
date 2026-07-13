import { motion } from "framer-motion";
import { GraduationCap, School, Briefcase, ChevronRight } from "lucide-react";
import Button from "../common/Button";

const STAKEHOLDERS = [
  {
    icon: GraduationCap,
    role: "Students",
    description: "Secure your mandatory industrial attachment with verified companies, submit weekly logbooks, and build a verified career profile.",
    benefits: [
      "Browse verified attachment opportunities across multiple regions",
      "Digital logbook tracking with direct coordinator submission",
      "Immediate sign-off and feedback from corporate supervisors"
    ],
    color: "from-blue-500/20 to-cyan-500/5",
    border: "group-hover:border-blue-500/40",
    iconColor: "text-blue-400"
  },
  {
    icon: School,
    role: "Universities",
    description: "Streamline academic oversight. Track placements by department and college, verify logbooks, and monitor coordinator grading rubrics.",
    benefits: [
      "Real-time placement dashboards filterable by department and academic program",
      "Automated verification of company eligibility and contracts",
      "Standardized grading logs aligned with institutional guidelines"
    ],
    color: "from-indigo-500/20 to-purple-500/5",
    border: "group-hover:border-indigo-500/40",
    iconColor: "text-indigo-400"
  },
  {
    icon: Briefcase,
    role: "Employers",
    description: "Onboard skilled interns from any participating university. Review student portfolios, host interviews, and complete standardized student assessments.",
    benefits: [
      "Direct portal to screen and filter students by skillset and level",
      "Secure digital signature of tripartite attachment agreements",
      "Simplified weekly task approvals and final performance grading"
    ],
    color: "from-emerald-500/20 to-teal-500/5",
    border: "group-hover:border-emerald-500/40",
    iconColor: "text-emerald-400"
  }
];

export default function About() {
  return (
    <section
      id="about"
      className="relative bg-[#020817] py-24 md:py-32 overflow-hidden border-t border-slate-900"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-0 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-600/5 blur-[150px] pointer-events-none" />

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
            About SBridge
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Bridging the Internship Gap
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-5 max-w-3xl text-lg text-slate-400"
          >
            SBridge connects students, employers, and university administrators on a single integrated system. 
            We replace manual introductory letters, printouts, and scattered emails with structured, digital-first attachment workflows.
          </motion.p>
        </div>

        {/* Stakeholder Cards Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {STAKEHOLDERS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group relative rounded-3xl border border-slate-800 bg-slate-900/40 p-8 hover:bg-slate-900/60 transition-all duration-300 backdrop-blur-sm"
              >
                {/* Glow background on card hover */}
                <div className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Card Icon Header */}
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700/80 transition-all group-hover:scale-110">
                    <Icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {item.role}
                  </h3>
                </div>

                <p className="mt-6 text-slate-400 leading-relaxed text-sm">
                  {item.description}
                </p>

                {/* Benefits List */}
                <ul className="mt-8 space-y-4">
                  {item.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ChevronRight className={`h-5 w-5 shrink-0 mt-0.5 ${item.iconColor}`} />
                      <span className="text-sm text-slate-300 leading-normal">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action Row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 flex flex-col sm:flex-row items-center justify-between rounded-3xl border border-blue-500/20 bg-blue-500/5 px-8 py-10 md:px-12 backdrop-blur-md gap-6"
        >
          <div className="max-w-2xl text-center sm:text-left">
            <h4 className="text-xl font-bold text-white sm:text-2xl">
              Ready to secure your next attachment?
            </h4>
            <p className="mt-2 text-slate-400 text-sm sm:text-base">
              Create an account using your university student email or register your company profile.
            </p>
          </div>
          <Button variant="primary" className="whitespace-nowrap px-8">
            Create Account
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
