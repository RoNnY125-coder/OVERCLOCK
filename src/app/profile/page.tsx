'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import AvatarIcon from '@/components/ui/AvatarIcon';

const formatTimelineDate = (value: string | null) => {
  if (!value) return 'CURRENT';

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return 'CURRENT';

  const diffDays = Math.floor((Date.now() - timestamp) / 86400000);
  if (diffDays <= 0) return 'TODAY';
  if (diffDays === 1) return 'YESTERDAY';
  return `${diffDays} DAYS AGO`;
};

type TimelineItem = {
  icon: string;
  tone: string;
  title: string;
  description: string;
  when: string;
};

const isTimelineItem = (item: TimelineItem | null): item is TimelineItem => item !== null;

export default function ProfilePage() {
  const {
    agentName,
    level,
    xp,
    maxXp,
    streakDays,
    selectedCharacter,
    transactions,
    quests,
    achievements,
    linkedTools,
    addLinkedTool,
    removeLinkedTool,
    isSidebarCollapsed
  } = useAppStore();
  const [toolName, setToolName] = useState('');
  const [toolEffect, setToolEffect] = useState('');
  const [toolIcon, setToolIcon] = useState('extension');

  const timelineItems = useMemo(() => {
    const unlockedAchievements = achievements
      .filter((achievement) => achievement.unlocked)
      .sort((a, b) => new Date(b.unlocked_at || 0).getTime() - new Date(a.unlocked_at || 0).getTime())
      .slice(0, 2)
      .map((achievement) => ({
        icon: achievement.icon || 'emoji_events',
        tone: 'text-[#77da9f]',
        title: `${achievement.name.toUpperCase()} UNLOCKED`,
        description: achievement.description,
        when: formatTimelineDate(achievement.unlocked_at),
      }));

    const leadingQuest = quests
      .filter((quest) => quest.targetAmount > 0)
      .map((quest) => ({
        quest,
        progress: Math.min(100, Math.round((quest.currentAmount / quest.targetAmount) * 100)),
      }))
      .sort((a, b) => b.progress - a.progress)[0];

    const items = [
      {
        icon: 'military_tech',
        tone: 'text-[#cb2957]',
        title: `LEVEL ${level} PROFILE ACTIVE`,
        description: `${xp} of ${maxXp} XP earned toward the next level`,
        when: 'CURRENT',
      },
      streakDays > 0
        ? {
            icon: 'local_fire_department',
            tone: 'text-[#cb2957]',
            title: `${streakDays} DAY STREAK RUNNING`,
            description: 'Progress updated from your active tracking streak',
            when: 'CURRENT',
          }
        : null,
      leadingQuest
        ? {
            icon: 'flag',
            tone: leadingQuest.progress >= 100 ? 'text-[#77da9f]' : 'text-[#ffb2bd]',
            title: `${leadingQuest.quest.title.toUpperCase()} ${leadingQuest.progress}% COMPLETE`,
            description: `$${leadingQuest.quest.currentAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })} of $${leadingQuest.quest.targetAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })} reached`,
            when: leadingQuest.quest.estCompletion,
          }
        : null,
      transactions[0]
        ? {
            icon: transactions[0].icon,
            tone: transactions[0].type === 'credit' ? 'text-[#77da9f]' : 'text-[#ffb2bd]',
            title: `${transactions[0].type === 'credit' ? 'INCOME' : 'EXPENSE'} LOGGED`,
            description: `${transactions[0].entity} added under ${transactions[0].category}`,
            when: transactions[0].date.toUpperCase(),
          }
        : null,
      ...unlockedAchievements,
    ].filter(isTimelineItem);

    return items.slice(0, 5);
  }, [achievements, level, maxXp, quests, streakDays, transactions, xp]);

  const handleAddTool = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!toolName.trim() || !toolEffect.trim()) return;

    addLinkedTool({
      name: toolName,
      effect: toolEffect,
      icon: toolIcon,
    });
    setToolName('');
    setToolEffect('');
    setToolIcon('extension');
  };

  return (
    <main className={`pt-20 lg:pt-8 pb-24 lg:pb-8 p-4 sm:p-8 max-w-7xl mx-auto min-h-screen transition-all duration-300 ${
      isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
    }`}>
      {/* Header with Avatar & Level */}
      <header className="mb-8 border-b-[3px] border-black pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-space text-3xl sm:text-5xl font-bold text-white uppercase tracking-tighter mb-2">
            Operative Profile
          </h1>
          <p className="font-mono text-xs text-[#c6c6c6]">Your finance profile and progress summary</p>
        </div>

        {/* Avatar + Level Badge */}
        <div className="flex items-center gap-3 bg-[#1a1a1a] border-[3px] border-black p-3 brutalist-shadow">
          <AvatarIcon character={selectedCharacter} size="md" />
          <div>
            <div className="font-space font-bold text-white text-base uppercase">{agentName}</div>
            <div className="font-mono text-xs text-[#cb2957] font-bold">{selectedCharacter.classTitle} • LVL {level}</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#1a1a1a] border-[3px] border-black p-6 brutalist-shadow mb-8 flex flex-col md:flex-row gap-6 items-center">
        <div className="shrink-0 relative">
          <AvatarIcon character={selectedCharacter} size="xl" />
          <div className="absolute bottom-0 right-0 bg-[#cb2957] text-black font-mono text-[10px] font-bold px-1.5 py-0.5 border-t-[2px] border-l-[2px] border-black">
            LVL {level}
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h2 className="font-space text-2xl font-bold text-white uppercase">{agentName}</h2>
            <span className="font-mono text-xs font-bold uppercase bg-[#cb2957] text-black px-3 py-1 border-[2px] border-black">
              {selectedCharacter.classTitle}
            </span>
          </div>

          <p className="font-mono text-xs text-[#c6c6c6] mb-4">
            Focus: savings consistency, budget tracking, and goal progress.
          </p>

          <div>
            <div className="flex justify-between font-mono text-xs mb-1">
              <span className="text-white font-bold">XP PROGRESSION</span>
              <span className="text-[#ffb2bd] font-bold">{xp} / {maxXp} XP</span>
            </div>
            <div className="health-bar-container">
              <div className="health-bar-fill" style={{ width: `${(xp / maxXp) * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* RPG Combat Stats & Active Gear */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Attributes (6 cols) */}
        <section className="lg:col-span-6 bg-[#131313] border-[3px] border-black p-6 brutalist-shadow">
          <h3 className="font-space text-xl font-bold text-white uppercase border-b-[3px] border-black pb-2 mb-6">
            RPG Attributes
          </h3>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-[#ffb2bd] font-bold">STR — Savings Rate</span>
                <span className="text-white font-bold">{selectedCharacter.str}%</span>
              </div>
              <div className="health-bar-container">
                <div className="health-bar-fill" style={{ width: `${selectedCharacter.str}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-[#77da9f] font-bold">WIS — Budget Adherence</span>
                <span className="text-white font-bold">{selectedCharacter.wis}/100</span>
              </div>
              <div className="health-bar-container">
                <div className="health-bar-fill-green" style={{ width: `${selectedCharacter.wis}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-[#ffb2bd] font-bold">DEX — Liquidity Ratio</span>
                <span className="text-white font-bold">{selectedCharacter.dex}%</span>
              </div>
              <div className="health-bar-container">
                <div className="health-bar-fill" style={{ width: `${selectedCharacter.dex}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-[#77da9f] font-bold">CON — Debt-to-Income</span>
                <span className="text-white font-bold">{selectedCharacter.con}%</span>
              </div>
              <div className="health-bar-container">
                <div className="health-bar-fill-green" style={{ width: `${selectedCharacter.con}%` }} />
              </div>
            </div>
          </div>
        </section>

        {/* Active Gear (6 cols) */}
        <section className="lg:col-span-6 bg-[#131313] border-[3px] border-black p-6 brutalist-shadow">
          <h3 className="font-space text-xl font-bold text-white uppercase border-b-[3px] border-black pb-2 mb-6">
            Linked Tools
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {linkedTools.map((tool) => (
              <div key={tool.id} className="bg-[#1a1a1a] border-[3px] border-black p-4 brutalist-shadow text-center relative">
                <button
                  type="button"
                  onClick={() => removeLinkedTool(tool.id)}
                  className="absolute top-1 right-1 text-[#c6c6c6] hover:text-[#ffb4ab]"
                  title="Remove linked tool"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
                <span className="material-symbols-outlined text-3xl text-[#cb2957] mb-2">{tool.icon}</span>
                <div className="font-space font-bold text-white text-sm uppercase">{tool.name}</div>
                <div className="font-mono text-[10px] text-[#77da9f] mt-1">{tool.effect}</div>
              </div>
            ))}

            {!linkedTools.length && (
              <div className="bg-[#131313] border-[3px] border-dashed border-[#353535] p-4 text-center opacity-70">
                <span className="material-symbols-outlined text-3xl text-[#c6c6c6] mb-2">add_link</span>
                <div className="font-space font-bold text-[#c6c6c6] text-sm uppercase">No Tools Linked</div>
                <div className="font-mono text-[10px] text-[#c6c6c6] mt-1">Add your own tool below</div>
              </div>
            )}
          </div>

          <form onSubmit={handleAddTool} className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              value={toolName}
              onChange={(event) => setToolName(event.target.value)}
              placeholder="Tool name"
              className="bg-[#1a1a1a] border-[3px] border-black px-3 py-2 font-mono text-xs text-white outline-none"
            />
            <input
              value={toolEffect}
              onChange={(event) => setToolEffect(event.target.value)}
              placeholder="Linked purpose"
              className="bg-[#1a1a1a] border-[3px] border-black px-3 py-2 font-mono text-xs text-white outline-none"
            />
            <div className="flex gap-3">
              <input
                value={toolIcon}
                onChange={(event) => setToolIcon(event.target.value)}
                placeholder="icon"
                className="min-w-0 flex-1 bg-[#1a1a1a] border-[3px] border-black px-3 py-2 font-mono text-xs text-white outline-none"
              />
              <button
                type="submit"
                className="bg-[#cb2957] text-black font-mono text-xs font-bold uppercase px-4 py-2 border-[3px] border-black brutalist-shadow"
              >
                Add
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Career Milestone Timeline */}
      <section className="bg-[#131313] border-[3px] border-black p-6 brutalist-shadow">
        <h3 className="font-space text-xl font-bold text-white uppercase border-b-[3px] border-black pb-2 mb-6">
          Career Timeline
        </h3>

        <div className="space-y-4 font-mono text-xs">
          {timelineItems.map((item) => (
            <div key={`${item.title}-${item.when}`} className="p-4 bg-[#1a1a1a] border-[2px] border-black flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined ${item.tone}`}>{item.icon}</span>
                <div>
                  <div className="font-bold text-white text-sm">{item.title}</div>
                  <div className="text-[#c6c6c6]">{item.description}</div>
                </div>
              </div>
              <span className="text-[#77da9f] font-bold">{item.when}</span>
            </div>
          ))}

          {!timelineItems.length && (
            <div className="p-4 bg-[#1a1a1a] border-[2px] border-black text-[#c6c6c6]">
              Profile milestones will appear as you log activity, unlock achievements, and advance goals.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
