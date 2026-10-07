/**
 * Browser Local Storage Utility
 * 
 * PRIVACY GUARANTEE:
 * All user profile information, photos, countries, and service offerings
 * are stored STRICTLY inside the user's local browser storage (localStorage).
 * ZERO data or images are ever transmitted to or stored on any external database or server.
 */

import { Skill } from '../data/skills';

const STORAGE_PREFIX = 'yourmap_';

export const STORAGE_KEYS = {
  USER_NAME: `${STORAGE_PREFIX}user_name`,
  USER_TITLE: `${STORAGE_PREFIX}user_title`,
  HOME_COUNTRY: `${STORAGE_PREFIX}home_country`,
  SELECTED_COUNTRIES: `${STORAGE_PREFIX}selected_countries`,
  SKILLS: `${STORAGE_PREFIX}skills`,
  THEME_ID: `${STORAGE_PREFIX}theme_id`,
  AVATAR_URL: `${STORAGE_PREFIX}avatar_url`,
  SHOW_LABELS: `${STORAGE_PREFIX}show_labels`,
  ASPECT_RATIO: `${STORAGE_PREFIX}aspect_ratio`,
};

export interface LocalUserData {
  userName: string;
  userTitle: string;
  homeCountry: string;
  selectedCountries: string[];
  skills: Skill[];
  themeId?: string;
  avatarUrl: string | null;
  showLabels: boolean;
  aspectRatio?: '4:5' | '1:1';
}

/**
 * Safely load all user data from browser's local storage
 */
export function loadUserLocalData(): Partial<LocalUserData> {
  if (typeof window === 'undefined') return {};

  try {
    const rawCountries = localStorage.getItem(STORAGE_KEYS.SELECTED_COUNTRIES);
    const rawSkills = localStorage.getItem(STORAGE_KEYS.SKILLS);
    const rawLabels = localStorage.getItem(STORAGE_KEYS.SHOW_LABELS);
    const rawAspectRatio = localStorage.getItem(STORAGE_KEYS.ASPECT_RATIO);

    return {
      userName: localStorage.getItem(STORAGE_KEYS.USER_NAME) || '',
      userTitle: localStorage.getItem(STORAGE_KEYS.USER_TITLE) || '',
      homeCountry: localStorage.getItem(STORAGE_KEYS.HOME_COUNTRY) || '',
      selectedCountries: rawCountries ? JSON.parse(rawCountries) : undefined,
      skills: rawSkills ? JSON.parse(rawSkills) : undefined,
      themeId: localStorage.getItem(STORAGE_KEYS.THEME_ID) || undefined,
      avatarUrl: localStorage.getItem(STORAGE_KEYS.AVATAR_URL) || null,
      showLabels: rawLabels !== null ? rawLabels === 'true' : true,
      aspectRatio: (rawAspectRatio === '4:5' || rawAspectRatio === '1:1') ? rawAspectRatio : undefined,
    };
  } catch (err) {
    console.warn('Could not read from local browser storage:', err);
    return {};
  }
}

/**
 * Save user data locally to the browser
 */
export function saveUserLocalData(key: string, value: any): void {
  if (typeof window === 'undefined') return;

  try {
    if (value === null || value === undefined || value === '') {
      localStorage.removeItem(key);
    } else if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, String(value));
    }
  } catch (err) {
    console.warn(`Could not save key ${key} to local browser storage:`, err);
  }
}

/**
 * Optimizes an uploaded image dataURL so it stays compact (~30-50KB)
 * and safely fits in browser localStorage without exceeding quotas.
 */
export function optimizeImageForLocalStorage(
  dataUrl: string,
  maxWidth = 360,
  maxHeight = 360,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve(dataUrl);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio scale
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(dataUrl);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (e) {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Clear all locally stored browser data
 */
export function clearUserLocalData(): void {
  if (typeof window === 'undefined') return;
  try {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  } catch (err) {
    console.warn('Could not clear local browser storage:', err);
  }
}
