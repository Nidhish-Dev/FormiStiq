'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import { HiOutlineArrowLeft, HiOutlineClipboardDocument } from 'react-icons/hi2';

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

interface ChatMessage {
  sender: 'bot' | 'user' | 'system';
  text: string;
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Hi! I’m FormiAI. Let’s create a form. What topic would you like the form to be about?' },
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<'topic' | 'numQuestions' | 'questionType' | 'includeName' | 'includeEmail' | 'includeContact' | 'generated'>('topic');
  const [formData, setFormData] = useState({
    topic: '',
    numQuestions: 0,
    questionType: '' as 'mcq' | 'shortAnswer',
    includeName: false,
    includeEmail: false,
    includeContact: false,
  });
  const [generatedForm, setGeneratedForm] = useState<GeneratedForm | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingText, setGeneratingText] = useState('Generating.');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Generating animation
  useEffect(() => {
    if (!loading) {
      setGeneratingText('Generating.');
      return;
    }

    const interval = setInterval(() => {
      setGeneratingText((prev) => {
        if (prev === 'Generating.') return 'Generating..';
        if (prev === 'Generating..') return 'Generating...';
        return 'Generating.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setChatMessages([...chatMessages, { sender: 'user', text: input }]);

    switch (step) {
      case 'topic':
        setFormData({ ...formData, topic: input });
        setChatMessages((prev) => [
          ...prev,
          { sender: 'bot', text: `Got it! How many questions should the form have (1-20)?` },
        ]);
        setStep('numQuestions');
        break;
      case 'numQuestions':
        const num = parseInt(input);
        if (isNaN(num) || num < 1 || num > 20) {
          setChatMessages((prev) => [
            ...prev,
            { sender: 'bot', text: 'Please enter a number between 1 and 20.' },
          ]);
        } else {
          setFormData({ ...formData, numQuestions: num });
          setChatMessages((prev) => [
            ...prev,
            { sender: 'bot', text: 'Great! Should the questions be Multiple Choice (MCQ) or Short Answer?' },
          ]);
          setStep('questionType');
        }
        break;
      case 'questionType':
        if (input.toLowerCase().includes('mcq') || input.toLowerCase().includes('multiple choice')) {
          setFormData({ ...formData, questionType: 'mcq' });
        } else if (input.toLowerCase().includes('short') || input.toLowerCase().includes('short answer')) {
          setFormData({ ...formData, questionType: 'shortAnswer' });
        } else {
          setChatMessages((prev) => [
            ...prev,
            { sender: 'bot', text: 'Please choose "MCQ" or "Short Answer".' },
          ]);
          break;
        }
        setChatMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Would you like to include a short-answer field for the respondent’s name? (Yes/No)' },
        ])
        setStep('includeName');
        break;
      case 'includeName':
        const includeName = input.toLowerCase().includes('yes');
        setFormData({ ...formData, includeName });
        setChatMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Would you like to include a short-answer field for the respondent’s email? (Yes/No)' },
        ]);
        setStep('includeEmail');
        break;
      case 'includeEmail':
        const includeEmail = input.toLowerCase().includes('yes');
        setFormData({ ...formData, includeEmail });
        setChatMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Would you like to include a short-answer field for the respondent’s contact number? (Yes/No)' },
        ]);
        setStep('includeContact');
        break;
      case 'includeContact':
        const includeContact = input.toLowerCase().includes('yes');
        setFormData({ ...formData, includeContact });
        setChatMessages((prev) => [
          ...prev,
          { sender: 'system', text: generatingText },
        ]);
        setStep('generated');
        try {
          setLoading(true);
          setMessage('');
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          if (!token) {
            setMessage('Authentication required. Please log in.');
            setChatMessages((prev) => [
              ...prev.filter((msg) => msg.sender !== 'system'),
              { sender: 'bot', text: 'Authentication required. Please log in and start over.' },
            ]);
            setStep('topic');
            setLoading(false);
            return;
          }

          const response = await axios.post(
            'https://formistiq.onrender.com/api/forms/ai',
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setGeneratedForm(response.data.form);
          setChatMessages((prev) => [
            ...prev.filter((msg) => msg.sender !== 'system'),
            { sender: 'bot', text: 'Form generated successfully! Check it out below.' },
          ]);
          setMessage('Form generated successfully!');
        } catch (error: any) {
          console.error('Form generation error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          });
          const errorMsg =
            error.response?.data?.message === 'AI service is temporarily unavailable. Please try again later.'
              ? 'The AI service is currently busy. Please try again in a few minutes.'
              : error.response?.data?.message || 'Error generating form. Please try again.';
          setMessage(errorMsg);
          setChatMessages((prev) => [
            ...prev.filter((msg) => msg.sender !== 'system'),
            { sender: 'bot', text: errorMsg },
          ]);
          setStep('topic');
        } finally {
          setLoading(false);
        }
        break;
    }

    setInput('');
  };

  // Update generating text in chatMessages during loading
  useEffect(() => {
    if (loading && step === 'generated') {
      setChatMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg.sender === 'system') {
          return [...prev.slice(0, -1), { sender: 'system', text: generatingText }];
        }
        return prev;
      });
    }
  }, [generatingText, loading, step]);

  const copyToClipboard = () => {
    if (generatedForm) {
      navigator.clipboard.writeText(`https://formistiq.vercel.app/forms/${generatedForm.uniqueUrl}`);
      setMessage('Form URL copied to clipboard!');
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Form URL copied to clipboard!' },
      ]);
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

          <div
            ref={chatContainerRef}
            className="max-h-[50vh] overflow-y-auto space-y-4 mb-6 pr-2"
          >
            {chatMessages.map((msg, i) => (
              <motion.div
                key={`msg-${i}`}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                variants={fadeInUp}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-3 text-sm sm:text-base ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : msg.sender === 'system'
                      ? 'bg-gray-800/40 text-blue-400 italic'
                      : 'bg-gray-800/40 text-gray-200'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>

          {!generatedForm ? (
            <motion.form
              onSubmit={handleInputSubmit}
              className="flex gap-2"
              variants={fadeInUp}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response..."
                className="flex-1 bg-gray-800/40 border border-gray-700/50 rounded-lg px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-sm sm:text-base font-medium rounded-full shadow hover:shadow-md transition-all duration-200 disabled:opacity-50"
              >
                Send
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
              className={`mt-8 text-sm sm:text-base text-center ${
                message.includes('Error') ? 'text-red-400' : 'text-green-400'
              }`}
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