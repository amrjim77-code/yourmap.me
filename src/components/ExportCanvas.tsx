import React, { forwardRef, useMemo } from 'react';
import { Globe, Layers, Navigation, Briefcase, User } from 'lucide-react';
import { ColorSwatch } from '../data/palette';
import { Skill } from '../data/skills';
import { countContinents } from '../data/countries';
import { ClientMapComponent } from './ClientMapComponent';
import { SkillMapComponent } from './SkillMapComponent';
import { ActiveTab } from './TopNav';

interface ExportCanvasProps {
  activeTab: ActiveTab;
  userName: string;
  userTitle: string;
  avatarUrl: string | null;
  themeColor: ColorSwatch;
  selectedCountries: string[];
  homeCountry?: string;
  skills: Skill[];
  onToggleCountry: (id: string, name: string) => void;
  aspectRatio?: '4:5' | '1:1';
  showLabels?: boolean;
  countryNamesMap?: Map<string, string>;
  isAnimated?: boolean;
  customSubtitle?: string;
  customCta?: string;
  watermarkText?: string;
}

export const ExportCanvas = forwardRef<HTMLDivElement, ExportCanvasProps>(({
  activeTab,
  userName,
  userTitle,
  avatarUrl,
  themeColor,
  selectedCountries,
  homeCountry,
  skills,
  onToggleCountry,
  aspectRatio = '1:1',
  showLabels = true,
  countryNamesMap,
  isAnimated = true,
  customSubtitle,
  customCta,
  watermarkText,
}, ref) => {
  const continentCount = useMemo(() => countContinents(selectedCountries), [selectedCountries]);

  // Round percent: e.g. 7/195 = 3.59% -> 4%
  const percentWorld = Math.round((selectedCountries.length / 195) * 100);

  const getInitials = () => {
    if (!userName.trim()) return null;
    const parts = userName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Subtitle based on active tab or custom override
  const displaySubtitle = customSubtitle || (
    activeTab === 'client-map'
      ? 'GLOBAL MARKET COVERAGE BY'
      : 'SCOPE OF WORK & SERVICES'
  );

  const homeCountryName = useMemo(() => {
    return (homeCountry && countryNamesMap?.get(homeCountry)) || '';
  }, [homeCountry, countryNamesMap]);

  const defaultCta = useMemo(() => {
    if (activeTab === 'client-map') {
      const basePart = homeCountryName ? `Based in ${homeCountryName} • ` : '';
      const countPart = `${selectedCountries.length} ${selectedCountries.length === 1 ? 'Country' : 'Countries'} Served`;
      return `${basePart}${countPart}`;
    }
    const basePart = homeCountryName ? `Based in ${homeCountryName} • ` : '';
    return `${basePart}${skills.length} Specialized Work Capabilities`;
  }, [activeTab, homeCountryName, selectedCountries.length, skills.length]);

  const displayTitle = userName.trim() || 'Your Name';
  const displayRole = userTitle.trim();
  const displayCta = customCta || defaultCta;
  const displayWatermark = watermarkText || 'yourmap.me · Show the world where you work.';

  // Dynamic aspect ratio styles (2 sizes: 4:5 and 1:1)
  const ratioStyle = aspectRatio === '4:5'
    ? { aspectRatio: '4 / 5', minHeight: '440px' }
    : { aspectRatio: '1 / 1', minHeight: '340px' };

  return (
    <div
      ref={ref}
      id="exportable-infographic-canvas"
      style={{
        ...ratioStyle,
        backgroundColor: themeColor.cardBg || '#10141d',
        borderColor: themeColor.cardBorder || '#1e293b',
        boxShadow: themeColor.isDark
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          : '0 20px 45px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.04)',
      }}
      className={`relative w-full overflow-hidden rounded-[20px] sm:rounded-[30px] border flex flex-col justify-between transition-all duration-300 select-none ${
        aspectRatio === '4:5' ? 'p-3.5 sm:p-6 sm:py-6' : 'p-3.5 sm:p-8'
      }`}
    >
      {/* ========================================================
          1. TOP HEADER (SCREENSHOT AESTHETIC WITH CLIENT FOOTPRINT CONCEPT)
         ======================================================== */}
      <div className="relative z-10 flex items-center justify-between gap-2.5 sm:gap-6 pb-2 sm:pb-3">
        {/* Left: User Avatar + Subtitle + Bold Name + Professional Role */}
        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5 min-w-0">
          {avatarUrl ? (
            <div
              className="relative w-12 h-12 sm:w-18 sm:h-18 md:w-22 md:h-22 rounded-full overflow-hidden shrink-0 border-2 sm:border-[2.5px] shadow-lg ring-2 ring-black/5"
              style={{ borderColor: themeColor.subcardBorder || '#2a364d' }}
            >
              <img
                src={avatarUrl}
                alt={displayTitle}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-12 h-12 sm:w-18 sm:h-18 md:w-22 md:h-22 rounded-full flex items-center justify-center font-bold text-lg sm:text-2xl md:text-3xl shrink-0 border-2 sm:border-[2.5px] shadow-lg ring-2 ring-black/5"
              style={{
                backgroundColor: themeColor.subcardBg || '#161d2a',
                borderColor: themeColor.subcardBorder || '#2a364d',
                color: themeColor.textPrimary || '#ffffff',
              }}
            >
              {getInitials() || <User className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 opacity-70" />}
            </div>
          )}

          <div className="flex flex-col justify-center min-w-0">
            <span
              className="text-[10px] sm:text-[12px] font-mono uppercase tracking-[0.08em] font-medium truncate"
              style={{ color: themeColor.textSecondary || '#94a3b8' }}
            >
              {displaySubtitle}
            </span>

            <h1
              className="text-xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight truncate mt-0.5"
              style={{ color: themeColor.textPrimary || '#ffffff' }}
            >
              {displayTitle}
            </h1>

            {/* Work & Services Showcase (Side-by-side highlighted pills maintaining theme) */}
            {skills.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 md:gap-2 mt-1 sm:mt-1.5 max-w-[540px]">
                {skills.map(skill => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs md:text-[13px] font-bold px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full border shadow-xs transition-all whitespace-nowrap"
                    style={{
                      backgroundColor: `${themeColor.hex}1c`,
                      borderColor: `${themeColor.hex}50`,
                      color: themeColor.isDark ? '#ffffff' : themeColor.hex,
                      boxShadow: `0 0 10px ${themeColor.hex}22`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: themeColor.hex,
                        boxShadow: `0 0 6px ${themeColor.hex}`,
                      }}
                    />
                    <span>{skill.name}</span>
                  </span>
                ))}
              </div>
            ) : displayRole ? (
              <p
                className="text-xs sm:text-sm font-normal truncate mt-0.5"
                style={{ color: themeColor.textSecondary || '#94a3b8' }}
              >
                {displayRole}
              </p>
            ) : null}
          </div>
        </div>

        {/* Right: Giant Stylized Counter (Numerator in themeColor + /195 in muted slate) */}
        <div className="flex items-center shrink-0">
          {activeTab === 'client-map' && (
            <div className="flex items-baseline font-mono select-none">
              <span
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-none"
                style={{
                  color: themeColor.hex,
                  textShadow: `0 0 35px ${themeColor.hex}45`,
                }}
              >
                {selectedCountries.length}
              </span>
              <span
                className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight ml-0.5 sm:ml-2 leading-none"
                style={{ color: themeColor.isDark ? '#64748b' : '#94a3b8' }}
              >
                /195
              </span>
            </div>
          )}

          {activeTab === 'skill-map' && (
            <div className="flex items-baseline font-mono select-none">
              <span
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-none"
                style={{
                  color: themeColor.hex,
                  textShadow: `0 0 35px ${themeColor.hex}45`,
                }}
              >
                {skills.length}
              </span>
              <span className="text-[#64748b] text-base sm:text-2xl md:text-3xl font-bold ml-1 sm:ml-2 font-sans">
                Services
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          2. CANVAS BODY
         ======================================================== */}
      <div className={`relative z-10 flex-1 w-full overflow-hidden flex flex-col justify-center ${
        aspectRatio === '4:5' ? 'my-1 py-1' : 'my-2'
      }`}>
        {/* VIEW 1: CLIENT MAP (Dark Landmasses, Solid Glowing Selected Countries, Animated Flight Paths) */}
        {activeTab === 'client-map' && (
          <div className="w-full h-full flex items-center justify-center relative flex-1">
            <ClientMapComponent
              selectedCountries={selectedCountries}
              homeCountry={homeCountry}
              onToggleCountry={onToggleCountry}
              themeColor={themeColor}
              compact={false}
              aspectRatio={aspectRatio}
              showLabels={showLabels}
              countryNamesMap={countryNamesMap}
              animated={isAnimated}
            />
          </div>
        )}

        {/* VIEW 2: WORK & SERVICES SHOWCASE */}
        {activeTab === 'skill-map' && (
          <div className="w-full h-full overflow-y-auto py-2">
            <SkillMapComponent
              skills={skills}
              themeColor={themeColor}
              compact={false}
            />
          </div>
        )}
      </div>

      {/* ========================================================
          3. BOTTOM SECTION (PROGRESS BAR + STATS ROW + BRAND SQUIRCLE + WATERMARK PILL)
         ======================================================== */}
      <div className="relative z-10 flex flex-col gap-3 pt-2">
        {/* Full-Width Progress Bar */}
        <div className="w-full">
          <div
            className="w-full h-[6px] sm:h-[7px] rounded-full overflow-hidden"
            style={{ backgroundColor: themeColor.trackBg || '#1e2638' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percentWorld}%`,
                backgroundColor: themeColor.hex,
              }}
            />
          </div>
        </div>

        {/* Row 1: Primary Client Stats */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          {/* Left: % of world covered */}
          <span
            className="font-bold tracking-tight"
            style={{ color: themeColor.textPrimary || '#ffffff' }}
          >
            {percentWorld}% Global Market Coverage
          </span>

          {/* Right: Total Continents Covered */}
          <span
            className="text-[11px] sm:text-xs font-medium font-mono"
            style={{ color: themeColor.textSecondary || '#94a3b8' }}
          >
            {continentCount} of 5 Continents Covered
          </span>
        </div>

        {/* Row 2: Based in & Countries Served + Squircle Icon Badge */}
        <div className="flex items-center justify-between pt-0.5">
          <span
            className="text-xs sm:text-base md:text-[17px] font-bold tracking-tight truncate min-w-0 pr-2"
            style={{ color: themeColor.textPrimary || '#ffffff' }}
          >
            {displayCta}
          </span>

          {/* Right: Squircle Badge with Flight / Navigation Icon */}
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] border flex items-center justify-center shrink-0"
            style={{
              backgroundColor: themeColor.subcardBg || '#1c2433',
              borderColor: themeColor.subcardBorder || '#2b374d',
            }}
          >
            <Navigation
              className="w-5 h-5 -rotate-45"
              style={{
                color: themeColor.hex,
              }}
            />
          </div>
        </div>

        {/* Row 3: Bottom Center Watermark Pill (Sleek, Minimal & Brand-Highlighted, Artifact-Free) */}
        <div className="flex justify-center pt-2 sm:pt-3">
          <div
            className="px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full flex items-center gap-2.5 sm:gap-3 border-[1.5px] transition-all"
            style={{
              backgroundColor: themeColor.isDark ? '#0f172a' : '#ffffff',
              borderColor: `${themeColor.hex}50`,
            }}
          >
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" style={{ color: themeColor.hex }} />
            <span
              className="font-extrabold font-mono tracking-tight text-[14px] sm:text-[17px] md:text-[18px]"
              style={{
                color: themeColor.hex,
              }}
            >
              yourmap.me
            </span>
            <span
              className="text-[12px] sm:text-[15px] opacity-40 font-mono font-bold"
              style={{ color: themeColor.textSecondary || '#94a3b8' }}
            >
              ·
            </span>
            <span
              className="text-[12.5px] sm:text-[15px] font-semibold tracking-tight"
              style={{ color: themeColor.textSecondary || '#64748b' }}
            >
              Show the world where you work.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

ExportCanvas.displayName = 'ExportCanvas';
