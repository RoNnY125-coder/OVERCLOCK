'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

const PUBLIC_PATHS = ['/', '/login', '/character-select'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userId, loadBackendData } = useAppStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const storedIdStr = typeof window !== 'undefined' ? localStorage.getItem('nyx_user_id') : null;
      const isPublic = PUBLIC_PATHS.includes(pathname);

      if (!storedIdStr && !userId) {
        setChecking(false);
        if (!isPublic) {
          router.push('/login');
        }
        return;
      }

      try {
        if (!userId) {
          await loadBackendData();
        }
      } catch (err) {
        console.warn('Backend user check failed or user not found:', err);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('nyx_user_id');
        }
        if (!isPublic) {
          router.push('/login');
        }
      } finally {
        setChecking(false);
      }
    }

    checkAuth();
  }, [pathname, userId, loadBackendData, router]);

  if (checking && !PUBLIC_PATHS.includes(pathname)) {
    return (
      <div className="min-h-screen bg-[#131313] text-[#e2e2e2] flex flex-col items-center justify-center font-mono">
        <div className="border-[3px] border-black bg-[#1a1a1a] p-8 brutalist-shadow text-center max-w-sm">
          <div className="w-8 h-8 border-4 border-[#cb2957] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-sm font-bold text-[#cb2957] uppercase tracking-wider mb-2">
            CONNECTING TO NEURAL LINK...
          </div>
          <div className="text-xs text-[#c6c6c6]">Verifying Operative Identity</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
