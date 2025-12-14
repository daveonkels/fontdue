/**
 * fontManager.js - Fontdue
 * Manages font collection in localStorage (CRUD operations)
 * Uses catalog system for starter fonts instead of hardcoded defaults
 */

import * as fontCatalog from './fontCatalog.js';

const STORAGE_KEY = 'fontdue';
const FONTS_KEY = 'fonts';
const SETTINGS_KEY = 'settings';

const DEFAULT_SETTINGS = {
  theme: 'dark',
  selectedFontId: 'google-inter',
  sidebarCollapsed: false,
  googleApiKey: null
};

/**
 * Get all data from localStorage
 */
function getData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to read from localStorage:', e);
    return null;
  }
}

/**
 * Save data to localStorage
 */
function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
    return false;
  }
}

/**
 * Initialize the font manager
 * Loads starter fonts from catalog on first run
 * @returns {Promise<Object>} Initialization data
 */
export async function initialize() {
  let data = getData();

  // Check if this is first run or empty fonts
  if (!data || !data[FONTS_KEY] || data[FONTS_KEY].length === 0) {
    console.log('First run: loading starter fonts from catalog...');

    try {
      const starterFonts = await fontCatalog.getStarterFonts();
      console.log(`Loaded ${starterFonts.length} starter fonts`);

      data = {
        [FONTS_KEY]: starterFonts,
        [SETTINGS_KEY]: DEFAULT_SETTINGS
      };
      saveData(data);
    } catch (error) {
      console.error('Failed to load starter fonts:', error);
      // Fall back to empty collection
      data = {
        [FONTS_KEY]: [],
        [SETTINGS_KEY]: DEFAULT_SETTINGS
      };
      saveData(data);
    }
  }

  return data;
}

/**
 * Synchronous initialize for backward compatibility
 * Returns existing data without loading from catalog
 */
export function initializeSync() {
  let data = getData();

  if (!data) {
    data = {
      [FONTS_KEY]: [],
      [SETTINGS_KEY]: DEFAULT_SETTINGS
    };
    saveData(data);
  }

  return data;
}

/**
 * Get all fonts
 */
export function getAllFonts() {
  const data = getData();
  return data?.[FONTS_KEY] || [];
}

/**
 * Get fonts grouped by source
 */
export function getFontsGrouped() {
  const fonts = getAllFonts();

  return {
    favorites: fonts.filter(f => f.favorite),
    google: fonts.filter(f => f.source === 'google'),
    bunny: fonts.filter(f => f.source === 'bunny'),
    fontshare: fonts.filter(f => f.source === 'fontshare'),
    cdn: fonts.filter(f => f.source === 'cdn'),
    system: fonts.filter(f => f.source === 'system' || f.source === 'local'),
    upload: fonts.filter(f => f.source === 'upload')
  };
}

/**
 * Get a single font by ID
 */
export function getFont(id) {
  const fonts = getAllFonts();
  return fonts.find(f => f.id === id);
}

/**
 * Check if a font exists in the collection
 * @param {string} id - Font ID (with source prefix, e.g., 'google-inter')
 */
export function hasFontInCollection(id) {
  const fonts = getAllFonts();
  return fonts.some(f => f.id === id);
}

/**
 * Add a new font
 */
export function addFont(font) {
  const data = getData();
  if (!data) return false;

  // Generate ID if not provided
  if (!font.id) {
    font.id = generateFontId(font.name);
  }

  // Check for duplicates
  if (data[FONTS_KEY].some(f => f.id === font.id)) {
    console.warn('Font with this ID already exists:', font.id);
    return false;
  }

  // Add metadata
  font.dateAdded = font.dateAdded || new Date().toISOString();
  font.favorite = font.favorite || false;

  data[FONTS_KEY].push(font);
  return saveData(data);
}

/**
 * Update a font
 */
export function updateFont(id, updates) {
  const data = getData();
  if (!data) return false;

  const index = data[FONTS_KEY].findIndex(f => f.id === id);
  if (index === -1) return false;

  data[FONTS_KEY][index] = { ...data[FONTS_KEY][index], ...updates };
  return saveData(data);
}

/**
 * Delete a font
 */
export function deleteFont(id) {
  const data = getData();
  if (!data) return false;

  const index = data[FONTS_KEY].findIndex(f => f.id === id);
  if (index === -1) return false;

  data[FONTS_KEY].splice(index, 1);
  return saveData(data);
}

/**
 * Toggle favorite status
 */
export function toggleFavorite(id) {
  const font = getFont(id);
  if (!font) return false;

  return updateFont(id, { favorite: !font.favorite });
}

/**
 * Get settings
 */
export function getSettings() {
  const data = getData();
  return data?.[SETTINGS_KEY] || DEFAULT_SETTINGS;
}

/**
 * Get a specific setting
 */
export function getSetting(key) {
  const settings = getSettings();
  return settings[key];
}

/**
 * Set a specific setting
 */
