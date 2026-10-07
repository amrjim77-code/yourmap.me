import React, { useState } from 'react';
import {
  Download,
  Plus,
  X,
  Sparkles,
  MapPin,
  Search,
  Check,
  RotateCcw,
  Palette,
  Briefcase,
  Share2,
  Copy,
  CheckCheck,
  MessageSquare,
  Globe,
  Layers,
  Code2,
  Star,
  Zap,
  Sliders,
  Filter,
} from 'lucide-react';
import { ThemeDefinition, THEMES } from '../data/themes';
import {
  REGIONAL_PRESETS,
  PROFILE_TEMPLATES,
  ProfileTemplate,
  getCountryFlag,
} from '../data/countries';
import {
  SkillItem,
  SkillDomainId,
  SKILL_DOMAINS,
  SUGGESTED_SKILLS_BY_DOMAIN,
  SKILL_PROFILE_PRESETS,
  SkillProfilePreset,
} from '../data/skills';
import { AspectRatioType } from './MapCanvas';

interface ControlsSidebarProps {
  // Mode
  activeMode: 'client-map' | 'skill-matrix';
  setActiveMode: (mode: 'client-map' | 'skill-matrix') => void;

  // Profile Form States
  name: string;
  setName: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
  tagline: string;
  setTagline: (v: string) => void;
  avatarInitials: string;
  setAvatarInitials: (v: string) => void;

  // Client Map States
  selectedCountryIds: string[];
  onToggleCountry: (id: string, name: string) => void;
  onSelectMultiple: (ids: string[], shouldAdd: boolean) => void;
  onClearCountries: () => void;
  countryList: { id: string; name: string }[];
  clientCountMetric: string;
  setClientCountMetric: (v: string) => void;
  showGraticule: boolean;
  setShowGraticule: (v: boolean) => void;

  // Skill Matrix States
  skillItems: SkillItem[];
  setSkillItems: React.Dispatch<React.SetStateAction<SkillItem[]>>;
  experienceMetric: string;
  setExperienceMetric: (v: string) => void;
  onLoadSkillPreset: (preset: SkillProfilePreset) => void;

  // Theme & Layout
  currentTheme: ThemeDefinition;
  onSelectTheme: (theme: ThemeDefinition) => void;
  onCustomColorChange: (color: string) => void;
  aspectRatio: AspectRatioType;
  setAspectRatio: (ar: AspectRatioType) => void;

  // Actions
  onExport: (format: 'png' | 'jpeg') => Promise<void>;
  onCopyClipboard: () => Promise<void>;
  onOpenCaptionModal: () => void;
  isExporting: boolean;
  copiedSuccess: boolean;
  onLoadTemplate: (template: ProfileTemplate) => void;
}

