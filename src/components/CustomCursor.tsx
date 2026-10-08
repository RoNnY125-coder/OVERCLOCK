'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function CustomCursor() {
  const customCursorEnabled = useAppStore((state) => state.customCursorEnabled);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    if (!customCursorEnabled) {
      document.documentElement.classList.remove('hide-default-cursor');
      return;
    }

    document.documentElement.classList.add('hide-default-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('select') ||
          target.closest('[role="button"]') ||
          target.tagName === 'BUTTON' ||
          target.tagName === 'A'
        );
        setIsPointer(isClickable);
      }
    };

    const handleMouseDown = () => setIsHovered(true);
    const handleMouseUp = () => setIsHovered(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.documentElement.classList.remove('hide-default-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [customCursorEnabled]);

  if (!customCursorEnabled) return null;

  return (
    <div
      className="fixed pointer-events-none z-[99999] transition-transform duration-100 ease-out"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: `translate(-50%, -50%) scale(${isHovered ? 0.75 : isPointer ? 1.25 : 1}) rotate(${isPointer ? '45deg' : '0deg'})`
      }}
    >
      {/* Sleek smaller neo-brutalist neon cursor box */}
      <div className={`w-3.5 h-3.5 border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center transition-colors ${
        isPointer ? 'bg-[#77da9f]' : 'bg-[#cb2957]'
      }`}>
        {/* Center dot */}
        <div className="w-1 h-1 bg-black" />
      </div>
    </div>
  );
}
