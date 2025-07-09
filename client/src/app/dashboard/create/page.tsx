'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiOutlineClipboard } from 'react-icons/hi';
import { HiOutlineClipboardDocument } from 'react-icons/hi2';

interface Question {
  _id?: string;
  type: 'short_answer' | 'long_answer' | 'mcq';
  text: string;
  options: string[];
  required: boolean;
}

export default function CreateForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [{ type: 'short_answer', text: '', options: [], required: false }] as Question[],
  });
  const [message, setMessage] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const addQuestion = () =>
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { type: 'short_answer', text: '', options: [], required: false },
      ],
    });

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const questions = [...formData.questions];
    questions[index] = { ...questions[index], [field]: value };
    if (field === 'type' && value !== 'mcq') questions[index].options = [];
    setFormData({ ...formData, questions });
  };

  const addOption = (qIndex: number) => {
    const questions = [...formData.questions];
    questions[qIndex].options.push('');
    setFormData({ ...formData, questions });
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const questions = [...formData.questions];
    questions[qIndex].options[optIndex] = value;
    setFormData({ ...formData, questions });
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const resp = await axios.post(
        'http://localhost:8000/api/forms',
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      const url = `http://localhost:3000/forms/${resp.data.form.uniqueUrl}`;
      setMessage('Form created successfully!');
      setFormUrl(url);
      setFormData({
        title: '',
        description: '',
        questions: [{ type: 'short_answer', text: '', options: [], required: false }],
      });
    } catch (e: any) {
      setMessage(e.response?.data?.message || 'Error creating form');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formUrl);
    setMessage('URL copied to clipboard!');
    setTimeout(() => setMessage('Form created successfully!'), 2500);
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-black flex justify-center items-start font-sans">
      <motion.div
        className="w-full max-w-4xl bg-[#111111] rounded-3xl p-10 shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h2
          className="text-3xl font-extralight mb-8 text-white text-center tracking-wide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Create a New Form
        </motion.h2>

        <form onSubmit={handleCreateForm} className="space-y-8">
          {/* Title & Description */}
          {['title', 'description'].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-gray-300 text-sm mb-2 uppercase font-light tracking-wide"
              >
                {field}
              </label>
              {field === 'title' ? (
                <input
                  id={field}
                  type="text"
                  value={(formData as any)[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  required
                  placeholder={field === 'title' ? 'Enter form title' : ''}
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#222222] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              ) : (
                <textarea
                  id={field}
                  value={(formData as any)[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  placeholder="Add a description (optional)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#222222] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                />
              )}
            </div>
          ))}

          {/* Questions */}
          {formData.questions.map((q, qi) => (
            <div
              key={qi}
              className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-700 space-y-4"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <label className="text-white font-semibold text-base mb-2 md:mb-0">
                  Question {qi + 1}
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(qi, 'type', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-600 bg-[#222222] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="short_answer">Short Answer</option>
                    <option value="long_answer">Long Answer</option>
                    <option value="mcq">Multiple Choice</option>
                  </select>
                  <label className="flex items-center text-white text-sm select-none">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) => updateQuestion(qi, 'required', e.target.checked)}
                      className="mr-2 w-4 h-4 rounded border-gray-600 bg-[#222222] focus:ring-2 focus:ring-blue-500"
                    />
                    Required
                  </label>
                </div>
              </div>
              <input
                type="text"
                placeholder="Enter question text"
                value={q.text}
                onChange={(e) => updateQuestion(qi, 'text', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#222222] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

              {/* MCQ Options */}
              {q.type === 'mcq' && (
                <div className="space-y-3 mt-2">
                  {q.options.map((opt, oi) => (
                    <input
                      key={oi}
                      type="text"
                      placeholder={`Option ${oi + 1}`}
                      value={opt}
                      onChange={(e) => updateOption(qi, oi, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#222222] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(qi)}
                    className="text-blue-500 hover:text-blue-400 font-medium transition"
                  >
                    + Add Option
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={addQuestion}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-full font-semibold transition"
            >
              + Add Question
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 ${
                loading ? 'bg-blue-600 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
              } text-white py-3 rounded-full font-semibold transition`}
            >
              {loading ? 'Creating...' : 'Create Form'}
            </button>
          </div>
        </form>

        {/* Feedback & Share */}
        {message && (
          <div className="mt-8 text-center space-y-3">
            <p className="text-green-400 font-medium">{message}</p>
            {formUrl && (
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-full font-semibold transition"
              >
                <HiOutlineClipboardDocument className="w-5 h-5" />
                Copy Share URL
              </button>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-sm text-blue-500 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