export const ControlsSidebar: React.FC<ControlsSidebarProps> = ({
  activeMode,
  setActiveMode,
  name,
  setName,
  title,
  setTitle,
  tagline,
  setTagline,
  avatarInitials,
  setAvatarInitials,
  selectedCountryIds,
  onToggleCountry,
  onSelectMultiple,
  onClearCountries,
  countryList,
  clientCountMetric,
  setClientCountMetric,
  showGraticule,
  setShowGraticule,
  skillItems,
  setSkillItems,
  experienceMetric,
  setExperienceMetric,
  onLoadSkillPreset,
  currentTheme,
  onSelectTheme,
  onCustomColorChange,
  aspectRatio,
  setAspectRatio,
  onExport,
  onCopyClipboard,
  onOpenCaptionModal,
  isExporting,
  copiedSuccess,
  onLoadTemplate,
}) => {
  // Navigation tabs inside sidebar: Profile | Data (Map/Skills) | Styling
  const [activeTab, setActiveTab] = useState<'profile' | 'data' | 'style'>('data');

  // Country Search State
  const [countrySearch, setCountrySearch] = useState('');

  // Skill Matrix States
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<SkillDomainId | 'all'>('all');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDomain, setNewSkillDomain] = useState<SkillDomainId>('engineering');
  const [newSkillIsCore, setNewSkillIsCore] = useState(false);

  // Skill Handlers
  const handleToggleSuggestedSkill = (skillName: string, domainId: SkillDomainId) => {
    setSkillItems(prev => {
      const exists = prev.find(s => s.name.toLowerCase() === skillName.toLowerCase());
      if (exists) {
        return prev.filter(s => s.id !== exists.id);
      } else {
        return [
          ...prev,
          {
            id: `skill-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: skillName,
            domain: domainId,
            level: 'core',
          },
        ];
      }
    });
  };

  const handleAddCustomSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSkillName.trim();
    if (!trimmed) return;

    const exists = skillItems.find(s => s.name.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      setSkillItems(prev => [
        ...prev,
        {
          id: `skill-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: trimmed,
          domain: newSkillDomain,
          level: newSkillIsCore ? 'core' : 'advanced',
        },
      ]);
    }
    setNewSkillName('');
    setNewSkillIsCore(false);
  };

  const handleRemoveSkill = (id: string) => {
    setSkillItems(prev => prev.filter(s => s.id !== id));
  };

  const handleToggleSkillLevel = (id: string) => {
    setSkillItems(prev =>
      prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            level: s.level === 'core' ? 'advanced' : 'core',
          };
        }
        return s;
      })
    );
  };

  const handleClearSkills = () => {
    setSkillItems([]);
  };

  // Filtered countries for search
  const filteredCountries = React.useMemo(() => {
    if (!countrySearch.trim()) return countryList.slice(0, 24);
    const q = countrySearch.toLowerCase();
    return countryList.filter(c => c.name.toLowerCase().includes(q));
  }, [countryList, countrySearch]);

  const selectedSet = React.useMemo(() => new Set(selectedCountryIds), [selectedCountryIds]);

  return (
    <aside className="w-full lg:w-[410px] xl:w-[450px] flex flex-col bg-slate-900 border-r border-slate-800 backdrop-blur-md h-full shrink-0">
      {/* 1. Primary Infographic Mode Switcher */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/70 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-mono font-bold shadow-md shadow-indigo-600/30">
              YM
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white font-mono">
              yourmap.me
            </span>
          </div>

          <div className="text-[11px] font-medium text-slate-400">
            {activeMode === 'client-map' ? (
              <span>
                <strong className="text-indigo-400 font-mono">{selectedCountryIds.length}</strong> Countries
              </span>
            ) : (
              <span>
                <strong className="text-emerald-400 font-mono">{skillItems.length}</strong> Skills
              </span>
            )}
          </div>
        </div>

        {/* Dual Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveMode('client-map')}
            className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeMode === 'client-map'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Client Map</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('skill-matrix')}
            className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeMode === 'skill-matrix'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Skill Matrix</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs: Profile | Data (Map/Skills) | Styling */}
      <div className="flex border-b border-slate-800 bg-slate-950/30 px-3 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('data')}
          className={`py-2.5 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'data'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          {activeMode === 'client-map' ? (
            <>
              <MapPin className="w-3.5 h-3.5" />
              <span>Countries ({selectedCountryIds.length})</span>
            </>
          ) : (
            <>
              <Layers className="w-3.5 h-3.5" />
              <span>Skills ({skillItems.length})</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`py-2.5 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'profile'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Profile Info</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('style')}
          className={`py-2.5 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'style'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Theme</span>
        </button>
      </div>

      {/* 3. SCROLLABLE TAB CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* =========================================
            TAB 1: DATA (COUNTRIES or SKILLS)
           ========================================= */}
        {activeTab === 'data' && (
          <div className="space-y-4 animate-fadeIn">
            {/* CLIENT MAP MODE */}
            {activeMode === 'client-map' && (
              <>
                {/* Search & Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Search & Select Countries
                    </label>
                    {selectedCountryIds.length > 0 && (
                      <button
                        type="button"
                        onClick={onClearCountries}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search country (e.g. Germany, Japan)..."
                      value={countrySearch}
                      onChange={e => setCountrySearch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Regional One-Click Quick Presets */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Quick Regional Bundles
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {REGIONAL_PRESETS.map(preset => {
                      const allSelected = preset.ids.every(id => selectedSet.has(id));
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => onSelectMultiple(preset.ids, !allSelected)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-all ${
                            allSelected
                              ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                              : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border-slate-700/60'
                          }`}
                        >
                          <span>{allSelected ? '✓' : '+'}</span>
                          <span>{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Country Pill Grid */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Click to toggle on map:</span>
                    <span className="font-mono">{filteredCountries.length} available</span>
                  </div>

                  <div className="max-h-56 overflow-y-auto p-2 bg-slate-950/60 border border-slate-800/80 rounded-xl flex flex-wrap gap-1.5 content-start">
                    {filteredCountries.map(c => {
                      const isSelected = selectedSet.has(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => onToggleCountry(c.id, c.name)}
                          className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-sm'
                              : 'bg-slate-800/70 hover:bg-slate-750 text-slate-300 border-slate-700/60'
                          }`}
                        >
                          <span>{getCountryFlag(c.id)}</span>
                          <span className="truncate max-w-[120px]">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Countries Badges */}
                {selectedCountryIds.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                      Highlighted ({selectedCountryIds.length})
                    </span>
                    <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-2 bg-slate-950/40 rounded-lg border border-slate-800/60">
                      {selectedCountryIds.map(id => {
                        const countryObj = countryList.find(c => c.id === id);
                        return (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-800/60 text-indigo-300"
                          >
                            <span>{getCountryFlag(id)}</span>
                            <span>{countryObj?.name || id}</span>
                            <button
                              type="button"
                              onClick={() => onToggleCountry(id, '')}
                              className="text-slate-400 hover:text-white ml-0.5"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* SKILL MATRIX MODE */}
            {activeMode === 'skill-matrix' && (
              <>
                {/* 1. Skill Profile Presets */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                    Quick Stack Presets
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SKILL_PROFILE_PRESETS.map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => onLoadSkillPreset(preset)}
                        className="text-left px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/20 hover:text-indigo-300 text-slate-300 border border-slate-700/60 transition-all text-xs flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate font-medium">{preset.label.split(' ')[0]} {preset.label.split(' ')[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Add Custom Skill Form */}
                <form
                  onSubmit={handleAddCustomSkill}
                  className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5"
                >
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Add Custom Capability</span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. GraphQL, Tailwind, RAG..."
                      value={newSkillName}
                      onChange={e => setNewSkillName(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />

                    <select
                      value={newSkillDomain}
                      onChange={e => setNewSkillDomain(e.target.value as SkillDomainId)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      {SKILL_DOMAINS.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.shortLabel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSkillIsCore}
                        onChange={e => setNewSkillIsCore(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                      />
                      <span>Mark as Core Stack (★)</span>
                    </label>

                    <button
                      type="submit"
                      disabled={!newSkillName.trim()}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors shadow-sm"
                    >
                      Add Skill
                    </button>
                  </div>
                </form>

                {/* 3. Domain Filter & Suggested Pill-Tag Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Suggested Skills by Domain</span>
                    </label>

                    {skillItems.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearSkills}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>

                  {/* Domain Filter Pills */}
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedDomainFilter('all')}
                      className={`text-[11px] px-2 py-0.5 rounded-md font-medium border transition-colors ${
                        selectedDomainFilter === 'all'
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white'
                      }`}
                    >
                      All Domains
                    </button>
                    {SKILL_DOMAINS.map(d => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDomainFilter(d.id)}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium border transition-colors ${
                          selectedDomainFilter === d.id
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white'
                        }`}
                      >
                        {d.shortLabel}
                      </button>
                    ))}
                  </div>

                  {/* Suggested Pills Grid */}
                  <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl max-h-48 overflow-y-auto flex flex-wrap gap-1.5 content-start">
                    {SKILL_DOMAINS.filter(
                      d => selectedDomainFilter === 'all' || selectedDomainFilter === d.id
                    ).flatMap(d => {
                      const list = SUGGESTED_SKILLS_BY_DOMAIN[d.id] || [];
                      return list.map(skillName => {
                        const isAdded = skillItems.some(
                          s => s.name.toLowerCase() === skillName.toLowerCase()
                        );
                        return (
                          <button
                            key={`${d.id}-${skillName}`}
                            type="button"
                            onClick={() => handleToggleSuggestedSkill(skillName, d.id)}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-all ${
                              isAdded
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                                : 'bg-slate-800/70 hover:bg-slate-750 text-slate-300 border-slate-700/60'
                            }`}
                          >
                            <span>{isAdded ? '✓' : '+'}</span>
                            <span>{skillName}</span>
                          </button>
                        );
                      });
                    })}
                  </div>
                </div>

                {/* 4. Active Selected Skills with Core Level Toggle */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold uppercase tracking-wider text-[10px]">
                      Active Matrix Skills ({skillItems.length})
                    </span>
                    <span className="text-[10px]">Click ★ to toggle Core</span>
                  </div>

                  {skillItems.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                      No skills added yet. Select pills above to build your matrix!
                    </div>
                  ) : (
                    <div className="max-h-40 overflow-y-auto p-2 bg-slate-950/50 rounded-xl border border-slate-800/70 flex flex-wrap gap-1.5">
                      {skillItems.map(skill => {
                        const isCore = skill.level === 'core';
                        const domainObj = SKILL_DOMAINS.find(d => d.id === skill.domain);
                        return (
                          <div
                            key={skill.id}
                            className={`text-[11px] px-2 py-0.5 rounded-lg border flex items-center gap-1.5 font-medium transition-all ${
                              isCore
                                ? 'bg-indigo-950/90 border-indigo-500/60 text-indigo-200'
                                : 'bg-slate-800/80 border-slate-700/60 text-slate-300'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleToggleSkillLevel(skill.id)}
                              className={`text-[10px] hover:scale-120 transition-transform ${
                                isCore ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'
                              }`}
                              title="Toggle Core / Advanced"
                            >
                              ★
                            </button>
                            <span className="truncate max-w-[140px]">{skill.name}</span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              ({domainObj?.shortLabel || skill.domain})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill.id)}
                              className="text-slate-400 hover:text-rose-400 ml-0.5"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* =========================================
            TAB 2: PROFILE INFO
           ========================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-3.5 animate-fadeIn">
            {/* Persona Presets in Profile Tab */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                Load Complete Profile Preset
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {PROFILE_TEMPLATES.map(tmpl => (
                  <button
                    key={tmpl.label}
                    type="button"
                    onClick={() => onLoadTemplate(tmpl.template)}
                    className="text-left px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/20 hover:text-indigo-300 text-slate-300 border border-slate-700/60 transition-all text-xs flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate font-medium">{tmpl.label.split(' ')[0]} {tmpl.label.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name / Studio Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-300">Professional Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Senior Full-Stack Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Initials</label>
                <input
                  type="text"
                  maxLength={3}
                  value={avatarInitials}
                  onChange={e => setAvatarInitials(e.target.value)}
                  placeholder="AR"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white text-center font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Tagline / Mission Pitch</label>
              <textarea
                rows={2}
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="Building mission-critical web applications for tech startups worldwide."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Contextual Metric depending on Mode */}
            {activeMode === 'client-map' ? (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Client Proof Metric Badge
                </label>
                <input
                  type="text"
                  value={clientCountMetric}
                  onChange={e => setClientCountMetric(e.target.value)}
                  placeholder="34+ Shipped Projects"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Experience / Capability Metric Badge
                </label>
                <input
                  type="text"
                  value={experienceMetric}
                  onChange={e => setExperienceMetric(e.target.value)}
                  placeholder="10+ Years Building Web Systems"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        )}

        {/* =========================================
            TAB 3: THEME & STYLING
           ========================================= */}
        {activeTab === 'style' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Theme Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Curated Brand Themes</label>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map(theme => {
                  const isSelected = currentTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => onSelectTheme(theme)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                        isSelected
                          ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                      style={{ backgroundColor: theme.canvasBg }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs font-bold font-sans tracking-tight"
                          style={{ color: theme.textPrimary }}
                        >
                          {theme.name.replace(/ \(Light\)/, '')}
                        </span>
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold"
                          style={{
                            backgroundColor: theme.tagBg,
                            color: theme.tagText,
                            border: `1px solid ${theme.tagBorder}`,
                          }}
                        >
                          {theme.type}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-indigo-400">✓ Active</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Accent Color Override */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Custom Accent Color</span>
                <span className="font-mono text-xs text-indigo-400">{currentTheme.accentColor}</span>
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={currentTheme.accentColor}
                  onChange={e => onCustomColorChange(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={currentTheme.accentColor}
                  onChange={e => onCustomColorChange(e.target.value)}
                  placeholder="#6366f1"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Map-specific toggles */}
            {activeMode === 'client-map' && (
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Map Overlays</label>
                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span>Show Latitude / Longitude Graticule</span>
                  <input
                    type="checkbox"
                    checked={showGraticule}
                    onChange={e => setShowGraticule(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                  />
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. BOTTOM ACTION & EXPORT BAR */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-col gap-2 shrink-0">
        <div className="flex items-center gap-2">
          {/* Copy to Clipboard */}
          <button
            type="button"
            onClick={onCopyClipboard}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 flex items-center justify-center gap-1.5 transition-colors"
          >
            {copiedSuccess ? (
              <>
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Image</span>
              </>
            )}
          </button>

          {/* Export PNG */}
          <button
            type="button"
            onClick={() => onExport('png')}
            disabled={isExporting}
            className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-indigo-600/25"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export PNG'}</span>
          </button>
        </div>

        {/* Viral Caption Generator Trigger */}
        <button
          type="button"
          onClick={onOpenCaptionModal}
          className="w-full py-1.5 px-3 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/40 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            {activeMode === 'client-map'
              ? 'Generate LinkedIn & X Client Post'
              : 'Generate Capability Matrix Pitch Post'}
          </span>
        </button>
      </div>
    </aside>
  );
};
