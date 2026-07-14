import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo/sbridge-logo.png";
import { ArrowRight, ArrowLeft } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { AuthCard, AuthButton } from "../../components/auth/AuthComponents";

interface LocationState {
  email?: string;
}

export default function SignupOTPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? {};
  const email = state.email ?? "your email";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/signup-successful", {
        state: { email, role: "student" },
      });
    }, 1200);
  };

  const handleResendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setResendTimer(30);
    // Here you would call the API to resend OTP
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logo} alt="SBridge Logo" className="h-12 w-auto mb-3 select-none" />
          <h2 className="text-xl font-extrabold tracking-tight">Verify Your Email</h2>
          <p className="text-xs text-slate-400 font-medium mt-1 max-w-xs">
            We sent a 6-digit code to <span className="text-blue-400 font-bold">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          {/* OTP Input Fields */}
          <div className="space-y-2">
            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
              Verification Code
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-bold bg-slate-950/60 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="-"
                />
              ))}
            </div>
          </div>

          {error && <p className="text-[10px] text-red-400 font-semibold text-center">{error}</p>}

          <AuthButton
            type="submit"
            disabled={isLoading}
            accentClass="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20 shadow-blue-600/10"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify Email</span>
                <ArrowRight size={14} />
              </>
            )}
          </AuthButton>
        </form>

        <div className="text-center mt-6 space-y-3">
          <p className="text-[10px] text-slate-500 font-medium">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0}
              className={`${
                resendTimer > 0
                  ? "text-slate-600 cursor-not-allowed"
                  : "text-blue-400 hover:text-blue-300 font-bold cursor-pointer"
              }`}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
            </button>
          </p>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Signup
          </button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
