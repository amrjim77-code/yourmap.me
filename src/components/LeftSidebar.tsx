import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Globe,
  Briefcase,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  MapPin,
  Star,
} from 'lucide-react';
import { ColorSwatch } from '../data/palette';
import {
  Skill,
  POPULAR_WORK_SERVICES,
} from '../data/skills';
import { CONTINENT_LIST, ContinentName, getCountryContinent } from '../data/countries';
import { ActiveTab } from './TopNav';
import countryListData from '../data/countryList.json';

interface LeftSidebarProps {
  activeTab: ActiveTab;
  themeColor: ColorSwatch;
  selectedCountries: string[];
  homeCountry?: string;
  onOpenLocationModal?: () => void;
  onToggleCountry: (id: string, name: string) => void;
  onClearCountries: () => void;
  skills: Skill[];
  onToggleSkill: (name: string, category?: string) => void;
  onAddCustomSkill: (name: string, category?: string) => void;
  onRemoveSkill: (id: string) => void;
  onToggleCoreSkill: (id: string) => void;
  onClearSkills: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  themeColor,
  selectedCountries,
  homeCountry,
  onOpenLocationModal,
  onToggleCountry,
  onClearCountries,
  skills,
  onToggleSkill,
  onAddCustomSkill,
  onRemoveSkill,
  onToggleCoreSkill,
  onClearSkills,
}) => {
  // Independent sidebar navigation so user can always switch between Countries and Work at any time
  const [sidebarTab, setSidebarTab] = useState<'countries' | 'skills'>(
    activeTab === 'skill-map' ? 'skills' : 'countries'
  );

  // Sync sidebar tab when user clicks top-level tabs above canvas
  useEffect(() => {
    if (activeTab === 'skill-map') {
      setSidebarTab('skills');
    } else if (activeTab === 'client-map') {
      setSidebarTab('countries');
    }
  }, [activeTab]);

  // Country Search & Accordions
  const [countrySearch, setCountrySearch] = useState('');
  const [expandedContinents, setExpandedContinents] = useState<Record<string, boolean>>({
    Asia: true,
    Europe: true,
    Americas: true,
    Africa: false,
    Oceania: false,
  });

  // Work selection state: unified search query
  const [workQuery, setWorkQuery] = useState('');

  // Selected Country Set for O(1) lookups
  const selectedCountrySet = useMemo(() => new Set(selectedCountries), [selectedCountries]);

  // Home Base Country Name
  const homeCountryName = useMemo(() => {
    if (!homeCountry) return 'Not selected';
    const match = countryListData.find(c => c.id === homeCountry);
    return match?.name || homeCountry;
  }, [homeCountry]);

  // Set of active skills/services by lowercase name for instant lookup
  const skillsByName = useMemo(() => {
    const map = new Map<string, Skill>();
    skills.forEach(s => map.set(s.name.toLowerCase().trim(), s));
    return map;
  }, [skills]);

  // Filtered services for the work selection panel
  const displayedServices = useMemo(() => {
    const q = workQuery.trim().toLowerCase();
    if (!q) return POPULAR_WORK_SERVICES;
    return POPULAR_WORK_SERVICES.filter(s => s.toLowerCase().includes(q));
  }, [workQuery]);

  // Countries grouped by continents (Asia first as requested)
  const countriesByContinent = useMemo(() => {
    const groups: Record<ContinentName, { id: string; name: string }[]> = {
      Asia: [],
      Europe: [],
      Americas: [],
      Africa: [],
      Oceania: [],
    };

    const query = countrySearch.trim().toLowerCase();

    countryListData.forEach(c => {
      if (!c.id) return;
      if (query && !c.name.toLowerCase().includes(query)) return;

      const continent = getCountryContinent(c.id);
      if (groups[continent]) {
        groups[continent].push(c);
      }
    });

    return groups;
  }, [countrySearch]);

  const toggleContinent = (continent: string) => {
    setExpandedContinents(prev => ({
      ...prev,
      [continent]: !prev[continent],
    }));
  };

  const handleAddWorkFromInput = () => {
    const trimmed = workQuery.trim();
    if (!trimmed) return;
    onAddCustomSkill(trimmed, 'Work');
    setWorkQuery('');
  };

  const isClientViewActive = sidebarTab === 'countries';
  const isSkillViewActive = sidebarTab === 'skills';

  // Check if current search query already exists in selected skills
  const isQueryAlreadySelected = useMemo(() => {
    const q = workQuery.trim().toLowerCase();
    return q ? skillsByName.has(q) : false;
  }, [workQuery, skillsByName]);

  return (
    <aside className="w-full lg:w-[360px] xl:w-[390px] flex flex-col bg-white border border-[#e0e0e0] rounded-[18px] shadow-sm p-3.5 sm:p-5 shrink-0 select-none static lg:sticky lg:top-24 h-auto max-h-[580px] lg:max-h-[calc(100vh-140px)]">
      {/* ========================================================
          ALWAYS-VISIBLE TOP NAVIGATION TABS (Countries vs What You Do)
         ======================================================== */}
      <div className="pb-3 mb-2 border-b border-[#e0e0e0]">
        <div className="grid grid-cols-2 p-1 bg-[#f5f5f7] rounded-full border border-[#e0e0e0] text-xs shadow-2xs">
          <button
            type="button"
            onClick={() => setSidebarTab('countries')}
            className={`py-1.5 px-3 rounded-full font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              sidebarTab === 'countries'
                ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
                : 'text-[#6e6e73] hover:text-[#1d1d1f]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Countries ({selectedCountries.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSidebarTab('skills')}
            className={`py-1.5 px-3 rounded-full font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              sidebarTab === 'skills'
                ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
                : 'text-[#6e6e73] hover:text-[#1d1d1f]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>What You Do ({skills.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          PANEL A: CLIENT MAP CONTROLS (WORKED COUNTRIES)
         ======================================================== */}
      {isClientViewActive && (
        <div className="flex-1 flex flex-col overflow-hidden space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">
                Client Countries
              </h3>
              <p className="text-[11px] text-[#86868b]">Select countries you work with or in</p>
            </div>

            <div
              className="text-xs font-mono font-semibold px-3 py-1 rounded-full border transition-colors"
              style={{
                backgroundColor: `${themeColor.hex}12`,
                borderColor: `${themeColor.hex}30`,
                color: themeColor.hex,
              }}
            >
              {selectedCountries.length}/195
            </div>
          </div>

          {/* Starting Point (Where you work from) Banner */}
          <div className="p-2.5 rounded-[14px] bg-[#fbfbfd] border border-[#e0e0e0] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 shadow-2xs"
                style={{ backgroundColor: themeColor.hex }}
              >
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-mono font-semibold text-[#86868b] leading-tight">
                  Starting Point (Home Base)
                </span>
                <span className="text-xs font-semibold text-[#1d1d1f] truncate leading-tight mt-0.5">
                  Working from: {homeCountryName}
                </span>
              </div>
            </div>
            {onOpenLocationModal && (
              <button
                type="button"
                onClick={onOpenLocationModal}
                className="text-xs font-semibold px-2.5 py-1 rounded-full border border-[#0066cc] text-[#0066cc] hover:bg-[#0066cc] hover:text-white transition-all cursor-pointer shrink-0 ml-2 shadow-2xs"
              >
                {homeCountry ? 'Change' : 'Select'}
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
            <input
              type="text"
              placeholder="Search 195 countries..."
              value={countrySearch}
              onChange={e => setCountrySearch(e.target.value)}
              className="w-full bg-[#f5f5f7] focus:bg-white border border-[#e0e0e0] focus:border-[#0066cc] rounded-full pl-9 pr-8 py-1.5 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:outline-none transition-colors"
            />
            {countrySearch && (
              <button
                type="button"
                onClick={() => setCountrySearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Clear Action */}
          <div className="flex items-center justify-between text-xs text-[#6e6e73] pt-0.5">
            <button
              type="button"
              onClick={onClearCountries}
              disabled={selectedCountries.length === 0}
              className="text-xs text-[#6e6e73] hover:text-rose-600 font-medium transition-colors disabled:opacity-40 cursor-pointer"
            >
              Clear all countries
            </button>
            <span className="text-[11px] font-mono text-[#86868b]">
              {selectedCountries.length} highlighted
            </span>
          </div>

          {/* Continents Accordion List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {CONTINENT_LIST.map(continent => {
              const countries = countriesByContinent[continent];
              if (countries.length === 0) return null;

              const isExpanded = expandedContinents[continent];
              const selectedInContinent = countries.filter(c => selectedCountrySet.has(c.id)).length;

              return (
                <div
                  key={continent}
                  className="rounded-[14px] bg-[#fbfbfd] border border-[#e0e0e0] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleContinent(continent)}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#f5f5f7] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-[#86868b]" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-[#86868b]" />
                      )}
                      <span className="text-xs font-semibold text-[#1d1d1f]">{continent}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedInContinent > 0 && (
                        <span
                          className="text-[11px] font-mono px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            backgroundColor: `${themeColor.hex}18`,
                            color: themeColor.hex,
                          }}
                        >
                          {selectedInContinent}
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-[#86868b]">
                        {countries.length}
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 pt-1 flex flex-wrap gap-1.5 border-t border-[#f0f0f0] bg-white">
                      {countries.map(country => {
                        const isSelected = selectedCountrySet.has(country.id);
                        const isHome = country.id === homeCountry;

                        return (
                          <button
                            key={`${continent}-${country.id || country.name}`}
                            type="button"
                            onClick={() => onToggleCountry(country.id, country.name)}
                            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                              isHome
                                ? 'text-white shadow-xs font-semibold ring-2 ring-[#0066cc]/50 ring-offset-1'
                                : isSelected
                                ? 'text-white shadow-2xs font-semibold'
                                : 'bg-[#f5f5f7] hover:bg-[#ebebed] text-[#1d1d1f] border border-[#e0e0e0]'
                            }`}
                            style={{
                              backgroundColor: (isHome || isSelected) ? themeColor.hex : undefined,
                              borderColor: (isHome || isSelected) ? themeColor.hex : undefined,
                            }}
                            title={isHome ? 'Starting Point / Home Base' : undefined}
                          >
                            {isHome && <Star className="w-2.5 h-2.5 fill-current text-white shrink-0" />}
                            {!isHome && isSelected && <span className="text-[10px] leading-none font-bold">•</span>}
                            <span className="truncate max-w-[140px]">{country.name}{isHome ? ' (Base)' : ''}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          PANEL B: WORK & WHAT YOU DO CONTROLS (EASY, CLEAN & INTUITIVE)
         ======================================================== */}
      {isSkillViewActive && (
        <div className="flex-1 flex flex-col overflow-hidden space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">
                What You Do
              </h3>
              <p className="text-[11px] text-[#86868b]">Select your roles or type any custom work</p>
            </div>

            <div
              className="text-xs font-mono font-semibold px-3 py-1 rounded-full border transition-colors"
              style={{
                backgroundColor: `${themeColor.hex}12`,
                borderColor: `${themeColor.hex}30`,
                color: themeColor.hex,
              }}
            >
              {skills.length} Selected
            </div>
          </div>

          {/* Prominent, Highly Visible Search & Instant Add Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
            <input
              type="text"
              placeholder="Search or type custom role (e.g. Designer)..."
              value={workQuery}
              onChange={e => setWorkQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddWorkFromInput();
                }
              }}
              className="w-full bg-[#f5f5f7] focus:bg-white border-2 border-[#d8d8de] focus:border-[#0066cc] rounded-full pl-10 pr-20 py-2.5 text-xs sm:text-[13px] font-medium text-[#1d1d1f] placeholder-[#86868b] focus:outline-none transition-all shadow-xs"
            />
            {workQuery.trim() && (
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleAddWorkFromInput}
                  className="px-3 py-1 rounded-full text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                  style={{ backgroundColor: themeColor.hex }}
                  title="Add as custom role"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkQuery('')}
                  className="text-[#86868b] hover:text-[#1d1d1f] p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Selected Work Pills (Active) */}
          {skills.length > 0 && (
            <div className="space-y-1.5 p-2.5 rounded-[16px] bg-[#fbfbfd] border border-[#e0e0e0] shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-[#86868b] uppercase tracking-wider font-semibold">
                  Your Selected Work ({skills.length})
                </span>
                <button
                  type="button"
                  onClick={onClearSkills}
                  className="text-xs text-[#86868b] hover:text-rose-600 font-medium transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1">
                {skills.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onRemoveSkill(item.id)}
                    className="text-xs px-3 py-1 rounded-full font-medium transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer text-white shadow-2xs group"
                    style={{
                      backgroundColor: themeColor.hex,
                      borderColor: themeColor.hex,
                    }}
                    title="Click to remove"
                  >
                    <span className="truncate max-w-[150px]">{item.name}</span>
                    <X className="w-3 h-3 group-hover:scale-125 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Offerings Grid / Pill Matrix (Clean & Easy Looking) */}
          <div className="flex-1 flex flex-col overflow-hidden space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between text-xs text-[#86868b]">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
                {workQuery.trim() ? `Search Results (${displayedServices.length})` : 'Popular Roles'}
              </span>
              <span className="text-[11px] font-mono text-[#86868b]">1-click toggle</span>
            </div>

            {/* Custom Work Adder Banner if typing something not yet added */}
            {workQuery.trim() && !isQueryAlreadySelected && (
              <button
                type="button"
                onClick={handleAddWorkFromInput}
                className="w-full p-2.5 rounded-[14px] bg-[#f5f5f7] hover:bg-white border-2 border-dashed border-[#0066cc] text-[#0066cc] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add &quot;{workQuery.trim()}&quot; as custom work</span>
              </button>
            )}

            <div className="flex-1 overflow-y-auto pr-1 flex flex-wrap gap-1.5 content-start">
              {displayedServices.map(serviceName => {
                const isSelected = skillsByName.has(serviceName.toLowerCase().trim());

                return (
                  <button
                    key={serviceName}
                    type="button"
                    onClick={() => onToggleSkill(serviceName)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'text-white shadow-2xs font-semibold'
                        : 'bg-[#f5f5f7] hover:bg-[#ebebed] text-[#1d1d1f] border border-[#e0e0e0]'
                    }`}
                    style={{
                      backgroundColor: isSelected ? themeColor.hex : undefined,
                      borderColor: isSelected ? themeColor.hex : undefined,
                    }}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                    <span className="truncate max-w-[160px]">{serviceName}</span>
                  </button>
                );
              })}

              {displayedServices.length === 0 && (
                <div className="w-full py-8 text-center text-xs text-[#86868b] flex flex-col items-center gap-2">
                  <p>No matching preset found.</p>
                  <button
                    type="button"
                    onClick={handleAddWorkFromInput}
                    className="px-4 py-1.5 rounded-full text-white text-xs font-semibold cursor-pointer shadow-2xs"
                    style={{ backgroundColor: themeColor.hex }}
                  >
                    Add &quot;{workQuery.trim()}&quot;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