export function setSetting(key, value) {
  return updateSettings({ [key]: value });
}

/**
 * Update settings
 */
export function updateSettings(updates) {
  const data = getData();
  if (!data) return false;

  data[SETTINGS_KEY] = { ...data[SETTINGS_KEY], ...updates };
  return saveData(data);
}

/**
 * Get the currently selected font
 */
export function getSelectedFont() {
  const settings = getSettings();
  return getFont(settings.selectedFontId) || getFont('google-inter') || getAllFonts()[0];
}

/**
 * Set the selected font
 */
export function setSelectedFont(id) {
  return updateSettings({ selectedFontId: id });
}

/**
 * Search fonts by name
 */
export function searchFonts(query) {
  if (!query) return getAllFonts();

  const lowerQuery = query.toLowerCase();
  return getAllFonts().filter(font =>
    font.name.toLowerCase().includes(lowerQuery) ||
    font.family.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Export font collection as JSON
 */
export function exportCollection() {
  const data = getData();
  return JSON.stringify(data, null, 2);
}

/**
 * Import font collection from JSON
 */
export function importCollection(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!data[FONTS_KEY] || !Array.isArray(data[FONTS_KEY])) {
      throw new Error('Invalid collection format');
    }
    return saveData(data);
  } catch (e) {
    console.error('Failed to import collection:', e);
    return false;
  }
}

/**
 * Reset to default fonts (loads from catalog)
 * @returns {Promise<boolean>} Success status
 */
export async function resetToDefaults() {
  try {
    const starterFonts = await fontCatalog.getStarterFonts();
    const data = {
      [FONTS_KEY]: starterFonts,
      [SETTINGS_KEY]: DEFAULT_SETTINGS
    };
    return saveData(data);
  } catch (error) {
    console.error('Failed to reset to defaults:', error);
    return false;
  }
}

/**
 * Clear all fonts (empty collection)
 */
export function clearAllFonts() {
  const data = {
    [FONTS_KEY]: [],
    [SETTINGS_KEY]: getSettings()
  };
  return saveData(data);
}

/**
 * Generate a URL-safe ID from font name
 */
function generateFontId(name) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  // Add timestamp to ensure uniqueness
  return `${base}-${Date.now().toString(36)}`;
}

/**
 * Create a font object from Google Fonts
 */
export function createGoogleFont(fontName, weights = [400, 700]) {
  const weightParam = weights.length > 1
    ? `wght@${weights.join(';')}`
    : `wght@${weights[0]}`;

  return {
    id: `google-${fontName.toLowerCase().replace(/\s+/g, '-')}`,
    name: fontName,
    family: fontName,
    source: 'google',
    url: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:${weightParam}&display=swap`,
    weights,
    hasItalic: false,
    category: 'sans-serif'
  };
}

/**
 * Create a font object from Bunny Fonts
 */
export function createBunnyFont(fontName, weights = [400, 700]) {
  const weightParam = weights.length > 1
    ? `wght@${weights.join(';')}`
    : `wght@${weights[0]}`;

  return {
    id: `bunny-${fontName.toLowerCase().replace(/\s+/g, '-')}`,
    name: fontName,
    family: fontName,
    source: 'bunny',
    url: `https://fonts.bunny.net/css2?family=${encodeURIComponent(fontName)}:${weightParam}&display=swap`,
    weights,
    hasItalic: false,
    category: 'sans-serif'
  };
}

/**
 * Create a font object from Fontshare
 */
export function createFontshareFont(fontName, weights = [400, 700]) {
  const slug = fontName.toLowerCase().replace(/\s+/g, '-');
  const weightParam = weights.join(',');

  return {
    id: `fontshare-${slug}`,
    name: fontName,
    family: fontName,
    source: 'fontshare',
    url: `https://api.fontshare.com/v2/css?f[]=${slug}@${weightParam}&display=swap`,
    weights,
    hasItalic: false,
    category: 'sans-serif'
  };
}

/**
 * Create a font object from a CDN URL
 */
export function createCdnFont(fontName, family, url) {
  return {
    id: generateFontId(fontName),
    name: fontName,
    family: family,
    source: 'cdn',
    url,
    weights: [400],
    hasItalic: false,
    category: 'sans-serif'
  };
}

/**
 * Create a font object from local system font
 */
export function createLocalFont(fontData) {
  return {
    id: generateFontId(fontData.family),
    name: fontData.fullName || fontData.family,
    family: fontData.family,
    source: 'local',
    url: null,
    weights: [400],
    hasItalic: true,
    category: 'sans-serif'
  };
}

/**
 * Create a font object from uploaded file
 */
export function createUploadedFont(fontName, family, dataUrl, format) {
  return {
    id: generateFontId(fontName),
    name: fontName,
    family: family,
    source: 'upload',
    url: dataUrl,
    format,
    weights: [400],
    hasItalic: false,
    category: 'sans-serif'
  };
}
