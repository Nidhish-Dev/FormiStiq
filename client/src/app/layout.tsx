import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FormiStiq - Intelligent Forms. Seamless Results.',
  description: 'Create and manage intelligent forms with ease.',
  icons: {
    icon: '/logo.svg', // ✅ Favicon SVG from public folder
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="mt-12 px-6 py-6 bg-gradient-to-t from-black via-neutral-900 to-black/70 backdrop-blur-lg border-t border-neutral-800">
            <div className="max-w-6xl mx-auto text-center text-sm sm:text-base text-gray-400 tracking-tight">
              &copy; {new Date().getFullYear()} FormiStiq. Developed by{' '}
              <span className="text-white font-medium hover:text-blue-400 transition duration-200">
                Nidhish Rathore
              </span>
              .
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
