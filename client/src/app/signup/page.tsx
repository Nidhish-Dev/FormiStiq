'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/5 backdrop-blur-2xl text-white px-8 py-10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10"
      >
        <h1 className="text-center text-2xl font-semibold mb-8 tracking-tight">
          Create your <span className="font-bold">FormiStiq</span> account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-gray-500 focus:ring-1 focus:ring-white/40 focus:outline-none"
                placeholder="John"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-gray-500 focus:ring-1 focus:ring-white/40 focus:outline-none"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-gray-500 focus:ring-1 focus:ring-white/40 focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-gray-500 focus:ring-1 focus:ring-white/40 focus:outline-none"
              placeholder="+1 234 567 8901"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-gray-500 focus:ring-1 focus:ring-white/40 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-2.5 rounded-md font-medium bg-white/10 hover:bg-white/20 text-white transition-all duration-200 focus:outline-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-white hover:underline underline-offset-4"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
