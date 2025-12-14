/**
 * fontCatalog.js - Fontdue
 * Catalog management for font repositories (Google Fonts, Bunny Fonts, Fontshare)
 */

/**
 * Cached catalogs in memory
 */
const catalogCache = {
  google: null,
  bunny: null,
  fontshare: null,
  fullGoogle: null,
  fullBunny: null
};

/**
 * Load a curated catalog shipped with the app
 * @param {string} source - 'google', 'bunny', or 'fontshare'
 * @returns {Promise<Object>} Catalog data
 */
export async function loadCuratedCatalog(source) {
  if (catalogCache[source]) {
    return catalogCache[source];
  }

  const path = `data/catalogs/${source}-curated.json`;

  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${source} catalog`);
    }
    const catalog = await response.json();
    catalogCache[source] = catalog;
    return catalog;
  } catch (error) {
    console.error(`Error loading ${source} catalog:`, error);
    return { fonts: [], source, sourceName: source };
  }
}

/**
 * Load starter fonts configuration
 * @returns {Promise<Object>} Starter fonts config
 */
export async function loadStarterConfig() {
  try {
    const response = await fetch('data/catalogs/starter-fonts.json');
    if (!response.ok) {
      throw new Error('Failed to load starter fonts config');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading starter fonts:', error);
    return { fonts: [] };
  }
}

/**
 * Fetch full catalog from remote API
 * @param {string} source - 'google' or 'bunny'
 * @param {string} [apiKey] - Required for Google Fonts API
 * @returns {Promise<Object>} Full catalog data
 */
export async function fetchFullCatalog(source, apiKey) {
  const cacheKey = `full${source.charAt(0).toUpperCase() + source.slice(1)}`;

  if (catalogCache[cacheKey]) {
    return catalogCache[cacheKey];
  }

  if (source === 'google') {
    return fetchGoogleFullCatalog(apiKey);
  } else if (source === 'bunny') {
    return fetchBunnyFullCatalog();
  }

  throw new Error(`Full catalog not available for source: ${source}`);
}

/**
 * Fetch full Google Fonts catalog
 * @param {string} apiKey - Google API key
 * @returns {Promise<Object>} Catalog data
 */
async function fetchGoogleFullCatalog(apiKey) {
  if (!apiKey) {
    throw new Error('Google Fonts API key required. Get one at https://console.cloud.google.com/apis/credentials');
  }

  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Invalid API key. Check your Google Cloud Console settings.');
      }
      throw new Error('Failed to fetch Google Fonts catalog');
    }

    const data = await response.json();
    const catalog = transformGoogleApiResponse(data);
    catalogCache.fullGoogle = catalog;
    return catalog;
  } catch (error) {
    console.error('Error fetching Google Fonts:', error);
    throw error;
  }
}

/**
 * Transform Google Fonts API response to catalog format
 * @param {Object} data - API response
 * @returns {Object} Catalog data
 */
function transformGoogleApiResponse(data) {
  const fonts = data.items.map((item, index) => {
    // Parse variants to get weights and italic info
    const weights = [];
    let hasItalic = false;

    item.variants.forEach(variant => {
      if (variant === 'regular') {
        weights.push(400);
      } else if (variant === 'italic') {
        hasItalic = true;
      } else if (variant.endsWith('italic')) {
        hasItalic = true;
        const weight = parseInt(variant.replace('italic', ''), 10);
        if (!isNaN(weight) && !weights.includes(weight)) {
          weights.push(weight);
        }
      } else {
        const weight = parseInt(variant, 10);
        if (!isNaN(weight)) {
          weights.push(weight);
        }
      }
    });

    // Ensure we have at least 400 weight
    if (weights.length === 0) {
      weights.push(400);
    }
    weights.sort((a, b) => a - b);

    return {
      id: item.family.toLowerCase().replace(/\s+/g, '-'),
      name: item.family,
      family: item.family,
      category: item.category || 'sans-serif',
      weights: [...new Set(weights)],
      hasItalic,
      popularity: index + 1
    };
  });

  return {
    version: '1.0.0',
    source: 'google',
    sourceName: 'Google Fonts',
    sourceUrl: 'https://fonts.google.com',
    fonts
  };
}

/**
 * Fetch full Bunny Fonts catalog (no API key required)
 * @returns {Promise<Object>} Catalog data
 */
async function fetchBunnyFullCatalog() {
  try {
    const response = await fetch('https://fonts.bunny.net/list');
    if (!response.ok) {
      throw new Error('Failed to fetch Bunny Fonts catalog');
    }

    const data = await response.json();
    const catalog = transformBunnyApiResponse(data);
    catalogCache.fullBunny = catalog;
    return catalog;
  } catch (error) {
    console.error('Error fetching Bunny Fonts:', error);
    throw error;
  }
}

/**
 * Transform Bunny Fonts API response to catalog format
 * @param {Object} data - API response (object keyed by font ID)
 * @returns {Object} Catalog data
 */
function transformBunnyApiResponse(data) {
  const fonts = Object.entries(data).map(([id, item], index) => {
    // Parse weights from styles object
    const weights = [];
    let hasItalic = false;

    if (item.styles) {
      Object.keys(item.styles).forEach(style => {
        if (style.includes('italic')) {
          hasItalic = true;
        }
        const weight = parseInt(style.replace('italic', ''), 10);
        if (!isNaN(weight) && !weights.includes(weight)) {
          weights.push(weight);
        }
      });
    }

    if (weights.length === 0) {
      weights.push(400);
    }
    weights.sort((a, b) => a - b);

    return {
      id,
      name: item.familyName,
      family: item.familyName,
      category: item.category || 'sans-serif',
      weights: [...new Set(weights)],
      hasItalic,
      popularity: index + 1
    };
  });

  // Sort by family name
  fonts.sort((a, b) => a.name.localeCompare(b.name));

  return {
    version: '1.0.0',
    source: 'bunny',
    sourceName: 'Bunny Fonts',
    sourceUrl: 'https://fonts.bunny.net',
    fonts
  };
}

/**
 * Build stylesheet URL for a font
 * @param {Object} font - Font from catalog
 * @param {string} source - 'google', 'bunny', or 'fontshare'
 * @returns {string} CSS stylesheet URL
 */
export function buildStylesheetUrl(font, source) {
  const weightStr = font.weights.join(';');
  const encodedFamily = encodeURIComponent(font.family);

  switch (source) {
    case 'google':
      return `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@${weightStr}&display=swap`;

    case 'bunny':
      return `https://fonts.bunny.net/css2?family=${encodedFamily}:wght@${weightStr}&display=swap`;

    case 'fontshare': {
      const slug = font.family.toLowerCase().replace(/\s+/g, '-');
      return `https://api.fontshare.com/v2/css?f[]=${slug}@${font.weights.join(',')}&display=swap`;
    }

    default:
      throw new Error(`Unknown source: ${source}`);
  }
}

