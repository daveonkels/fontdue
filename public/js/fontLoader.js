/**
 * fontLoader.js - Fontdue
 * Handles loading fonts from various sources into the document
 */

// Track which fonts have been loaded
const loadedFonts = new Set();

// Track injected style elements
const styleElements = new Map();

/**
 * Load a font into the document
 * @param {Object} font - Font object from fontManager
 * @returns {Promise<boolean>} - Whether the font loaded successfully
 */
export async function loadFont(font) {
  if (loadedFonts.has(font.id)) {
    return true; // Already loaded
  }

  try {
    switch (font.source) {
      case 'google':
      case 'bunny':
      case 'fontshare':
      case 'cdn':
        await loadStylesheetFont(font);
        break;
      case 'system':
      case 'local':
        await loadSystemFont(font);
        break;
      case 'upload':
        await loadUploadedFont(font);
        break;
      default:
        console.warn('Unknown font source:', font.source);
        return false;
    }

    loadedFonts.add(font.id);
    return true;
  } catch (error) {
    console.error(`Failed to load font ${font.name}:`, error);
    return false;
  }
}

/**
 * Load a font from a stylesheet URL (Google, Fontshare, CDN)
 */
async function loadStylesheetFont(font) {
  if (!font.url) {
    throw new Error('No URL provided for stylesheet font');
  }

  // Check if already injected
  if (styleElements.has(font.id)) {
    return;
  }

  // Create and inject link element
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = font.url;
  link.id = `font-${font.id}`;

  // Wait for the stylesheet to load
  await new Promise((resolve, reject) => {
    link.onload = resolve;
    link.onerror = () => reject(new Error(`Failed to load stylesheet: ${font.url}`));
    document.head.appendChild(link);
  });

  styleElements.set(font.id, link);

  // Wait for the font to be ready
  await document.fonts.ready;
}

/**
 * Load a system/local font (just verify it exists)
 */
async function loadSystemFont(font) {
  // For system fonts, we just need to verify the font is available
  // by trying to load it with the FontFace API
  try {
    const testFont = new FontFace(font.family, `local("${font.family}")`);
    await testFont.load();
    // Font exists on system
  } catch (e) {
    // Font doesn't exist, but we'll still "load" it
    // It will fall back to system fonts
    console.warn(`System font "${font.family}" may not be available`);
  }
}

/**
 * Load an uploaded font from a data URL
 */
async function loadUploadedFont(font) {
  if (!font.url) {
    throw new Error('No data URL provided for uploaded font');
  }

  // Determine format
  const format = font.format || getFormatFromDataUrl(font.url);

  // Create @font-face rule
  const css = `
    @font-face {
      font-family: "${font.family}";
      src: url("${font.url}") format("${format}");
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }
  `;

  // Inject style element
  const style = document.createElement('style');
  style.id = `font-${font.id}`;
  style.textContent = css;
  document.head.appendChild(style);

  styleElements.set(font.id, style);

  // Wait for the font to be ready
  await document.fonts.ready;
}

/**
 * Unload a font (remove from document)
 */
export function unloadFont(fontId) {
  const element = styleElements.get(fontId);
  if (element) {
    element.remove();
    styleElements.delete(fontId);
  }
  loadedFonts.delete(fontId);
}

/**
 * Apply a font to the preview area
 * @param {Object} font - Font object to apply
 */
export function applyPreviewFont(font) {
  const root = document.documentElement;

  // Build the font-family string with fallbacks
  const fallback = getFallbackStack(font.category);
  const fontFamily = `"${font.family}", ${fallback}`;

  root.style.setProperty('--preview-font', fontFamily);

  // If it's a monospace font, also update the mono variable
  if (font.category === 'monospace') {
    root.style.setProperty('--preview-font-mono', fontFamily);
  }
}

/**
 * Get fallback font stack for a category
 */
function getFallbackStack(category) {
  const stacks = {
    'sans-serif': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'serif': 'Georgia, "Times New Roman", Times, serif',
    'monospace': '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
    'display': 'system-ui, sans-serif',
    'handwriting': '"Brush Script MT", cursive'
  };

  return stacks[category] || stacks['sans-serif'];
}

