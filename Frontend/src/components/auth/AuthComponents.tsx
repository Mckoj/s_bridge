import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <div
      className={`bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
}

interface AuthInputProps {
  label: string;
  icon: LucideIcon;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  trailing?: ReactNode;
}

export function AuthInput({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  trailing,
}: AuthInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
        {label}
      </label>
      <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl px-4 py-3 focus-within:border-slate-700 transition-all duration-200">
        <Icon size={16} className="text-slate-500 shrink-0" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-xs outline-none border-none w-full text-white placeholder-slate-500 font-medium"
          required={required}
        />
        {trailing}
      </div>
    </div>
  );
}

interface AuthButtonProps {
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  accentClass: string;
  className?: string;
}

export function AuthButton({
  children,
  type = "button",
  onClick,
  disabled,
  accentClass,
  className = "",
}: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 rounded-2xl text-xs font-bold text-white transition-all duration-250 cursor-pointer shadow-lg focus:outline-none focus:ring-4 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${accentClass} ${className}`}
    >
      {children}
    </button>
  );
}
