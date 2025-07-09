'use client';

import { Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
};

export default function About() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white px-4 py-16">
      <motion.div
        className="w-full max-w-3xl bg-[#111] bg-opacity-60 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        {/* Title */}
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
          variants={fadeUp}
        >
          About FormiStiq
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-sm sm:text-base text-gray-300 leading-relaxed"
          variants={fadeUp}
        >
          <span className="text-white font-semibold">FormiStiq</span> is a modern form-building platform designed for performance, simplicity, and elegance. Whether you’re collecting feedback or managing internal workflows, FormiStiq delivers a seamless experience with clean UI and smooth interactions.
        </motion.p>

        <motion.p
          className="text-xs sm:text-sm text-gray-400 leading-relaxed"
          variants={fadeUp}
        >
          Built for creators, startups, and professionals — FormiStiq makes form creation feel effortless, intelligent, and beautiful.
        </motion.p>

        <motion.hr className="border-white/10 my-4" variants={fadeUp} />

        {/* Developer Info */}
        <motion.div className="space-y-3 text-left sm:text-center" variants={fadeUp}>
          <p className="text-sm sm:text-base text-white font-medium">
            👨‍💻 Developed by <span className="text-blue-400">Nidhish Rathore</span>
          </p>

          <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
            <Mail className="w-4 h-4" />
            <a href="mailto:codenidhish07@gmail.com" className="hover:underline text-blue-400">
              codenidhish07@gmail.com
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
            <Phone className="w-4 h-4" />
            <a href="tel:8708295706" className="hover:underline text-blue-400">
              +91 87082 95706
            </a>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div className="mt-6 flex justify-center gap-6" variants={fadeUp}>
          <a
            href="https://github.com/Nidhish-Dev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
              alt="GitHub"
              className="w-6 h-6 invert"
            />
          </a>

          <a
            href="https://www.linkedin.com/in/nidhish-rathore-b2b9bb325/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
              alt="LinkedIn"
              className="w-6 h-6"
            />
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
