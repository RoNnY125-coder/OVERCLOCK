'use client';

import { Character } from '@/store/useAppStore';

interface AvatarIconProps {
  character: Character;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function AvatarIcon({ character, size = 'md', className = '' }: AvatarIconProps) {
  const sizeClasses = {
    sm: 'w-7 h-7 border-[2px]',
    md: 'w-10 h-10 border-[2px]',
    lg: 'w-14 h-14 border-[3px]',
    xl: 'w-24 h-24 border-[3px]',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-black bg-[#131313] shrink-0 overflow-hidden relative shadow-[2px_2px_0px_0px_#000] ${className}`}
    >
      {character.imageUrl ? (
        <img
          src={character.imageUrl}
          alt={character.name}
          className="w-full h-full object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
      ) : (
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url('/avatars.png')`,
            backgroundSize: character.spriteBgSize || '330% 330%',
            backgroundPosition: character.spriteBgPos || '0% 0%',
            backgroundRepeat: 'no-repeat',
            imageRendering: 'pixelated',
          }}
        />
      )}
    </div>
  );
}