/**
 * Search/filter fonts in a catalog
 * @param {Object} catalog - Catalog data
 * @param {string} query - Search query
 * @param {Object} [filters] - Optional filters
 * @param {string} [filters.category] - Filter by category
 * @returns {Array} Filtered fonts
 */
export function searchCatalog(catalog, query = '', filters = {}) {
  let fonts = catalog.fonts || [];

  // Filter by search query
  if (query) {
    const lowerQuery = query.toLowerCase();
    fonts = fonts.filter(font =>
      font.name.toLowerCase().includes(lowerQuery) ||
      font.family.toLowerCase().includes(lowerQuery)
    );
  }

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    fonts = fonts.filter(font => font.category === filters.category);
  }

  return fonts;
}

/**
 * Get starter fonts for new users
 * @returns {Promise<Array>} Array of app-ready font objects
 */
export async function getStarterFonts() {
  const starterConfig = await loadStarterConfig();
  const fonts = [];

  // Load all required catalogs
  const catalogs = {
    google: await loadCuratedCatalog('google'),
    bunny: await loadCuratedCatalog('bunny'),
    fontshare: await loadCuratedCatalog('fontshare')
  };

  for (const starterFont of starterConfig.fonts) {
    const catalog = catalogs[starterFont.source];
    if (!catalog) continue;

    const catalogFont = catalog.fonts.find(f => f.id === starterFont.id);
    if (!catalogFont) {
      console.warn(`Starter font not found: ${starterFont.id} from ${starterFont.source}`);
      continue;
    }

    const appFont = catalogFontToAppFont(catalogFont, starterFont.source);
    appFont.favorite = starterFont.favorite || false;
    fonts.push(appFont);
  }

  return fonts;
}

/**
 * Transform a catalog font to app font format
 * @param {Object} catalogFont - Font from catalog
 * @param {string} source - 'google', 'bunny', or 'fontshare'
 * @returns {Object} App-ready font object
 */
export function catalogFontToAppFont(catalogFont, source) {
  return {
    id: `${source}-${catalogFont.id}`,
    name: catalogFont.name,
    family: catalogFont.family,
    source,
    url: buildStylesheetUrl(catalogFont, source),
    weights: catalogFont.weights,
    hasItalic: catalogFont.hasItalic,
    category: catalogFont.category,
    favorite: false,
    dateAdded: new Date().toISOString()
  };
}

/**
 * Check if a font ID exists in any loaded catalog
 * @param {string} fontId - Font ID (without source prefix)
 * @param {string} source - Source to check
 * @returns {Object|null} Catalog font or null
 */
export function findFontInCatalog(fontId, source) {
  const catalog = catalogCache[source];
  if (!catalog) return null;

  return catalog.fonts.find(f => f.id === fontId) || null;
}

/**
 * Get cached catalog
 * @param {string} source - 'google', 'bunny', or 'fontshare'
 * @returns {Object|null} Cached catalog or null
 */
export function getCachedCatalog(source) {
  return catalogCache[source] || null;
}

/**
 * Check if full catalog is loaded
 * @param {string} source - 'google' or 'bunny'
 * @returns {boolean}
 */
export function isFullCatalogLoaded(source) {
  // Fontshare doesn't have a full catalog API
  if (source === 'fontshare') {
    return false;
  }
  const cacheKey = `full${source.charAt(0).toUpperCase() + source.slice(1)}`;
  return catalogCache[cacheKey] != null;
}

/**
 * Get available categories from a catalog
 * @param {Object} catalog - Catalog data
 * @returns {Array<string>} Unique categories
 */
export function getCatalogCategories(catalog) {
  if (!catalog || !catalog.fonts) return [];

  const categories = new Set(catalog.fonts.map(f => f.category));
  return Array.from(categories).sort();
}
