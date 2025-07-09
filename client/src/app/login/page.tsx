'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center bg-neutral-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/5 backdrop-blur-2xl text-white px-8 py-10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10"
      >
        <h1 className="text-center text-2xl font-semibold mb-8 text-white tracking-tight">
          Login to <span className="font-bold">FormiStiq</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-900 text-white border border-neutral-700 rounded-md placeholder-gray-500 focus:ring-1 focus:ring-white/40 focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-900 text-white border border-neutral-700 rounded-md placeholder-gray-500 focus:ring-1 focus:ring-white/40 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-2.5 rounded-md font-medium bg-white/10 hover:bg-white/20 text-white transition-all duration-200 focus:outline-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-white hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
