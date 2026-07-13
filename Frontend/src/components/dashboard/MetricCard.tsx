import React from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  color: "blue" | "purple" | "green" | "red" | "orange";
}

export default function MetricCard({ title, value, subtext, icon, color }: MetricCardProps) {
  const colorStyles = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      border: "border-blue-100 dark:border-blue-900/55",
      text: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100/80 dark:bg-blue-900/40",
      accent: "bg-blue-600",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/20",
      border: "border-purple-100 dark:border-purple-900/55",
      text: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100/80 dark:bg-purple-900/40",
      accent: "bg-purple-600",
    },
    green: {
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      border: "border-emerald-100 dark:border-emerald-900/55",
      text: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100/80 dark:bg-emerald-900/40",
      accent: "bg-emerald-600",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-950/20",
      border: "border-red-100 dark:border-red-900/55",
      text: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-100/80 dark:bg-red-900/40",
      accent: "bg-red-600",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-950/20",
      border: "border-orange-100 dark:border-orange-900/55",
      text: "text-orange-600 dark:text-orange-400",
      iconBg: "bg-orange-100/80 dark:bg-orange-900/40",
      accent: "bg-orange-600",
    },
  };

  const style = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl border ${style.border} ${style.bg} p-6 shadow-sm dark:shadow-slate-950/40 transition-all duration-300 flex items-center justify-between`}
    >
      {/* Decorative top accent line */}
      <div className={`absolute top-0 left-0 w-full h-[3px] ${style.accent}`} />
      
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 select-none">
          {value}
        </span>
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          {subtext}
        </span>
      </div>

      <div className={`p-3.5 rounded-xl ${style.iconBg} ${style.text} flex items-center justify-center`}>
        {icon}
      </div>
    </motion.div>
  );
}
