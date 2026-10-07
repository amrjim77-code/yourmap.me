import React, { forwardRef } from 'react';
import { WorldMap } from './WorldMap';
import { ThemeDefinition } from '../data/themes';
import { Globe, Sparkles, MapPin, Edit3 } from 'lucide-react';
import { getCountryFlag, countContinents } from '../data/countries';

export type AspectRatioType = '4:5' | '1:1';

interface MapCanvasProps {
  name: string;
  title: string;
  tagline: string;
  skills: string[];
  selectedCountryIds: string[];
  countryNamesMap: Map<string, string>;
  theme: ThemeDefinition;
  aspectRatio: AspectRatioType;
  hoveredCountry: string | null;
  setHoveredCountry: (name: string | null) => void;
  onToggleCountry: (id: string, name: string) => void;
  clientCountMetric?: string;
  showGraticule?: boolean;
  avatarInitials?: string;
  onSelectCountryTab?: () => void;
}

export const MapCanvas = forwardRef<HTMLDivElement, MapCanvasProps>(({
  name,
  title,
  tagline,
  skills,
  selectedCountryIds,
  countryNamesMap,
  theme,
  aspectRatio,
  hoveredCountry,
  setHoveredCountry,
  onToggleCountry,
  clientCountMetric,
  showGraticule = true,
  avatarInitials,
}, ref) => {
  const selectedCount = selectedCountryIds.length;
  const continentCount = React.useMemo(() => countContinents(selectedCountryIds), [selectedCountryIds]);

  // Selected country names for bottom ticker or quick display
  const selectedNames = React.useMemo(() => {
    return selectedCountryIds
      .map(id => countryNamesMap.get(id))
      .filter((n): n is string => Boolean(n));
  }, [selectedCountryIds, countryNamesMap]);

  // Flag emoji list for top selected
  const topFlags = React.useMemo(() => {
    return selectedCountryIds.slice(0, 10).map(id => getCountryFlag(id));
  }, [selectedCountryIds]);

  // Derive initials from name if not custom
  const computedInitials = React.useMemo(() => {
    if (avatarInitials && avatarInitials.trim()) return avatarInitials.trim().slice(0, 2).toUpperCase();
    if (!name.trim()) return 'ME';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name, avatarInitials]);

  // Aspect ratio classes for responsive container (2 sizes: 4:5 and 1:1)
  const getAspectRatioStyle = () => {
    switch (aspectRatio) {
      case '4:5':
        return { aspectRatio: '4 / 5', minHeight: '660px' };
      case '1:1':
      default:
        return { aspectRatio: '1 / 1', minHeight: '580px' };
    }
  };

  return (
    <div
      ref={ref}
      id="export-map-canvas"
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
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-20 blur-[100px]"
        style={{
          background: `radial-gradient(circle, ${theme.accentColor} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none opacity-15 blur-[90px]"
        style={{
          background: `radial-gradient(circle, ${theme.accentSecondary} 0%, transparent 70%)`,
        }}
      />

      {/* TOP HEADER SECTION */}
      <div className="relative z-10 px-8 pt-7 pb-3 flex flex-col gap-3.5">
        {/* Top row: Avatar/Monogram + Name + Title + Metric badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Monogram / Avatar with glowing ring */}
            <div
              className="relative w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg tracking-wider shrink-0 transition-transform shadow-md"
              style={{
                backgroundColor: theme.tagBg,
                color: theme.accentColor,
                border: `1.5px solid ${theme.tagBorder}`,
              }}
            >
              <span className="font-mono">{computedInitials}</span>
              <div
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2"
                style={{
                  backgroundColor: theme.accentColor,
                  borderColor: theme.canvasBg,
                }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1
                  className="text-2xl lg:text-3xl font-extrabold tracking-tight"
                  style={{ color: theme.textPrimary }}
                >
                  {name || 'Your Name'}
                </h1>
                <div
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase"
                  style={{
                    backgroundColor: theme.tagBg,
                    color: theme.accentColor,
                    border: `1px solid ${theme.tagBorder}`,
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Global Reach</span>
                </div>
              </div>

              <p
                className="text-sm lg:text-base font-medium mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                {title || 'Professional Title'}
              </p>
            </div>
          </div>

          {/* Right Metrics Stat Box */}
          <div className="text-right shrink-0">
            <div className="flex items-baseline justify-end gap-1.5">
              <span
                className="text-2xl lg:text-3xl font-mono font-extrabold tabular-nums tracking-tight"
                style={{ color: theme.accentColor }}
              >
                {selectedCount}
              </span>
              <span
                className="text-xs uppercase tracking-wider font-semibold"
                style={{ color: theme.textMuted }}
              >
                {selectedCount === 1 ? 'Country' : 'Countries'}
              </span>
            </div>
            <p
              className="text-xs font-mono tabular-nums mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              {continentCount} {continentCount === 1 ? 'Continent' : 'Continents'} · {clientCountMetric || '100% Remote'}
            </p>
          </div>
        </div>

        {/* Optional Tagline */}
        {tagline && (
          <p
            className="text-xs lg:text-sm max-w-3xl leading-relaxed"
            style={{ color: theme.textSecondary }}
          >
            {tagline}
          </p>
        )}

        {/* Core Skills Tags */}
        {skills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span
              className="text-[11px] font-semibold uppercase tracking-wider mr-1"
              style={{ color: theme.textMuted }}
            >
              Stack:
            </span>
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium transition-colors"
                style={{
                  backgroundColor: theme.tagBg,
                  color: theme.tagText,
                  border: `1px solid ${theme.tagBorder}`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CENTER INTERACTIVE WORLD MAP */}
      <div className="relative z-10 flex-1 w-full px-4 min-h-[240px] flex items-center justify-center">
        <WorldMap
          selectedIds={selectedCountryIds}
          theme={theme}
          onToggleCountry={onToggleCountry}
          hoveredCountry={hoveredCountry}
          setHoveredCountry={setHoveredCountry}
          showGraticule={showGraticule}
        />
      </div>

      {/* BOTTOM FOOTER SECTION & WATERMARK */}
      <div
        className="relative z-10 px-8 py-3 flex items-center justify-between border-t transition-colors"
        style={{
          borderTopColor: theme.cardBorder,
          backgroundColor: theme.type === 'dark' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.45)',
        }}
      >
        {/* Left: Flag Icons & Active Country Ticker */}
        <div className="flex items-center gap-2 overflow-hidden text-xs">
          {topFlags.length > 0 && (
            <div className="flex items-center gap-1 text-sm shrink-0">
              {topFlags.map((flag, idx) => (
                <span key={idx}>{flag}</span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5 truncate" style={{ color: theme.textSecondary }}>
            {hoveredCountry ? (
              <span className="font-semibold flex items-center gap-1" style={{ color: theme.textPrimary }}>
                <MapPin className="w-3 h-3 shrink-0" />
                <span>{hoveredCountry}</span>
              </span>
            ) : (
              <span className="truncate text-[11px]">
                {selectedNames.length > 0
                  ? selectedNames.slice(0, 5).join(' · ') + (selectedNames.length > 5 ? ` +${selectedNames.length - 5} more` : '')
                  : 'Click on countries to highlight your global client network'}
              </span>
            )}
          </div>
        </div>

        {/* Right Watermark: Mandatory requirement: "Generated by yourmap.me" */}
        <div
          className="flex items-center gap-1.5 shrink-0 text-xs font-semibold tracking-wide ml-4"
          style={{ color: theme.watermarkColor }}
        >
          <span className="opacity-80">Generated by</span>
          <span
            className="font-bold tracking-tight px-1.5 py-0.5 rounded"
            style={{
              color: theme.accentColor,
              backgroundColor: theme.tagBg,
            }}
          >
            yourmap.me
          </span>
        </div>
      </div>
    </div>
  );
});

MapCanvas.displayName = 'MapCanvas';
