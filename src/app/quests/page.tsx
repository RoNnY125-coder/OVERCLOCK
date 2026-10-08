'use client';

import { useAppStore } from '@/store/useAppStore';
import AvatarIcon from '@/components/ui/AvatarIcon';

export default function QuestsPage() {
  const { level, selectedCharacter, quests, contributeQuest, totalBalance, isSidebarCollapsed, setAddGoalOpen } = useAppStore();

  return (
    <main className={`pt-20 lg:pt-8 pb-24 lg:pb-8 p-4 sm:p-8 max-w-7xl mx-auto min-h-screen transition-all duration-300 ${
      isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
    }`}>
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4 border-b-[3px] border-black pb-6">
        <div>
          <h1 className="font-space text-3xl sm:text-5xl font-bold text-white uppercase tracking-tighter mb-1">
            Savings Goals
          </h1>
          <p className="font-mono text-xs sm:text-sm text-[#c6c6c6]">
            Add money to goals from your available balance
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Avatar + Level Badge */}
          <div className="flex items-center gap-2 bg-[#1a1a1a] border-[3px] border-black px-3 py-1.5 brutalist-shadow">
            <AvatarIcon character={selectedCharacter} size="sm" />
            <span className="font-mono text-xs font-bold text-[#ffb2bd]">
              LVL {level}
            </span>
          </div>

          <button
            onClick={() => setAddGoalOpen(true)}
            className="bg-[#cb2957] text-white border-[3px] border-black px-5 py-2.5 font-mono text-xs font-bold uppercase brutalist-shadow flex items-center gap-2 whitespace-nowrap hover:bg-[#ffb2bd] hover:text-black transition-colors"
          >
            <span className="material-symbols-outlined text-sm font-bold">add</span>
            NEW GOAL
          </button>
        </div>
      </header>

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {quests.map((quest) => {
          const pct = Math.round((quest.currentAmount / quest.targetAmount) * 100);
          const canContribute = totalBalance > 0 && quest.status !== 'COMPLETED';
          return (
            <div
              key={quest.id}
              className="bg-[#1a1a1a] border-[3px] border-black p-6 flex flex-col relative brutalist-shadow"
            >
              {/* Status Badge */}
              <div
                className={`absolute -top-3 -right-3 border-[2px] border-black px-3 py-1 font-mono text-[10px] font-bold shadow-[2px_2px_0px_0px_#000] ${
                  quest.status === 'NEAR COMPLETION'
                    ? 'bg-[#cb2957] text-black rotate-1'
                    : quest.status === 'COMPLETED'
                    ? 'bg-[#77da9f] text-black'
                    : 'bg-[#77da9f] text-black -rotate-1'
                }`}
              >
                {quest.status}
              </div>

              <div className="mb-4">
                <h2 className="font-space text-2xl font-bold text-white mb-1">{quest.title}</h2>
                <p className="font-mono text-[11px] text-[#e1bec2] uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">timer</span> TARGET DATE: {quest.estCompletion}
                </p>
              </div>

              {/* Quest Image */}
              <div className="w-full h-36 border-[2px] border-black mb-6 relative overflow-hidden bg-[#131313]">
                <img
                  src={quest.imageUrl}
                  alt={quest.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex justify-between items-end font-mono text-xs">
                  <div>
                    <span className="text-[#c6c6c6] block text-[10px]">SAVED SO FAR</span>
                    <span className="text-[#77da9f] font-bold text-base">
                      ${quest.currentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#c6c6c6] block text-[10px]">TARGET</span>
                    <span className="text-white font-bold text-base">
                      ${quest.targetAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between font-mono text-[11px] mb-1 text-[#ffb2bd]">
                    <span>PROGRESS</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="health-bar-container">
                    <div className="health-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <button
                  onClick={() => contributeQuest(quest.id, 100)}
                  disabled={!canContribute}
                  className="w-full bg-[#cb2957] text-white border-[3px] border-black py-3 font-mono text-xs font-bold uppercase brutalist-shadow flex justify-center items-center gap-2 hover:bg-[#ffb2bd] hover:text-black transition-colors mt-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">monetization_on</span>
                  {canContribute ? 'ADD $100 FROM BALANCE' : 'NO AVAILABLE BALANCE'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed / Archived Quests Section */}
      <section className="mt-12">
        <h3 className="font-space text-2xl font-bold text-[#353535] uppercase border-b-2 border-[#353535] pb-2 mb-6">
          Completed Goals
        </h3>
        <div className="space-y-3 opacity-60 grayscale">
          <div className="flex items-center justify-between p-4 bg-[#131313] border-[2px] border-[#353535]">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#353535]">check_circle</span>
              <span className="font-mono text-sm text-[#e2e2e2] line-through">New Custom PC Setup</span>
            </div>
            <span className="font-mono text-xs text-[#353535] font-bold">COMPLETED JAN 2024</span>
          </div>
        </div>
      </section>
    </main>
  );
}
