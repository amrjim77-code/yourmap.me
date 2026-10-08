import React, { useState, useMemo, useEffect } from 'react';
import { Search, Briefcase, Plus, X, Check, Sparkles } from 'lucide-react';
import { ColorSwatch } from '../data/palette';
import { Skill, POPULAR_WORK_CATEGORIES } from '../data/skills';

interface WorkSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: Skill[];
  onToggleSkill: (name: string, category?: string) => void;
  onAddCustomSkill: (name: string, category?: string) => void;
  onRemoveSkill: (id: string) => void;
  onClearSkills: () => void;
  themeColor: ColorSwatch;
}

export const WorkSelectionModal: React.FC<WorkSelectionModalProps> = ({
  isOpen,
  onClose,
  skills,
  onToggleSkill,
  onAddCustomSkill,
  onRemoveSkill,
  onClearSkills,
  themeColor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset inputs when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setCustomInput('');
    }
  }, [isOpen]);

  // Set of selected skill names (lowercase for case-insensitive matching)
  const selectedSkillNames = useMemo(() => {
    const set = new Set<string>();
    skills.forEach(s => set.add(s.name.toLowerCase().trim()));
    return set;
  }, [skills]);

  // Handle adding custom skill
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;
    onAddCustomSkill(trimmed, 'Custom');
    setCustomInput('');
  };

  // Filtered categories and services
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return POPULAR_WORK_CATEGORIES.map(cat => {
      const matchingServices = cat.services.filter(s =>
        !q || s.toLowerCase().includes(q)
      );
      return {
        ...cat,
        services: matchingServices,
      };
    }).filter(cat =>
      activeCategory === 'all' || activeCategory === cat.id
    ).filter(cat => cat.services.length > 0);
  }, [searchQuery, activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-[24px] sm:rounded-[28px] shadow-2xl border border-[#e5e5ea] flex flex-col max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 1. Header */}
        <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-[#f0f0f2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs"
              style={{
                backgroundColor: `${themeColor.hex}18`,
                color: themeColor.hex,
              }}
            >
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] tracking-tight">
                Select Your Work & Services
              </h3>
              <p className="text-xs text-[#86868b]">
                Selected items appear as badges on your map poster
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#ebebed] text-[#6e6e73] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Search & Custom Add Bar */}
        <div className="p-4 sm:p-5 pb-3 border-b border-[#f0f0f2] bg-[#fbfbfd] flex flex-col gap-2.5 shrink-0">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search services (e.g. Designer, Software Developer, Sourcing Agent)..."
              className="w-full bg-white border border-[#e0e0e0] hover:border-[#b0b0b5] focus:border-[#0066cc] rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Custom Service Input Form */}
          <form onSubmit={handleAddCustom} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                placeholder="Can't find yours? Type a custom title or skill..."
                className="w-full bg-white border border-[#e0e0e0] hover:border-[#b0b0b5] focus:border-[#0066cc] rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:outline-none transition-all shadow-2xs"
              />
            </div>
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="px-3.5 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 disabled:opacity-40 cursor-pointer shrink-0 shadow-xs"
              style={{ backgroundColor: themeColor.hex }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          {/* Active Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#1d1d1f] text-white shadow-xs'
                  : 'bg-white hover:bg-[#f2f2f4] text-[#6e6e73] border border-[#e5e5ea]'
              }`}
            >
              All Categories
            </button>
            {POPULAR_WORK_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#1d1d1f] text-white shadow-xs'
                    : 'bg-white hover:bg-[#f2f2f4] text-[#6e6e73] border border-[#e5e5ea]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Selected Skills Badge Strip */}
        {skills.length > 0 && (
          <div className="px-5 py-2.5 bg-[#fbfbfd] border-b border-[#f0f0f2] flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar flex-1">
              <span className="text-[11px] font-semibold text-[#86868b] shrink-0 mr-1">
                Selected ({skills.length}):
              </span>
              {skills.map(s => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border shadow-2xs whitespace-nowrap shrink-0 transition-all"
                  style={{
                    backgroundColor: `${themeColor.hex}18`,
                    borderColor: `${themeColor.hex}50`,
                    color: themeColor.hex,
                  }}
                >
                  <span>{s.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveSkill(s.id)}
                    className="hover:opacity-80 p-0.5 rounded-full"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={onClearSkills}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline shrink-0 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* 4. Categorized Services Grid (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {filteredCategories.length === 0 ? (
            <div className="py-12 text-center text-[#86868b]">
              <p className="text-sm">No services matching "{searchQuery}"</p>
              <p className="text-xs mt-1">Use the field above to add it as a custom service!</p>
            </div>
          ) : (
            filteredCategories.map(cat => (
              <div key={cat.id} className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#6e6e73] uppercase tracking-wider">
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.services.map(serviceName => {
                    const isSelected = selectedSkillNames.has(serviceName.toLowerCase().trim());
                    return (
                      <button
                        key={serviceName}
                        type="button"
                        onClick={() => onToggleSkill(serviceName, cat.label)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                          isSelected
                            ? 'text-white font-semibold scale-102'
                            : 'bg-white hover:bg-[#f5f5f7] border-[#e0e0e0] text-[#1d1d1f] hover:border-[#b0b0b5]'
                        }`}
                        style={isSelected ? {
                          backgroundColor: themeColor.hex,
                          borderColor: themeColor.hex,
                        } : undefined}
                      >
                        {isSelected ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <Plus className="w-3 h-3 text-[#86868b]" />
                        )}
                        <span>{serviceName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 5. Footer: Done Action */}
        <div className="px-5 sm:px-6 py-3 border-t border-[#f0f0f2] bg-[#fbfbfd] flex items-center justify-between shrink-0">
          <span className="text-xs text-[#86868b]">
            {skills.length === 0 ? 'No services selected yet' : `${skills.length} services added to poster`}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            style={{ backgroundColor: themeColor.hex }}
          >
            Done & View Map Poster
          </button>
        </div>
      </div>
    </div>
  );
};
