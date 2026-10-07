export interface WorkOffering {
  id: string;
  name: string;
  isCore?: boolean;
  category?: string;
  domain?: string;
}

// Skill is aliased to WorkOffering for full backwards compatibility
export type Skill = WorkOffering;

export interface SkillItem {
  id: string;
  name: string;
  category?: string;
  domain?: string;
  isCore?: boolean;
  level?: 'core' | 'advanced' | 'familiar';
}

export type SkillDomainId = string;

export interface SkillDomain {
  id: string;
  label: string;
  shortLabel: string;
  iconName: string;
  description: string;
  accentColor: string;
}

export interface WorkCategory {
  id: string;
  label: string;
  icon?: string;
  services: string[];
}

// Clean, human, universally recognized categories of global remote work
export const POPULAR_WORK_CATEGORIES: WorkCategory[] = [
  {
    id: 'creative',
    label: 'Design & Creative',
    icon: '🎨',
    services: [
      'Designer',
      'UI/UX Designer',
      'Digital Artist',
      '3D Artist',
      'Graphic Designer',
      'Motion Designer',
      'Illustrator',
      'Brand Designer',
      'Art Director',
      'Architect',
    ],
  },
  {
    id: 'trade',
    label: 'Trade & Logistics',
    icon: '📦',
    services: [
      'Importer / Exporter',
      'Global Trader',
      'Sourcing Agent',
      'Freight & Logistics',
      'Supply Chain Manager',
      'E-Commerce Merchant',
      'Wholesale Distributor',
      'Manufacturer Agent',
    ],
  },
  {
    id: 'tech',
    label: 'Tech & Engineering',
    icon: '💻',
    services: [
      'Software Developer',
      'Web Developer',
      'Mobile App Developer',
      'AI Engineer',
      'Cloud & DevOps',
      'Product Manager',
      'Data Scientist',
      'Systems Architect',
    ],
  },
  {
    id: 'business',
    label: 'Business & Consulting',
    icon: '📈',
    services: [
      'Business Consultant',
      'Strategy Advisor',
      'Financial Advisor',
      'Operations Consultant',
      'Project Manager',
      'Legal Consultant',
      'Virtual Assistant',
    ],
  },
  {
    id: 'media',
    label: 'Media & Marketing',
    icon: '📣',
    services: [
      'Growth Marketer',
      'Video Editor',
      'Content Creator',
      'Copywriter',
      'SEO Specialist',
      'Social Media Strategist',
      'Translator',
      'Photographer',
      'Audio Producer',
    ],
  },
];

// Flat list of all preset offerings for search & toggle (curated with top roles first)
export const POPULAR_WORK_SERVICES: string[] = [
  'Designer',
  'Digital Artist',
  'Importer / Exporter',
  'Software Developer',
  'UI/UX Designer',
  'Video Editor',
  'Business Consultant',
  'Growth Marketer',
  '3D Artist',
  'E-Commerce Merchant',
  'Sourcing Agent',
  'Content Creator',
  'Copywriter',
  'Brand Designer',
  'Freight & Logistics',
  'Product Manager',
  'Graphic Designer',
  'AI Engineer',
  'Translator',
  'Photographer',
  'Global Trader',
  'Motion Designer',
  'Web Developer',
  'Strategy Advisor',
  'Supply Chain Manager',
  'Financial Advisor',
  'Cloud & DevOps',
  'Illustrator',
  'Architect',
  'Art Director',
  'Data Scientist',
  'Wholesale Distributor',
  'Mobile App Developer',
  'Operations Consultant',
  'SEO Specialist',
  'Audio Producer',
  'Social Media Strategist',
  'Project Manager',
  'Legal Consultant',
  'Virtual Assistant',
  'Manufacturer Agent',
  'Systems Architect',
];

// Initial skills start empty for ready-to-use production state
export const INITIAL_SKILLS: WorkOffering[] = [];

// Legacy compatibility exports if needed by any older views
export const PRESET_CATEGORIES: { name: string; icon: string; color: string }[] = [
  { name: 'Core Services', icon: 'Briefcase', color: '#10b981' },
];

export const PREPOPULATED_SKILLS: Record<string, string[]> = {
  'Core Services': POPULAR_WORK_SERVICES,
};

export const SKILL_DOMAINS: SkillDomain[] = [
  { id: 'services', label: 'Services & Work', shortLabel: 'Services', iconName: 'Briefcase', description: 'Work and service offerings', accentColor: '#10b981' },
];

export const SUGGESTED_SKILLS_BY_DOMAIN: Record<string, string[]> = PREPOPULATED_SKILLS;

export interface SkillProfilePreset {
  label: string;
  name: string;
  title: string;
  tagline: string;
  experienceMetric: string;
  themeId: string;
  skills: { name: string; domain?: string; category?: string; level?: 'core' | 'advanced' | 'familiar' }[];
}

export const SKILL_PROFILE_PRESETS: SkillProfilePreset[] = [
  {
    label: 'Senior Full-Stack Consultant',
    name: 'Alex Rivera',
    title: 'Senior Full-Stack Engineer & Consultant',
    tagline: 'Building mission-critical web applications for high-growth tech companies worldwide.',
    experienceMetric: '10+ Years Building Web Systems',
    themeId: 'indigo-obsidian',
    skills: [
      { name: 'Software Developer', level: 'core' },
      { name: 'Cloud & DevOps', level: 'core' },
      { name: 'Designer', level: 'core' },
      { name: 'AI Engineer', level: 'core' },
    ],
  },
];
