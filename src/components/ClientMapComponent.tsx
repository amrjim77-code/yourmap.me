import React, { memo, useState, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  useMapContext,
} from 'react-simple-maps';
import worldGeoData from '../data/world-110m.json';
import countryCoordinatesData from '../data/countryCoordinates.json';
import { ColorSwatch } from '../data/palette';

interface ClientMapComponentProps {
  selectedCountries: string[];
  homeCountry?: string; // Starting point where the user works from
  onToggleCountry?: (id: string, name: string) => void;
  themeColor: ColorSwatch;
  compact?: boolean;
  aspectRatio?: '4:5' | '1:1';
  showLabels?: boolean;
  countryNamesMap?: Map<string, string>;
  animated?: boolean;
}

const countryCoordinates = countryCoordinatesData as unknown as Record<string, [number, number]>;

// Custom label offset adjustments to ensure zero overlap and spacious breathing room
const LABEL_OFFSETS: Record<string, { dx: number; dy: number; hasLeader?: boolean }> = {
  '156': { dx: 6, dy: -12 },                  // China: spacious placement above south/east asia
  '050': { dx: 0, dy: -12 },                  // Bangladesh: distinct upward position above pin
  '356': { dx: -12, dy: 14 },                 // India: southwest into southern peninsula, avoiding Bangladesh
  '764': { dx: 18, dy: 4 },                   // Thailand: eastward into Indochina
  '458': { dx: 26, dy: -2 },                  // Malaysia: eastward across South China Sea
  '702': { dx: 18, dy: 14, hasLeader: true }, // Singapore: southeast with clean leader line
  '682': { dx: -4, dy: -4 },                  // Saudi Arabia: central Arabian peninsula
  '392': { dx: 18, dy: -2 },                  // Japan: off coast to the right
  '840': { dx: 0, dy: 0 },                    // United States: centered
  '124': { dx: 0, dy: -10 },                  // Canada: centered upper
  '826': { dx: -8, dy: -12 },                 // United Kingdom: upper-left
  '276': { dx: 10, dy: 14 },                  // Germany: down-right into central Europe
  '250': { dx: -10, dy: 14 },                 // France: down-left
  '528': { dx: 14, dy: -6, hasLeader: true }, // Netherlands: northeast with leader
  '036': { dx: 0, dy: 6 },                    // Australia: centered
  '784': { dx: 14, dy: 8, hasLeader: true },  // UAE: with leader line
};

/**
 * Animated Flight Paths and Traveling Photon Particles
 * Renders directly inside ComposableMap SVG using projection from useMapContext
 * All paths originate from homeCountry (starting point) radiating outward to client countries
 */
const AnimatedFlightLayer: React.FC<{
  selectedCountries: string[];
  homeCountry?: string;
  themeColor: ColorSwatch;
}> = ({ selectedCountries, homeCountry, themeColor }) => {
  const { projection } = useMapContext();

  const paths = useMemo(() => {
    if (!projection) return [];

    // Starting point is homeCountry if provided, otherwise first selected country
    const hubId = homeCountry || (selectedCountries.length > 0 ? selectedCountries[0] : undefined);
    if (!hubId) return [];

    const hubCoord = countryCoordinates[hubId];
    if (!hubCoord) return [];
    const hubPt = projection(hubCoord);
    if (!hubPt) return [];

    // All destinations are client countries excluding the starting point itself
    const otherIds = selectedCountries.filter(id => id !== hubId);
    if (otherIds.length === 0) return [];

    return otherIds
      .map(id => {
        const targetCoord = countryCoordinates[id];
        if (!targetCoord) return null;
        const targetPt = projection(targetCoord);
        if (!targetPt) return null;

        const startX = hubPt[0];
        const startY = hubPt[1];
        const endX = targetPt[0];
        const endY = targetPt[1];

        // Quadratic curve arching upward
        const midX = (startX + endX) / 2;
        const dx = Math.abs(endX - startX);
        const midY = Math.min(startY, endY) - Math.max(15, dx * 0.22);

        return {
          id,
          d: `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`,
        };
      })
      .filter(Boolean) as Array<{ id: string; d: string }>;
  }, [projection, selectedCountries, homeCountry]);

  if (paths.length === 0) return null;

  return (
    <g className="flight-layer pointer-events-none">
      {paths.map((p, idx) => (
        <g key={`flight-arc-${p.id}`}>
          {/* Base Curved Flight Path */}
          <path
            d={p.d}
            fill="none"
            stroke="url(#flight-gradient)"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.85"
            style={{
              filter: `drop-shadow(0 0 4px ${themeColor.hex})`,
            }}
          />

          {/* Traveling Photon Comet Glow radiating from starting point to destination */}
          <circle r="4.5" fill={themeColor.hex} opacity="0.6">
            <animateMotion
              path={p.d}
              dur="2.4s"
              repeatCount="indefinite"
              begin={`${(idx * 0.35) % 2.4}s`}
            />
          </circle>

          {/* Core White Pulse */}
          <circle r="2.8" fill="#ffffff">
            <animateMotion
              path={p.d}
              dur="2.4s"
              repeatCount="indefinite"
              begin={`${(idx * 0.35) % 2.4}s`}
            />
          </circle>
        </g>
      ))}
    </g>
  );
};

