'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Form {
  _id: string;
  title: string;
  uniqueUrl: string;
  createdAt?: string;
}

export default function Forms() {
  const [forms, setForms] = useState<Form[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://formistiq-server.vercel.app/api/forms', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setForms(response.data);
        setMessage('');
      } catch (error: any) {
        setMessage(error.response?.data?.message || 'Error fetching forms');
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(`https://formistiq.vercel.app/forms/${url}`);
    setMessage('URL copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-black text-white flex justify-center items-start relative">
      {/* Toast Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 text-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Card */}
      <motion.div
        className="w-full max-w-4xl bg-[#111111]/60 backdrop-blur-xl border border-gray-700/40 rounded-3xl p-6 sm:p-10 shadow-xl"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h2
          className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your Forms
        </motion.h2>

        {loading ? (
          <p className="text-center text-gray-400 mt-6">Loading forms...</p>
        ) : forms.length > 0 ? (
          <div className="space-y-4">
            {forms
              .slice()
              .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
              .map((form, i) => (
                <motion.div
                  key={form._id}
                  className="p-5 bg-neutral-900 border border-neutral-700 rounded-xl shadow-sm transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                >
                  <p className="text-sm sm:text-base font-medium text-white mb-1">{form.title}</p>
                  <p className="text-xs text-gray-400 break-all">
                    https://formistiq.vercel.app/forms/{form.uniqueUrl}
                  </p>

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/dashboard/responses/${form.uniqueUrl}`}
                      className="flex-1 bg-[#007aff] hover:bg-blue-600 text-white px-4 py-2 text-sm rounded-full text-center shadow transition-all"
                    >
                      View Responses
                    </Link>
                    <button
                      onClick={() => copyToClipboard(form.uniqueUrl)}
                      className="flex-1 bg-white hover:bg-gray-100 text-black px-4 py-2 text-sm rounded-full shadow transition-all"
                    >
                      Share Form
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-6">No forms found.</p>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-sm text-[#007aff] hover:underline transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
