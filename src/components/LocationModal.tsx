import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, X, Check, Globe } from 'lucide-react';
import { ColorSwatch } from '../data/palette';
import { CONTINENT_LIST, ContinentName, getCountryContinent, getCountryFlag } from '../data/countries';
import countryListData from '../data/countryList.json';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeCountry: string;
  onSelectHomeCountry: (countryId: string, countryName: string) => void;
  themeColor: ColorSwatch;
}

// Quick pick popular hubs
const POPULAR_HUBS = [
  { id: '050', name: 'Bangladesh' },
  { id: '840', name: 'United States' },
  { id: '826', name: 'United Kingdom' },
  { id: '356', name: 'India' },
  { id: '276', name: 'Germany' },
  { id: '124', name: 'Canada' },
  { id: '036', name: 'Australia' },
  { id: '702', name: 'Singapore' },
  { id: '784', name: 'UAE' },
  { id: '528', name: 'Netherlands' },
  { id: '682', name: 'Saudi Arabia' },
  { id: '156', name: 'China' },
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  homeCountry,
  onSelectHomeCountry,
  themeColor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

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

  // Group countries by continent (Asia at top)
  const countriesByContinent = useMemo(() => {
    const groups: Record<ContinentName, { id: string; name: string }[]> = {
      Asia: [],
      Europe: [],
      Americas: [],
      Africa: [],
      Oceania: [],
    };

    const query = searchQuery.trim().toLowerCase();

    countryListData.forEach(c => {
      if (!c.id) return;
      if (query && !c.name.toLowerCase().includes(query)) return;

      const continent = getCountryContinent(c.id);
      if (groups[continent]) {
        groups[continent].push(c);
      }
    });

    return groups;
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div
        className="w-full max-w-xl bg-white rounded-[24px] border border-[#e0e0e0] shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#f0f0f0] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
              style={{ backgroundColor: themeColor.hex }}
            >
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                Where are you working from?
              </h2>
              <p className="text-xs text-[#86868b] mt-1 leading-relaxed">
                Select your home base country. All client connections on your map will originate from this starting point.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#ebebed] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:px-6 bg-[#fafafa] border-b border-[#f0f0f0]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
            <input
              type="text"
              autoFocus
              placeholder="Search country (e.g. Bangladesh, United States, Japan)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#d1d1d6] focus:border-[#0066cc] rounded-full pl-10 pr-9 py-2 text-xs sm:text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Hub Picks */}
          {!searchQuery && (
            <div className="mt-3">
              <span className="text-[10px] uppercase font-mono font-semibold text-[#86868b] tracking-wider block mb-1.5">
                Popular Hubs:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_HUBS.map(hub => {
                  const isCurrent = homeCountry === hub.id;
                  return (
                    <button
                      key={`hub-${hub.id}`}
                      type="button"
                      onClick={() => {
                        onSelectHomeCountry(hub.id, hub.name);
                        onClose();
                      }}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all active:scale-95 flex items-center gap-1 cursor-pointer ${
                        isCurrent
                          ? 'text-white shadow-xs font-semibold'
                          : 'bg-white hover:bg-[#f0f0f0] text-[#1d1d1f] border border-[#e0e0e0]'
                      }`}
                      style={{
                        backgroundColor: isCurrent ? themeColor.hex : undefined,
                        borderColor: isCurrent ? themeColor.hex : undefined,
                      }}
                    >
                      <span>{getCountryFlag(hub.id)}</span>
                      <span>{hub.name}</span>
                      {isCurrent && <Check className="w-3 h-3 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Continent & Country List (Asia at top) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {CONTINENT_LIST.map(continent => {
            const countries = countriesByContinent[continent];
            if (countries.length === 0) return null;

            return (
              <div key={continent} className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-[#f0f0f0]">
                  <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#86868b]" />
                    <span>{continent}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#86868b]">
                    {countries.length} countries
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {countries.map(country => {
                    const isCurrent = homeCountry === country.id;
                    return (
                      <button
                        key={`home-country-${country.id}`}
                        type="button"
                        onClick={() => {
                          onSelectHomeCountry(country.id, country.name);
                          onClose();
                        }}
                        className={`text-left text-xs px-2.5 py-1.5 rounded-xl border flex items-center justify-between transition-all active:scale-95 cursor-pointer ${
                          isCurrent
                            ? 'text-white shadow-xs font-semibold'
                            : 'bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] border-[#e0e0e0]'
                        }`}
                        style={{
                          backgroundColor: isCurrent ? themeColor.hex : undefined,
                          borderColor: isCurrent ? themeColor.hex : undefined,
                        }}
                      >
                        <span className="truncate pr-1">{country.name}</span>
                        {isCurrent && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:px-6 bg-[#fafafa] border-t border-[#f0f0f0] flex items-center justify-between text-xs text-[#86868b]">
          <span>Connecting client lines will originate from your base country</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white border border-[#d1d1d6] hover:bg-[#f5f5f7] text-[#1d1d1f] font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