export const ClientMapComponent: React.FC<ClientMapComponentProps> = memo(({
  selectedCountries,
  homeCountry,
  onToggleCountry,
  themeColor,
  compact = false,
  aspectRatio = '1:1',
  showLabels = true,
  countryNamesMap,
  animated = false,
}) => {
  // All active countries on map include home base + client countries
  const allActiveCountries = useMemo(() => {
    const list = [...selectedCountries];
    if (homeCountry && !list.includes(homeCountry)) {
      list.unshift(homeCountry);
    }
    return list;
  }, [selectedCountries, homeCountry]);

  const selectedSet = useMemo(() => new Set(allActiveCountries), [allActiveCountries]);
  const [hoveredCountry, setHoveredCountry] = useState<{ id: string; name: string } | null>(null);

  // In 4:5 format: expand SVG viewBox height and increase scale to best-fit the portrait poster
  const isFourFive = aspectRatio === '4:5';
  const mapWidth = 800;
  const mapHeight = isFourFive ? 490 : 400;
  // Scale 172 in 4:5 gives maximum size while preserving all world boundaries with margin
  const mapScale = isFourFive ? 172 : compact ? 142 : 158;
  const mapCenter: [number, number] = isFourFive ? [6.5, 5] : [6.5, 7];

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden group ${
      isFourFive ? 'min-h-[280px] sm:min-h-[460px] md:min-h-[520px]' : 'min-h-[220px] sm:min-h-[340px] md:min-h-[380px]'
    }`}>
      {/* Floating Hover Badge in English */}
      {hoveredCountry && (
        <div
          className="absolute top-2 left-2 z-20 pointer-events-none px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2 backdrop-blur-md border"
          style={{
            backgroundColor: themeColor.isDark ? '#161c28f0' : '#fffffff0',
            borderColor: themeColor.subcardBorder || '#2a364d',
          }}
        >
          <div className="flex flex-col">
            <span
              className="text-xs font-semibold leading-tight"
              style={{ color: themeColor.textPrimary || '#ffffff' }}
            >
              {hoveredCountry.name}
            </span>
            <span
              className="text-[10px] font-mono leading-tight font-medium"
              style={{ color: themeColor.hex }}
            >
              {selectedSet.has(hoveredCountry.id)
                ? '✓ Client Country'
                : 'Click to highlight'}
            </span>
          </div>
        </div>
      )}

      {/* Map SVG Canvas - Responsive to container, best-fit without cropping */}
      <div className="w-full h-full flex items-center justify-center">
        <ComposableMap
          key={`composable-map-${themeColor.id}-${aspectRatio}-${compact ? 'compact' : 'full'}`}
          projection="geoEqualEarth"
          projectionConfig={{
            scale: mapScale,
            center: mapCenter,
          }}
          width={mapWidth}
          height={mapHeight}
          className="w-full h-full object-contain"
        >
          <defs>
            {/* Outer Drop Shadow Glow for Selected Countries */}
            <filter id="country-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="4"
                floodColor={themeColor.hex}
                floodOpacity="0.65"
              />
            </filter>

            {/* Flight Path Gradient */}
            <linearGradient id="flight-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="30%" stopColor={themeColor.hex} stopOpacity="1" />
              <stop offset="70%" stopColor={themeColor.hex} stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
            </linearGradient>

            {/* Pin Node Glow Filter */}
            <filter id="pin-glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Geographies: Unselected countries dynamically filled with theme landDefault, Selected in themeColor.hex */}
          <Geographies geography={worldGeoData as any}>
            {({ geographies }) =>
              geographies.map((geo, idx) => {
                const id = (geo.id ? String(geo.id) : geo.properties?.name || `geo-${idx}`) as string;
                const name = (geo.properties?.name || 'Country') as string;
                const isSelected = selectedSet.has(id);
                const isHovered = hoveredCountry?.id === id;

                const countryFill = isSelected
                  ? themeColor.hex
                  : isHovered
                  ? themeColor.landHover
                  : themeColor.landDefault;

                const countryStroke = isSelected
                  ? '#ffffff'
                  : isHovered
                  ? themeColor.hex
                  : themeColor.landStroke;

                const countryStrokeWidth = isSelected ? 1.2 : isHovered ? 1.0 : 0.6;

                return (
                  <Geography
                    key={`geo-${themeColor.id}-${id}`}
                    geography={geo}
                    onClick={() => onToggleCountry?.(id, name)}
                    onMouseEnter={() => setHoveredCountry({ id, name })}
                    onMouseLeave={() => setHoveredCountry(null)}
                    fill={countryFill}
                    stroke={countryStroke}
                    strokeWidth={countryStrokeWidth}
                    style={{
                      fill: countryFill,
                      stroke: countryStroke,
                      strokeWidth: countryStrokeWidth,
                      outline: 'none',
                      filter: isSelected ? 'url(#country-glow)' : 'none',
                      transition: 'fill 0.25s ease, stroke 0.25s ease',
                      cursor: 'pointer',
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Animated Flight Layer (Curves + Moving Photons radiating from homeCountry) */}
          {animated && (
            <AnimatedFlightLayer
              selectedCountries={selectedCountries}
              homeCountry={homeCountry}
              themeColor={themeColor}
            />
          )}

          {/* Singapore Pin Dot (Microstate at [103.82, 1.35]) */}
          {selectedSet.has('702') && (
            <Marker coordinates={[103.82, 1.35]}>
              <circle
                r={2.8}
                fill={themeColor.hex}
                stroke="#ffffff"
                strokeWidth={1}
                style={{ filter: `drop-shadow(0 0 4px ${themeColor.hex})` }}
              />
            </Marker>
          )}

          {/* Country Centroid Nodes & English Labels */}
          {allActiveCountries.map((id, idx) => {
            const coord = countryCoordinates[id];
            const displayName = countryNamesMap?.get(id) || id;
            if (!coord) return null;

            const isHome = id === homeCountry;
            const offset = LABEL_OFFSETS[id] || { dx: 0, dy: -6 };

            return (
              <Marker key={`label-marker-${id}`} coordinates={coord}>
                {/* Special Base Country Origin Ring */}
                {isHome && (
                  <circle
                    r={5.5}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={1.1}
                    strokeDasharray="2,2"
                    opacity={0.9}
                  />
                )}

                {/* Pulsing Radar Wave in Animated Mode (or Origin Beacon) */}
                {(animated || isHome) && (
                  <circle
                    r={3}
                    fill="none"
                    stroke={themeColor.hex}
                    strokeWidth={isHome ? 1.5 : 1.2}
                    opacity={0.8}
                  >
                    <animate
                      attributeName="r"
                      from="3"
                      to={isHome ? "14" : "12"}
                      dur={isHome ? "1.8s" : "2.2s"}
                      repeatCount="indefinite"
                      begin={`${(idx * 0.3) % 2.2}s`}
                    />
                    <animate
                      attributeName="opacity"
                      from="0.8"
                      to="0"
                      dur={isHome ? "1.8s" : "2.2s"}
                      repeatCount="indefinite"
                      begin={`${(idx * 0.3) % 2.2}s`}
                    />
                  </circle>
                )}

                {/* Centroid Pin Dot - Clean, crisp, unobtrusive */}
                <circle
                  r={isHome ? 3.4 : 2.8}
                  fill={themeColor.hex}
                  opacity={1}
                  filter="url(#pin-glow)"
                />
                <circle
                  r={isHome ? 1.8 : 1.5}
                  fill="#ffffff"
                  stroke={themeColor.hex}
                  strokeWidth={0.6}
                />

                {/* Leader line for Singapore / offset microstates */}
                {showLabels && offset.hasLeader && (
                  <line
                    x1={0}
                    y1={0}
                    x2={offset.dx > 0 ? offset.dx - 6 : offset.dx + 6}
                    y2={offset.dy > 0 ? offset.dy - 6 : offset.dy + 6}
                    stroke={themeColor.isDark ? '#cbd5e1' : '#475569'}
                    strokeWidth={0.8}
                    strokeDasharray="2,2"
                    opacity={0.85}
                  />
                )}

                {/* Refined, Crisp Country Label Text in English */}
                {showLabels && (
                  <text
                    x={offset.dx}
                    y={offset.dy}
                    textAnchor="middle"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Inter, sans-serif',
                      fontSize: isFourFive ? '9.5px' : compact ? '8.5px' : '9px',
                      fontWeight: isHome ? 600 : 500,
                      fill: '#ffffff',
                      paintOrder: 'stroke fill',
                      stroke: themeColor.isDark ? '#0b0f17' : '#1e293b',
                      strokeWidth: '0.8px',
                      strokeLinejoin: 'round',
                      letterSpacing: '0.02em',
                      pointerEvents: 'none',
                    }}
                  >
                    {displayName}{isHome ? ' ★' : ''}
                  </text>
                )}
              </Marker>
            );
          })}
        </ComposableMap>
      </div>
    </div>
  );
});

ClientMapComponent.displayName = 'ClientMapComponent';
