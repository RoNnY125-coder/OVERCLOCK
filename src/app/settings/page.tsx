'use client';

import { useAppStore } from '@/store/useAppStore';
import AvatarIcon from '@/components/ui/AvatarIcon';

export default function SettingsPage() {
  const {
    agentName,
    setAgentName,
    level,
    selectedCharacter,
    customCursorEnabled,
    toggleCustomCursor,
    isSidebarCollapsed
  } = useAppStore();

  return (
    <main className={`pt-20 lg:pt-8 pb-24 lg:pb-8 p-4 sm:p-8 max-w-5xl mx-auto min-h-screen transition-all duration-300 ${
      isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
    }`}>
      {/* Header */}
      <header className="mb-8 border-b-[3px] border-black pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-space text-3xl sm:text-5xl font-bold text-white uppercase tracking-tighter mb-1">
            System Settings
          </h1>
          <p className="font-mono text-xs text-[#c6c6c6]">Manage profile, display, and security preferences</p>
        </div>

        {/* Avatar + Level Badge */}
        <div className="flex items-center gap-3 bg-[#1a1a1a] border-[3px] border-black px-3 py-1.5 brutalist-shadow">
          <AvatarIcon character={selectedCharacter} size="sm" />
          <div>
            <div className="font-space font-bold text-white text-xs uppercase">{agentName}</div>
            <div className="font-mono text-[10px] text-[#cb2957] font-bold">LEVEL {level} PROFILE</div>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {/* Profile Identity */}
        <section className="border-[3px] border-black bg-[#1a1a1a] p-6 brutalist-shadow">
          <h2 className="font-space text-xl font-bold text-[#cb2957] border-b-[3px] border-black pb-2 uppercase mb-6">
            Profile Identity
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="relative shrink-0">
              <AvatarIcon character={selectedCharacter} size="xl" />
              <div className="absolute -bottom-2 -right-2 p-1 bg-[#cb2957] border-[2px] border-black text-black">
                <span className="material-symbols-outlined text-xs font-bold">edit</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="block font-mono text-xs text-[#ffb2bd] uppercase mb-1 font-bold">
                  Codename
                </label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full bg-[#131313] border-[3px] border-black p-3 font-mono text-sm text-white focus:outline-none focus:border-[#cb2957]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#ffb2bd] uppercase mb-1 font-bold">
                  Comms Channel (Email)
                </label>
                <input
                  type="email"
                  defaultValue="agent42@nyx.network"
                  className="w-full bg-[#131313] border-[3px] border-black p-3 font-mono text-sm text-white focus:outline-none focus:border-[#cb2957]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* UI & Custom Cursor Preferences */}
        <section className="border-[3px] border-black bg-[#1a1a1a] p-6 brutalist-shadow">
          <h2 className="font-space text-xl font-bold text-white border-b-[3px] border-black pb-2 uppercase mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#cb2957]">tune</span>
            UI &amp; FX Preferences
          </h2>

          <div className="space-y-4 font-mono text-xs">
            {/* Custom Cursor Toggle */}
            <div className="flex justify-between items-center p-4 border-[2px] border-black bg-[#131313]">
              <div>
                <div className="font-bold text-white text-sm">NEO-BRUTALIST CUSTOM CURSOR</div>
                <div className="text-[#c6c6c6]">Enable responsive neon square crosshair cursor &amp; hide OS cursor</div>
              </div>
              <button
                onClick={toggleCustomCursor}
                className={`px-4 py-2 border-[2px] border-black font-bold uppercase transition-colors brutalist-shadow ${
                  customCursorEnabled
                    ? 'bg-[#cb2957] text-black'
                    : 'bg-[#353535] text-[#c6c6c6]'
                }`}
              >
                {customCursorEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            {/* Smooth Scroll Status */}
            <div className="flex justify-between items-center p-4 border-[2px] border-black bg-[#131313]">
              <div>
                <div className="font-bold text-white text-sm">SMOOTH SCROLLING</div>
                <div className="text-[#c6c6c6]">Native CSS smooth scroll behavior for transitions</div>
              </div>
              <span className="px-3 py-1 bg-[#007c4a]/30 text-[#77da9f] border-[2px] border-[#77da9f] font-bold">
                ACTIVE
              </span>
            </div>
          </div>
        </section>

        {/* Security & Data Protocols */}
        <section className="border-[3px] border-black bg-[#1a1a1a] p-6 brutalist-shadow">
          <h2 className="font-space text-xl font-bold text-white border-b-[3px] border-black pb-2 uppercase mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#cb2957]">lock</span>
            Security Settings
          </h2>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center p-4 border-[2px] border-black bg-[#131313]">
              <div>
                <div className="font-bold text-white text-sm">BIOMETRIC LOCK</div>
                <div className="text-[#c6c6c6]">Require biometric scan before sensitive vault actions</div>
              </div>
              <span className="px-3 py-1 bg-[#cb2957] text-black border-[2px] border-black font-bold">
                ACTIVE
              </span>
            </div>

            <div className="flex justify-between items-center p-4 border-[2px] border-black bg-[#131313]">
              <div>
                <div className="font-bold text-white text-sm">DATA ENCRYPTION LEVEL</div>
                <div className="text-[#c6c6c6]">Hardware-backed AES-256 local storage encryption</div>
              </div>
              <span className="px-3 py-1 bg-[#007c4a]/30 text-[#77da9f] border-[2px] border-[#77da9f] font-bold">
                MAX (AES-256)
              </span>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <button className="bg-[#cb2957] text-black border-[3px] border-black px-8 py-3.5 font-space text-lg font-bold uppercase brutalist-shadow hover:bg-[#ffb2bd] transition-colors">
            SAVE CONFIGURATION
          </button>

          <button className="bg-[#93000a] text-white border-[3px] border-black px-6 py-3.5 font-mono text-xs font-bold uppercase brutalist-shadow hover:bg-[#ffb4ab] hover:text-black transition-colors">
            PURGE ACCOUNT DATA
          </button>
        </div>
      </div>
    </main>
  );
}
