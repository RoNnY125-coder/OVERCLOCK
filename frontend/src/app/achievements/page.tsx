'use client';

import { useAppStore } from '@/store/useAppStore';
import AvatarIcon from '@/components/ui/AvatarIcon';

const rarityClasses: Record<string, string> = {
  common: 'text-[#c6c6c6] border-[#c6c6c6] bg-[#353535]',
  uncommon: 'text-[#77da9f] border-[#77da9f] bg-[#007c4a]/30',
  rare: 'text-[#ffb2bd] border-[#ffb2bd] bg-[#cb2957]/25',
  epic: 'text-[#b8a7ff] border-[#b8a7ff] bg-[#4f378b]/35',
  legendary: 'text-[#f7b731] border-[#f7b731] bg-[#8a5a00]/35',
};

const normalizeRarity = (rarity: string) => rarity.toLowerCase();

export default function AchievementsPage() {
  const { level, xp, maxXp, selectedCharacter, achievements, isSidebarCollapsed } = useAppStore();
  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;
  const totalCount = achievements.length;
  const xpProgress = maxXp > 0 ? Math.min(100, Math.max(0, (xp / maxXp) * 100)) : 0;
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.unlocked === b.unlocked) return a.id - b.id;
    return a.unlocked ? -1 : 1;
  });

  return (
    <main className={`pt-20 lg:pt-8 pb-24 lg:pb-8 p-4 sm:p-8 max-w-7xl mx-auto min-h-screen transition-all duration-300 ${
      isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
    }`}>
      <div className="bg-[#1a1a1a] border-[3px] border-black p-6 sm:p-8 brutalist-shadow mb-10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-black pb-6 mb-6">
          <div>
            <h1 className="font-space text-3xl sm:text-5xl font-bold text-white uppercase tracking-tighter">
              Combat Log
            </h1>
            <p className="font-mono text-xs text-[#c6c6c6]">RECORD OF FINANCIAL DISCIPLINE &amp; TROPHIES</p>
          </div>

          <div className="flex items-center gap-3 bg-[#131313] border-[3px] border-black px-4 py-2 brutalist-shadow">
            <AvatarIcon character={selectedCharacter} size="md" />
            <div>
              <div className="font-space font-bold text-white text-sm uppercase">LEVEL {level} PROFILE</div>
              <div className="font-mono text-[10px] text-[#77da9f] font-bold">
                {unlockedCount}/{totalCount} TROPHIES
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#131313] border-[3px] border-black p-5 brutalist-shadow">
            <div className="font-mono text-xs text-[#c6c6c6] mb-1">Achievements Unlocked</div>
            <div className="font-space text-4xl font-bold text-[#cb2957]">
              {unlockedCount}/{totalCount}
            </div>
            <div className="font-mono text-xs text-[#77da9f] mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">military_tech</span>
              {totalCount ? `${Math.round((unlockedCount / totalCount) * 100)}% trophy completion` : 'No achievements available yet'}
            </div>
          </div>

          <div className="bg-[#131313] border-[3px] border-black p-5 brutalist-shadow">
            <div className="font-mono text-xs text-[#c6c6c6] mb-1">Current XP</div>
            <div className="font-space text-4xl font-bold text-[#ffb2bd]">
              {xp.toLocaleString('en-US')} / {maxXp.toLocaleString('en-US')} XP
            </div>
            <div className="health-bar-container mt-3">
              <div className="health-bar-fill" style={{ width: `${xpProgress}%` }} />
            </div>
            <div className="font-mono text-[10px] text-[#c6c6c6] mt-1 text-right">
              {Math.max(0, maxXp - xp).toLocaleString('en-US')} XP to Level {level + 1}
            </div>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-space text-2xl font-bold text-white uppercase border-b-[3px] border-[#cb2957] pb-1">
            Achievements
          </h2>
          <span className="px-2.5 py-1 bg-[#353535] border-[2px] border-black font-mono text-xs text-white font-bold">
            {unlockedCount}/{totalCount}
          </span>
        </div>

        {sortedAchievements.length === 0 ? (
          <div className="bg-[#1a1a1a] border-[3px] border-black p-6 brutalist-shadow">
            <h3 className="font-space text-lg font-bold text-white mb-1 uppercase">No Achievements Found</h3>
            <p className="font-mono text-xs text-[#c6c6c6]">
              Achievement definitions have not been seeded in the backend yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAchievements.map((achievement) => {
              const rarity = normalizeRarity(achievement.rarity);
              const rarityClass = rarityClasses[rarity] || rarityClasses.common;
              const unlockedAt = achievement.unlocked_at
                ? new Date(achievement.unlocked_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : null;

              return (
                <div
                  key={achievement.id}
                  className={`border-[3px] border-black p-6 brutalist-shadow transition-all ${
                    achievement.unlocked
                      ? 'bg-[#1a1a1a] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                      : 'bg-[#131313] opacity-75 grayscale hover:grayscale-0'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`w-14 h-14 border-[3px] border-black flex items-center justify-center brutalist-shadow ${
                        achievement.unlocked ? 'bg-[#cb2957]' : 'bg-[#353535]'
                      }`}
                    >
                      <span className="text-3xl leading-none">{achievement.icon}</span>
                    </div>
                    <span
                      className={`px-2.5 py-1 border-[2px] font-mono text-[10px] font-bold ${
                        achievement.unlocked
                          ? 'bg-[#007c4a]/30 text-[#77da9f] border-[#77da9f]'
                          : 'bg-[#353535] text-[#c6c6c6] border-black'
                      }`}
                    >
                      {achievement.unlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>

                  <h3 className={`font-space text-lg font-bold mb-1 ${achievement.unlocked ? 'text-white' : 'text-[#c6c6c6]'}`}>
                    {achievement.name}
                  </h3>
                  <p className="font-inter text-xs text-[#c6c6c6] mb-4">
                    {achievement.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2.5 py-1 border-[2px] font-mono text-[10px] font-bold uppercase ${rarityClass}`}>
                      {achievement.rarity}
                    </span>
                    <span className="px-2.5 py-1 bg-[#2a2a2a] text-[#ffb2bd] border-[2px] border-black font-mono text-[10px] font-bold">
                      +{achievement.xp_reward} XP
                    </span>
                    <span className="px-2.5 py-1 bg-[#2a2a2a] text-[#f7b731] border-[2px] border-black font-mono text-[10px] font-bold">
                      +{achievement.gold_reward} GOLD
                    </span>
                  </div>

                  <div className={`font-mono text-[11px] mb-1 flex justify-between font-bold ${
                    achievement.unlocked ? 'text-white' : 'text-[#c6c6c6]'
                  }`}>
                    <span>{achievement.unlocked ? 'Unlocked' : 'Progress'}</span>
                    <span>{achievement.unlocked ? unlockedAt || 'Complete' : '0%'}</span>
                  </div>
                  <div className="health-bar-container">
                    <div
                      className={achievement.unlocked ? 'health-bar-fill-green' : 'health-bar-fill'}
                      style={{ width: achievement.unlocked ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
