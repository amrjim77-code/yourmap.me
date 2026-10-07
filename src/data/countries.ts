export interface CountryItem {
  id: string;
  name: string;
  continent?: ContinentName;
  flag?: string;
}

export type ContinentName = 'Asia' | 'Europe' | 'Americas' | 'Africa' | 'Oceania';

export const CONTINENT_LIST: ContinentName[] = [
  'Asia',
  'Europe',
  'Americas',
  'Africa',
  'Oceania',
];

// Country ID to Flag Emoji mapping for common/global countries
export const COUNTRY_FLAGS: Record<string, string> = {
  '840': '🇺🇸', // USA
  '124': '🇨🇦', // Canada
  '826': '🇬🇧', // UK
  '276': '🇩🇪', // Germany
  '250': '🇫🇷', // France
  '392': '🇯🇵', // Japan
  '036': '🇦🇺', // Australia
  '702': '🇸🇬', // Singapore
  '756': '🇨🇭', // Switzerland
  '528': '🇳🇱', // Netherlands
  '752': '🇸🇪', // Sweden
  '578': '🇳🇴', // Norway
  '208': '🇩🇰', // Denmark
  '246': '🇫🇮', // Finland
  '380': '🇮🇹', // Italy
  '724': '🇪🇸', // Spain
  '620': '🇵🇹', // Portugal
  '372': '🇮🇪', // Ireland
  '056': '🇧🇪', // Belgium
  '040': '🇦🇹', // Austria
  '616': '🇵🇱', // Poland
  '356': '🇮🇳', // India
  '410': '🇰🇷', // South Korea
  '156': '🇨🇳', // China
  '076': '🇧🇷', // Brazil
  '484': '🇲🇽', // Mexico
  '032': '🇦🇷', // Argentina
  '152': '🇨🇱', // Chile
  '170': '🇨🇴', // Colombia
  '554': '🇳🇿', // New Zealand
  '784': '🇦🇪', // UAE
  '682': '🇸🇦', // Saudi Arabia
  '376': '🇮🇱', // Israel
  '710': '🇿🇦', // South Africa
  '566': '🇳🇬', // Nigeria
  '404': '🇰🇪', // Kenya
  '818': '🇪🇬', // Egypt
  '764': '🇹🇭', // Thailand
  '704': '🇻🇳', // Vietnam
  '360': '🇮🇩', // Indonesia
  '458': '🇲🇾', // Malaysia
  '608': '🇵🇭', // Philippines
  '792': '🇹🇷', // Turkey
  '804': '🇺🇦', // Ukraine
  '643': '🇷🇺', // Russia
  '300': '🇬🇷', // Greece
  '203': '🇨🇿', // Czechia
  '348': '🇭🇺', // Hungary
  '642': '🇷🇴', // Romania
  '068': '🇧🇴', // Bolivia
  '604': '🇵🇪', // Peru
  '858': '🇺🇾', // Uruguay
  '862': '🇻🇪', // Venezuela
  '192': '🇨🇺', // Cuba
  '214': '🇩🇴', // Dominican Republic
  '320': '🇬🇹', // Guatemala
  '188': '🇨🇷', // Costa Rica
  '591': '🇵🇦', // Panama
  '364': '🇮🇷', // Iran
  '368': '🇮🇶', // Iraq
  '586': '🇵🇰', // Pakistan
  '050': '🇧🇩', // Bangladesh
  '144': '🇱🇰', // Sri Lanka
  '524': '🇳🇵', // Nepal
  '634': '🇶🇦', // Qatar
  '414': '🇰🇼', // Kuwait
  '512': '🇴🇲', // Oman
  '504': '🇲🇦', // Morocco
  '788': '🇹🇳', // Tunisia
  '012': '🇩🇿', // Algeria
  '288': '🇬🇭', // Ghana
  '242': '🇫🇯', // Fiji
  '598': '🇵🇬', // Papua New Guinea
};

export const getCountryFlag = (id: string): string => {
  return COUNTRY_FLAGS[id] || '🌐';
};

