// hooks/useAuthGuard.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AuthContext } from '@/components/AuthProvider';

export default function useAuthGuard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // If not logged in, redirect to login
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
}
