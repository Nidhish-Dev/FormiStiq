'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/components/AuthProvider';
import Link from 'next/link';

const animatedWords = ['Smart', 'Fast', 'Seamless'];

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
      >
        {/* Brand Name */}
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        >
          FormiStiq
        </motion.h1>

        {/* Animated tagline */}
        <div className="flex items-center justify-center space-x-1 text-base sm:text-lg font-semibold mb-5 select-none">
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
        </div>

        {/* Description */}
        <motion.p
          className="max-w-3xl mx-auto text-gray-300 text-center text-sm sm:text-base leading-relaxed px-4 sm:px-0 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          Empower your team with FormiStiq — the intelligent form builder designed to handle every type of
          question effortlessly, ensuring secure, private, and smooth data collection.
        </motion.p>

        {/* Features grid */}
        <motion.div
          className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          {[
            {
              title: 'Flexible Question Types',
              desc: 'Support short answers, long responses, and multiple-choice questions for diverse data collection.',
              icon: (
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              ),
            },
            {
              title: 'Secure & Private',
              desc: 'Your responses are encrypted and safely stored, giving you peace of mind with every submission.',
              icon: (
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c0-1.105-.895-2-2-2s-2 .895-2 2 .895 2 2 2 2-.895 2-2zm0 0v2m0 4v1a2 2 0 0 0 4 0v-1m-4-6h4"
                  />
                </svg>
              ),
            },
            {
              title: 'Unique Form Links',
              desc: 'Share your forms easily with unique URLs, ensuring quick access and better response tracking.',
              icon: (
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 14.828a4 4 0 1 1-5.656-5.656m1.414-1.414L8 8m8 8l-2.586-2.586"
                  />
                </svg>
              ),
            },
          ].map(({ title, desc, icon }) => (
            <div key={title} className="flex flex-col items-center text-center px-2 sm:px-4">
              <div className="mb-2">{icon}</div>
              <h3 className="text-base font-semibold mb-1">{title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-snug">{desc}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-3 max-w-xs mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
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
