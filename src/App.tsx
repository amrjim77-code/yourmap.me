/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  X,
  User,
  Briefcase,
  Globe,
  Lightbulb,
  MapPin,
  ChevronDown,
  ChevronRight,
  Check,
  ShieldCheck,
  Facebook,
  Linkedin,
  Mail,
} from 'lucide-react';
import { TopNav, ActiveTab } from './components/TopNav';
import { LandingHero } from './components/LandingHero';
import { ExportCanvas } from './components/ExportCanvas';
import { ExportBar } from './components/ExportBar';
import { WorkSelectionModal } from './components/WorkSelectionModal';
import { CountrySelectionModal } from './components/CountrySelectionModal';
import { LocationModal } from './components/LocationModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { COLOR_SWATCHES, ColorSwatch } from './data/palette';
import { Skill } from './data/skills';
import countryListData from './data/countryList.json';
import {
  loadUserLocalData,
  saveUserLocalData,
  optimizeImageForLocalStorage,
  STORAGE_KEYS,
} from './utils/browserStorage';

export default function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const exportCanvasRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load any previously saved user data from local browser storage (NO database)
  const initialLocalData = useMemo(() => loadUserLocalData(), []);

  // 1. Core State Setup - Glacier & Azure Blue (#0f7af0) default matching reference
  const activeTab: ActiveTab = 'client-map'; // Main workspace & export are always dedicated to the Map Poster
  const [userName, setUserName] = useState<string>(initialLocalData.userName || '');
  const [userTitle, setUserTitle] = useState<string>(initialLocalData.userTitle || '');
  const [homeCountry, setHomeCountry] = useState<string>(initialLocalData.homeCountry || '');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState<boolean>(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialLocalData.avatarUrl || null);
  const [themeColor, setThemeColor] = useState<ColorSwatch>(() => {
    if (initialLocalData.themeId) {
      const match = COLOR_SWATCHES.find(s => s.id === initialLocalData.themeId);
      if (match) return match;
    }
    return COLOR_SWATCHES[3];
  });
  const [showLabels, setShowLabels] = useState<boolean>(
    initialLocalData.showLabels !== undefined ? initialLocalData.showLabels : true
  );
  const [isAnimated, setIsAnimated] = useState<boolean>(true); // Live flight animation

  // Worked countries & skills (persisted strictly in user's browser)
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    initialLocalData.selectedCountries || []
  );
  const [skills, setSkills] = useState<Skill[]>(
    initialLocalData.skills || []
  );

  // Layout & Export State (2 sizes: 4:5 and 1:1, default 1:1)
  const [aspectRatio, setAspectRatio] = useState<'4:5' | '1:1'>(
    initialLocalData.aspectRatio || '1:1'
  );
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Sync state to local browser storage only (100% private, zero database storage)
  useEffect(() => {
    saveUserLocalData(STORAGE_KEYS.USER_NAME, userName);
  }, [userName]);

  useEffect(() => {
    saveUserLocalData(STORAGE_KEYS.USER_TITLE, userTitle);
  }, [userTitle]);

  useEffect(() => {
    saveUserLocalData(STORAGE_KEYS.HOME_COUNTRY, homeCountry);
  }, [homeCountry]);

  useEffect(() => {
    saveUserLocalData(STORAGE_KEYS.SELECTED_COUNTRIES, selectedCountries);
  }, [selectedCountries]);

  useEffect(() => {
    saveUserLocalData(STORAGE_KEYS.SKILLS, skills);
  }, [skills]);

  useEffect(() => {
    saveUserLocalData(STORAGE_KEYS.THEME_ID, themeColor.id);
  }, [themeColor.id]);

  useEffect(() => {
    saveUserLocalData(STORAGE_KEYS.SHOW_LABELS, showLabels);
  }, [showLabels]);

  useEffect(() => {
    saveUserLocalData(STORAGE_KEYS.ASPECT_RATIO, aspectRatio);
  }, [aspectRatio]);

  useEffect(() => {
    saveUserLocalData(STORAGE_KEYS.AVATAR_URL, avatarUrl);
  }, [avatarUrl]);

  // Country ID to Name Map
  const countryNamesMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of countryListData) {
      if (c.id) map.set(c.id, c.name);
    }
    return map;
  }, []);

  // Smooth scroll down to studio
  const handleScrollToStudio = () => {
    studioRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Avatar upload: stored strictly in the client's browser (localStorage), NEVER in any database
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, WebP, etc.).');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        alert('Please choose an image under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = async () => {
        const rawDataUrl = reader.result as string;
        // Optimize locally in browser memory so it stays compact (~30KB) for localStorage
        const optimizedUrl = await optimizeImageForLocalStorage(rawDataUrl);
        setAvatarUrl(optimizedUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle Country Selection
  const handleToggleCountry = useCallback((countryId: string, _countryName: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(countryId)) {
        return prev.filter(id => id !== countryId);
      } else {
        return [...prev, countryId];
      }
    });
  }, []);

  // Set Home Base Country (Starting point connecting other countries)
  const handleSelectHomeCountry = useCallback((countryId: string, countryName: string) => {
    setHomeCountry(countryId);
    setExportNotice(`Starting point set to ${countryName}! All client connections on the map radiate from here.`);
    setTimeout(() => setExportNotice(null), 4000);
  }, []);

  // Clear Countries
  const handleClearCountries = useCallback(() => {
    setSelectedCountries([]);
  }, []);

  // Toggle Work / Service Selection
  const handleToggleSkill = useCallback((name: string, category: string = 'Work') => {
    setSkills(prev => {
      const exists = prev.some(s => s.name.toLowerCase().trim() === name.toLowerCase().trim());
      if (exists) {
        return prev.filter(s => s.name.toLowerCase().trim() !== name.toLowerCase().trim());
      } else {
        const newSkill: Skill = {
          id: `work-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: name.trim(),
          category,
          isCore: false,
        };
        return [...prev, newSkill];
      }
    });
  }, []);

  // Add Custom Work / Service
  const handleAddCustomSkill = useCallback((name: string, category: string = 'Work') => {
    setSkills(prev => {
      const exists = prev.some(s => s.name.toLowerCase().trim() === name.toLowerCase().trim());
      if (exists) return prev;
      const newSkill: Skill = {
        id: `work-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: name.trim(),
        category,
        isCore: false,
      };
      return [...prev, newSkill];
    });
  }, []);

  // Remove Skill
  const handleRemoveSkill = useCallback((id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  }, []);

  // Toggle Core / Featured Skill
  const handleToggleCoreSkill = useCallback((id: string) => {
    setSkills(prev =>
      prev.map(s => (s.id === id ? { ...s, isCore: !s.isCore } : s))
    );
  }, []);

  // Clear All Skills
  const handleClearSkills = useCallback(() => {
    setSkills([]);
  }, []);

  // ========================================================
  // ========================================================
  // EXPORT ENGINE: High-res 2x Retina PNG & JPG (2 formats)
  // ========================================================
  const handleExport = async (format: 'png' | 'jpeg') => {
    const node = exportCanvasRef.current || canvasRef.current;
    if (!node || isExporting) return;
    setIsExporting(true);
    setExportNotice(`Preparing studio-grade ${format.toUpperCase()}...`);

    try {
      // 1.5x pixelRatio on canonical 1200px canvas = 1800 x 1800 (1:1) or 1800 x 2250 (4:5)
      // Guarantees ultra-crisp, razor-sharp output on all devices (mobile, tablet, desktop)
      const pixelRatio = 1.5;

      let dataUrl = '';
      if (format === 'png') {
        dataUrl = await htmlToImage.toPng(node, {
          pixelRatio,
          backgroundColor: themeColor.cardBg || '#10141d',
          skipFonts: true,
          cacheBust: true,
          quality: 1,
          style: {
            boxShadow: 'none',
            transform: 'none',
          },
        });
      } else {
        dataUrl = await htmlToImage.toJpeg(node, {
          pixelRatio,
          backgroundColor: themeColor.cardBg || '#10141d',
          skipFonts: true,
          cacheBust: true,
          quality: 0.95,
          style: {
            boxShadow: 'none',
            transform: 'none',
          },
        });
      }

      const safeBaseName = (userName || 'export')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '-')
        .replace(/-+/g, '-');
      const filename = `yourmap-client-reach-${safeBaseName}.${format}`;

      saveAs(dataUrl, filename);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: [themeColor.hex, '#10b981', '#ffffff'],
      });

      setExportNotice(`Successfully exported ${filename}!`);
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error('Export error:', err);
      alert('Could not export graphic. Please check browser permissions and try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy to Clipboard (PNG Blob)
  const handleCopyClipboard = async () => {
    const node = exportCanvasRef.current || canvasRef.current;
    if (!node || isExporting) return;
    setIsExporting(true);
    setExportNotice('Copying high-resolution graphic to clipboard...');

    try {
      const blob = await htmlToImage.toBlob(node, {
        pixelRatio: 1.5,
        backgroundColor: themeColor.cardBg || '#10141d',
        skipFonts: true,
        cacheBust: true,
      });

      if (!blob) throw new Error('Blob creation failed');

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);

      setCopiedSuccess(true);
      setExportNotice('Copied 2x Retina graphic to clipboard! Ready to paste into LinkedIn or messages.');
      setTimeout(() => setCopiedSuccess(false), 3000);
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error('Copy to clipboard failed:', err);
      alert('Clipboard copy is not supported in this browser. Please use the Download button instead.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col font-sans selection:bg-[#10b981] selection:text-white">
      {/* 1. TOP NAVIGATION: ONLY COMPANY NAME */}
      <TopNav onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

      {/* 2. LANDING HERO HEADER (SCROLLS DOWN TO STUDIO) */}
      <LandingHero
        themeColor={themeColor}
        onScrollToStudio={handleScrollToStudio}
      />

      {/* 3. STUDIO SECTION */}
      <section
        id="studio-section"
        ref={studioRef}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col"
      >
        {/* Floating Toast Notification */}
        {exportNotice && (
          <div className="mb-4 px-4 py-2.5 rounded-[14px] bg-white border border-[#e0e0e0] text-[#1d1d1f] text-xs flex items-center justify-between shadow-md animate-fadeIn">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#10b981]" />
              <span className="font-medium">{exportNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setExportNotice(null)}
              className="text-[#86868b] hover:text-[#1d1d1f] ml-3 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* STUDIO WORKSPACE CONTAINER: Prominently centered, dedicated solely to Map Poster */}
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-3.5">
          {/* Studio Workspace Toolbar */}
          <div className="bg-white border border-[#e0e0e0] rounded-[20px] p-3 sm:p-3.5 flex flex-col gap-2.5 shadow-2xs">
            {/* Row 1: Creator Profile & Modals Triggers */}
            <div className="p-2 sm:p-2.5 rounded-[14px] bg-[#fbfbfd] border border-[#e5e5ea] flex flex-wrap items-center justify-between gap-2.5">
              {/* Left: Avatar + Name + Work Selection Button */}
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />

                {/* Compact Avatar / Photo Uploader */}
                <div className="relative group shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-[#d1d1d6] flex items-center justify-center bg-white shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer relative"
                    title={avatarUrl ? 'Change photo' : 'Upload photo'}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center font-bold text-xs text-white"
                        style={{ backgroundColor: themeColor.hex }}
                      >
                        {userName.trim() ? (
                          userName.trim().slice(0, 2).toUpperCase()
                        ) : (
                          <User className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full text-white text-[9px] font-semibold">
                      Edit
                    </div>
                  </button>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setAvatarUrl(null);
                      }}
                      className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white hover:bg-rose-500 hover:text-white rounded-full text-[#1d1d1f] flex items-center justify-center text-[8px] shadow-2xs cursor-pointer border border-[#d1d1d6]"
                      title="Remove photo"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  )}
                </div>

                {/* Simple Minimal Name Input Pill */}
                <div className="flex items-center bg-white border border-[#e0e0e0] hover:border-[#b0b0b5] focus-within:border-[#0066cc] rounded-full px-2.5 sm:px-3 py-1.5 shadow-2xs transition-all">
                  <User className="w-3.5 h-3.5 text-[#86868b] mr-1.5 shrink-0" />
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="Your Name"
                    className="bg-transparent text-xs sm:text-[13px] font-semibold text-[#1d1d1f] placeholder-[#86868b] focus:outline-none w-24 sm:w-36"
                  />
                </div>

                {/* Button Beside Name: Exclusively selects work & services */}
                <button
                  type="button"
                  onClick={() => setIsWorkModalOpen(true)}
                  className="flex items-center gap-1.5 bg-white hover:bg-[#f5f5f7] border border-[#e0e0e0] hover:border-[#b0b0b5] rounded-full px-2.5 sm:px-3 py-1.5 transition-all shadow-2xs cursor-pointer group text-xs text-[#1d1d1f] max-w-full"
                  title="Click to select work & services"
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#0f7af0] shrink-0" />
                  {skills.length > 0 ? (
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#f2f2f4] text-[#1d1d1f] border border-[#e2e2e7] truncate max-w-[120px] sm:max-w-none">
                        {skills[0].name}
                      </span>
                      {skills.length > 1 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#e5e5ea] text-[#6e6e73]">
                          +{skills.length - 1}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-[#6e6e73] font-medium">
                      {userTitle || 'Select Work & Services'}
                    </span>
                  )}
                  <span className="text-[11px] text-[#86868b] group-hover:text-[#1d1d1f] flex items-center gap-0.5 ml-0.5 shrink-0">
                    <span className="hidden sm:inline">Select</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              </div>

              {/* Right: Working From + Client Countries Button */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Working From / Base */}
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex items-center gap-1.5 bg-white hover:bg-[#f5f5f7] border border-[#e0e0e0] hover:border-[#b0b0b5] rounded-full px-2.5 sm:px-3 py-1.5 transition-all shadow-2xs cursor-pointer group text-xs shrink-0 self-start sm:self-auto"
                  title="Select where you work from (starting point on map)"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#0066cc] shrink-0" />
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-[#6e6e73]">Working from:</span>
                    <span className="text-[#1d1d1f] font-semibold truncate max-w-[110px] sm:max-w-[150px]">
                      {countryNamesMap.get(homeCountry) || 'Select Base'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#86868b] group-hover:text-[#1d1d1f] ml-0.5" />
                </button>

                {/* Client Countries Selector Button */}
                <button
                  type="button"
                  onClick={() => setIsCountryModalOpen(true)}
                  className="flex items-center gap-1.5 bg-white hover:bg-[#f5f5f7] border border-[#e0e0e0] hover:border-[#b0b0b5] rounded-full px-2.5 sm:px-3 py-1.5 transition-all shadow-2xs cursor-pointer group text-xs shrink-0"
                  title="Select client countries"
                >
                  <Globe className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-[#6e6e73]">Countries:</span>
                    <span className="text-[#1d1d1f] font-semibold">
                      {selectedCountries.length}/195
                    </span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-[#86868b] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Row 2: Theme Swatches + Map Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
              {/* Theme Selector (5 swatches) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#86868b]">Theme:</span>
                <div className="flex items-center gap-2 bg-[#f5f5f7] px-2.5 sm:px-3 py-1 rounded-full border border-[#e0e0e0]">
                  {COLOR_SWATCHES.map(swatch => {
                    const isSelected = themeColor.id === swatch.id;
                    return (
                      <button
                        key={swatch.id}
                        type="button"
                        onClick={() => setThemeColor(swatch)}
                        title={swatch.name}
                        className={`relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0 transition-all cursor-pointer border border-black/10 shadow-2xs ${
                          isSelected
                            ? 'ring-2 ring-[#18191c] ring-offset-2 ring-offset-[#f5f5f7] scale-105'
                            : 'hover:scale-110 opacity-90 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: swatch.cardBg }}
                      >
                        <div
                          className="absolute bottom-0 right-0 w-[55%] h-[55%] rounded-tl-[9px]"
                          style={{ backgroundColor: swatch.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Map Controls */}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-[#1d1d1f] cursor-pointer select-none bg-[#f5f5f7] px-3 py-1.5 rounded-full border border-[#e0e0e0] hover:bg-[#ebebed] transition-colors">
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={e => setShowLabels(e.target.checked)}
                    className="rounded border-[#d1d1d6] bg-white text-[#10b981] focus:ring-0 cursor-pointer"
                  />
                  <span className="font-medium text-[#515154]">Country Labels</span>
                </label>

                {selectedCountries.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCountries}
                    className="text-xs text-[#86868b] hover:text-rose-600 px-2 py-1 rounded-full transition-colors cursor-pointer"
                    title="Clear all selected countries"
                  >
                    Reset Map
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* The Main Stage: Exportable Luxury Map Canvas Card (Screenshot Style) */}
          <div className="w-full">
            <ExportCanvas
              ref={canvasRef}
              activeTab={activeTab}
              userName={userName}
              userTitle={userTitle}
              avatarUrl={avatarUrl}
              themeColor={themeColor}
              selectedCountries={selectedCountries}
              homeCountry={homeCountry}
              skills={skills}
              onToggleCountry={handleToggleCountry}
              aspectRatio={aspectRatio}
              showLabels={showLabels}
              countryNamesMap={countryNamesMap}
              isAnimated={isAnimated}
            />
          </div>

          {/* Export & Download Bar (2 sizes: 4:5, 1:1 & 2 formats: JPG, PNG) */}
          <ExportBar
            activeTab={activeTab}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            onExport={handleExport}
            onCopyClipboard={handleCopyClipboard}
            isExporting={isExporting}
            copiedSuccess={copiedSuccess}
            themeColor={themeColor}
            isAnimated={isAnimated}
          />

          {/* Helpful Quick Tip & Privacy Guarantee */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 py-1 text-center">
            <p className="text-xs text-[#86868b] flex items-center justify-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>
                <span className="text-[#1d1d1f] font-medium">Tip:</span> Click any country on the map or use the Countries button to add clients.
              </span>
            </p>
            <span className="hidden sm:inline text-[#d1d1d6]">•</span>
            <p className="text-xs text-[#0f7af0] flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0f7af0] shrink-0" />
              <span>100% Private · Stored only in your local browser</span>
            </p>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="w-full bg-[#f5f5f7] border-t border-[#e0e0e0] py-10 px-4 sm:px-6 mt-12 text-[#6e6e73]">
        <div className="max-w-7xl mx-auto space-y-5">
          {/* Privacy Policy & Creator Row */}
          <div className="text-[12px] text-[#86868b] flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#e0e0e0]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="text-[#1d1d1f] hover:text-[#0f7af0] font-semibold underline underline-offset-4 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0f7af0]" />
                <span>Privacy Policy</span>
              </button>
              <span className="text-[#d1d1d6]">•</span>
              <span className="text-[#86868b]">100% Private Client-Side Tool</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[#6e6e73]">
              <span>Made by</span>
              <span className="font-bold text-[#1d1d1f]">A M R JIM</span>
              <span>·</span>
              <a
                href="mailto:amrjimweb@gmail.com"
                className="text-[#1d1d1f] hover:text-[#0f7af0] font-medium flex items-center gap-1 transition-colors"
                title="Email: amrjimweb@gmail.com"
              >
                <Mail className="w-3.5 h-3.5 text-[#0f7af0]" />
                <span>amrjimweb@gmail.com</span>
              </a>
              <span>·</span>
              <a
                href="https://www.facebook.com/share/1FgP4jNFEG/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1877f2] hover:underline font-semibold flex items-center gap-1 transition-colors"
                title="Connect on Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>
              <span>·</span>
              <a
                href="https://www.linkedin.com/in/al-mahamud-rohit-jim-8027b9275/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0a66c2] hover:underline font-semibold flex items-center gap-1 transition-colors"
                title="Connect on LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px]">
            <div className="flex items-center gap-2">
              <img src="/YMlogo-black.png" alt="yourmap.me" className="w-4 h-4 object-contain shrink-0" />
              <span className="font-semibold text-[#1d1d1f]">yourmap.me</span>
              <span>•</span>
              <span>Show the world where you work.</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[#6e6e73]">
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="flex items-center gap-1 text-[#0f7af0] font-medium hover:underline cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0f7af0]" />
                <span>No Database / 100% Local Storage</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================
          CANONICAL STUDIO HIGH-RES EXPORT CANVAS (DEVICE-AGNOSTIC)
          Always rendered at standard 1200px width with desktop typography
          Guarantees users on mobile, tablet, or desktop get the exact same
          crisp, professional, full-sized studio poster output
         ======================================================== */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          overflow: 'hidden',
          zIndex: -9999,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <div
          ref={exportCanvasRef}
          style={{
            width: '1200px',
            height: aspectRatio === '4:5' ? '1500px' : '1200px',
          }}
        >
          <ExportCanvas
            activeTab={activeTab}
            userName={userName}
            userTitle={userTitle}
            avatarUrl={avatarUrl}
            themeColor={themeColor}
            selectedCountries={selectedCountries}
            homeCountry={homeCountry}
            skills={skills}
            onToggleCountry={() => {}}
            aspectRatio={aspectRatio}
            showLabels={showLabels}
            countryNamesMap={countryNamesMap}
            isAnimated={false}
            isExportMode={true}
          />
        </div>
      </div>

      {/* 5. WORK & SERVICES SELECTION MODAL */}
      <WorkSelectionModal
        isOpen={isWorkModalOpen}
        onClose={() => setIsWorkModalOpen(false)}
        skills={skills}
        onToggleSkill={handleToggleSkill}
        onAddCustomSkill={handleAddCustomSkill}
        onRemoveSkill={handleRemoveSkill}
        onClearSkills={handleClearSkills}
        themeColor={themeColor}
      />

      {/* 6. CLIENT COUNTRY SELECTION MODAL */}
      <CountrySelectionModal
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        selectedCountries={selectedCountries}
        homeCountry={homeCountry}
        onToggleCountry={handleToggleCountry}
        onClearCountries={handleClearCountries}
        themeColor={themeColor}
      />

      {/* 7. LOCATION MODAL (WHERE ARE YOU WORKING FROM?) */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        homeCountry={homeCountry}
        onSelectHomeCountry={handleSelectHomeCountry}
        themeColor={themeColor}
      />

      {/* 8. PRIVACY POLICY MODAL */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        themeColor={themeColor}
      />
    </div>
  );
}
