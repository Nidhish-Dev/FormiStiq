'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import { HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineClipboardDocument } from 'react-icons/hi2';

interface Question {
  _id: string;
  type: 'short_answer' | 'mcq';
  text: string;
  options?: string[];
  required: boolean;
}

interface GeneratedForm {
  title: string;
  description: string;
  questions: Question[];
  uniqueUrl: string;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function FormiAI() {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState('5');
  const [questionType, setQuestionType] = useState<'mcq' | 'shortAnswer'>('mcq');
  const [generatedForm, setGeneratedForm] = useState<GeneratedForm | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setMessage('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        'https://formistiq.onrender.com/api/forms/ai',
        { topic, numQuestions: parseInt(numQuestions), questionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGeneratedForm(response.data.form);
      setMessage('Form generated successfully!');
    } catch (error: any) {
      console.error('Form generation error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      setMessage(error.response?.data?.message || 'Error generating form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedForm) {
      navigator.clipboard.writeText(`https://formistiq.vercel.app/forms/${generatedForm.uniqueUrl}`);
      setMessage('Form URL copied to clipboard!');
      setTimeout(() => setMessage('Form generated successfully!'), 3000);
    }
  };

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        key="formiai"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-[80vh] bg-black text-white flex items-center justify-center px-6 py-12 md:py-20"
      >
        <motion.div
          className="w-full max-w-4xl bg-[#111]/60 backdrop-blur-xl border border-gray-700/40 rounded-3xl p-6 sm:p-8 shadow-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
            variants={fadeInUp}
          >
            Generate Form with FormiAI
          </motion.h2>

          {!generatedForm ? (
            <motion.form
              onSubmit={handleGenerateForm}
              className="space-y-6 max-w-md mx-auto"
              variants={fadeInUp}
            >
              <div>
                <label className="block text-sm sm:text-base text-gray-200 mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Customer Feedback"
                  className="w-full bg-gray-800/40 border border-gray-700/50 rounded-lg px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base text-gray-200 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  min="1"
                  max="20"
                  className="w-full bg-gray-800/40 border border-gray-700/50 rounded-lg px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base text-gray-200 mb-2">
                  Question Type
                </label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value as 'mcq' | 'shortAnswer')}
                  className="w-full bg-gray-800/40 border border-gray-700/50 rounded-lg px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="shortAnswer">Short Answer</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 text-sm sm:text-base font-medium rounded-full shadow hover:shadow-md transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Form'}
              </button>
            </motion.form>
          ) : (
            <div className="space-y-6">
              <motion.div variants={fadeInUp}>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                  {generatedForm.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-400 mb-4">
                  {generatedForm.description}
                </p>
              </motion.div>
              {generatedForm.questions.map((q, i) => (
                <motion.div
                  key={`question-${i}`}
                  className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5 sm:p-6 shadow-lg"
                  variants={fadeInUp}
                >
                  <p className="text-sm sm:text-base text-white font-medium mb-2">
                    {q.text} {q.required && <span className="text-red-400">*</span>}
                  </p>
                  {q.type === 'mcq' && q.options && (
                    <ul className="text-xs sm:text-sm text-gray-300 space-y-1">
                      {q.options.map((option, j) => (
                        <li key={`option-${i}-${j}`}>{option}</li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mt-6"
                variants={fadeInUp}
              >
                <Link
                  href={`/forms/${generatedForm.uniqueUrl}`}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 text-sm sm:text-base font-medium rounded-full shadow hover:shadow-md transition-all duration-200"
                >
                  View Form
                </Link>
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 text-sm sm:text-base font-medium rounded-full shadow hover:shadow-md transition-all duration-200"
                >
                  <HiOutlineClipboardDocument className="inline-block w-5 h-5 mr-2" />
                  Share Form
                </button>
              </motion.div>
            </div>
          )}

          {message && (
            <motion.p
              className="mt-8 text-sm sm:text-base text-center text-green-400"
              variants={fadeInUp}
            >
              {message}
            </motion.p>
          )}

          <motion.div
            className="mt-8 text-center"
            variants={fadeInUp}
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm sm:text-base text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              <HiOutlineArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}