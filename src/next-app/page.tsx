'use client';

/**
 * yourmap.me - Next.js (App Router) Single-Page Web Application
 * Complete, copy-pasteable implementation for app/page.tsx
 */

import React, { useState, useRef, useMemo, useCallback } from 'react';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import {
  Globe,
  Briefcase,
  Layers,
  LayoutGrid,
  Search,
  Plus,
  Download,
  Copy,
  CheckCheck,
  RotateCcw,
  Sparkles,
  Camera,
  X,
  Code2,
  Database,
  Palette,
  Cloud,
  TrendingUp,
  Cpu,
  ChevronDown,
  ChevronRight,
  User,
  Briefcase,
  Layout,
  CheckCircle2,
} from 'lucide-react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Sphere } from 'react-simple-maps';
import worldGeoData from '../data/world-110m.json';

// --- DATA & CONSTANTS ---
export interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
  secondaryHex: string;
  glow: string;
}

export const COLOR_SWATCHES: ColorSwatch[] = [
  { id: 'electric-blue', name: 'Electric Blue', hex: '#3b82f6', secondaryHex: '#60a5fa', glow: 'rgba(59, 130, 246, 0.5)' },
  { id: 'emerald-green', name: 'Emerald Green', hex: '#10b981', secondaryHex: '#34d399', glow: 'rgba(16, 185, 129, 0.5)' },
  { id: 'indigo', name: 'Indigo', hex: '#6366f1', secondaryHex: '#818cf8', glow: 'rgba(99, 102, 241, 0.5)' },
  { id: 'amber', name: 'Amber', hex: '#f59e0b', secondaryHex: '#fbbf24', glow: 'rgba(245, 158, 11, 0.5)' },
  { id: 'sunset-rose', name: 'Sunset Rose', hex: '#f43f5e', secondaryHex: '#fb7185', glow: 'rgba(244, 63, 94, 0.5)' },
];

export interface Skill {
  id: string;
  name: string;
  category: string;
  isCore?: boolean;
}

export const PRESET_CATEGORIES = ['Frontend', 'Backend', 'UI/UX', 'Cloud', 'Marketing', 'AI & Data'];

export const PREPOPULATED_SKILLS: Record<string, string[]> = {
  Frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'WebGL', 'Svelte', 'Redux'],
  Backend: ['Node.js', 'Python', 'PostgreSQL', 'GraphQL', 'REST APIs', 'Go', 'Rust', 'Redis'],
  'UI/UX': ['Figma', 'Design Systems', 'User Research', 'Wireframing', 'Prototyping', 'Brand Identity'],
  Cloud: ['AWS', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Terraform', 'GCP', 'Serverless', 'Cloudflare'],
  Marketing: ['Technical SEO', 'Conversion Optimization', 'Product-Led Growth', 'Google Analytics', 'A/B Testing'],
  'AI & Data': ['LLMs & Agents', 'Prompt Engineering', 'RAG Systems', 'OpenAI & Gemini APIs', 'PyTorch'],
};

export const INITIAL_SKILLS: Skill[] = [
  { id: 's-1', name: 'Next.js', category: 'Frontend', isCore: true },
  { id: 's-2', name: 'React', category: 'Frontend', isCore: true },
  { id: 's-3', name: 'TypeScript', category: 'Frontend', isCore: true },
  { id: 's-4', name: 'Tailwind CSS', category: 'Frontend', isCore: true },
  { id: 's-5', name: 'Node.js', category: 'Backend', isCore: true },
  { id: 's-6', name: 'PostgreSQL', category: 'Backend', isCore: true },
  { id: 's-7', name: 'Figma', category: 'UI/UX', isCore: true },
  { id: 's-8', name: 'Design Systems', category: 'UI/UX', isCore: true },
  { id: 's-9', name: 'AWS', category: 'Cloud', isCore: true },
  { id: 's-10', name: 'Docker', category: 'Cloud', isCore: false },
  { id: 's-11', name: 'LLMs & Agents', category: 'AI & Data', isCore: true },
  { id: 's-12', name: 'Conversion Optimization', category: 'Marketing', isCore: false },
];

export const CONTINENTS = ['Americas', 'Europe', 'Asia', 'Africa', 'Oceania'] as const;

export type ActiveTab = 'client-map' | 'skill-map' | 'combined';

