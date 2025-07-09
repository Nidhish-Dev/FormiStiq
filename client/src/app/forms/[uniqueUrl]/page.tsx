'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { use } from 'react';

interface Question {
  _id: string;
  type: 'short_answer' | 'long_answer' | 'mcq';
  text: string;
  options?: string[];
  required: boolean;
}

interface Form {
  _id: string;
  title: string;
  description: string;
  uniqueUrl: string;
  questions: Question[];
}

export default function FormSubmission({ params }: { params: Promise<{ uniqueUrl: string }> }) {
  const { uniqueUrl } = use(params);
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/forms/${uniqueUrl}`);
        setForm(response.data);
        setAnswers(new Array(response.data.questions.length).fill(''));
        setError('');
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to load form.');
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [uniqueUrl]);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const hasMissingRequired = form.questions.some((q, i) => q.required && !answers[i]);
    if (hasMissingRequired) {
      setMessage('Please fill out all required fields.');
      return;
    }
    const formattedAnswers = form.questions.map((q, i) => ({
      questionId: q._id,
      answer: answers[i] || '',
    }));
    try {
      await axios.post(`http://localhost:8000/api/forms/${uniqueUrl}/submit`, {
        answers: formattedAnswers,
      });
      setMessage('Response submitted successfully!');
      setAnswers(new Array(form.questions.length).fill(''));
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error submitting form');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4 py-12 font-sans">
      <motion.div
        className="w-full max-w-3xl bg-[#111111] rounded-3xl p-10 border border-gray-800 shadow-[0_0_20px_rgba(0,122,255,0.3)] text-white"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {loading ? (
          <p className="text-center text-sm text-gray-400">Loading form...</p>
        ) : error ? (
          <div className="text-center space-y-3">
            <p className="text-sm text-red-500 font-medium">{error}</p>
            <Link href="/dashboard" className="text-blue-500 text-sm hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        ) : form ? (
          <>
            <h1 className="text-3xl font-extrabold text-center text-[#007aff] mb-3 tracking-wide">
              {form.title}
            </h1>
            <p className="text-center text-gray-400 mb-8 max-w-xl mx-auto">{form.description}</p>

            <form onSubmit={handleSubmitForm} className="space-y-8">
              {form.questions.map((q, i) => (
                <div key={q._id}>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 select-none">
                    {q.text} {q.required && <span className="text-red-500">*</span>}
                  </label>

                  {q.type === 'mcq' ? (
                    <div className="space-y-2">
                      {q.options?.map((opt, j) => (
                        <label
                          key={j}
                          className="flex items-center gap-3 cursor-pointer text-gray-300 text-sm"
                        >
                          <input
                            type="radio"
                            name={`answer-${i}`}
                            value={opt}
                            checked={answers[i] === opt}
                            onChange={(e) => {
                              const newAnswers = [...answers];
                              newAnswers[i] = e.target.value;
                              setAnswers(newAnswers);
                            }}
                            className="w-5 h-5 accent-[#007aff] cursor-pointer"
                            required={q.required}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : q.type === 'short_answer' ? (
                    <input
                      type="text"
                      value={answers[i]}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[i] = e.target.value;
                        setAnswers(newAnswers);
                      }}
                      className="w-full px-5 py-3 rounded-xl bg-[#222222] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007aff] transition"
                      placeholder="Your answer..."
                      required={q.required}
                    />
                  ) : (
                    <textarea
                      value={answers[i]}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[i] = e.target.value;
                        setAnswers(newAnswers);
                      }}
                      className="w-full px-5 py-3 rounded-xl bg-[#222222] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007aff] transition resize-none"
                      placeholder="Your detailed answer..."
                      rows={4}
                      required={q.required}
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#007aff] hover:bg-[#005fcc] text-white font-semibold shadow-lg transition duration-200 focus:outline-none focus:ring-4 focus:ring-[#007aff]/50"
              >
                Submit Form
              </button>

              {message && (
                <p className="text-center text-green-400 font-medium mt-4 select-none">{message}</p>
              )}
            </form>

            <div className="mt-10 text-center">
              <Link href="/dashboard" className="text-[#007aff] text-sm hover:underline">
                ← Back to Dashboard
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 text-sm select-none">Form not found.</p>
        )}
      </motion.div>
    </div>
  );
}
