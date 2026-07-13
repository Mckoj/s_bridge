import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";
import Problem from "../../components/landing/Problem";
import Solution from "../../components/landing/Solution";
import HowItWorks from "../../components/landing/HowItWorks";
import CTA from "../../components/landing/CTA";
import Footer from "../../components/landing/Footer";

/**
 * Story arc:
 * Hero       → "There's a gap between students and opportunity"
 * Problem    → "Students struggle. Recruiters are overwhelmed. Universities are blind."
 * Solution   → "SBridge fixes all three — here's what each person gets"
 * HowItWorks → "Three steps. That's it."
 * CTA        → "Join today"
 */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#020817] text-white overflow-x-hidden selection:bg-blue-600/40 selection:text-white">
      <Navbar />
      <Hero />
      <main>
        <Problem />
        <Solution />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}