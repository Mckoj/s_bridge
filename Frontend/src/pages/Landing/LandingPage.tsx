import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";
import Problem from "../../components/landing/Problem";
import Solution from "../../components/landing/Solution";
import HowItWorks from "../../components/landing/HowItWorks";
import CTA from "../../components/landing/CTA";
import Footer from "../../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(135deg,_#07111f_0%,_#0f172a_50%,_#111827_100%)] text-white selection:bg-violet-500/40 selection:text-white">
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