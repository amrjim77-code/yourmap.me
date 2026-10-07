import React, { memo } from 'react';
import { Briefcase } from 'lucide-react';
import { Skill } from '../data/skills';
import { ColorSwatch } from '../data/palette';

interface SkillMapComponentProps {
  skills: Skill[];
  themeColor: ColorSwatch;
  compact?: boolean;
}

export const SkillMapComponent: React.FC<SkillMapComponentProps> = memo(({
  skills,
  themeColor,
  compact = false,
}) => {
  if (skills.length === 0) {
    return (
      <div
        className="w-full h-full min-h-[320px] flex flex-col items-center justify-center p-8 text-center rounded-[20px] border border-dashed transition-colors"
        style={{
          backgroundColor: themeColor.isDark ? '#161c28' : 'rgba(255, 255, 255, 0.65)',
          borderColor: themeColor.subcardBorder || '#dbe6f0',
        }}
      >
        <div
          className="w-12 h-12 rounded-full border flex items-center justify-center mb-3 shadow-2xs"
          style={{
            backgroundColor: themeColor.cardBg,
            borderColor: themeColor.subcardBorder || '#dbe6f0',
          }}
        >
          <Briefcase className="w-5 h-5" style={{ color: themeColor.hex }} />
        </div>
        <h4
          className="text-sm font-semibold mb-1"
          style={{ color: themeColor.textPrimary || '#1d1d1f' }}
        >
          No Services Selected Yet
        </h4>
        <p
          className="text-xs max-w-sm leading-relaxed"
          style={{ color: themeColor.textSecondary || '#64748b' }}
        >
          Select popular offerings or type your own custom services from the sidebar to showcase your scope of work to clients worldwide.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-start p-1 sm:p-2 select-none overflow-y-auto">
      {/* 1. Header: Scope of Work & Services */}
      <div
        className="flex items-center gap-2.5 pb-3 mb-3 border-b"
        style={{ borderColor: themeColor.subcardBorder || '#1e283b' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
          style={{
            backgroundColor: `${themeColor.hex}22`,
            border: `1px solid ${themeColor.hex}44`,
            color: themeColor.hex,
          }}
        >
          <Briefcase className="w-4 h-4" />
        </div>
        <h3
          className="text-sm sm:text-base font-bold tracking-tight leading-tight"
          style={{ color: themeColor.textPrimary || '#ffffff' }}
        >
          Scope of Work & Services
        </h3>
      </div>

      {/* 2. Services & Capabilities Grid */}
      <div className="flex-1 py-1">
        <div className="flex flex-wrap gap-2.5 content-start">
          {skills.map(item => (
            <div
              key={item.id}
              className="text-xs px-3.5 py-1.5 rounded-full border font-medium transition-all select-none flex items-center gap-2 shadow-2xs hover:scale-102"
              style={{
                backgroundColor: item.isCore ? `${themeColor.hex}18` : (themeColor.subcardBg || '#141b26'),
                borderColor: item.isCore ? `${themeColor.hex}60` : (themeColor.subcardBorder || '#253246'),
                color: themeColor.textPrimary || '#e2e8f0',
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  backgroundColor: themeColor.hex,
                  boxShadow: item.isCore ? `0 0 6px ${themeColor.hex}` : 'none',
                }}
              />
              <span className="text-[12px] sm:text-[13px] font-medium">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

SkillMapComponent.displayName = 'SkillMapComponent';
