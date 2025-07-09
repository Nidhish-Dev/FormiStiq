'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/components/AuthProvider';
import Link from 'next/link';
import { HiOutlineChatBubbleLeft, HiOutlineSparkles, HiOutlineShare } from 'react-icons/hi2';

const animatedWords = ['Smart', 'Fast', 'Seamless'];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function Home() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % animatedWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-black text-white px-6 sm:px-12 lg:px-20 pt-8 pb-16 font-sans">
      <motion.div
        className="w-full max-w-6xl bg-gray-900/30 backdrop-blur-xl rounded-3xl py-8 sm:py-10 px-5 sm:px-8 shadow-[0_0_25px_rgba(0,122,255,0.4)] border border-gray-800/60 flex flex-col justify-between"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        draggable="false"
      >
        {/* Brand Name */}
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 relative inline-block"
          variants={fadeInUp}
        >
          FormiStiq
        </motion.h1>

        {/* Animated Tagline */}
        <motion.div
          className="flex items-center justify-center space-x-1 text-base sm:text-lg font-semibold mb-5 select-none"
          variants={fadeInUp}
        >
          <span>Intelligent Forms with</span>
          <div className="relative w-32 h-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={animatedWords[currentWordIndex]}
                className="absolute text-blue-400 font-extrabold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                {animatedWords[currentWordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          <span>Results.</span>
        </motion.div>

        {/* FormiAI: The Next Revolution Section */}
        <motion.div
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
            FormiAI: The Next Revolution
          </h2>
          <p className="text-center text-gray-300 text-sm sm:text-base mb-6 max-w-xl mx-auto">
            FormiAI redefines form creation with AI-powered intelligence, crafting tailored forms instantly to meet your unique needs.
          </p>
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Describe Needs',
                desc: 'Chat with FormiAI to specify your form’s topic and requirements.',
                icon: <HiOutlineChatBubbleLeft className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" />,
              },
              {
                title: 'AI Generates',
                desc: 'FormiAI instantly creates a tailored form with relevant questions.',
                icon: <HiOutlineSparkles className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" />,
              },
              {
                title: 'Share & Collect',
                desc: 'Share the unique form link and collect responses effortlessly.',
                icon: <HiOutlineShare className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" />,
              },
            ].map(({ title, desc, icon }, index) => (
              <motion.div
                key={title}
                className="flex flex-col items-center text-center px-2 sm:px-4 bg-[#222222]/60 backdrop-blur-md border border-gray-700/40 rounded-xl p-6 shadow-sm"
                variants={fadeInUp}
                transition={{ delay: 0.8 + index * 0.2 }}
                draggable="false"
              >
                <div className="mb-3">{icon}</div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-white">{title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-snug">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FormiStiq Description */}
        <motion.p
          className="max-w-3xl mx-auto text-gray-300 text-center text-sm sm:text-base leading-relaxed px-4 sm:px-0 mb-8"
          variants={fadeInUp}
          transition={{ delay: 1.4 }}
        >
          FormiStiq is your all-in-one platform for creating, sharing, and managing intelligent forms. With secure data collection and real-time tracking, it simplifies every step of your workflow.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-3 max-w-xs mx-auto"
          variants={fadeInUp}
          transition={{ delay: 1.6 }}
        >
          <Link
            href={user ? '/dashboard' : '/login'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-4 rounded-full shadow-lg transition text-sm sm:text-base flex justify-center items-center"
          >
            Try FormiStiq for Free
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}