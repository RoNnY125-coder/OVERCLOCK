'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import AvatarIcon from '@/components/ui/AvatarIcon';

export default function DashboardPage() {
  const {
    level,
    xp,
    maxXp,
    streakDays,
    totalBalance,
    totalIncome,
    totalExpenses,
    netSavings,
    selectedCharacter,
    transactions,
    quests,
    setAddTransactionOpen,
    userId,
    athenaInsight,
    isAthenaInsightLoading,
    loadAthenaInsight,
    isSidebarCollapsed
  } = useAppStore();

  useEffect(() => {
    if (userId && !athenaInsight && !isAthenaInsightLoading) {
      void loadAthenaInsight();
    }
  }, [athenaInsight, isAthenaInsightLoading, loadAthenaInsight, userId]);

  return (
    <main className={`pt-20 lg:pt-8 pb-24 lg:pb-8 p-4 sm:p-8 max-w-7xl mx-auto min-h-screen transition-all duration-300 ${
      isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
    }`}>
      {/* Header / Level Status with Avatar */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b-[3px] border-black pb-6">
        <div>
          <h1 className="font-space text-3xl sm:text-5xl font-bold text-white uppercase tracking-tight mb-2">
            Dashboard
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#1a1a1a] border-[3px] border-black px-3 py-1.5 font-mono text-xs font-bold uppercase text-[#cb2957] inline-flex items-center gap-2 brutalist-shadow">
              <span className="material-symbols-outlined text-sm">local_fire_department</span>
              {streakDays} Day Streak
            </div>

            {/* Avatar Badge directly in dashboard header where Level is mentioned */}
            <div className="flex items-center gap-2 bg-[#1a1a1a] border-[3px] border-black px-3 py-1 brutalist-shadow">
              <AvatarIcon character={selectedCharacter} size="sm" />
              <span className="font-mono text-xs font-bold text-[#ffb2bd]">
                {selectedCharacter.name} • LVL {level}
              </span>
            </div>
          </div>
        </div>

        {/* Arcade XP Bar */}
        <div className="w-full md:w-80 bg-[#1a1a1a] border-[3px] border-black p-3 brutalist-shadow">
          <div className="flex justify-between items-end mb-1.5 font-mono text-xs uppercase">
            <span className="font-bold text-white flex items-center gap-2">
              <AvatarIcon character={selectedCharacter} size="sm" />
              LVL {level}
            </span>
            <span className="text-[#c6c6c6]">{xp}/{maxXp} XP</span>
          </div>
          <div className="health-bar-container">
            <div className="health-bar-fill" style={{ width: `${(xp / maxXp) * 100}%` }} />
          </div>
        </div>
      </header>

      {/* AI Intelligence Alert Banner */}
      <div className="mb-8 bg-[#1a1a1a] border-[3px] border-black p-5 brutalist-shadow flex gap-4 items-start border-l-[8px] border-l-[#ffb4ab]">
        <div className="bg-[#93000a] text-white p-1 border-[2px] border-black shrink-0 w-14 h-14 flex items-center justify-center">
          <Image
            src="/athena/athena.png"
            alt="Athena"
            width={48}
            height={48}
            className="object-contain [image-rendering:pixelated]"
            priority
          />
        </div>
        <div>
          <h3 className="font-mono text-xs font-bold text-[#ffb4ab] uppercase mb-1">
            Athena Insight
          </h3>
          <p className="text-sm text-[#e2e2e2] font-inter">
            {isAthenaInsightLoading
              ? 'Athena is reading your spend, behavior, and past experience...'
              : athenaInsight || 'Athena will share spend, behavior, and past-experience insights after your financial logs are ready.'}
          </p>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Card 1: Balance (8 cols) */}
        <section className="lg:col-span-8 bg-[#131313] border-[3px] border-black p-6 brutalist-shadow relative overflow-hidden">
          <div className="relative z-10">
            <span className="font-mono text-xs font-bold uppercase text-white bg-black px-3 py-1 inline-block border-[2px] border-black mb-3">
              Current Balance
            </span>
            <div className="font-space text-4xl sm:text-6xl font-bold text-white tracking-tighter my-2">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 text-[#77da9f] font-mono text-xs uppercase font-bold bg-[#007c4a]/30 px-3 py-1 inline-block border-[2px] border-[#007c4a]">
              <span className="material-symbols-outlined text-sm align-middle">trending_up</span>
              +2.4% vs last week
            </div>
          </div>

          {/* Histogram Chart */}
          <div className="mt-8 h-32 w-full border-[3px] border-black bg-[#1a1a1a] relative overflow-hidden flex items-end px-2 gap-2 pb-1">
            <div className="w-1/6 bg-[#cb2957]/30 border-t-[3px] border-[#cb2957] h-1/4" />
            <div className="w-1/6 bg-[#cb2957]/30 border-t-[3px] border-[#cb2957] h-2/4" />
            <div className="w-1/6 bg-[#cb2957]/30 border-t-[3px] border-[#cb2957] h-1/3" />
            <div className="w-1/6 bg-[#cb2957]/30 border-t-[3px] border-[#cb2957] h-3/4" />
            <div className="w-1/6 bg-[#cb2957]/30 border-t-[3px] border-[#cb2957] h-2/3" />
            <div className="w-1/6 bg-[#cb2957] border-[3px] border-black h-full shadow-[2px_2px_0px_0px_#000] z-10 relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold bg-black text-white px-1.5 border-[2px] border-black">
                NOW
              </div>
            </div>
          </div>
        </section>

        {/* Card 2: Cashflow (4 cols) */}
        <section className="lg:col-span-4 bg-[#131313] border-[3px] border-black p-6 brutalist-shadow flex flex-col justify-between">
          <div>
            <span className="font-mono text-xs font-bold uppercase text-white bg-black px-3 py-1 inline-block border-[2px] border-black mb-6">
              Cashflow
            </span>
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="font-mono text-xs font-bold uppercase text-[#77da9f] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">arrow_downward</span> IN
                </span>
                <span className="font-space text-2xl font-bold text-white">
                  ${totalIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="h-4 w-full border-[2px] border-black bg-[#1a1a1a]">
                <div className="h-full bg-[#77da9f]" style={{ width: `${Math.min(100, totalIncome ? (totalIncome / Math.max(totalIncome, totalExpenses)) * 100 : 0)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-mono text-xs font-bold uppercase text-[#ffb4ab] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">arrow_upward</span> OUT
                </span>
                <span className="font-space text-2xl font-bold text-white">
                  ${totalExpenses.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="h-4 w-full border-[2px] border-black bg-[#1a1a1a]">
                <div className="h-full bg-[#ffb4ab]" style={{ width: `${Math.min(100, totalExpenses ? (totalExpenses / Math.max(totalIncome, totalExpenses)) * 100 : 0)}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t-[3px] border-black border-dashed text-center">
            <span className="font-mono text-xs uppercase text-[#c6c6c6]">Net Balance: </span>
            <span className="font-mono font-bold text-[#77da9f] text-base">
              {netSavings >= 0 ? '+' : '-'}${Math.abs(netSavings).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </section>

        {/* Card 3: Active Goals (4 cols) */}
        <section className="lg:col-span-4 bg-[#131313] border-[3px] border-black p-6 brutalist-shadow flex flex-col justify-between">
          <div>
            <span className="font-mono text-xs font-bold uppercase text-white bg-black px-3 py-1 inline-block border-[2px] border-black mb-6">
              Active Goals
            </span>
            <div className="space-y-5">
              {quests.map((q) => {
                const pct = Math.round((q.currentAmount / q.targetAmount) * 100);
                return (
                  <div key={q.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-xs font-bold uppercase text-white">{q.title}</span>
                      <span className="font-mono text-xs text-[#c6c6c6]">{pct}%</span>
                    </div>
                    <div className="health-bar-container">
                      <div className="health-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href="/quests"
            className="w-full mt-6 bg-[#2a2a2a] text-[#e2e2e2] font-mono text-xs font-bold uppercase py-2.5 border-[2px] border-black text-center hover:bg-[#cb2957] hover:text-black transition-colors block"
          >
            View All Goals &rarr;
          </Link>
        </section>

        {/* Card 4: Recent Logs (8 cols) */}
        <section className="lg:col-span-8 bg-[#131313] border-[3px] border-black p-0 brutalist-shadow flex flex-col">
          <div className="p-4 border-b-[3px] border-black flex justify-between items-center bg-[#1a1a1a]">
            <span className="font-mono text-xs font-bold uppercase text-white bg-black px-3 py-1 inline-block border-[2px] border-black">
              Recent Logs
            </span>
            <Link href="/ledger" className="font-mono text-xs font-bold text-[#cb2957] hover:underline uppercase">
              See All &rarr;
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b-[3px] border-black bg-[#1a1a1a]">
                  <th className="p-3 font-mono text-xs uppercase text-[#c6c6c6]">Type</th>
                  <th className="p-3 font-mono text-xs uppercase text-[#c6c6c6]">Entity</th>
                  <th className="p-3 font-mono text-xs uppercase text-[#c6c6c6]">Category</th>
                  <th className="p-3 font-mono text-xs uppercase text-[#c6c6c6]">Date</th>
                  <th className="p-3 font-mono text-xs uppercase text-[#c6c6c6] text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="border-b-[2px] border-black/50 hover:bg-[#1a1a1a] transition-colors">
                    <td className="p-3">
                      <div className={`w-8 h-8 border-[2px] border-black flex items-center justify-center ${
                        tx.type === 'credit' ? 'bg-[#77da9f]/20 text-[#77da9f]' : 'bg-[#cb2957]/20 text-[#cb2957]'
                      }`}>
                        <span className="material-symbols-outlined text-sm">{tx.icon}</span>
                      </div>
                    </td>
                    <td className="p-3 font-space font-bold text-white text-sm">{tx.entity}</td>
                    <td className="p-3">
                      <span className="font-mono text-[10px] uppercase border-[2px] border-black px-2 py-0.5 bg-[#2a2a2a] text-white">
                        {tx.category}
                      </span>
                    </td>
                    <td className="p-3 text-[#c6c6c6] font-mono text-xs">{tx.date}</td>
                    <td className={`p-3 text-right font-mono font-bold text-sm ${
                      tx.type === 'credit' ? 'text-[#77da9f]' : 'text-[#ffb4ab]'
                    }`}>
                      {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setAddTransactionOpen(true)}
        className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 w-14 h-14 bg-[#cb2957] border-[3px] border-black text-white flex items-center justify-center brutalist-shadow z-50 hover:bg-[#ffb2bd] hover:text-black transition-colors"
        title="Add Transaction"
      >
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </button>
    </main>
  );
}

