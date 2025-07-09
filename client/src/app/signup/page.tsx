'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const router = useRouter();

  // Common email domains for validation
  const validEmailDomains = [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com',
    'protonmail.com', 'mail.com', 'zoho.com', 'yandex.com', 'gmx.com', 'me.com',
  ];

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    const domain = email.split('@')[1].toLowerCase();
    if (!validEmailDomains.includes(domain)) {
      return 'Please use a valid email domain (e.g., gmail.com, yahoo.com)';
    }
    return '';
  };

  const validatePhone = (phone: string): string => {
    const phoneRegex = /^\+?\d[\d\s-]*$/;
    if (!phoneRegex.test(phone)) {
      return 'Phone number can only contain numbers, +, -, and spaces';
    }
    return '';
  };

  const validatePasswords = (password: string, confirmPassword: string): string => {
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
    if (name === 'email') {
      setErrors({ ...errors, email: validateEmail(value) });
    }
    if (name === 'phone') {
      setErrors({ ...errors, phone: validatePhone(value) });
    }
    if (name === 'password' || name === 'confirmPassword') {
      setErrors({
        ...errors,
        confirmPassword: validatePasswords(
          name === 'password' ? value : formData.password,
          name === 'confirmPassword' ? value : formData.confirmPassword
        ),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: '', phone: '', password: '', confirmPassword: '' });

    // Validate all fields
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    const passwordError = validatePasswords(formData.password, formData.confirmPassword);

    if (emailError || phoneError || passwordError) {
      setErrors({
        email: emailError,
        phone: phoneError,
        password: '', // No specific password error beyond matching
        confirmPassword: passwordError,
      });
      return;
    }

    setLoading(true);
    try {
      // Exclude confirmPassword from signup payload
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
      router.push('/dashboard');
    } catch (err: any) {
      setErrors({ ...errors, email: err.response?.data?.message || 'Signup failed', phone: '', password: '', confirmPassword: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/5 backdrop-blur-2xl text-white px-8 py-10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10"
        draggable="false"
      >
        <h1 className="text-center text-2xl font-semibold mb-8 tracking-tight">
          Create your <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">FormiStiq</span> account
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
              className={`w-full px-4 py-2.5 bg-neutral-900 border ${errors.email ? 'border-red-500' : 'border-neutral-700'} rounded-md text-white placeholder-gray-500 focus:ring-1 focus:ring-white/40 focus:outline-none`}
              placeholder="you@example.com"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-neutral-900 border ${errors.phone ? 'border-red-500' : 'border-neutral-700'} rounded-md text-white placeholder-gray-500 focus:ring-1 focus:ring-white/40 focus:outline-none`}
              placeholder="+1 234 567 8901"
              required
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-neutral-900 border ${errors.confirmPassword ? 'border-red-500' : 'border-neutral-700'} rounded-md text-white placeholder-gray-500 focus:ring-1 focus:ring-white/40 focus:outline-none`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <HiOutlineEyeOff className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-neutral-900 border ${errors.confirmPassword ? 'border-red-500' : 'border-neutral-700'} rounded-md text-white placeholder-gray-500 focus:ring-1 focus:ring-white/40 focus:outline-none`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showConfirmPassword ? <HiOutlineEyeOff className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {errors.email && !errors.confirmPassword && !errors.phone && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

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