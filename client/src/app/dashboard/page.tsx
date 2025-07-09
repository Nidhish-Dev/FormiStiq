'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, Variants, Transition } from 'framer-motion';
import Link from 'next/link';
import { use } from 'react';
import { HiOutlineArrowLeft } from 'react-icons/hi';

interface Question {
  _id: string;
  text: string;
}

interface Response {
  answers: { questionId: string; answer: string }[];
  submittedAt: string;
}

interface ApiResponse {
  responses: Response[];
  form?: { questions: Question[] };
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function ViewResponses({ params }: { params: Promise<{ uniqueUrl: string }> }) {
  const { uniqueUrl } = use(params);
  const [responses, setResponses] = useState<Response[]>([]);
  const [questionsMap, setQuestionsMap] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (!token) {
          setMessage('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        // Fetch responses with retry logic
        const fetchWithRetry = async (url: string, retries = 3, delay = 1000): Promise<any> => {
          for (let i = 0; i < retries; i++) {
            try {
              const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
              });
              return response.data;
            } catch (error: any) {
              if (i === retries - 1) throw error;
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        };

        const responseData = await fetchWithRetry(`https://formistiq-server.vercel.app/api/forms/${uniqueUrl}/responses`);
        const fetchedResponses = responseData.responses || responseData;

        // Fetch questions separately
        const formData = await fetchWithRetry(`https://formistiq-server.vercel.app/api/forms/${uniqueUrl}`);
        const fetchedQuestions = formData.questions || [];

        const questionMap: Record<string, string> = {};
        fetchedQuestions.forEach((q: Question) => {
          questionMap[q._id] = q.text;
        });

        setResponses(fetchedResponses);
        setQuestionsMap(questionMap);
        if (fetchedQuestions.length === 0) {
          setMessage('No questions found for this form.');
        } else {
          setMessage('');
        }
      } catch (error: any) {
        console.error('Fetch error:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        setMessage(error.response?.data?.message || 'Error fetching responses. Please try again.');
        setResponses([]);
        setQuestionsMap({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uniqueUrl]);

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
        key="responses"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-[80vh] bg-black text-white flex items-center justify-center px-6 py-12 md:py-20"
      >
        <motion.div
          className="w-full max-w-6xl bg-[#111]/60 backdrop-blur-xl border border-gray-700/40 rounded-3xl p-6 sm:p-8 shadow-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
            variants={fadeInUp}
          >
            Form Responses
          </motion.h2>

          {loading ? (
            <motion.p
              className="text-center text-sm sm:text-base text-gray-400"
              variants={fadeInUp}
            >
              Loading responses...
            </motion.p>
          ) : responses.length > 0 ? (
            <div className="space-y-6">
              {responses.map((resp, i) => (
                <motion.div
                  key={`response-${i}`}
                  className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  variants={fadeInUp}
                >
                  <p className="text-sm sm:text-base text-gray-200 font-semibold mb-4">
                    Response {i + 1} ·{' '}
                    <span className="text-xs sm:text-sm text-gray-400">
                      {new Date(resp.submittedAt).toLocaleString()}
                    </span>
                  </p>
                  <div className="space-y-4">
                    {resp.answers.map((a, j) => (
                      <motion.div
                        key={`answer-${i}-${j}`}
                        className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/30"
                        variants={fadeInUp}
                      >
                        <p className="text-sm sm:text-base text-white font-medium">
                          {questionsMap[a.questionId] || 'Unknown question'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-300 mt-1">{a.answer}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p
              className="text-sm sm:text-base text-gray-300 text-center"
              variants={fadeInUp}
            >
              No responses yet.
            </motion.p>
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
              className="inline-flex items-center gap-2 text-sm sm:text-base text-blue-400 hover:text-blue-300 transition-colors duration-300"
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