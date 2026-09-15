'use client';

import { useAppStore } from '@/store/useAppStore';
import AvatarIcon from '@/components/ui/AvatarIcon';

export default function BudgetsPage() {
  const { level, selectedCharacter, budgets, isSidebarCollapsed, setAddBudgetOpen } = useAppStore();
  const totalRemaining = budgets.reduce((sum, budget) => sum + Math.max(0, budget.limit - budget.spent), 0);

  return (
    <main className={`pt-20 lg:pt-8 pb-24 lg:pb-8 p-4 sm:p-8 max-w-7xl mx-auto min-h-screen transition-all duration-300 ${
      isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
    }`}>
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-[3px] border-black pb-6">
        <div>
          <h1 className="font-space text-3xl sm:text-5xl font-bold text-white mb-1 uppercase tracking-tighter">
            Budget Overview
          </h1>
          <p className="font-mono text-sm text-[#c6c6c6]">Monthly spending limits and remaining funds</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Avatar + Level Badge */}
          <div className="flex items-center gap-2 bg-[#1a1a1a] border-[3px] border-black px-3 py-2 brutalist-shadow">
            <AvatarIcon character={selectedCharacter} size="sm" />
            <span className="font-mono text-xs font-bold text-[#ffb2bd]">
              LVL {level}
            </span>
          </div>

          <div className="border-[3px] border-black bg-[#1a1a1a] px-4 py-1.5 brutalist-shadow">
            <div className="font-mono text-[10px] text-[#77da9f] mb-0.5 uppercase tracking-widest font-bold">
              Total Remaining
            </div>
            <div className="font-space text-xl font-bold text-white">
              ${totalRemaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <button
            onClick={() => setAddBudgetOpen(true)}
            className="bg-[#cb2957] text-white border-[3px] border-black px-4 py-2.5 font-mono text-xs font-bold uppercase brutalist-shadow flex items-center gap-2 whitespace-nowrap hover:bg-[#ffb2bd] hover:text-black transition-colors"
          >
            <span className="material-symbols-outlined text-sm font-bold">add</span>
            NEW BUDGET
          </button>
        </div>
      </header>

      {/* Budget Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((b) => {
          const pct = Math.round((b.spent / b.limit) * 100);
          const isCritical = b.status === 'warning' || pct >= 95;
          return (
            <article
              key={b.id}
              className={`bg-[#1a1a1a] border-[3px] border-black p-6 brutalist-shadow relative ${
                isCritical ? 'glow-warning' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 border-[2px] border-black text-white ${
                      isCritical ? 'bg-[#93000a]' : 'bg-[#cb2957]'
                    }`}
                  >
                    <span className="material-symbols-outlined">{b.icon}</span>
                  </div>
                  <h2
                    className={`font-space text-xl font-bold uppercase tracking-tight ${
                      isCritical ? 'text-[#ffb4ab]' : 'text-white'
                    }`}
                  >
                    {b.category}
                  </h2>
                </div>

                <button className="text-[#c6c6c6] hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
              </div>

              <div className="mb-2 flex justify-between font-mono text-xs font-bold">
                <span className={isCritical ? 'text-[#ffb4ab]' : 'text-white'}>
                  ${b.spent} Spent
                </span>
                <span className="text-[#c6c6c6]">${b.limit} Limit</span>
              </div>

              <div className="health-bar-container">
                <div
                  className={isCritical ? 'health-bar-fill' : 'health-bar-fill-green'}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div
                className={`mt-2 text-right font-mono text-[11px] font-bold uppercase ${
                  isCritical ? 'text-[#ffb4ab] animate-pulse' : 'text-[#77da9f]'
                }`}
              >
                {isCritical ? 'Critical Limit Reached' : `${pct}% Utilized`}
              </div>
            </article>
          );
        })}

        {/* Add Budget Dashed Card */}
        <button
          onClick={() => setAddBudgetOpen(true)}
          className="bg-[#1b1b1b] border-[3px] border-dashed border-[#594043] p-6 hover:bg-[#2a2a2a] transition-colors flex flex-col items-center justify-center min-h-[200px] group cursor-pointer w-full text-left"
        >
          <div className="bg-[#131313] border-[2px] border-black p-3 rounded-full mb-3 group-hover:bg-[#cb2957] group-hover:text-black transition-colors text-[#e1bec2]">
            <span className="material-symbols-outlined text-2xl font-bold">add</span>
          </div>
          <span className="font-space text-lg font-bold uppercase tracking-widest text-[#e1bec2] group-hover:text-white transition-colors">
            Add Budget
          </span>
        </button>
      </div>
    </main>
  );
}
