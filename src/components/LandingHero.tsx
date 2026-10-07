import React, { useMemo } from 'react';
import { ArrowDown } from 'lucide-react';
import { ColorSwatch } from '../data/palette';
import { Globe } from '@/components/ui/globe';
import { BrandLogo } from './BrandLogo';

interface LandingHeroProps {
  themeColor: ColorSwatch;
  onScrollToStudio: () => void;
  onLoadDemo?: () => void;
}

// Helper to convert hex to [r, g, b] normalized (0-1) for cobe
function hexToNormalizedRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (clean.length < 6) return [16 / 255, 185 / 255, 129 / 255];
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [r, g, b];
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  themeColor,
  onScrollToStudio,
}) => {
  // Dynamically adapt globe marker color to selected theme swatch
  const globeConfig = useMemo(() => {
    const markerRgb = hexToNormalizedRgb(themeColor.hex);
    return {
      width: 1000,
      height: 1000,
      onRender: () => {},
      devicePixelRatio: 2,
      phi: 0,
      theta: 0.28,
      dark: 0,
      diffuse: 0.45,
      mapSamples: 18000,
      mapBrightness: 1.25,
      baseColor: [1, 1, 1] as [number, number, number],
      markerColor: markerRgb,
      glowColor: [1, 1, 1] as [number, number, number],
      markers: [
        { location: [14.5995, 120.9842] as [number, number], size: 0.035 },
        { location: [19.076, 72.8777] as [number, number], size: 0.09 },
        { location: [23.8103, 90.4125] as [number, number], size: 0.06 },
        { location: [30.0444, 31.2357] as [number, number], size: 0.07 },
        { location: [39.9042, 116.4074] as [number, number], size: 0.08 },
        { location: [-23.5505, -46.6333] as [number, number], size: 0.09 },
        { location: [19.4326, -99.1332] as [number, number], size: 0.09 },
        { location: [40.7128, -74.006] as [number, number], size: 0.09 },
        { location: [34.6937, 135.5022] as [number, number], size: 0.05 },
        { location: [41.0082, 28.9784] as [number, number], size: 0.06 },
      ],
    };
  }, [themeColor]);

  return (
    <section className="relative overflow-hidden pt-14 pb-4 px-4 sm:px-6 bg-white border-b border-[#e0e0e0]">
      <div className="max-w-[1100px] mx-auto text-center space-y-6">
        {/* Apple Pill Tag / Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e0e0e0] bg-[#f5f5f7] text-[13px] text-[#1d1d1f] shadow-2xs font-normal">
          <BrandLogo themeColor={themeColor} className="w-4 h-4 object-contain shrink-0" />
          <span>yourmap.me · Show the world where you work.</span>
        </div>

        {/* Hero Display Headline (H1) */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-[-0.035em] leading-[1.08] bg-gradient-to-b from-black via-zinc-800 to-gray-400/80 bg-clip-text text-transparent pb-1">
          Where in the World is Your Work?
        </h1>

        {/* Lead Subtitle / Description */}
        <p className="text-[17px] sm:text-[21px] text-[#6e6e73] max-w-2xl mx-auto leading-[1.47] tracking-[-0.015em] font-normal">
          The ultimate work map generator for professionals. Select what you do , highlight the countries you’ve worked with, and download a beautiful infographic of your global footprint in seconds.
        </p>

        {/* Action Button */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* button-primary: Start Picking Countries */}
          <button
            type="button"
            onClick={onScrollToStudio}
            className="px-6 py-2.5 rounded-full text-white text-[15px] font-semibold transition-all hover:bg-[#0071e3] active:scale-95 shadow-sm cursor-pointer flex items-center gap-2"
            style={{ backgroundColor: themeColor.hex }}
          >
            <span>Start Picking Countries</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* Massive 3D Rotating Globe - Seamlessly mixed & blended into the website */}
        <div className="relative w-full max-w-[1050px] mx-auto flex items-center justify-center overflow-hidden mt-4 h-[360px] sm:h-[480px] md:h-[560px]">
          {/* Subtle ambient illumination behind the globe */}
          <div
            className="pointer-events-none absolute inset-0 transition-colors duration-500"
            style={{
              backgroundImage: `radial-gradient(ellipse at 50% 50%, ${themeColor.hex}18, transparent 70%)`,
            }}
          />

          {/* Large 3D Globe with cropped lower sphere */}
          <Globe
            key={`hero-globe-${themeColor.id}`}
            className="w-[700px] sm:w-[900px] md:w-[1050px] aspect-square max-w-none -top-10 sm:-top-16 md:-top-20"
            config={globeConfig}
          />

          {/* Smooth bottom gradient blend melting into the page background */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-44 bg-gradient-to-t from-white via-white/85 to-transparent z-10" />
        </div>
      </div>
    </section>
  );
};
