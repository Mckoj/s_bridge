import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    role: "Student",
    name: "Aba Mensah",
    title: "Software Engineering Intern at MTN Ghana",
    content: "SBridge completely changed how I managed my industrial attachment. Finding a position at MTN Ghana was fast, and logging my weekly progress was a breeze. My university coordinator could see and sign off on my logbook tasks instantly.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120"
  },
  {
    role: "Employer",
    name: "Kwame Asare",
    title: "Lead Developer at M-Corp Technologies",
    content: "Recruiting and tracking interns from partner universities used to be a paperwork nightmare. SBridge consolidated our attachment postings, tripartite agreement signings, logbook reviews, and final evaluations into one efficient portal.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120"
  },
  {
    role: "University Supervisor",
    name: "Dr. Yaw M. Missah",
    title: "Senior Lecturer & University Internship Supervisor",
    content: "With over 1,200 active students placed across various regions, SBridge's monitoring dashboards are invaluable. I get instant alerts for overdue logbooks, missing contracts, or low performance marks. It makes grading simple and structured.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120"
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <section
      id="testimonials"
      className="relative bg-[#020817] py-24 md:py-32 overflow-hidden border-t border-slate-900"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-blue-600/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-600/5 blur-[130px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-wider text-blue-400"
          >
            Reviews
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Loved by Students & Teams
          </motion.h2>
        </div>

        {/* Carousel Card Container */}
        <div className="relative min-h-[380px] sm:min-h-[320px] flex items-center justify-center">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute left-0 lg:-left-16 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700/80 transition-colors backdrop-blur-sm focus:outline-none"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Slider Content */}
          <div className="w-full max-w-4xl overflow-hidden px-4">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative rounded-3xl border border-slate-800 bg-slate-900/30 p-8 sm:p-12 md:flex items-center gap-8 backdrop-blur-md"
              >
                {/* Quote Icon Background */}
                <Quote className="absolute right-8 top-8 h-20 w-20 text-slate-800/25 -z-10" />

                {/* Left Side: Avatar & Details */}
                <div className="flex flex-col items-center shrink-0 mb-6 md:mb-0">
                  <img
                    src={TESTIMONIALS[activeIndex].avatar}
                    alt={TESTIMONIALS[activeIndex].name}
                    className="h-20 w-20 rounded-full border-2 border-blue-500/50 object-cover shadow-lg"
                  />
                  <span className="mt-4 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
                    {TESTIMONIALS[activeIndex].role}
                  </span>
                </div>

                {/* Right Side: content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Rating Stars */}
                  <div className="flex justify-center md:justify-start gap-1 mb-4">
                    {[...Array(TESTIMONIALS[activeIndex].rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>

                  <p className="text-base sm:text-lg text-slate-300 italic leading-relaxed">
                    "{TESTIMONIALS[activeIndex].content}"
                  </p>

                  <h3 className="mt-6 text-xl font-bold text-white">
                    {TESTIMONIALS[activeIndex].name}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {TESTIMONIALS[activeIndex].title}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-0 lg:-right-16 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700/80 transition-colors backdrop-blur-sm focus:outline-none"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Carousel Indicators (Dots) */}
        <div className="flex justify-center gap-3 mt-8">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                index === activeIndex ? "w-8 bg-blue-500" : "w-2.5 bg-slate-800 hover:bg-slate-700"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
