'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mobileTabs = [
  { label: 'Home', href: '/dashboard', icon: 'dashboard' },
  { label: 'Ledger', href: '/ledger', icon: 'receipt_long' },
  { label: 'Vault', href: '/quests', icon: 'account_balance_wallet' },
  { label: 'Stats', href: '/analytics', icon: 'analytics' },
  { label: 'Profile', href: '/profile', icon: 'person' },
];

export default function MobileNav() {
  const pathname = usePathname();

  // Hide on Intro, Login, and Character Select pages.
  if (pathname === '/' || pathname === '/login' || pathname === '/character-select') return null;

  return (
    <nav className="lg:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-2 bg-[#131313] border-t-[3px] border-black h-16">
      {mobileTabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center p-1 flex-1 max-w-[72px] mx-0.5 border-[2px] transition-transform ${
              isActive
                ? 'bg-[#cb2957] text-white border-black shadow-[2px_2px_0px_0px_#000]'
                : 'text-[#e1bec2] border-transparent hover:bg-[#2a2a2a]'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {tab.icon}
            </span>
            <span className="font-mono text-[10px] font-bold uppercase mt-0.5">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
