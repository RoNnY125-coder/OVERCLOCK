'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import AvatarIcon from '@/components/ui/AvatarIcon';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Transactions', href: '/ledger', icon: 'receipt_long' },
  { label: 'Budgets', href: '/budgets', icon: 'account_balance_wallet' },
  { label: 'Goals', href: '/quests', icon: 'emoji_events' },
  { label: 'Analytics', href: '/analytics', icon: 'analytics' },
  { label: 'Achievements', href: '/achievements', icon: 'workspace_premium' },
  { label: 'Profile', href: '/profile', icon: 'person' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const {
    level,
    xp,
    maxXp,
    selectedCharacter,
    setAddTransactionOpen,
    isSidebarCollapsed,
    toggleSidebar,
    logout
  } = useAppStore();

  // Hide left bar on Intro, Login, and Character Select.
  if (pathname === '/' || pathname === '/login' || pathname === '/character-select') {
    return null;
  }

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen fixed left-0 top-0 p-4 bg-[#131313] border-r-[3px] border-black z-40 transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand & Collapse Toggle */}
      <div className={`flex items-center mb-6 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isSidebarCollapsed && (
          <Link
            href="/dashboard"
            className="font-space text-xl font-bold text-[#cb2957] tracking-tighter uppercase block hover:opacity-90 transition-opacity truncate"
          >
            OVERCLOCK
          </Link>
        )}

        <button
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-1.5 bg-[#1a1a1a] border-[2px] border-black text-[#ffb2bd] hover:bg-[#cb2957] hover:text-black transition-colors shadow-[2px_2px_0px_0px_#000] shrink-0"
        >
          <span className="material-symbols-outlined text-sm font-bold">
            {isSidebarCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      {/* Level + Avatar Badge */}
      <Link
        href="/profile"
        className={`flex items-center gap-3 mb-6 p-2.5 border-[3px] border-black bg-[#1a1a1a] shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform ${
          isSidebarCollapsed ? 'justify-center p-2' : ''
        }`}
      >
        <AvatarIcon character={selectedCharacter} size="md" />

        {!isSidebarCollapsed && (
          <div className="min-w-0">
            <div className="font-space font-bold uppercase tracking-tight text-[#eeeeee] text-xs truncate">
              Level {level}
            </div>
            <div className="font-mono text-[10px] text-[#c6c6c6]">
              {xp}/{maxXp} XP
            </div>
          </div>
        )}
      </Link>

      {/* Add Transaction Button */}
      <button
        onClick={() => setAddTransactionOpen(true)}
        title="Add Transaction"
        className={`w-full bg-[#cb2957] text-white font-mono text-xs font-bold uppercase py-3 border-[3px] border-black brutalist-shadow mb-6 flex items-center justify-center gap-2 hover:bg-[#ffb2bd] hover:text-black transition-colors ${
          isSidebarCollapsed ? 'px-0' : 'px-4'
        }`}
      >
        <span className="material-symbols-outlined font-bold text-base">add</span>
        {!isSidebarCollapsed && <span>Add Entry</span>}
      </button>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center gap-3 p-3 font-mono text-xs font-bold uppercase border-[3px] transition-all ${
                isSidebarCollapsed ? 'justify-center p-2.5' : ''
              } ${
                isActive
                  ? 'text-white bg-[#cb2957] border-black shadow-[4px_4px_0px_0px_#000]'
                  : 'text-[#e2e2e2] border-transparent hover:bg-[#353535] hover:border-black'
              }`}
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t-[3px] border-black space-y-1.5 mt-auto">
        <Link
          href="/settings"
          title="Settings"
          className={`flex items-center gap-3 p-3 font-mono text-xs font-bold uppercase border-[3px] transition-all ${
            isSidebarCollapsed ? 'justify-center p-2.5' : ''
          } ${
            pathname === '/settings'
              ? 'text-white bg-[#cb2957] border-black shadow-[4px_4px_0px_0px_#000]'
              : 'text-[#e2e2e2] border-transparent hover:bg-[#353535] hover:border-black'
          }`}
        >
          <span className="material-symbols-outlined text-lg">settings</span>
          {!isSidebarCollapsed && <span>Settings</span>}
        </Link>

        <Link
          href="/login"
          onClick={logout}
          title="Log Out"
          className={`flex items-center gap-3 p-3 font-mono text-xs font-bold uppercase text-[#ffb4ab] border-[3px] border-transparent hover:bg-[#353535] hover:border-black transition-all ${
            isSidebarCollapsed ? 'justify-center p-2.5' : ''
          }`}
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          {!isSidebarCollapsed && <span>Log Out</span>}
        </Link>
      </div>
    </aside>
  );
}