// --- MAIN NEXT.JS PAGE COMPONENT ---
export default function YourmapPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core State
  const [activeTab, setActiveTab] = useState<ActiveTab>('client-map');
  const [userName, setUserName] = useState<string>('Alex Rivera');
  const [userTitle, setUserTitle] = useState<string>('Senior Full-Stack Engineer');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState<ColorSwatch>(COLOR_SWATCHES[0]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    '840', '124', '826', '276', '250', '392', '036', '702', '756', '528', '752',
  ]);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);

  // Sidebar & Layout State
  const [combinedSubTab, setCombinedSubTab] = useState<'countries' | 'skills'>('countries');
  const [countrySearch, setCountrySearch] = useState('');
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState('Frontend');
  const [aspectRatio, setAspectRatio] = useState<'4:5' | '1:1'>('1:1');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Avatar upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    if (!userName.trim()) return 'YM';
    const parts = userName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Toggle Country
  const handleToggleCountry = (id: string) => {
    setSelectedCountries(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  // Toggle Skill
  const handleToggleSkill = (name: string, category: string) => {
    setSkills(prev => {
      const found = prev.find(s => s.name.toLowerCase() === name.toLowerCase());
      if (found) return prev.filter(s => s.id !== found.id);
      return [...prev, { id: `skill-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name, category, isCore: true }];
    });
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const name = customSkillName.trim();
    if (!name) return;
    if (skills.some(s => s.name.toLowerCase() === name.toLowerCase())) return;
    setSkills(prev => [...prev, { id: `custom-${Date.now()}`, name, category: customSkillCategory, isCore: true }]);
    setCustomSkillName('');
  };

  // Export Engine: 2x Retina Export via html-to-image and file-saver
  const handleExport = async (format: 'png' | 'jpeg') => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      await htmlToImage.toPng(canvasRef.current, { pixelRatio: 1 });
      const options = { pixelRatio: 2, cacheBust: true, backgroundColor: '#090d16' };
      const blob = format === 'png'
        ? await htmlToImage.toBlob(canvasRef.current, options)
        : await htmlToImage.toBlob(canvasRef.current, { ...options, quality: 0.95 });

      if (blob) {
        const safeName = (userName.trim() || 'yourmap').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        saveAs(blob, `${safeName}-${activeTab}-${aspectRatio.replace(':', 'x')}.${format === 'png' ? 'png' : 'jpg'}`);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const blob = await htmlToImage.toBlob(canvasRef.current, { pixelRatio: 2, backgroundColor: '#090d16' });
      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Copy failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. TOP NAVIGATION & GLOBAL SETTINGS */}
      <header className="border-b border-slate-800 bg-slate-950/95 px-4 sm:px-6 py-2.5 z-30 shrink-0">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 max-w-[1700px] mx-auto">
          {/* Header Left: Logo & User Inputs */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-mono font-bold text-base text-white">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: themeColor.hex }}>
                <Globe className="w-4 h-4" />
              </div>
              <span>yourmap.me</span>
            </div>

            <div className="h-5 w-px bg-slate-800 hidden sm:block" />

            {/* Profile Photo Uploader */}
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-9 h-9 rounded-full overflow-hidden border-2 flex items-center justify-center bg-slate-800 group"
              style={{ borderColor: themeColor.hex }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-mono text-xs font-bold text-slate-200">{getInitials()}</span>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
            </button>

            {/* User Name & Role Inputs */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="Your Name"
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none w-28 sm:w-32"
              />
              <input
                type="text"
                value={userTitle}
                onChange={e => setUserTitle(e.target.value)}
                placeholder="Professional Role"
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none w-36 sm:w-44"
              />
            </div>
          </div>

          {/* Header Right: Mode Switcher & 5 Preset Color Swatches */}
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('client-map')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'client-map' ? 'text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                style={{ backgroundColor: activeTab === 'client-map' ? themeColor.hex : 'transparent' }}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Client Map</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('skill-map')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'skill-map' ? 'text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                style={{ backgroundColor: activeTab === 'skill-map' ? themeColor.hex : 'transparent' }}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Work & Services</span>
              </button>
            </div>

            {/* 5 Preset Color Swatches */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800">
              {COLOR_SWATCHES.map(swatch => (
                <button
                  key={swatch.id}
                  type="button"
                  onClick={() => setThemeColor(swatch)}
                  title={swatch.name}
                  className={`w-5 h-5 rounded-full transition-transform ${
                    themeColor.id === swatch.id ? 'ring-2 ring-white scale-110' : 'opacity-80'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* LEFT SIDEBAR: Dynamic Controls */}
        <aside className="w-full lg:w-[380px] xl:w-[410px] flex flex-col bg-slate-900/95 border-r border-slate-800 p-4 space-y-4 shrink-0 overflow-y-auto">
          {activeTab === 'client-map' || (activeTab === 'combined' && combinedSubTab === 'countries') ? (
            <>
              {/* Dynamic Counter */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Global Footprint</span>
                <h2 className="text-xl font-bold font-mono text-white">
                  <span style={{ color: themeColor.hex }}>{selectedCountries.length}</span>/195 Countries Served
                </h2>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter countries..."
                  value={countrySearch}
                  onChange={e => setCountrySearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Continents Categorized List & Country Pills */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Continents List</span>
                {['North America (US, CA)', 'Western Europe (UK, DE, FR)', 'Nordics (SE, NO, DK)', 'APAC (JP, SG, AU)'].map((group, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap gap-1.5">
                    {['840', '124', '826', '276', '250', '392', '036'].slice(idx * 2, idx * 2 + 3).map(id => {
                      const isSel = selectedCountries.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleToggleCountry(id)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                            isSel ? 'text-white font-semibold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                          }`}
                          style={isSel ? { backgroundColor: themeColor.hex, borderColor: themeColor.hex } : undefined}
                        >
                          Country {id}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Skill Map Dynamic Counter */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Capability Matrix</span>
                <h2 className="text-xl font-bold font-mono text-white">
                  <span style={{ color: themeColor.hex }}>{skills.length}</span> Skills Mapped
                </h2>
              </div>

              {/* Custom Skill Adder */}
              <form onSubmit={handleAddCustomSkill} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-slate-200 block">Add Custom Skill</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Skill name..."
                    value={customSkillName}
                    onChange={e => setCustomSkillName(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <select
                    value={customSkillCategory}
                    onChange={e => setCustomSkillCategory(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-slate-200"
                  >
                    {PRESET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={!customSkillName.trim()}
                  className="w-full py-1.5 rounded-xl text-white text-xs font-semibold shadow disabled:opacity-50"
                  style={{ backgroundColor: themeColor.hex }}
                >
                  Add Skill
                </button>
              </form>

              {/* Pre-populated Categorized Pills */}
              <div className="space-y-3">
                {Object.entries(PREPOPULATED_SKILLS).map(([cat, list]) => (
                  <div key={cat} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-slate-300 block">{cat}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {list.map(skillName => {
                        const isSel = skills.some(s => s.name.toLowerCase() === skillName.toLowerCase());
                        return (
                          <button
                            key={skillName}
                            type="button"
                            onClick={() => handleToggleSkill(skillName, cat)}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                              isSel ? 'text-white font-semibold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                            }`}
                            style={isSel ? { backgroundColor: themeColor.hex, borderColor: themeColor.hex } : undefined}
                          >
                            <span>{isSel ? '✓' : '+'}</span>
                            <span>{skillName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* 3. MAIN STAGE: THE EXPORTABLE CANVAS */}
        <main className="flex-1 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto bg-slate-950">
          <div className="flex-1 flex items-center justify-center max-w-[1200px] mx-auto w-full">
            <div
              ref={canvasRef}
              style={{
                aspectRatio: '16 / 9',
                minHeight: '540px',
                background: 'linear-gradient(145deg, #090d16 0%, #0d1527 50%, #080c14 100%)',
                borderColor: 'rgba(51, 65, 85, 0.45)',
              }}
              className="relative w-full rounded-2xl border flex flex-col justify-between shadow-2xl p-6"
            >
              {/* Canvas Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-bold text-white bg-slate-900" style={{ borderColor: themeColor.hex }}>
                    {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-2xl" /> : getInitials()}
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold text-white">{userName}</h1>
                    <p className="text-xs text-slate-300">{userTitle}</p>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl border text-xs font-semibold text-white" style={{ backgroundColor: `${themeColor.hex}20`, borderColor: themeColor.hex }}>
                  {activeTab === 'client-map'
                    ? `${selectedCountries.length} Countries Reached`
                    : activeTab === 'skill-map'
                    ? `${skills.length} Core Competencies`
                    : `${selectedCountries.length} Countries • ${skills.length} Competencies`}
                </div>
              </div>

              {/* Canvas Body */}
              <div className="flex-1 py-4 flex items-center justify-center">
                {activeTab === 'client-map' && (
                  <div className="w-full h-full flex items-center justify-center text-center text-slate-400">
                    <ComposableMap projection="geoEqualEarth" className="w-full h-[400px]">
                      <ZoomableGroup center={[0, 8]} zoom={1}>
                        <Sphere stroke="rgba(255,255,255,0.05)" id="s" fill="transparent" />
                        <Geographies geography={worldGeoData as any}>
                          {({ geographies }) =>
                            geographies.map((geo, idx) => {
                              const isSelected = selectedCountries.includes(String(geo.id));
                              return (
                                <Geography
                                  key={`rsm-${geo.rsmKey || geo.id || idx}`}
                                  geography={geo}
                                  onClick={() => handleToggleCountry(String(geo.id))}
                                  style={{
                                    default: { fill: isSelected ? themeColor.hex : '#1e293b', stroke: '#0f172a', strokeWidth: 0.5, outline: 'none' },
                                    hover: { fill: isSelected ? themeColor.hex : '#334155', outline: 'none' },
                                  } as any}
                                />
                              );
                            })
                          }
                        </Geographies>
                      </ZoomableGroup>
                    </ComposableMap>
                  </div>
                )}

                {activeTab === 'skill-map' && (
                  <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PRESET_CATEGORIES.map(category => {
                      const catSkills = skills.filter(s => s.category === category);
                      if (catSkills.length === 0) return null;
                      return (
                        <div key={category} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                          <span className="text-xs font-bold text-white block mb-2">{category} ({catSkills.length})</span>
                          <div className="flex flex-wrap gap-1">
                            {catSkills.map(s => (
                              <span key={s.id} className="text-xs px-2 py-0.5 rounded-md border text-slate-200" style={{ backgroundColor: `${themeColor.hex}18`, borderColor: `${themeColor.hex}50` }}>
                                {s.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === 'combined' && (
                  <div className="w-full h-full flex divide-x divide-slate-800 gap-3">
                    <div className="w-1/2 flex items-center justify-center">
                      <ComposableMap projection="geoEqualEarth" className="w-full h-[320px]">
                        <ZoomableGroup center={[0, 8]} zoom={1}>
                          <Geographies geography={worldGeoData as any}>
                            {({ geographies }) =>
                              geographies.map((geo, idx) => {
                                const isSelected = selectedCountries.includes(String(geo.id));
                                return (
                                  <Geography
                                    key={`rsm-comb-${geo.rsmKey || geo.id || idx}`}
                                    geography={geo}
                                    style={{
                                      default: { fill: isSelected ? themeColor.hex : '#1e293b', stroke: '#0f172a', strokeWidth: 0.5, outline: 'none' },
                                    } as any}
                                  />
                                );
                              })
                            }
                          </Geographies>
                        </ZoomableGroup>
                      </ComposableMap>
                    </div>

                    <div className="w-1/2 pl-3 grid grid-cols-2 gap-2 content-start overflow-y-auto">
                      {PRESET_CATEGORIES.map(category => {
                        const catSkills = skills.filter(s => s.category === category);
                        if (catSkills.length === 0) return null;
                        return (
                          <div key={category} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                            <span className="text-[11px] font-bold text-white block mb-1">{category}</span>
                            <div className="flex flex-wrap gap-1">
                              {catSkills.map(s => (
                                <span key={s.id} className="text-[10px] px-1.5 py-0.5 rounded border text-slate-200" style={{ backgroundColor: `${themeColor.hex}15`, borderColor: `${themeColor.hex}40` }}>
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Canvas Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Active across multiple continents • {userTitle}</span>
                <span className="font-mono text-[11px] font-semibold text-slate-400">
                  Generated with <strong className="text-white">yourmap.me</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 4. EXPORT & DOWNLOAD BAR */}
          <div className="max-w-[1200px] mx-auto w-full mt-4 flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Format:</span>
              <button type="button" onClick={() => setAspectRatio('4:5')} className={`px-2.5 py-1 rounded text-xs ${aspectRatio === '4:5' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>4:5</button>
              <button type="button" onClick={() => setAspectRatio('1:1')} className={`px-2.5 py-1 rounded text-xs ${aspectRatio === '1:1' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>1:1</button>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={handleCopy} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-white">
                {copiedSuccess ? 'Copied!' : 'Copy Image'}
              </button>
              <button type="button" onClick={() => handleExport('jpeg')} disabled={isExporting} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-white">
                Download JPG
              </button>
              <button
                type="button"
                onClick={() => handleExport('png')}
                disabled={isExporting}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow"
                style={{ backgroundColor: themeColor.hex }}
              >
                {isExporting ? 'Generating...' : 'Download PNG'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
