import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";
import About from "../../components/landing/About";
import Features from "../../components/landing/Features";
import Statistics from "../../components/landing/Statistics";
import Testimonials from "../../components/landing/Testimonials";
import FAQ from "../../components/landing/FAQ";
import Footer from "../../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#020817] text-white overflow-x-hidden selection:bg-blue-600/40 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero / Home Section */}
      <Hero />

      {/* Main Sections */}
      <main>
        {/* About Section */}
        <About />

        {/* Features Section */}
        <Features />

        {/* Statistics Section */}
        <Statistics />

        {/* Testimonials Section */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}