export interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
  secondaryHex: string;
  glow: string;
  bgTint: string;
  cardBg: string;
  cardBorder: string;
  isDark: boolean;
  textPrimary: string;
  textSecondary: string;
  landDefault: string;
  landStroke: string;
  landHover: string;
  subcardBg: string;
  subcardBorder: string;
  trackBg: string;
}

// Exactly the 5 requested dual-tone themes from the user reference
export const COLOR_SWATCHES: ColorSwatch[] = [
  // 1. Warm Alabaster + Deep Forest Green (Light)
  {
    id: 'cream-forest',
    name: 'Alabaster & Forest Green',
    hex: '#16774e',
    secondaryHex: '#22a072',
    glow: 'rgba(22, 119, 78, 0.45)',
    bgTint: 'rgba(22, 119, 78, 0.12)',
    cardBg: '#f6f4ee',
    cardBorder: '#e3ddd1',
    isDark: false,
    textPrimary: '#16191d',
    textSecondary: '#64748b',
    landDefault: '#dfd7ca',
    landStroke: '#cec4b3',
    landHover: '#cfc5b3',
    subcardBg: '#ece4d6',
    subcardBorder: '#ded4c4',
    trackBg: '#e6dfd3',
  },
  // 2. Midnight Navy + Electric Periwinkle Blue (Dark)
  {
    id: 'midnight-periwinkle',
    name: 'Midnight & Periwinkle',
    hex: '#597ef7',
    secondaryHex: '#819ffb',
    glow: 'rgba(89, 126, 247, 0.45)',
    bgTint: 'rgba(89, 126, 247, 0.15)',
    cardBg: '#161726',
    cardBorder: '#27293e',
    isDark: true,
    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    landDefault: '#23253b',
    landStroke: '#2e314d',
    landHover: '#313350',
    subcardBg: '#1d1e30',
    subcardBorder: '#2c2e47',
    trackBg: '#25263d',
  },
  // 3. Warm Ivory Linen + Sunset Coral Red (Light)
  {
    id: 'sand-coral',
    name: 'Ivory & Sunset Coral',
    hex: '#f2543d',
    secondaryHex: '#fa7a67',
    glow: 'rgba(242, 84, 61, 0.45)',
    bgTint: 'rgba(242, 84, 61, 0.12)',
    cardBg: '#faf4ea',
    cardBorder: '#e7ded0',
    isDark: false,
    textPrimary: '#1c1917',
    textSecondary: '#78716c',
    landDefault: '#e6ded0',
    landStroke: '#d6cbba',
    landHover: '#d8cdbc',
    subcardBg: '#efe5d6',
    subcardBorder: '#dfd4c1',
    trackBg: '#e7ded0',
  },
  // 4. Glacier Ice White + Vivid Azure Blue (Light)
  {
    id: 'glacier-azure',
    name: 'Glacier & Azure Blue',
    hex: '#0f7af0',
    secondaryHex: '#459bf4',
    glow: 'rgba(15, 122, 240, 0.45)',
    bgTint: 'rgba(15, 122, 240, 0.12)',
    cardBg: '#edf4fa',
    cardBorder: '#dbe6f0',
    isDark: false,
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    landDefault: '#d3e2ee',
    landStroke: '#c0d4e4',
    landHover: '#bcd1e2',
    subcardBg: '#dfe9f2',
    subcardBorder: '#cfdce8',
    trackBg: '#dbe6f0',
  },
  // 5. Obsidian Jet Black + Neon Emerald Green (Dark - Default)
  {
    id: 'obsidian-emerald',
    name: 'Obsidian & Neon Emerald',
    hex: '#10b981',
    secondaryHex: '#34d399',
    glow: 'rgba(16, 185, 129, 0.45)',
    bgTint: 'rgba(16, 185, 129, 0.14)',
    cardBg: '#10141d',
    cardBorder: '#1e293b',
    isDark: true,
    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    landDefault: '#1c2433',
    landStroke: '#283548',
    landHover: '#253145',
    subcardBg: '#161c28',
    subcardBorder: '#232f42',
    trackBg: '#1e2638',
  },
];
