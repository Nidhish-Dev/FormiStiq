'use client';

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { HiOutlineClipboardList, HiOutlinePlusCircle } from 'react-icons/hi';
import { HiOutlineBolt } from 'react-icons/hi2';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contextReady, setContextReady] = useState(false);

  useEffect(() => {
    if (user !== undefined) setContextReady(true);
  }, [user]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('token');
        if (!user || !token) return;

        const response = await fetch('https://formistiq-server.vercel.app/api/forms', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          console.error('Failed to fetch forms:', await response.text());
          return;
        }

        const data = await response.json();
        setForms(data);
      } catch (error) {
        console.error('Error fetching forms:', error);
      } finally {
        setLoading(false);
      }
    };

    if (contextReady) fetchForms();
  }, [user, contextReady]);

  if (!contextReady) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="dashboard"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-[80vh] bg-black text-white flex items-center justify-center px-6 py-12 md:py-20"
      >
        <motion.div
          className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#111]/60 backdrop-blur-xl border border-gray-700/40 rounded-3xl p-6 sm:p-8 shadow-2xl"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {/* 👋 Welcome Section */}
          <motion.div
            className="flex flex-col justify-center items-start text-left order-1 md:order-1"
            variants={fadeInUp}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 text-white">
              Welcome back, {user?.firstName}!
            </h1>

            <p className="text-sm sm:text-base text-gray-400 mb-8 max-w-md">
              Manage your forms quickly and easily with FormiStiq — your all-in-one platform for creating, editing, and analyzing forms with zero hassle.
            </p>

            {loading ? (
              <p className="text-gray-500 text-sm mb-6">Loading your forms...</p>
            ) : (
              <p className="text-sm sm:text-base text-gray-400 mb-6">
                You’ve created <strong>{forms.length}</strong> form{forms.length !== 1 && 's'}.
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard/create"
                className="flex items-center gap-2 bg-white text-black px-6 py-2.5 text-sm font-medium rounded-full shadow hover:bg-gray-200 transition-all duration-200"
              >
                <HiOutlinePlusCircle className="h-5 w-5" />
                Create New Form
              </Link>
              <Link
                href="/dashboard/forms"
                className="flex items-center gap-2 bg-neutral-800 text-white px-6 py-2.5 text-sm font-medium rounded-full shadow hover:bg-neutral-700 transition-all duration-200"
              >
                <HiOutlineClipboardList className="h-5 w-5" />
                View All Forms
              </Link>
            </div>
          </motion.div>

          {/* ⚡ FormiAI Section */}
          <motion.div
            className="flex flex-col justify-center items-start text-left border-t md:border-t-0 md:border-l border-gray-700/40 pt-8 md:pt-0 md:pl-6 order-2 md:order-2"
            variants={fadeInUp}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 flex items-center gap-2">
              <HiOutlineBolt className="h-6 w-6" />
              Generate Forms with FormiAI
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mb-6 max-w-md">
              Use our AI-powered assistant to automatically create forms tailored to your exact requirements. Save time and effort while getting smarter, more intuitive forms every time.
            </p>
            <Link
              href="/dashboard/formiai"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 text-sm font-semibold rounded-full shadow transition-all duration-200"
            >
              Launch FormiAI
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
