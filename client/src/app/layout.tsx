import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FormiStiq - Intelligent Forms. Seamless Results.',
  description: 'Create and manage intelligent forms with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}