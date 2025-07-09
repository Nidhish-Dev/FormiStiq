'use client';

import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/components/AuthProvider';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
    setIsMenuOpen(false);
  };

  // Prevent background scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-black/30 border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent tracking-tight"
          >
            FormiStiq
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white text-sm font-medium transition duration-300"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-white text-sm font-medium transition duration-300"
            >
              About
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="px-5 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold shadow-md transition duration-300"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="px-5 py-1.5 rounded-full bg-white text-black text-sm font-semibold shadow-md hover:bg-gray-100 transition duration-300"
              >
                Get Started
              </Link>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden text-white hover:text-gray-300 transition"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Fullscreen Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed top-0 left-0 w-full h-screen z-[999] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-6 text-white text-lg"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
              aria-label="Close Menu"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Mobile Links */}
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-blue-400 transition"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-blue-400 transition"
            >
              About
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-full text-white font-semibold shadow-md transition"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
              >
                Get Started
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
