import React, { forwardRef } from 'react';
import {
  Code2,
  Palette,
  Cpu,
  Compass,
  TrendingUp,
  Server,
  Layers,
  Sparkles,
  Star,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { ThemeDefinition } from '../data/themes';
import { SkillItem, SKILL_DOMAINS, SkillDomainId } from '../data/skills';
import { AspectRatioType } from './MapCanvas';

interface SkillMapCanvasProps {
  name: string;
  title: string;
  tagline: string;
  skills: SkillItem[];
  theme: ThemeDefinition;
  aspectRatio: AspectRatioType;
  experienceMetric?: string;
  avatarInitials?: string;
  onRemoveSkill?: (id: string) => void;
  onToggleLevel?: (id: string) => void;
  interactive?: boolean;
}

const DOMAIN_ICONS: Record<SkillDomainId, React.ComponentType<{ className?: string }>> = {
  engineering: Code2,
  design: Palette,
  'ai-data': Cpu,
  strategy: Compass,
  marketing: TrendingUp,
  devops: Server,
};

export const SkillMapCanvas = forwardRef<HTMLDivElement, SkillMapCanvasProps>(({
  name,
  title,
  tagline,
  skills,
  theme,
  aspectRatio,
  experienceMetric,
  avatarInitials,
  onRemoveSkill,
  onToggleLevel,
  interactive = false,
}, ref) => {
  // Derive initials
  const computedInitials = React.useMemo(() => {
    if (avatarInitials && avatarInitials.trim()) return avatarInitials.trim().slice(0, 2).toUpperCase();
    if (!name.trim()) return 'ME';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name, avatarInitials]);

  // Group skills by domain
  const groupedSkills = React.useMemo(() => {
    const map = new Map<SkillDomainId, SkillItem[]>();
    for (const d of SKILL_DOMAINS) {
      map.set(d.id, []);
    }
    for (const s of skills) {
      const key = s.domain || s.category || 'Frontend';
      const arr = map.get(key) || [];
      arr.push(s);
      map.set(key, arr);
    }
    return map;
  }, [skills]);

  // Active domains that have at least 1 skill
  const activeDomains = React.useMemo(() => {
    return SKILL_DOMAINS.filter(d => (groupedSkills.get(d.id)?.length || 0) > 0);
  }, [groupedSkills]);

  const totalSkillsCount = skills.length;
  const coreSkillsCount = skills.filter(s => s.level === 'core').length;

  // Aspect ratio styling (2 sizes: 4:5 and 1:1)
  const getAspectRatioStyle = () => {
    switch (aspectRatio) {
      case '4:5':
        return { aspectRatio: '4 / 5', minHeight: '660px' };
      case '1:1':
      default:
        return { aspectRatio: '1 / 1', minHeight: '580px' };
    }
  };

  // Determine grid column layout based on aspect ratio and number of active domains
  const getGridLayoutClass = () => {
    if (aspectRatio === '4:5') {
      // Portrait: 2 columns or single column
      return activeDomains.length <= 2 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2';
    }
    // 1:1 Square
    return activeDomains.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2';
  };

  return (
    <div
      ref={ref}
      id="export-skill-canvas"
      style={{
        backgroundColor: theme.canvasBg,
        borderColor: theme.cardBorder,
        ...getAspectRatioStyle(),
      }}
      className={`relative w-full overflow-hidden rounded-2xl border transition-all duration-300 flex flex-col justify-between shadow-2xl ${
        theme.type === 'dark' ? 'shadow-black/70' : 'shadow-slate-300/40'
      }`}
    >
      {/* Background ambient radial gradients */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-20 blur-[110px]"
        style={{
          background: `radial-gradient(circle, ${theme.accentColor} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[450px] h-[450px] pointer-events-none opacity-15 blur-[100px]"
        style={{
          background: `radial-gradient(circle, ${theme.accentSecondary} 0%, transparent 70%)`,
        }}
      />

      {/* Decorative grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `linear-gradient(${theme.cardBorder} 1px, transparent 1px), linear-gradient(90deg, ${theme.cardBorder} 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* TOP HEADER SECTION */}
      <div className="relative z-10 px-7 pt-6 pb-3 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Avatar / Monogram */}
            <div
              className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold text-base sm:text-lg tracking-wider shrink-0 shadow-lg"
              style={{
                backgroundColor: theme.tagBg,
                color: theme.accentColor,
                border: `1.5px solid ${theme.tagBorder}`,
              }}
            >
              <span className="font-mono">{computedInitials}</span>
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-sm font-sans"
                style={{
                  backgroundColor: theme.accentColor,
                  color: theme.canvasBg,
                }}
              >
                ⚡
              </div>
            </div>

            {/* Name, Title, Tagline */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1
                  className="text-lg sm:text-xl font-extrabold tracking-tight truncate font-sans"
                  style={{ color: theme.textPrimary }}
                >
                  {name || 'Your Name'}
                </h1>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1 uppercase tracking-wider"
                  style={{
                    backgroundColor: theme.tagBg,
                    borderColor: theme.tagBorder,
                    color: theme.tagText,
                  }}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Capability Matrix</span>
                </span>
              </div>

              <p
                className="text-xs sm:text-sm font-medium truncate"
                style={{ color: theme.textSecondary }}
              >
                {title || 'Professional Title / Specialization'}
              </p>

              {tagline && (
                <p
                  className="text-[11px] leading-relaxed line-clamp-1 max-w-xl mt-0.5 hidden sm:block"
                  style={{ color: theme.textMuted }}
                >
                  {tagline}
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
            {experienceMetric && (
              <div
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                style={{
                  backgroundColor: theme.tagBg,
                  borderColor: theme.tagBorder,
                  color: theme.accentColor,
                }}
              >
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span className="font-mono text-[11px] sm:text-xs">{experienceMetric}</span>
              </div>
            )}

            <div
              className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 shadow-sm"
              style={{
                backgroundColor: theme.type === 'dark' ? 'rgba(15, 23, 42, 0.75)' : 'rgba(241, 245, 249, 0.85)',
                borderColor: theme.cardBorder,
                color: theme.textPrimary,
              }}
            >
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs sm:text-sm font-bold" style={{ color: theme.accentColor }}>
                  {totalSkillsCount}
                </span>
                <span className="text-[11px]" style={{ color: theme.textSecondary }}>Skills</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs sm:text-sm font-bold" style={{ color: theme.accentSecondary }}>
                  {activeDomains.length}
                </span>
                <span className="text-[11px]" style={{ color: theme.textSecondary }}>Domains</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MATRIX CLUSTERS BODY */}
      <div className="relative z-10 flex-1 px-7 py-3 overflow-y-auto">
        {activeDomains.length === 0 ? (
          <div className="h-full min-h-[240px] flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-700/60 bg-slate-900/30">
            <Layers className="w-10 h-10 mb-3 opacity-40 text-indigo-400" />
            <h3 className="text-sm font-semibold mb-1" style={{ color: theme.textPrimary }}>
              No Skills Selected Yet
            </h3>
            <p className="text-xs max-w-sm mb-4" style={{ color: theme.textSecondary }}>
              Use the sidebar to choose skills from Engineering, Design, AI, Strategy, or add custom capabilities.
            </p>
          </div>
        ) : (
          <div className={`grid ${getGridLayoutClass()} gap-3.5 h-full content-start`}>
            {activeDomains.map(domain => {
              const domainSkills = groupedSkills.get(domain.id) || [];
              const IconComp = DOMAIN_ICONS[domain.id] || Layers;

              return (
                <div
                  key={domain.id}
                  className="rounded-xl p-3.5 border transition-all duration-200 flex flex-col justify-between group"
                  style={{
                    backgroundColor:
                      theme.type === 'dark'
                        ? 'rgba(15, 23, 42, 0.55)'
                        : 'rgba(255, 255, 255, 0.75)',
                    borderColor: theme.cardBorder,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {/* Domain Card Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b" style={{ borderColor: theme.cardBorder }}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shadow-xs"
                        style={{
                          backgroundColor: `${domain.accentColor}22`,
                          color: domain.accentColor,
                        }}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4
                          className="text-xs font-bold font-sans tracking-tight"
                          style={{ color: theme.textPrimary }}
                        >
                          {domain.label}
                        </h4>
                      </div>
                    </div>

                    <span
                      className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${domain.accentColor}18`,
                        color: domain.accentColor,
                        border: `1px solid ${domain.accentColor}33`,
                      }}
                    >
                      {domainSkills.length} {domainSkills.length === 1 ? 'skill' : 'skills'}
                    </span>
                  </div>

                  {/* Skills Pill Badges */}
                  <div className="flex flex-wrap gap-1.5 flex-1 content-start">
                    {domainSkills.map(skill => {
                      const isCore = skill.level === 'core';
                      return (
                        <div
                          key={skill.id || skill.name}
                          onClick={() => {
                            if (interactive && onToggleLevel && skill.id) {
                              onToggleLevel(skill.id);
                            }
                          }}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-all select-none ${
                            interactive ? 'cursor-pointer hover:scale-102' : ''
                          }`}
                          style={{
                            backgroundColor: isCore
                              ? `${theme.accentColor}18`
                              : theme.type === 'dark'
                              ? 'rgba(30, 41, 59, 0.7)'
                              : 'rgba(241, 245, 249, 0.9)',
                            borderColor: isCore ? theme.tagBorder : theme.cardBorder,
                            color: isCore ? theme.tagText : theme.textPrimary,
                            boxShadow: isCore && theme.glowColor ? `0 0 10px ${theme.glowColor}25` : undefined,
                          }}
                          title={interactive ? 'Click to toggle Core / Standard level' : undefined}
                        >
                          {isCore && (
                            <span
                              className="text-[9px] font-bold"
                              style={{ color: theme.accentColor }}
                            >
                              ★
                            </span>
                          )}
                          <span className="text-[11px] sm:text-xs tracking-tight">{skill.name}</span>

                          {interactive && onRemoveSkill && skill.id && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveSkill(skill.id);
                              }}
                              className="ml-0.5 text-slate-400 hover:text-rose-400 text-xs leading-none"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Domain Subtitle / Footer Note */}
                  <div className="mt-2.5 pt-2 border-t flex items-center justify-between text-[10px]" style={{ borderColor: theme.cardBorder }}>
                    <span className="truncate max-w-[180px]" style={{ color: theme.textMuted }}>
                      {domain.description}
                    </span>
                    {domainSkills.some(s => s.level === 'core') && (
                      <span className="font-mono text-[9px] flex items-center gap-0.5 font-semibold" style={{ color: theme.accentColor }}>
                        <Star className="w-2.5 h-2.5 inline fill-current" />
                        <span>Core Stack</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BOTTOM FOOTER SECTION */}
      <div
        className="relative z-10 px-7 py-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs"
        style={{
          borderColor: theme.cardBorder,
          backgroundColor:
            theme.type === 'dark'
              ? 'rgba(10, 15, 26, 0.65)'
              : 'rgba(255, 255, 255, 0.65)',
        }}
      >
        {/* Left: Domain Indicator Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-semibold uppercase tracking-wider font-mono" style={{ color: theme.textMuted }}>
            Coverage:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {activeDomains.map(d => (
              <span
                key={d.id}
                className="text-[10px] px-2 py-0.5 rounded-md font-medium border flex items-center gap-1"
                style={{
                  backgroundColor: `${d.accentColor}12`,
                  borderColor: `${d.accentColor}30`,
                  color: d.accentColor,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.accentColor }} />
                <span>{d.shortLabel}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right: Branded Watermark & Verification */}
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-mono font-medium flex items-center gap-1"
            style={{ color: theme.watermarkColor }}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Verified Matrix</span>
          </span>

          <div
            className="text-[11px] font-mono font-semibold tracking-wider flex items-center gap-1.5 opacity-90"
            style={{ color: theme.watermarkColor }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: theme.accentColor }}
            />
            <span>yourmap.me/skills</span>
          </div>
        </div>
      </div>
    </div>
  );
});

SkillMapCanvas.displayName = 'SkillMapCanvas';
