'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/components/AuthProvider';
import Link from 'next/link';
import { HiOutlineChatBubbleLeft, HiOutlineSparkles, HiOutlineShare } from 'react-icons/hi2';

const animatedWords = ['Smart', 'Fast', 'Seamless'];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
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
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-b from-neutral-950 to-black text-white px-6 sm:px-12 lg:px-20 pt-12 pb-16 font-sans">
      <motion.div
        className="w-full max-w-6xl bg-gray-900/20 backdrop-blur-lg rounded-3xl py-10 sm:py-12 px-6 sm:px-10 shadow-[0_0_30px_rgba(0,122,255,0.5)] border border-gray-800/50 flex flex-col justify-between"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
        draggable="false"
      >
        {/* Brand Name */}
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative inline-block"
          initial="hidden"
          animate="show"
          variants={fadeInUp}
        >
          FormiStiq
        </motion.h1>

        {/* Animated Tagline */}
        <motion.div
          className="flex items-center justify-center space-x-2 text-base sm:text-lg font-semibold mb-6 select-none"
          initial="hidden"
          animate="show"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <span>Intelligent Forms with</span>
          <div className="relative w-32 h-7 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={animatedWords[currentWordIndex]}
                className="absolute text-purple-400 font-extrabold"
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
          className="max-w-5xl mx-auto mb-12"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-5"
            variants={fadeInUp}
          >
            FormiAI: The Next Revolution
          </motion.h2>
          <motion.p
            className="text-center text-gray-200 text-sm sm:text-base mb-8 max-w-2xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            FormiAI transforms form creation with cutting-edge AI, delivering tailored, intelligent forms in seconds to streamline your workflow.
          </motion.p>
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Describe Needs',
                desc: 'Chat with FormiAI to define your form’s topic and specific requirements effortlessly.',
                icon: <HiOutlineChatBubbleLeft className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400" />,
              },
              {
                title: 'AI Generates',
                desc: 'FormiAI instantly crafts a customized form with smart, relevant questions.',
                icon: <HiOutlineSparkles className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400" />,
              },
              {
                title: 'Share & Collect',
                desc: 'Share unique form links and collect responses with ease and precision.',
                icon: <HiOutlineShare className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400" />,
              },
            ].map(({ title, desc, icon }, index) => (
              <motion.div
                key={title}
                className="flex flex-col items-center text-center px-3 sm:px-5 bg-[#222222]/60 backdrop-blur-md border border-gray-700/40 rounded-2xl p-8 shadow-lg hover:scale-105 transition-transform duration-300"
                variants={fadeInUp}
                transition={{ delay: 0.4 + index * 0.2 }}
                draggable="false"
              >
                <div className="mb-4">{icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">{title}</h3>
                <p className="text-gray-300 text-sm sm:text-base leading-snug">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FormiStiq Description */}
        <motion.p
          className="max-w-3xl mx-auto text-gray-200 text-center text-sm sm:text-base leading-relaxed px-4 sm:px-0 mb-10"
          initial="hidden"
          animate="show"
          variants={fadeInUp}
          transition={{ delay: 1.0 }}
        >
          FormiStiq is the ultimate platform for crafting, sharing, and managing intelligent forms. With secure data handling and real-time insights, it empowers seamless data collection for teams of all sizes.
        </motion.p>

        {/* CTA */}
        {/* CTA */}
<motion.div
  className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
  initial="hidden"
  animate="show"
  variants={fadeInUp}
  transition={{ delay: 1.2 }}
>
  <Link
    href={user ? '/dashboard' : '/login'}
    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-5 px-6 rounded-full shadow-xl transition-all duration-300 text-sm sm:text-base flex justify-center items-center"
  >
    Try FormiStiq
  </Link>

  <button
    onClick={() => router.push(user ? '/dashboard/formiai' : '/login')}
    className="w-full bg-transparent border border-gray-600 hover:border-gray-500 text-gray-200 hover:text-white font-semibold py-5 px-6 rounded-full shadow-xl transition-all duration-300 text-sm sm:text-base flex justify-center items-center"
  >
    Explore FormiAI
  </button>
</motion.div>

      </motion.div>
    </div>
  );
}