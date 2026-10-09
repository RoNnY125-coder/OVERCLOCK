'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, accentColor } = useAppStore();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    try {
      const found = await loginUser(username);
      if (!found) {
        setError('No profile found with that username.');
        return;
      }
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    localStorage.setItem('nyx_pending_username', username.trim());
    router.push('/character-select');
  };

  return (
    <main className="min-h-screen bg-[#131313] text-[#e2e2e2] flex items-center justify-center p-4">
      <section className="w-full max-w-md bg-[#1a1a1a] border-[3px] border-black brutalist-shadow p-6">
        <Link href="/" className="font-mono text-xs text-[#c6c6c6] hover:text-white uppercase">
          Back
        </Link>

        <h1 className="font-space text-4xl font-bold text-white uppercase mt-4 mb-2">
          Sign In
        </h1>
        <p className="font-mono text-xs text-[#c6c6c6] mb-6">
          Continue with your saved finance profile or create a new one.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-[#ffb2bd] uppercase mb-1">Username</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="e.g. raunak"
              className="w-full bg-[#131313] border-[3px] border-black p-3 font-mono text-sm text-white focus:outline-none"
              style={{ borderColor: username ? accentColor : undefined }}
            />
          </div>

          {error && (
            <div className="bg-[#93000a] border-[2px] border-black p-3 font-mono text-xs text-white">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="w-full text-black border-[3px] border-black py-3 font-space text-lg font-bold uppercase brutalist-shadow disabled:opacity-50"
            style={{ backgroundColor: accentColor }}
          >
            {isLoading ? 'Checking...' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={handleCreate}
            disabled={!username.trim()}
            className="w-full bg-[#2a2a2a] text-white border-[3px] border-black py-3 font-mono text-xs font-bold uppercase hover:bg-[#353535] disabled:opacity-50"
          >
            Create New Profile
          </button>
        </form>
      </section>
    </main>
  );
}
