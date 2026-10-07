import React, { memo, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Sphere, Graticule } from 'react-simple-maps';
import worldGeoData from '../data/world-110m.json';
import { ThemeDefinition } from '../data/themes';
import { getCountryFlag } from '../data/countries';
import { ZoomIn, ZoomOut, RotateCcw, Check, Plus } from 'lucide-react';

interface WorldMapProps {
  selectedIds: string[];
  theme: ThemeDefinition;
  onToggleCountry: (id: string, name: string) => void;
  hoveredCountry: string | null;
  setHoveredCountry: (name: string | null) => void;
  showGraticule?: boolean;
  projectionType?: 'geoEqualEarth' | 'geoMercator';
}

export const WorldMap: React.FC<WorldMapProps> = memo(({
  selectedIds,
  theme,
  onToggleCountry,
  hoveredCountry,
  setHoveredCountry,
  showGraticule = true,
  projectionType = 'geoEqualEarth',
}) => {
  const selectedSet = React.useMemo(() => new Set(selectedIds), [selectedIds]);

  // Zoom & Pan state
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [0, 8],
    zoom: 1,
  });

  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom * 1.4, 4) }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom / 1.4, 1) }));
  };

  const handleResetZoom = () => {
    setPosition({ coordinates: [0, 8], zoom: 1 });
  };

  const handleMoveEnd = (pos: { coordinates?: [number, number]; zoom?: number }) => {
    if (pos.coordinates && typeof pos.zoom === 'number') {
      setPosition({ coordinates: pos.coordinates, zoom: pos.zoom });
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden group">
      {/* Subtle background glow behind active countries */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 blur-3xl transition-colors duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${theme.glowColor || theme.accentColor} 0%, transparent 70%)`
        }}
      />

      {/* Floating Interactive Tooltip when hovering over any country */}
      {hoveredCountry && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-3.5 py-1.5 rounded-full backdrop-blur-md border text-xs font-semibold flex items-center gap-2 shadow-xl animate-fadeIn transition-all"
          style={{
            backgroundColor: theme.type === 'dark' ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: hoveredCountryId && selectedSet.has(hoveredCountryId) ? theme.accentColor : theme.cardBorder,
            color: theme.textPrimary,
          }}
        >
          <span className="text-base leading-none">
            {hoveredCountryId ? getCountryFlag(hoveredCountryId) : '🌐'}
          </span>
          <span className="font-bold tracking-tight">{hoveredCountry}</span>
          <span className="opacity-30">|</span>
          {hoveredCountryId && selectedSet.has(hoveredCountryId) ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: theme.accentColor }}>
              <Check className="w-3 h-3" />
              <span>Active Client (Click to remove)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] opacity-75 font-normal">
              <Plus className="w-3 h-3" />
              <span>Click to add</span>
            </span>
          )}
        </div>
      )}

      {/* On-Map Zoom Controls Toolbar (Friendly and Accessible) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col items-center bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl p-1 shadow-lg gap-1">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In (Click smaller countries)"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        {position.zoom > 1 && (
          <button
            type="button"
            onClick={handleResetZoom}
            title="Reset View"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <ComposableMap
        projection={projectionType}
        projectionConfig={{
          scale: projectionType === 'geoEqualEarth' ? 145 : 110,
          center: [0, 8],
        }}
        width={800}
        height={410}
        className="w-full h-full max-h-[520px]"
        style={{ outline: 'none' }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={4}
        >
          {/* Decorative ocean boundary and coordinate graticules */}
          {showGraticule && (
            <>
              <Sphere stroke={theme.type === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'} strokeWidth={0.5} id="sphere" fill="transparent" />
              <Graticule stroke={theme.type === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} strokeWidth={0.5} />
            </>
          )}

          <Geographies geography={worldGeoData as any}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryId = String(geo.id);
                const countryName = geo.properties?.name || '';
                // Exclude Antarctica from dominating the canvas unless explicitly chosen
                const isAntarctica = countryId === '010' || countryName.toLowerCase() === 'antarctica';
                if (isAntarctica && !selectedSet.has(countryId)) {
                  return null;
                }

                const isSelected = selectedSet.has(countryId);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onToggleCountry(countryId, countryName)}
                    onMouseEnter={() => {
                      setHoveredCountry(countryName);
                      setHoveredCountryId(countryId);
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry(null);
                      setHoveredCountryId(null);
                    }}
                    style={{
                      default: {
                        fill: isSelected ? theme.landHighlight : theme.landDefault,
                        stroke: isSelected ? theme.accentColor : theme.landStroke,
                        strokeWidth: isSelected ? 0.9 : 0.45,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      hover: {
                        fill: isSelected ? theme.accentSecondary : theme.landHover,
                        stroke: theme.accentColor,
                        strokeWidth: 1.2,
                        outline: 'none',
                        cursor: 'pointer',
                        filter: isSelected ? 'drop-shadow(0px 0px 4px ' + theme.accentColor + ')' : undefined,
                      },
                      pressed: {
                        fill: theme.accentSecondary,
                        stroke: theme.accentColor,
                        strokeWidth: 1.2,
                        outline: 'none',
                      },
                    } as any}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Map interaction footer hint */}
      <div 
        className="absolute bottom-2 left-3 text-[11px] font-medium tracking-tight pointer-events-none flex items-center gap-1.5 transition-opacity"
        style={{ color: theme.textMuted }}
      >
        <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: theme.accentColor }} />
        <span>Click any country · Drag to pan · Scroll or buttons to zoom</span>
      </div>
    </div>
  );
});

WorldMap.displayName = 'WorldMap';
