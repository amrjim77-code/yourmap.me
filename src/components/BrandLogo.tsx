import React, { useEffect, useState } from 'react';
import { ColorSwatch } from '../data/palette';

interface BrandLogoProps {
  themeColor?: ColorSwatch;
  color?: string;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}

// Pre-rendered, high-resolution theme-matched logos for zero latency
export const THEME_LOGOS: Record<string, string> = {
  'cream-forest': '/logos/YMlogo-cream-forest.png',
  'midnight-periwinkle': '/logos/YMlogo-midnight-periwinkle.png',
  'sand-coral': '/logos/YMlogo-sand-coral.png',
  'glacier-azure': '/logos/YMlogo-glacier-azure.png',
  'obsidian-emerald': '/logos/YMlogo-obsidian-emerald.png',
};

/**
 * BrandLogo: Displays yourmap.me logo dynamically tinted to match
 * the active theme accent color across canvases, pills, and headers.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  themeColor,
  color,
  className = 'w-4 h-4 object-contain shrink-0',
  alt = 'yourmap.me',
  style,
}) => {
  const [dynamicSrc, setDynamicSrc] = useState<string>('');

  const targetHex = color || themeColor?.hex;
  const themeId = themeColor?.id;

  useEffect(() => {
    // If it's a known theme, use the pre-rendered pixel-perfect asset immediately
    if (themeId && THEME_LOGOS[themeId]) {
      setDynamicSrc(THEME_LOGOS[themeId]);
      return;
    }

    if (!targetHex) {
      setDynamicSrc('/YMlogo-black.png');
      return;
    }

    // Dynamic off-screen canvas tinting for any arbitrary hex color
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/YMlogo-black.png';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = targetHex;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setDynamicSrc(canvas.toDataURL('image/png'));
      } catch {
        setDynamicSrc('/YMlogo-black.png');
      }
    };
    img.onerror = () => setDynamicSrc('/YMlogo-black.png');
  }, [themeId, targetHex]);

  // Synchronous resolution for known themes ensures instant render with 0 flash
  const resolvedSrc = (themeId && THEME_LOGOS[themeId]) || dynamicSrc || '/YMlogo-black.png';

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      style={style}
    />
  );
};
