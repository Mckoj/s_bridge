import { motion } from "framer-motion";
import Button from "../common/Button";
import logo from "../../assets/logo/sbridge-logo.png";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen lg:h-[calc(100vh-80px)] items-center overflow-hidden bg-[#020817] pt-36 md:pt-44 lg:pt-28 pb-16 lg:pb-8"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563EB22_0%,#020817_70%)]" />

      <motion.div
        className="absolute -top-24 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[180px]"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">

        {/* Left Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
         
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
            Building Bridges
            <br />
            Between
            <span className="text-blue-400"> Students</span>,
            <br />
            Universities &
            <span className="text-blue-400"> Employers</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
            SBridge simplifies industrial attachments and internship placements for university students, 
            digitizing supervisor monitoring, employer recruitment, and student logbooks into one modern portal.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button>
            Get Started
            </Button>
            
          </div>

          <div className="mt-12 flex flex-wrap gap-8">
            <div>
              <h2 className="text-3xl font-bold text-blue-400">
                1,240
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Active Placements
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-blue-400">
                150+
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Verified Employers
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-blue-400">
                98%
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Success Rate
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Logo with Tagline */}
        <motion.div
          className="flex flex-col items-center justify-center mb-8 lg:mb-0"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative group flex flex-col items-center">
            {/* Soft Glow Underneath the Logo */}
            <div className="absolute inset-0 bg-blue-500/10 rounded-full filter blur-3xl opacity-70 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />
            
            <img
              src={logo}
              alt="SBridge Logo"
              className="w-[200px] sm:w-[260px] md:w-[300px] lg:w-[360px] drop-shadow-[0_0_50px_rgba(37,99,235,0.4)] select-none transition-transform duration-500 hover:scale-105"
            />
            
            {/* Explicit Tagline underneath the logo */}
            <motion.p 
              className="mt-4 text-center text-xs font-bold tracking-[0.2em] text-blue-400 uppercase select-none"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
             
          <div className="mt-8 flex flex-wrap gap-4">
            
          </div>
            </motion.p>
          </div>       
        </motion.div>

      </div>
    </section>
  );
}