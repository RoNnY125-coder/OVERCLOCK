'use client';

import Link from 'next/link';
import ShaderBackground from '@/components/ShaderBackground';

export default function IntroPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col items-center justify-between bg-[#131313] text-[#e2e2e2] select-none">
      {/* WebGL Canvas & Broken TV CRT Noise Layer */}
      <ShaderBackground />

      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <header className="relative z-10 w-full px-6 py-4 flex justify-center border-b-[3px] border-black bg-[#131313]/90 backdrop-blur-sm">
        <span className="font-space text-xl font-bold text-[#cb2957] uppercase tracking-widest">OVERCLOCK</span>
      </header>

      {/* Central Hero Banner & CTA */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 text-center my-auto">
        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-[#cb2957] bg-[#1a1a1a] border-[3px] border-black px-4 py-1.5 mb-6 brutalist-shadow uppercase font-bold tracking-widest">
          <span className="material-symbols-outlined text-sm text-[#77da9f]">terminal</span>
          GAMIFIED PERSONAL FINANCE SYSTEM
        </div>

        {/* Giant OVERCLOCK Brutalist Banner */}
        <h1 className="font-space font-bold text-black bg-[#cb2957] border-[4px] border-black px-6 sm:px-8 py-3 mb-6 tracking-widest shadow-[14px_14px_0px_0px_#000] text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-none uppercase relative">
          OVERCLOCK
          <div className="absolute -top-3 -right-3 bg-black text-[#ffb2bd] font-mono text-xs px-3 py-1 border-[2px] border-[#cb2957] uppercase tracking-widest hidden sm:block">
            ATHENA AI
          </div>
        </h1>

        {/* Tagline */}
        <p className="font-mono text-sm sm:text-lg text-[#e2e2e2] max-w-2xl mb-10 tracking-[0.2em] uppercase font-bold bg-[#131313] px-6 py-3 border-[3px] border-black brutalist-shadow">
          CONQUER YOUR CAPITAL. LEVEL UP YOUR WEALTH.
        </p>

        {/* Professional Start Adventure CTA Button */}
        <Link
          href="/login"
          className="group relative inline-flex items-center justify-center gap-4 bg-[#cb2957] text-black font-space text-2xl sm:text-4xl font-bold uppercase px-10 py-5 border-[4px] border-black shadow-[8px_8px_0px_0px_#000] hover:shadow-[12px_12px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0px_0px_#000] transition-all bg-gradient-to-r from-[#cb2957] via-[#ffb2bd] to-[#cb2957] bg-[length:200%_auto] hover:bg-[position:right_center]"
        >
          <span>Get Started</span>
          <span className="material-symbols-outlined text-3xl sm:text-4xl group-hover:rotate-12 transition-transform font-bold">
            sports_esports
          </span>
        </Link>
      </main>

      {/* Bottom Feature Highlights Ticker */}
      <footer className="relative z-10 w-full bg-[#1a1a1a] border-t-[3px] border-black py-3 px-4 font-mono text-xs text-[#c6c6c6] overflow-hidden">
        <div className="flex justify-around items-center max-w-6xl mx-auto gap-4 font-bold flex-wrap">
          <span className="flex items-center gap-2 text-[#77da9f]">
            <span>⚡</span> XP LEVELING &amp; STREAKS
          </span>
          <span className="hidden sm:inline text-black">&bull;</span>
          <span className="flex items-center gap-2 text-[#ffb2bd]">
            <span>🛡️</span> ACTIVE QUESTS &amp; VAULTS
          </span>
          <span className="hidden sm:inline text-black">&bull;</span>
          <span className="flex items-center gap-2 text-[#77da9f]">
            <span>📊</span> SMART BUDGET INSIGHTS
          </span>
          <span className="hidden sm:inline text-black">&bull;</span>
          <span className="flex items-center gap-2 text-[#ffb2bd]">
            <span>🏆</span> COMBAT LOG TROPHIES
          </span>
        </div>
      </footer>
    </div>
  );
}
