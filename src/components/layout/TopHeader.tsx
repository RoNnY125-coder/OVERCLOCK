'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import AvatarIcon from '@/components/ui/AvatarIcon';

export default function TopHeader() {
  const pathname = usePathname();
  const { level, selectedCharacter } = useAppStore();

  // Hide top header on Intro, Login, and Character Select.
  if (pathname === '/' || pathname === '/login' || pathname === '/character-select') {
    return null;
  }

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-[#131313] border-b-[3px] border-black lg:hidden">
      <Link href="/dashboard" className="font-space text-xl font-bold text-[#cb2957] tracking-tight uppercase">
        OVERCLOCK
      </Link>

      <div className="flex items-center gap-3">
        {/* Avatar + Level Badge */}
        <Link href="/profile" className="flex items-center gap-2 bg-[#1a1a1a] border-[2px] border-black p-1 pr-2 shadow-[2px_2px_0px_0px_#000]">
          <AvatarIcon character={selectedCharacter} size="sm" />
          <span className="font-mono text-xs font-bold text-[#ffb2bd]">Lvl {level}</span>
        </Link>

        <button className="hover:bg-[#353535] p-1.5 border-[2px] border-black bg-[#1a1a1a] text-[#ffb2bd] shadow-[2px_2px_0px_0px_#000]">
          <span className="material-symbols-outlined text-lg">bolt</span>
        </button>
      </div>
    </header>
  );
}
