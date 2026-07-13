import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    question: "How does the SBridge attachment matching algorithm work?",
    answer: "SBridge matches university students to industrial attachments by comparing student skill tags and academic department profiles with active roles posted by Ghanaian companies like MTN Ghana, GCB Bank, and M-Corp Technologies."
  },
  {
    question: "Who evaluates and grades the student's industrial attachment?",
    answer: "Grading is collaborative. Corporate supervisors evaluate weekly task reports and final performance, while university academic coordinators (like Dr. Yaw M. Missah) review weekly logbook entries and grade the final attachment report."
  },
  {
    question: "Can academic departments customize their attachment requirements?",
    answer: "Yes. SBridge allows coordinators from any department to customize minimum placement durations, upload specific grading rubrics, and define required documents (e.g. university introductory letters, insurance covers)."
  },
  {
    question: "How is the tripartite industrial attachment agreement signed?",
    answer: "SBridge generates a standard digital tripartite agreement based on the accepted placement. The student, the host company representative, and the university department coordinator review and e-sign directly inside the web portal."
  },
  {
    question: "Is there support for students during their attachment?",
    answer: "Absolutely. Students can contact coordinators via built-in chats, access resources on CV styling and professional conduct, and report placement issues directly to their assigned university supervisor."
  }
];

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ question, answer, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-slate-800 py-5">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left focus:outline-none"
      >
        <span className="text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-200">
          {question}
        </span>
        <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-slate-400 leading-relaxed text-sm">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="contact"
      className="relative bg-[#020817] py-24 md:py-32 overflow-hidden border-t border-slate-900"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 right-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        {/* Section Heading */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-wider text-blue-400"
          >
            Questions
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-slate-400"
          >
            Everything you need to know about the SBridge platform. Can't find what you are looking for? Reach out to support.
          </motion.p>
        </div>

        {/* Accordions List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/10 p-8 sm:p-12 backdrop-blur-md"
        >
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
