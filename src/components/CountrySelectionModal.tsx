import React, { useState, useMemo, useEffect } from 'react';
import { Search, Globe, X, Check, Trash2 } from 'lucide-react';
import { ColorSwatch } from '../data/palette';
import { CONTINENT_LIST, ContinentName, getCountryContinent } from '../data/countries';
import countryListData from '../data/countryList.json';

interface CountrySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountries: string[];
  homeCountry?: string;
  onToggleCountry: (id: string, name: string) => void;
  onClearCountries: () => void;
  themeColor: ColorSwatch;
}

export const CountrySelectionModal: React.FC<CountrySelectionModalProps> = ({
  isOpen,
  onClose,
  selectedCountries,
  homeCountry,
  onToggleCountry,
  onClearCountries,
  themeColor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeContinent, setActiveContinent] = useState<string>('all');

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

  // Reset search when opened
  useEffect(() => {
    if (isOpen) setSearchQuery('');
  }, [isOpen]);

  const selectedSet = useMemo(() => new Set(selectedCountries), [selectedCountries]);

  // Filtered countries
  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return countryListData.filter(country => {
      const continent = getCountryContinent(country.id);
      const matchesContinent = activeContinent === 'all' || continent === activeContinent;
      const matchesSearch = !q || country.name.toLowerCase().includes(q);
      return matchesContinent && matchesSearch;
    });
  }, [searchQuery, activeContinent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-[24px] sm:rounded-[28px] shadow-2xl border border-[#e5e5ea] flex flex-col max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-[#f0f0f2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs"
              style={{
                backgroundColor: `${themeColor.hex}18`,
                color: themeColor.hex,
              }}
            >
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] tracking-tight">
                Select Client Countries ({selectedCountries.length} / 195)
              </h3>
              <p className="text-xs text-[#86868b]">
                Search or pick countries where you've served clients or delivered work
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

        {/* Search & Continent Filters */}
        <div className="p-4 sm:p-5 pb-3 border-b border-[#f0f0f2] bg-[#fbfbfd] flex flex-col gap-2.5 shrink-0">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search countries (e.g. United States, Singapore, Germany)..."
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

          {/* Continent Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveContinent('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeContinent === 'all'
                  ? 'bg-[#1d1d1f] text-white shadow-xs'
                  : 'bg-white hover:bg-[#f2f2f4] text-[#6e6e73] border border-[#e5e5ea]'
              }`}
            >
              All Continents
            </button>
            {CONTINENT_LIST.map(continent => (
              <button
                key={continent}
                type="button"
                onClick={() => setActiveContinent(continent)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeContinent === continent
                    ? 'bg-[#1d1d1f] text-white shadow-xs'
                    : 'bg-white hover:bg-[#f2f2f4] text-[#6e6e73] border border-[#e5e5ea]'
                }`}
              >
                {continent}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Countries Strip */}
        {selectedCountries.length > 0 && (
          <div className="px-5 py-2.5 bg-[#fbfbfd] border-b border-[#f0f0f2] flex items-center justify-between gap-3 shrink-0">
            <span className="text-xs text-[#6e6e73]">
              <strong className="text-[#1d1d1f] font-semibold">{selectedCountries.length}</strong> countries selected
            </span>
            <button
              type="button"
              onClick={onClearCountries}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* Countries Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredCountries.map(country => {
              const isSelected = selectedSet.has(country.id);

              return (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => onToggleCountry(country.id, country.name)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center justify-between gap-2 transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'text-white font-semibold shadow-xs'
                      : 'bg-white hover:bg-[#f5f5f7] border-[#e0e0e0] text-[#1d1d1f] hover:border-[#b0b0b5]'
                  }`}
                  style={isSelected ? {
                    backgroundColor: themeColor.hex,
                    borderColor: themeColor.hex,
                  } : undefined}
                >
                  <span className="truncate font-medium">{country.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-[#f0f0f2] bg-[#fbfbfd] flex items-center justify-between shrink-0">
          <span className="text-xs text-[#86868b]">
            Tip: You can also click any country directly on the map!
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            style={{ backgroundColor: themeColor.hex }}
          >
            Done & View Map
          </button>
        </div>
      </div>
    </div>
  );
};