// Complete mapping of all standard ISO IDs to the 5 requested continents:
// Asia, Europe, Americas, Africa, Oceania
export const CONTINENT_MAP: Record<string, ContinentName> = {
  // Americas
  '840': 'Americas', '124': 'Americas', '484': 'Americas', '076': 'Americas', '032': 'Americas',
  '152': 'Americas', '170': 'Americas', '604': 'Americas', '068': 'Americas', '600': 'Americas',
  '858': 'Americas', '862': 'Americas', '188': 'Americas', '591': 'Americas', '320': 'Americas',
  '340': 'Americas', '222': 'Americas', '084': 'Americas', '192': 'Americas', '214': 'Americas',
  '332': 'Americas', '388': 'Americas', '780': 'Americas', '044': 'Americas', '328': 'Americas',
  '740': 'Americas', '238': 'Americas', '630': 'Americas', '304': 'Americas',

  // Europe
  '826': 'Europe', '276': 'Europe', '250': 'Europe', '528': 'Europe', '756': 'Europe',
  '724': 'Europe', '380': 'Europe', '752': 'Europe', '578': 'Europe', '208': 'Europe',
  '246': 'Europe', '056': 'Europe', '040': 'Europe', '372': 'Europe', '620': 'Europe',
  '616': 'Europe', '300': 'Europe', '203': 'Europe', '348': 'Europe', '642': 'Europe',
  '804': 'Europe', '643': 'Europe', '112': 'Europe', '100': 'Europe', '191': 'Europe',
  '703': 'Europe', '705': 'Europe', '440': 'Europe', '428': 'Europe', '233': 'Europe',
  '352': 'Europe', '442': 'Europe', '498': 'Europe', '499': 'Europe', '688': 'Europe',
  '008': 'Europe', '070': 'Europe', '807': 'Europe', '196': 'Europe',

  // Asia
  '392': 'Asia', '702': 'Asia', '410': 'Asia', '356': 'Asia', '156': 'Asia',
  '764': 'Asia', '704': 'Asia', '360': 'Asia', '458': 'Asia', '608': 'Asia',
  '784': 'Asia', '682': 'Asia', '376': 'Asia', '634': 'Asia', '414': 'Asia',
  '512': 'Asia', '792': 'Asia', '364': 'Asia', '368': 'Asia', '586': 'Asia',
  '050': 'Asia', '144': 'Asia', '524': 'Asia', '004': 'Asia', '398': 'Asia',
  '860': 'Asia', '762': 'Asia', '417': 'Asia', '795': 'Asia', '051': 'Asia',
  '031': 'Asia', '268': 'Asia', '496': 'Asia', '104': 'Asia', '408': 'Asia',
  '116': 'Asia', '418': 'Asia', '422': 'Asia', '760': 'Asia', '887': 'Asia',
  '064': 'Asia', '096': 'Asia', '158': 'Asia', '626': 'Asia',

  // Oceania
  '036': 'Oceania', '554': 'Oceania', '242': 'Oceania', '598': 'Oceania', '090': 'Oceania',
  '548': 'Oceania', '540': 'Oceania', '010': 'Oceania',

  // Africa (defaults & key mapped)
  '710': 'Africa', '566': 'Africa', '404': 'Africa', '818': 'Africa', '504': 'Africa',
  '788': 'Africa', '012': 'Africa', '288': 'Africa', '231': 'Africa', '729': 'Africa',
  '834': 'Africa', '800': 'Africa', '204': 'Africa', '180': 'Africa', '178': 'Africa',
  '120': 'Africa', '706': 'Africa', '262': 'Africa', '508': 'Africa', '686': 'Africa',
  '450': 'Africa', '478': 'Africa', '516': 'Africa', '694': 'Africa', '768': 'Africa',
  '854': 'Africa', '024': 'Africa', '072': 'Africa', '108': 'Africa', '148': 'Africa',
  '266': 'Africa', '270': 'Africa', '324': 'Africa', '430': 'Africa', '434': 'Africa',
  '466': 'Africa', '480': 'Africa', '562': 'Africa', '624': 'Africa', '646': 'Africa',
  '678': 'Africa', '732': 'Africa', '748': 'Africa', '894': 'Africa', '716': 'Africa',
};

export const getCountryContinent = (id: string): ContinentName => {
  return CONTINENT_MAP[id] || 'Americas';
};

