'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, Variants, Transition } from 'framer-motion';
import Link from 'next/link';
import { use } from 'react';

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

        const response = await axios.get<ApiResponse>(`https://formistiq-server.vercel.app/forms/${uniqueUrl}/responses`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const fetchedResponses = response.data.responses || response.data;

        const formResponse = await axios.get<{ questions: Question[] }>(`https://formistiq-server.vercel.app/api/forms/${uniqueUrl}`);
        const fetchedQuestions = formResponse.data.questions || [];

        const questionMap: Record<string, string> = {};
        fetchedQuestions.forEach((q) => {
          questionMap[q._id] = q.text;
        });

        setResponses(fetchedResponses);
        setQuestionsMap(questionMap);
        setMessage(fetchedQuestions.length === 0 ? 'No questions found for this form.' : '');
      } catch (error: any) {
        console.error('Fetch error:', error);
        setMessage(error.response?.data?.message || 'Error fetching responses');
        setResponses([]);
        setQuestionsMap({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uniqueUrl]);

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.2 },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 14 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white px-4">
      <AnimatePresence>
        <motion.div
          className="w-full max-w-4xl bg-[#111111]/70 border border-gray-700/40 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.h2
            className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#007aff]"
            variants={childVariants}
          >
            Form Responses
          </motion.h2>

          {loading ? (
            <motion.p className="text-center text-sm text-gray-400" variants={childVariants}>
              Loading responses...
            </motion.p>
          ) : responses.length > 0 ? (
            <div className="space-y-6">
              {responses.map((resp, i) => (
                <motion.div
                  key={`response-${i}`}
                  className="bg-black/60 border border-gray-700 rounded-2xl p-5 sm:p-6 shadow hover:shadow-lg transition duration-300"
                  variants={childVariants}
                >
                  <p className="text-sm font-semibold text-white mb-4">
                    Response {i + 1}{' '}
                    <span className="text-xs text-gray-400">
                      · {new Date(resp.submittedAt).toLocaleString()}
                    </span>
                  </p>

                  <div className="space-y-4">
                    {resp.answers.map((a, j) => (
                      <div
                        key={`answer-${i}-${j}`}
                        className="bg-neutral-900/70 border border-neutral-700 rounded-lg p-4"
                      >
                        <p className="text-sm font-medium text-white">
                          {questionsMap[a.questionId] || 'Unknown Question'}
                        </p>
                        <p className="text-sm text-gray-300 mt-1">{a.answer}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p
              className="text-sm text-gray-400 text-center"
              variants={childVariants}
            >
              No responses yet.
            </motion.p>
          )}

          {message && (
            <motion.p className="mt-6 text-center text-green-400 text-sm" variants={childVariants}>
              {message}
            </motion.p>
          )}

          <motion.div className="mt-8 text-center" variants={childVariants}>
            <Link
              href="/dashboard"
              className="text-sm text-[#007aff] hover:underline transition"
            >
              ← Back to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
