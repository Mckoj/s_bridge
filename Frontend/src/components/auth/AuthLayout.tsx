import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-4xl",
};

export default function AuthLayout({ children, maxWidth = "md" }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(135deg,_#07111f_0%,_#0f172a_45%,_#111827_100%)] p-4 text-white md:p-6 flex items-center justify-center selection:bg-violet-500/40">
      <div className="pointer-events-none absolute left-[-10%] top-[-15%] h-[45%] w-[45%] rounded-full bg-blue-500/12 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] h-[45%] w-[45%] rounded-full bg-emerald-500/12 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.08),_transparent_35%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative z-10 w-full ${maxWidthClasses[maxWidth]}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