/**
 * Determine font format from data URL
 */
function getFormatFromDataUrl(dataUrl) {
  if (dataUrl.includes('woff2')) return 'woff2';
  if (dataUrl.includes('woff')) return 'woff';
  if (dataUrl.includes('opentype') || dataUrl.includes('otf')) return 'opentype';
  if (dataUrl.includes('truetype') || dataUrl.includes('ttf')) return 'truetype';
  return 'truetype'; // Default
}

/**
 * Get format from file extension
 */
export function getFormatFromFilename(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const formats = {
    'woff2': 'woff2',
    'woff': 'woff',
    'otf': 'opentype',
    'ttf': 'truetype',
    'eot': 'embedded-opentype'
  };
  return formats[ext] || 'truetype';
}

/**
 * Load multiple fonts in parallel
 */
export async function loadFonts(fonts) {
  const results = await Promise.allSettled(fonts.map(loadFont));

  const loaded = results.filter(r => r.status === 'fulfilled' && r.value).length;
  const failed = results.filter(r => r.status === 'rejected' || !r.value).length;

  if (failed > 0) {
    console.warn(`${failed} font(s) failed to load`);
  }

  return { loaded, failed };
}

/**
 * Check if Local Font Access API is supported
 */
export function isLocalFontAccessSupported() {
  return 'queryLocalFonts' in window;
}

/**
 * Get list of local system fonts
 * Requires user permission
 */
export async function getLocalFonts() {
  if (!isLocalFontAccessSupported()) {
    throw new Error('Local Font Access API is not supported in this browser');
  }

  try {
    const fonts = await window.queryLocalFonts();

    // Group by family to avoid duplicates (different styles)
    const familyMap = new Map();

    for (const font of fonts) {
      if (!familyMap.has(font.family)) {
        familyMap.set(font.family, {
          family: font.family,
          fullName: font.fullName,
          postscriptName: font.postscriptName,
          style: font.style
        });
      }
    }

    // Sort alphabetically
    return Array.from(familyMap.values()).sort((a, b) =>
      a.family.localeCompare(b.family)
    );
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      throw new Error('Permission denied to access local fonts');
    }
    throw error;
  }
}

/**
 * Read a font file and convert to base64 data URL
 */
export function readFontFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve({
        dataUrl: reader.result,
        filename: file.name,
        format: getFormatFromFilename(file.name)
      });
    };

    reader.onerror = () => reject(new Error('Failed to read font file'));

    reader.readAsDataURL(file);
  });
}

/**
 * Validate a font file
 */
export function isValidFontFile(file) {
  const validTypes = [
    'font/woff2',
    'font/woff',
    'font/otf',
    'font/ttf',
    'application/font-woff2',
    'application/font-woff',
    'application/vnd.ms-fontobject',
    'application/x-font-ttf',
    'application/x-font-opentype'
  ];

  const validExtensions = ['woff2', 'woff', 'otf', 'ttf', 'eot'];
  const ext = file.name.split('.').pop().toLowerCase();

  return validTypes.includes(file.type) || validExtensions.includes(ext);
}

/**
 * Extract font name from filename
 */
export function extractFontName(filename) {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capitals
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Preload fonts for faster switching
 */
export async function preloadFonts(fonts) {
  // Create hidden elements with each font to trigger loading
  const preloadContainer = document.createElement('div');
  preloadContainer.style.cssText = `
    position: absolute;
    top: -9999px;
    left: -9999px;
    visibility: hidden;
    pointer-events: none;
  `;

  fonts.forEach(font => {
    const el = document.createElement('span');
    el.style.fontFamily = `"${font.family}", sans-serif`;
    el.textContent = 'preload';
    preloadContainer.appendChild(el);
  });

  document.body.appendChild(preloadContainer);

  // Wait for fonts to load
  await document.fonts.ready;

  // Clean up
  preloadContainer.remove();
}
