import React from 'react';
import { Globe } from 'lucide-react';

export type ActiveTab = 'client-map' | 'skill-map';

interface TopNavProps {
  onScrollToTop?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onScrollToTop }) => {
  return (
    <header className="sticky top-0 z-40 w-full shrink-0 h-11 bg-[#000000] text-white flex items-center justify-between px-4 sm:px-8 border-b border-black">
      <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between">
        {/* Company Name & Minimal Logo Mark Only */}
        <a
          href="/"
          onClick={(e) => {
            if (onScrollToTop) {
              e.preventDefault();
              onScrollToTop();
            }
          }}
          className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity font-semibold"
        >
          <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
            <Globe className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-[13.5px]">yourmap.me</span>
        </a>

        {/* Minimal clean tagline */}
        <span className="text-[11px] text-white/50 font-mono hidden sm:inline">
          Show the world where you work.
        </span>
      </div>
    </header>
  );
};
