import React, { forwardRef, useMemo } from 'react';
import { Globe, Layers, Navigation, Briefcase, User } from 'lucide-react';
import { ColorSwatch } from '../data/palette';
import { Skill } from '../data/skills';
import { countContinents } from '../data/countries';
import { ClientMapComponent } from './ClientMapComponent';
import { SkillMapComponent } from './SkillMapComponent';
import { BrandLogo } from './BrandLogo';
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
  isExportMode?: boolean;
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
  isExportMode = false,
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

  // Dynamic aspect ratio styles (canonical 1200px in export mode, responsive in view mode)
  const ratioStyle = isExportMode
    ? {
        width: '1200px',
        height: aspectRatio === '4:5' ? '1500px' : '1200px',
        minHeight: aspectRatio === '4:5' ? '1500px' : '1200px',
        aspectRatio: aspectRatio === '4:5' ? '4 / 5' : '1 / 1',
      }
    : {
        aspectRatio: aspectRatio === '4:5' ? '4 / 5' : '1 / 1',
        width: '100%',
      };

  return (
    <div
      ref={ref}
      id={isExportMode ? 'canonical-export-canvas' : 'exportable-infographic-canvas'}
      style={{
        ...ratioStyle,
        backgroundColor: themeColor.cardBg || '#10141d',
        borderColor: themeColor.cardBorder || '#1e293b',
        boxShadow: themeColor.isDark
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          : '0 20px 45px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.04)',
      }}
      className={`relative w-full overflow-hidden rounded-[18px] sm:rounded-[28px] md:rounded-[32px] border flex flex-col justify-between transition-all duration-300 select-none ${
        isExportMode
          ? (aspectRatio === '4:5' ? 'p-10' : 'p-12')
          : (aspectRatio === '4:5' ? 'p-3 sm:p-6 sm:py-6' : 'p-3 sm:p-7 md:p-8')
      }`}
    >
      {/* ========================================================
          1. TOP HEADER (SCREENSHOT AESTHETIC WITH CLIENT FOOTPRINT CONCEPT)
         ======================================================== */}
      <div className={`relative z-10 flex items-center justify-between gap-2 sm:gap-5 md:gap-6 ${
        isExportMode ? 'pb-4' : 'pb-1.5 sm:pb-3'
      }`}>
        {/* Left: User Avatar + Subtitle + Bold Name + Professional Role */}
        <div className={`flex items-center min-w-0 ${
          isExportMode ? 'gap-5' : 'gap-2.5 sm:gap-4 md:gap-5'
        }`}>
          {avatarUrl ? (
            <div
              className={`relative rounded-full overflow-hidden shrink-0 border-2 sm:border-[2.5px] shadow-lg ring-2 ring-black/5 ${
                isExportMode ? 'w-20 h-20' : 'w-9 h-9 sm:w-16 sm:h-16 md:w-20 md:h-20'
              }`}
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
              className={`rounded-full flex items-center justify-center font-bold shrink-0 border-2 sm:border-[2.5px] shadow-lg ring-2 ring-black/5 ${
                isExportMode
                  ? 'w-20 h-20 text-3xl'
                  : 'w-9 h-9 sm:w-16 sm:h-16 md:w-20 md:h-20 text-sm sm:text-2xl md:text-3xl'
              }`}
              style={{
                backgroundColor: themeColor.subcardBg || '#161d2a',
                borderColor: themeColor.subcardBorder || '#2a364d',
                color: themeColor.textPrimary || '#ffffff',
              }}
            >
              {getInitials() || <User className={isExportMode ? 'w-10 h-10' : 'w-4 h-4 sm:w-8 sm:h-8 md:w-10 md:h-10 opacity-70'} />}
            </div>
          )}

          <div className="flex flex-col justify-center min-w-0">
            <span
              className={`font-mono uppercase tracking-[0.08em] font-medium truncate ${
                isExportMode ? 'text-xs' : 'text-[9px] sm:text-[11px] md:text-xs'
              }`}
              style={{ color: themeColor.textSecondary || '#94a3b8' }}
            >
              {displaySubtitle}
            </span>

            <h1
              className={`font-extrabold tracking-tight leading-tight truncate mt-0.5 ${
                isExportMode
                  ? 'text-4xl'
                  : 'text-base sm:text-2xl md:text-3xl lg:text-[40px]'
              }`}
              style={{ color: themeColor.textPrimary || '#ffffff' }}
            >
              {displayTitle}
            </h1>

            {/* Work & Services Showcase (Side-by-side highlighted pills) */}
            {skills.length > 0 ? (
              <div className={`flex flex-wrap items-center mt-1 max-w-[540px] ${
                isExportMode ? 'gap-2' : 'gap-1 sm:gap-1.5 md:gap-2'
              }`}>
                {skills.map(skill => (
                  <span
                    key={skill.id}
                    className={`inline-flex items-center gap-1.5 font-bold rounded-full border shadow-xs transition-all whitespace-nowrap ${
                      isExportMode
                        ? 'text-xs px-3 py-1'
                        : 'text-[9.5px] sm:text-xs md:text-[13px] px-1.5 sm:px-2.5 md:px-3 py-0.5 sm:py-1'
                    }`}
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
                className={`font-normal truncate mt-0.5 ${
                  isExportMode ? 'text-sm' : 'text-[11px] sm:text-xs md:text-sm'
                }`}
                style={{ color: themeColor.textSecondary || '#94a3b8' }}
              >
                {displayRole}
              </p>
            ) : null}
          </div>
        </div>

        {/* Right: Giant Stylized Counter */}
        <div className="flex items-center shrink-0">
          {activeTab === 'client-map' && (
            <div className="flex items-baseline font-mono select-none">
              <span
                className={`font-black tracking-tight leading-none ${
                  isExportMode
                    ? 'text-7xl'
                    : 'text-3xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl'
                }`}
                style={{
                  color: themeColor.hex,
                  textShadow: `0 0 35px ${themeColor.hex}45`,
                }}
              >
                {selectedCountries.length}
              </span>
              <span
                className={`font-extrabold tracking-tight ml-0.5 sm:ml-2 leading-none ${
                  isExportMode
                    ? 'text-3xl'
                    : 'text-base sm:text-3xl md:text-4xl lg:text-5xl'
                }`}
                style={{ color: themeColor.isDark ? '#64748b' : '#94a3b8' }}
              >
                /195
              </span>
            </div>
          )}

          {activeTab === 'skill-map' && (
            <div className="flex items-baseline font-mono select-none">
              <span
                className={`font-black tracking-tight leading-none ${
                  isExportMode
                    ? 'text-7xl'
                    : 'text-3xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl'
                }`}
                style={{
                  color: themeColor.hex,
                  textShadow: `0 0 35px ${themeColor.hex}45`,
                }}
              >
                {skills.length}
              </span>
              <span className={`font-bold ml-1 sm:ml-2 font-sans text-[#64748b] ${
                isExportMode ? 'text-2xl' : 'text-sm sm:text-2xl md:text-3xl'
              }`}>
                Services
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          2. CANVAS BODY (THE STAR OF THE POSTER: EXPANSIVE, PROPORTIONAL MAP)
         ======================================================== */}
      <div className={`relative z-10 flex-1 w-full overflow-hidden flex flex-col justify-center ${
        isExportMode ? 'my-3' : (aspectRatio === '4:5' ? 'my-0.5 sm:my-1' : 'my-0.5 sm:my-2')
      }`}>
        {/* VIEW 1: CLIENT MAP */}
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
              animated={isAnimated && !isExportMode}
              isExportMode={isExportMode}
            />
          </div>
        )}

        {/* VIEW 2: WORK & SERVICES SHOWCASE */}
        {activeTab === 'skill-map' && (
          <div className="w-full h-full overflow-y-auto py-1 sm:py-2">
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
      <div className={`relative z-10 flex flex-col ${
        isExportMode
          ? 'gap-3 pt-3'
          : 'gap-1.5 sm:gap-2.5 md:gap-3 pt-1 sm:pt-2'
      }`}>
        {/* Full-Width Progress Bar */}
        <div className="w-full">
          <div
            className={`w-full rounded-full overflow-hidden ${
              isExportMode ? 'h-[7px]' : 'h-[4px] sm:h-[6px] md:h-[7px]'
            }`}
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
        <div className={`flex items-center justify-between ${
          isExportMode ? 'text-sm' : 'text-[10px] sm:text-xs md:text-sm'
        }`}>
          {/* Left: % of world covered */}
          <span
            className="font-bold tracking-tight"
            style={{ color: themeColor.textPrimary || '#ffffff' }}
          >
            {percentWorld}% Global Market Coverage
          </span>

          {/* Right: Total Continents Covered */}
          <span
            className="font-medium font-mono"
            style={{ color: themeColor.textSecondary || '#94a3b8' }}
          >
            {continentCount} of 5 Continents Covered
          </span>
        </div>

        {/* Row 2: Based in & Countries Served + Squircle Icon Badge */}
        <div className="flex items-center justify-between pt-0.5">
          <span
            className={`font-bold tracking-tight truncate min-w-0 pr-2 ${
              isExportMode ? 'text-base' : 'text-[11px] sm:text-sm md:text-base lg:text-[17px]'
            }`}
            style={{ color: themeColor.textPrimary || '#ffffff' }}
          >
            {displayCta}
          </span>

          {/* Right: Squircle Badge with Flight / Navigation Icon */}
          <div
            className={`border flex items-center justify-center shrink-0 ${
              isExportMode
                ? 'w-11 h-11 rounded-[14px]'
                : 'w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-[9px] sm:rounded-[12px] md:rounded-[14px]'
            }`}
            style={{
              backgroundColor: themeColor.subcardBg || '#1c2433',
              borderColor: themeColor.subcardBorder || '#2b374d',
            }}
          >
            <Navigation
              className={`-rotate-45 ${
                isExportMode ? 'w-5 h-5' : 'w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5'
              }`}
              style={{
                color: themeColor.hex,
              }}
            />
          </div>
        </div>

        {/* Row 3: Bottom Center Watermark Pill */}
        <div className={`flex justify-center ${
          isExportMode ? 'pt-2' : 'pt-0.5 sm:pt-2'
        }`}>
          <div
            className={`rounded-full flex items-center border-[1.5px] transition-all ${
              isExportMode
                ? 'px-6 py-2 gap-3'
                : 'px-2.5 sm:px-5 md:px-6 py-1 sm:py-2 md:py-2.5 gap-1.5 sm:gap-2.5 md:gap-3'
            }`}
            style={{
              backgroundColor: themeColor.isDark ? '#0f172a' : '#ffffff',
              borderColor: `${themeColor.hex}50`,
            }}
          >
            <BrandLogo
              themeColor={themeColor}
              className={`object-contain shrink-0 ${
                isExportMode ? 'w-5 h-5' : 'w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5'
              }`}
              alt="yourmap.me"
            />
            <span
              className={`font-extrabold font-mono tracking-tight ${
                isExportMode ? 'text-[16px]' : 'text-[11px] sm:text-[15px] md:text-[17px]'
              }`}
              style={{
                color: themeColor.hex,
              }}
            >
              yourmap.me
            </span>
            <span
              className={`opacity-40 font-mono font-bold ${
                isExportMode ? 'text-[14px]' : 'text-[9px] sm:text-[13px] md:text-[15px]'
              }`}
              style={{ color: themeColor.textSecondary || '#94a3b8' }}
            >
              ·
            </span>
            <span
              className={`font-semibold tracking-tight whitespace-nowrap ${
                isExportMode ? 'text-[14px]' : 'text-[10px] sm:text-[13px] md:text-[15px]'
              }`}
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
