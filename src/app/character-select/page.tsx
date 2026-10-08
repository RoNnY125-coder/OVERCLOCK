'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore, CHARACTERS, Character } from '@/store/useAppStore';
import AvatarIcon from '@/components/ui/AvatarIcon';

export default function CharacterSelectPage() {
  const router = useRouter();
  const { selectedCharacter, setSelectedCharacter, accentColor, setAccentColor, createCurrentUser } = useAppStore();

  const [selectedHeadwear, setSelectedHeadwear] = useState('Classic Hood');
  const [selectedArmor, setSelectedArmor] = useState('Travel Coat');
  const [selectedAccessory, setSelectedAccessory] = useState('Savings Planner');
  const [username, setUsername] = useState(() => {
    if (typeof localStorage === 'undefined') return '';
    return localStorage.getItem('nyx_pending_username') || '';
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectChar = (char: Character) => {
    setSelectedCharacter(char);
  };

  const handleConfirm = async () => {
    if (!username.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await createCurrentUser(username);
      localStorage.removeItem('nyx_pending_username');
      router.push('/dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReRoll = () => {
    const randomChar = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    setSelectedCharacter(randomChar);
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e2e2e2] pt-8 pb-16 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col">
      {/* Top Header without left bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-[3px] border-black pb-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#eeeeee] border-[3px] border-black px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#cb2957] hover:text-black transition-colors brutalist-shadow mb-3 font-bold"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            BACK TO INTRO
          </Link>
          <h1 className="font-space text-3xl sm:text-5xl font-bold text-white uppercase tracking-tighter">
            Character Select
          </h1>
          <p className="font-mono text-xs text-[#e1bec2] mt-1">Choose your profile and preferred app color.</p>
        </div>

        <div className="font-mono text-xs text-[#ffb2bd] flex items-center gap-2 border-[3px] border-black px-3 py-1.5 bg-[#1a1a1a]">
          <span className="material-symbols-outlined text-sm">person_add</span>
          New Account
        </div>
      </div>

      {/* 3-Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Panel: Loadout Controls */}
        <section className="lg:col-span-3 bg-[#1a1a1a] border-[3px] border-black p-5 brutalist-shadow flex flex-col">
          <h2 className="font-space text-xl font-bold text-white uppercase border-b-[3px] border-black pb-2 mb-4">
            Profile Details
          </h2>

          <div className="space-y-5 flex-1">
            <div>
              <label className="block font-mono text-xs text-[#ffb2bd] uppercase mb-2">Username</label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full bg-[#131313] border-[3px] border-black p-3 font-mono text-sm text-white focus:outline-none"
                placeholder="Enter your name"
                style={{ borderColor: username ? accentColor : undefined }}
              />
            </div>

            {/* Headwear */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#cb2957] text-lg">smart_toy</span>
                <h3 className="font-mono text-xs font-bold text-[#e2e2e2] uppercase">Headwear</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Classic Hood', 'Audio Rig', 'Focus Visor'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedHeadwear(item)}
                    className={`p-2 border-[2px] border-black font-mono text-[10px] font-bold uppercase transition-all ${
                      selectedHeadwear === item
                        ? 'text-black shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-[#2a2a2a] text-[#c6c6c6] hover:bg-[#353535]'
                    }`}
                    style={selectedHeadwear === item ? { backgroundColor: accentColor } : undefined}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Armor */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#cb2957] text-lg">shield</span>
                <h3 className="font-mono text-xs font-bold text-[#e2e2e2] uppercase">Armor</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Light Mesh', 'Travel Coat', 'Protective Plate'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedArmor(item)}
                    className={`p-2 border-[2px] border-black font-mono text-[10px] font-bold uppercase transition-all ${
                      selectedArmor === item
                        ? 'text-black shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-[#2a2a2a] text-[#c6c6c6] hover:bg-[#353535]'
                    }`}
                    style={selectedArmor === item ? { backgroundColor: accentColor } : undefined}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessory */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#cb2957] text-lg">watch</span>
                <h3 className="font-mono text-xs font-bold text-[#e2e2e2] uppercase">Accessory</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Savings Planner', 'Data Pad'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedAccessory(item)}
                    className={`p-2 border-[2px] border-black font-mono text-[10px] font-bold uppercase transition-all ${
                      selectedAccessory === item
                        ? 'text-black shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-[#2a2a2a] text-[#c6c6c6] hover:bg-[#353535]'
                    }`}
                    style={selectedAccessory === item ? { backgroundColor: accentColor } : undefined}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Neon Color Accent */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#cb2957] text-lg">palette</span>
                <h3 className="font-mono text-xs font-bold text-[#e2e2e2] uppercase">App Accent</h3>
              </div>
              <div className="flex gap-3">
                {['#cb2957', '#00b894', '#3867d6', '#f7b731'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-8 h-8 border-[2px] border-black brutalist-shadow transition-transform ${
                      accentColor === color ? 'scale-110 shadow-[4px_4px_0px_0px_#000]' : 'hover:opacity-80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Center Panel: Sprite Grid (9 Avatars from user sheet) */}
        <section className="lg:col-span-6 bg-[#1a1a1a] border-[3px] border-black p-5 brutalist-shadow flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b-[3px] border-black pb-2">
            <h2 className="font-space text-xl font-bold text-white uppercase">Choose Character</h2>
            <div className="text-black font-mono text-xs px-2 py-0.5 border-[2px] border-black font-bold" style={{ backgroundColor: accentColor }}>
              ACTIVE: {selectedCharacter.name}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 flex-1">
            {CHARACTERS.map((char) => {
              const isSelected = selectedCharacter.id === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => handleSelectChar(char)}
                  className={`border-[3px] border-black p-2 relative flex flex-col items-center justify-between transition-all ${
                    isSelected
                      ? 'text-black shadow-[4px_4px_0px_0px_#000]'
                      : 'bg-[#2a2a2a] hover:bg-[#353535] text-white'
                  }`}
                  style={isSelected ? { backgroundColor: accentColor } : undefined}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 bg-black text-white font-mono text-[9px] font-bold px-1.5 py-0.5 border-b-[2px] border-r-[2px] border-black z-10">
                      ACTIVE
                    </div>
                  )}

                  {/* PERFECT CROPPED SPRITE SHEET CONTAINER */}
                  <div className="w-full aspect-square bg-[#131313] border-[2px] border-black overflow-hidden relative flex items-center justify-center p-1">
                    <AvatarIcon character={char} size="xl" className="w-full h-full border-none shadow-none" />
                  </div>
                  <span className="font-mono text-[11px] mt-2 font-bold uppercase tracking-wider text-center">{char.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Right Panel: RPG Attributes */}
        <section className="lg:col-span-3 bg-[#1a1a1a] border-[3px] border-black p-5 brutalist-shadow flex flex-col">
          <h2 className="font-space text-xl font-bold text-white uppercase border-b-[3px] border-black pb-2 mb-4">
            Attributes
          </h2>

          <div className="space-y-4 flex-1">
            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-[#ffb2bd] font-bold">STR (Savings Rate)</span>
                <span className="text-white font-bold">{selectedCharacter.str}%</span>
              </div>
              <div className="health-bar-container">
                <div className="health-bar-fill" style={{ width: `${selectedCharacter.str}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-[#77da9f] font-bold">WIS (Budget Score)</span>
                <span className="text-white font-bold">{selectedCharacter.wis}/100</span>
              </div>
              <div className="health-bar-container">
                <div className="health-bar-fill-green" style={{ width: `${selectedCharacter.wis}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-[#ffb2bd] font-bold">DEX (Liquidity Ratio)</span>
                <span className="text-white font-bold">{selectedCharacter.dex}%</span>
              </div>
              <div className="health-bar-container">
                <div className="health-bar-fill" style={{ width: `${selectedCharacter.dex}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-[#77da9f] font-bold">CON (Debt Ratio)</span>
                <span className="text-white font-bold">{selectedCharacter.con}%</span>
              </div>
              <div className="health-bar-container">
                <div className="health-bar-fill-green" style={{ width: `${selectedCharacter.con}%` }} />
              </div>
            </div>

            <div className="p-3 bg-[#131313] border-[2px] border-black text-xs font-mono text-[#c6c6c6] mt-4">
              <span className="text-[#cb2957] font-bold">CLASS: {selectedCharacter.classTitle}</span>
              <p className="mt-1">+15% bonus XP on streak maintenance &amp; savings contribution.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#1a1a1a] border-[3px] border-black p-4 brutalist-shadow">
        <button
          onClick={handleReRoll}
          className="w-full sm:w-auto bg-[#2a2a2a] text-[#e2e2e2] border-[2px] border-black px-6 py-3 font-mono text-xs font-bold uppercase hover:bg-[#353535] transition-colors"
        >
          Randomize Character
        </button>

        <button
          onClick={handleConfirm}
          disabled={!username.trim() || isSaving}
          className="w-full sm:w-auto text-black border-[3px] border-black px-8 py-3 font-space text-lg font-bold uppercase brutalist-shadow hover:bg-[#ffb2bd] transition-colors disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          {isSaving ? 'Creating Profile...' : 'Create Profile'}
        </button>
      </div>
    </div>
  );
}