export const countContinents = (ids: string[]): number => {
  const continents = new Set<string>();
  for (const id of ids) {
    if (CONTINENT_MAP[id]) {
      continents.add(CONTINENT_MAP[id]);
    }
  }
  return Math.max(continents.size, ids.length > 0 ? 1 : 0);
};

// Preset regions for rapid one-click selection
export const REGIONAL_PRESETS: { name: string; description: string; ids: string[] }[] = [
  {
    name: 'Top Global Tech Hubs',
    description: 'US, UK, Germany, Canada, Japan, Singapore, Australia',
    ids: ['840', '826', '276', '124', '392', '702', '036'],
  },
  {
    name: 'North America',
    description: 'United States, Canada, Mexico',
    ids: ['840', '124', '484'],
  },
  {
    name: 'Western & Central Europe',
    description: 'UK, Germany, France, Netherlands, Switzerland, Spain, Italy',
    ids: ['826', '276', '250', '528', '756', '724', '380', '056', '040', '372'],
  },
  {
    name: 'Nordics',
    description: 'Sweden, Norway, Denmark, Finland',
    ids: ['752', '578', '208', '246'],
  },
  {
    name: 'Asia Pacific (APAC)',
    description: 'Japan, Australia, Singapore, South Korea, India, New Zealand',
    ids: ['392', '036', '702', '410', '356', '554'],
  },
  {
    name: 'Latin America',
    description: 'Brazil, Argentina, Mexico, Colombia, Chile',
    ids: ['076', '032', '484', '170', '152'],
  },
  {
    name: 'Middle East & Gulf',
    description: 'UAE, Saudi Arabia, Qatar, Israel',
    ids: ['784', '682', '634', '376'],
  },
];

// Profile templates for instant showcase
export interface ProfileTemplate {
  name: string;
  title: string;
  tagline?: string;
  skills: string[];
  clientCount?: string;
  themeId: string;
  countryIds: string[];
}

export const PROFILE_TEMPLATES: { label: string; template: ProfileTemplate }[] = [
  {
    label: 'Global Senior Full-Stack Engineer',
    template: {
      name: 'Alex Rivera',
      title: 'Senior Full-Stack Engineer & Architect',
      tagline: 'Building mission-critical web applications for high-growth tech companies worldwide.',
      skills: ['Next.js & React', 'TypeScript', 'Node.js & Backend', 'Cloud Architecture', 'AI & LLM Integration'],
      clientCount: '34+ Shipped Projects',
      themeId: 'indigo-obsidian',
      countryIds: ['840', '124', '826', '276', '250', '392', '036', '702', '756', '528', '752'],
    },
  },
  {
    label: 'Boutique Product Design Agency',
    template: {
      name: 'Studio North',
      title: 'Digital Product & Brand Studio',
      tagline: 'Designing category-defining interfaces and identity systems across 4 continents.',
      skills: ['UI/UX Design', 'Design Systems', 'Brand Identity', 'Product Strategy', 'Figma'],
      clientCount: '48 Global Clients',
      themeId: 'cyber-emerald',
      countryIds: ['840', '826', '276', '752', '208', '578', '036', '702', '124', '040', '392'],
    },
  },
  {
    label: 'Fractional CTO & Tech Advisor',
    template: {
      name: 'Elena Rostova',
      title: 'Fractional CTO & Distributed Systems Advisor',
      tagline: 'Scaling seed to Series B engineering teams and technical architectures globally.',
      skills: ['Fractional CTO', 'Cloud Architecture', 'Full-Stack Development', 'Product Strategy'],
      clientCount: '22 Scaled Startups',
      themeId: 'amber-sunset',
      countryIds: ['840', '124', '826', '276', '756', '376', '702', '410', '036', '356'],
    },
  },
  {
    label: 'Minimalist Editorial Consultant',
    template: {
      name: 'Marcus Vance',
      title: 'Growth Marketing & Strategic Copywriting',
      tagline: 'Crafting high-converting positioning and messaging for modern enterprise software.',
      skills: ['Product Strategy', 'Conversion Rate Optimization', 'Brand Identity', 'SEO & Performance'],
      clientCount: '60+ Global Retainers',
      themeId: 'editorial-paper',
      countryIds: ['840', '826', '124', '036', '276', '528', '372', '554', '702'],
    },
  },
];
