/**
 * themeManager.js - Typography Workbench
 * Manages light/dark mode and color themes based on OKLCH palettes
 */

// Theme definitions with OKLCH-based color palettes
// Inspired by oklch.fyi color palettes
const THEMES = {
  // Current default - warm terracotta
  terracotta: {
    name: 'Terracotta',
    icon: '🧱',
    light: {
      bgApp: 'oklch(0.97 0.01 60)',
      bgSidebar: 'oklch(0.95 0.01 60)',
      bgCanvas: 'oklch(0.96 0.01 60)',
      bgCard: 'oklch(0.99 0.005 60)',
      bgCardHover: 'oklch(0.97 0.01 60)',
      bgElevated: 'oklch(1 0 0)',
      bgInput: 'oklch(0.98 0.005 60)',
      borderSubtle: 'oklch(0.9 0.02 60 / 0.5)',
      borderDefault: 'oklch(0.85 0.02 60 / 0.6)',
      borderStrong: 'oklch(0.8 0.03 60 / 0.7)',
      textPrimary: 'oklch(0.2 0.02 60)',
      textSecondary: 'oklch(0.45 0.02 60)',
      textTertiary: 'oklch(0.6 0.02 60)',
      accentPrimary: 'oklch(0.6 0.18 35)',
      accentPrimaryHover: 'oklch(0.55 0.2 35)',
      accentSage: 'oklch(0.6 0.1 145)',
      accentGold: 'oklch(0.7 0.15 85)',
    },
    dark: {
      bgApp: 'oklch(0.13 0.01 60)',
      bgSidebar: 'oklch(0.15 0.01 60)',
      bgCanvas: 'oklch(0.14 0.01 60)',
      bgCard: 'oklch(0.18 0.01 60)',
      bgCardHover: 'oklch(0.22 0.01 60)',
      bgElevated: 'oklch(0.24 0.01 60)',
      bgInput: 'oklch(0.16 0.01 60)',
      borderSubtle: 'oklch(1 0 0 / 0.04)',
      borderDefault: 'oklch(1 0 0 / 0.08)',
      borderStrong: 'oklch(1 0 0 / 0.12)',
      textPrimary: 'oklch(0.95 0.01 60)',
      textSecondary: 'oklch(0.7 0.02 60)',
      textTertiary: 'oklch(0.5 0.02 60)',
      accentPrimary: 'oklch(0.7 0.18 35)',
      accentPrimaryHover: 'oklch(0.65 0.2 35)',
      accentSage: 'oklch(0.6 0.1 145)',
      accentGold: 'oklch(0.7 0.15 85)',
    }
  },

  // Ocean Breeze - Cool blues
  ocean: {
    name: 'Ocean Breeze',
    icon: '🌊',
    light: {
      bgApp: 'oklch(0.97 0.01 235)',
      bgSidebar: 'oklch(0.95 0.01 235)',
      bgCanvas: 'oklch(0.96 0.01 235)',
      bgCard: 'oklch(0.99 0.005 235)',
      bgCardHover: 'oklch(0.97 0.01 235)',
      bgElevated: 'oklch(1 0 0)',
      bgInput: 'oklch(0.98 0.005 235)',
      borderSubtle: 'oklch(0.85 0.05 235 / 0.3)',
      borderDefault: 'oklch(0.8 0.06 235 / 0.4)',
      borderStrong: 'oklch(0.7 0.08 235 / 0.5)',
      textPrimary: 'oklch(0.2 0.03 235)',
      textSecondary: 'oklch(0.45 0.04 235)',
      textTertiary: 'oklch(0.6 0.03 235)',
      accentPrimary: 'oklch(0.55 0.18 235)',
      accentPrimaryHover: 'oklch(0.5 0.2 230)',
      accentSage: 'oklch(0.6 0.12 180)',
      accentGold: 'oklch(0.7 0.12 200)',
    },
    dark: {
      bgApp: 'oklch(0.13 0.02 235)',
      bgSidebar: 'oklch(0.15 0.02 235)',
      bgCanvas: 'oklch(0.14 0.02 235)',
      bgCard: 'oklch(0.18 0.02 235)',
      bgCardHover: 'oklch(0.22 0.02 235)',
      bgElevated: 'oklch(0.24 0.02 235)',
      bgInput: 'oklch(0.16 0.02 235)',
      borderSubtle: 'oklch(1 0 0 / 0.04)',
      borderDefault: 'oklch(1 0 0 / 0.08)',
      borderStrong: 'oklch(1 0 0 / 0.12)',
      textPrimary: 'oklch(0.95 0.01 235)',
      textSecondary: 'oklch(0.7 0.03 235)',
      textTertiary: 'oklch(0.5 0.02 235)',
      accentPrimary: 'oklch(0.65 0.15 240)',
      accentPrimaryHover: 'oklch(0.6 0.18 235)',
      accentSage: 'oklch(0.55 0.12 180)',
      accentGold: 'oklch(0.65 0.12 200)',
    }
  },

  // Sunset Vibes - Warm oranges and reds
  sunset: {
    name: 'Sunset Vibes',
    icon: '🌅',
    light: {
      bgApp: 'oklch(0.97 0.01 50)',
      bgSidebar: 'oklch(0.95 0.015 50)',
      bgCanvas: 'oklch(0.96 0.01 50)',
      bgCard: 'oklch(0.99 0.005 50)',
      bgCardHover: 'oklch(0.97 0.01 50)',
      bgElevated: 'oklch(1 0 0)',
      bgInput: 'oklch(0.98 0.005 50)',
      borderSubtle: 'oklch(0.85 0.05 40 / 0.3)',
      borderDefault: 'oklch(0.8 0.06 40 / 0.4)',
      borderStrong: 'oklch(0.7 0.08 40 / 0.5)',
      textPrimary: 'oklch(0.25 0.04 30)',
      textSecondary: 'oklch(0.45 0.04 35)',
      textTertiary: 'oklch(0.6 0.03 40)',
      accentPrimary: 'oklch(0.6 0.22 40)',
      accentPrimaryHover: 'oklch(0.55 0.24 35)',
      accentSage: 'oklch(0.65 0.15 55)',
      accentGold: 'oklch(0.75 0.18 70)',
    },
    dark: {
      bgApp: 'oklch(0.13 0.02 30)',
      bgSidebar: 'oklch(0.15 0.02 30)',
      bgCanvas: 'oklch(0.14 0.02 30)',
      bgCard: 'oklch(0.18 0.02 30)',
      bgCardHover: 'oklch(0.22 0.02 30)',
      bgElevated: 'oklch(0.24 0.02 30)',
      bgInput: 'oklch(0.16 0.02 30)',
      borderSubtle: 'oklch(1 0 0 / 0.04)',
      borderDefault: 'oklch(1 0 0 / 0.08)',
      borderStrong: 'oklch(1 0 0 / 0.12)',
      textPrimary: 'oklch(0.95 0.02 50)',
      textSecondary: 'oklch(0.7 0.03 45)',
      textTertiary: 'oklch(0.5 0.02 40)',
      accentPrimary: 'oklch(0.65 0.22 45)',
      accentPrimaryHover: 'oklch(0.6 0.24 40)',
      accentSage: 'oklch(0.6 0.15 55)',
      accentGold: 'oklch(0.7 0.18 70)',
    }
  },

  // Forest - Natural greens
  forest: {
    name: 'Forest',
    icon: '🌲',
    light: {
      bgApp: 'oklch(0.97 0.01 145)',
      bgSidebar: 'oklch(0.95 0.015 140)',
      bgCanvas: 'oklch(0.96 0.01 145)',
      bgCard: 'oklch(0.99 0.005 145)',
      bgCardHover: 'oklch(0.97 0.01 145)',
      bgElevated: 'oklch(1 0 0)',
      bgInput: 'oklch(0.98 0.005 145)',
      borderSubtle: 'oklch(0.85 0.04 135 / 0.3)',
      borderDefault: 'oklch(0.8 0.05 135 / 0.4)',
      borderStrong: 'oklch(0.7 0.06 135 / 0.5)',
      textPrimary: 'oklch(0.25 0.04 145)',
      textSecondary: 'oklch(0.45 0.04 140)',
      textTertiary: 'oklch(0.6 0.03 140)',
      accentPrimary: 'oklch(0.5 0.12 145)',
      accentPrimaryHover: 'oklch(0.45 0.14 140)',
      accentSage: 'oklch(0.6 0.08 135)',
      accentGold: 'oklch(0.65 0.1 100)',
    },
    dark: {
      bgApp: 'oklch(0.13 0.02 145)',
      bgSidebar: 'oklch(0.15 0.02 140)',
      bgCanvas: 'oklch(0.14 0.02 145)',
      bgCard: 'oklch(0.18 0.02 145)',
      bgCardHover: 'oklch(0.22 0.02 145)',
      bgElevated: 'oklch(0.24 0.02 145)',
      bgInput: 'oklch(0.16 0.02 145)',
      borderSubtle: 'oklch(1 0 0 / 0.04)',
      borderDefault: 'oklch(1 0 0 / 0.08)',
      borderStrong: 'oklch(1 0 0 / 0.12)',
      textPrimary: 'oklch(0.92 0.02 145)',
      textSecondary: 'oklch(0.7 0.04 140)',
      textTertiary: 'oklch(0.5 0.03 140)',
      accentPrimary: 'oklch(0.6 0.12 145)',
      accentPrimaryHover: 'oklch(0.55 0.14 140)',
      accentSage: 'oklch(0.55 0.08 135)',
      accentGold: 'oklch(0.6 0.1 100)',
    }
  },

  // Cherry Blossom - Soft pinks
  cherry: {
    name: 'Cherry Blossom',
    icon: '🌸',
    light: {
      bgApp: 'oklch(0.97 0.01 350)',
      bgSidebar: 'oklch(0.95 0.015 355)',
      bgCanvas: 'oklch(0.96 0.01 350)',
      bgCard: 'oklch(0.99 0.005 0)',
      bgCardHover: 'oklch(0.97 0.01 355)',
      bgElevated: 'oklch(1 0 0)',
      bgInput: 'oklch(0.98 0.005 355)',
      borderSubtle: 'oklch(0.88 0.06 355 / 0.3)',
      borderDefault: 'oklch(0.82 0.08 355 / 0.4)',
      borderStrong: 'oklch(0.75 0.1 355 / 0.5)',
      textPrimary: 'oklch(0.25 0.04 350)',
      textSecondary: 'oklch(0.45 0.05 355)',
      textTertiary: 'oklch(0.6 0.04 355)',
      accentPrimary: 'oklch(0.7 0.14 355)',
      accentPrimaryHover: 'oklch(0.65 0.16 350)',
      accentSage: 'oklch(0.75 0.1 10)',
      accentGold: 'oklch(0.8 0.08 20)',
    },
    dark: {
      bgApp: 'oklch(0.13 0.02 350)',
      bgSidebar: 'oklch(0.15 0.02 355)',
      bgCanvas: 'oklch(0.14 0.02 350)',
      bgCard: 'oklch(0.18 0.02 355)',
      bgCardHover: 'oklch(0.22 0.02 355)',
      bgElevated: 'oklch(0.24 0.02 355)',
      bgInput: 'oklch(0.16 0.02 355)',
      borderSubtle: 'oklch(1 0 0 / 0.04)',
      borderDefault: 'oklch(1 0 0 / 0.08)',
      borderStrong: 'oklch(1 0 0 / 0.12)',
      textPrimary: 'oklch(0.95 0.02 355)',
      textSecondary: 'oklch(0.7 0.04 355)',
      textTertiary: 'oklch(0.5 0.03 355)',
      accentPrimary: 'oklch(0.72 0.12 355)',
      accentPrimaryHover: 'oklch(0.68 0.14 350)',
      accentSage: 'oklch(0.7 0.1 10)',
      accentGold: 'oklch(0.75 0.08 20)',
    }
  },

  // Midnight Blue - Deep blues
  midnight: {
    name: 'Midnight',
    icon: '🌙',
    light: {
      bgApp: 'oklch(0.97 0.01 260)',
      bgSidebar: 'oklch(0.95 0.015 265)',
      bgCanvas: 'oklch(0.96 0.01 260)',
      bgCard: 'oklch(0.99 0.005 260)',
      bgCardHover: 'oklch(0.97 0.01 260)',
      bgElevated: 'oklch(1 0 0)',
      bgInput: 'oklch(0.98 0.005 260)',
      borderSubtle: 'oklch(0.85 0.06 265 / 0.3)',
      borderDefault: 'oklch(0.8 0.08 265 / 0.4)',
      borderStrong: 'oklch(0.7 0.1 265 / 0.5)',
      textPrimary: 'oklch(0.2 0.04 260)',
      textSecondary: 'oklch(0.4 0.05 265)',
      textTertiary: 'oklch(0.55 0.04 265)',
      accentPrimary: 'oklch(0.45 0.15 270)',
      accentPrimaryHover: 'oklch(0.4 0.18 265)',
      accentSage: 'oklch(0.5 0.12 255)',
      accentGold: 'oklch(0.55 0.1 280)',
    },
    dark: {
      bgApp: 'oklch(0.12 0.03 260)',
      bgSidebar: 'oklch(0.14 0.03 265)',
      bgCanvas: 'oklch(0.13 0.03 260)',
      bgCard: 'oklch(0.17 0.03 265)',
      bgCardHover: 'oklch(0.21 0.03 265)',
      bgElevated: 'oklch(0.23 0.03 265)',
      bgInput: 'oklch(0.15 0.03 265)',
      borderSubtle: 'oklch(1 0 0 / 0.04)',
      borderDefault: 'oklch(1 0 0 / 0.08)',
      borderStrong: 'oklch(1 0 0 / 0.12)',
      textPrimary: 'oklch(0.92 0.02 265)',
      textSecondary: 'oklch(0.68 0.04 270)',
      textTertiary: 'oklch(0.48 0.03 265)',
      accentPrimary: 'oklch(0.55 0.16 273)',
      accentPrimaryHover: 'oklch(0.5 0.18 270)',
      accentSage: 'oklch(0.5 0.12 255)',
      accentGold: 'oklch(0.55 0.1 280)',
    }
  },

  // Lavender Fields - Soft purples
  lavender: {
    name: 'Lavender',
    icon: '💜',
    light: {
      bgApp: 'oklch(0.97 0.01 295)',
      bgSidebar: 'oklch(0.95 0.015 298)',
      bgCanvas: 'oklch(0.96 0.01 295)',
      bgCard: 'oklch(0.99 0.005 295)',
      bgCardHover: 'oklch(0.97 0.01 298)',
      bgElevated: 'oklch(1 0 0)',
      bgInput: 'oklch(0.98 0.005 298)',
      borderSubtle: 'oklch(0.85 0.06 295 / 0.3)',
      borderDefault: 'oklch(0.8 0.08 298 / 0.4)',
      borderStrong: 'oklch(0.75 0.1 298 / 0.5)',
      textPrimary: 'oklch(0.25 0.04 295)',
      textSecondary: 'oklch(0.45 0.05 298)',
      textTertiary: 'oklch(0.6 0.04 298)',
      accentPrimary: 'oklch(0.65 0.14 298)',
      accentPrimaryHover: 'oklch(0.6 0.16 295)',
      accentSage: 'oklch(0.7 0.12 302)',
      accentGold: 'oklch(0.75 0.1 305)',
    },
    dark: {
      bgApp: 'oklch(0.13 0.02 295)',
      bgSidebar: 'oklch(0.15 0.02 298)',
      bgCanvas: 'oklch(0.14 0.02 295)',
      bgCard: 'oklch(0.18 0.02 298)',
      bgCardHover: 'oklch(0.22 0.02 298)',
      bgElevated: 'oklch(0.24 0.02 298)',
      bgInput: 'oklch(0.16 0.02 298)',
      borderSubtle: 'oklch(1 0 0 / 0.04)',
      borderDefault: 'oklch(1 0 0 / 0.08)',
      borderStrong: 'oklch(1 0 0 / 0.12)',
      textPrimary: 'oklch(0.93 0.02 298)',
      textSecondary: 'oklch(0.7 0.04 298)',
      textTertiary: 'oklch(0.5 0.03 298)',
      accentPrimary: 'oklch(0.68 0.14 300)',
      accentPrimaryHover: 'oklch(0.63 0.16 298)',
      accentSage: 'oklch(0.65 0.12 302)',
      accentGold: 'oklch(0.7 0.1 305)',
    }
  },

  // Monochrome - Pure grayscale
  mono: {
    name: 'Monochrome',
    icon: '⬛',
    light: {
      bgApp: 'oklch(0.97 0 0)',
      bgSidebar: 'oklch(0.95 0 0)',
      bgCanvas: 'oklch(0.96 0 0)',
      bgCard: 'oklch(0.99 0 0)',
      bgCardHover: 'oklch(0.97 0 0)',
      bgElevated: 'oklch(1 0 0)',
      bgInput: 'oklch(0.98 0 0)',
      borderSubtle: 'oklch(0.85 0 0 / 0.4)',
      borderDefault: 'oklch(0.75 0 0 / 0.5)',
      borderStrong: 'oklch(0.65 0 0 / 0.6)',
      textPrimary: 'oklch(0.15 0 0)',
      textSecondary: 'oklch(0.4 0 0)',
      textTertiary: 'oklch(0.55 0 0)',
      accentPrimary: 'oklch(0.35 0 0)',
      accentPrimaryHover: 'oklch(0.25 0 0)',
      accentSage: 'oklch(0.5 0 0)',
      accentGold: 'oklch(0.45 0 0)',
    },
    dark: {
      bgApp: 'oklch(0.1 0 0)',
      bgSidebar: 'oklch(0.12 0 0)',
      bgCanvas: 'oklch(0.11 0 0)',
      bgCard: 'oklch(0.15 0 0)',
      bgCardHover: 'oklch(0.19 0 0)',
      bgElevated: 'oklch(0.21 0 0)',
      bgInput: 'oklch(0.13 0 0)',
      borderSubtle: 'oklch(1 0 0 / 0.04)',
      borderDefault: 'oklch(1 0 0 / 0.08)',
      borderStrong: 'oklch(1 0 0 / 0.12)',
      textPrimary: 'oklch(0.95 0 0)',
      textSecondary: 'oklch(0.7 0 0)',
      textTertiary: 'oklch(0.5 0 0)',
      accentPrimary: 'oklch(0.85 0 0)',
      accentPrimaryHover: 'oklch(0.9 0 0)',
      accentSage: 'oklch(0.6 0 0)',
      accentGold: 'oklch(0.7 0 0)',
    }
  }
};

const STORAGE_KEY_THEME = 'typography-workbench-theme';
const STORAGE_KEY_MODE = 'typography-workbench-mode';

let currentTheme = 'terracotta';
let currentMode = 'dark';

/**
 * Initialize theme manager
 */
function initialize() {
  // Load saved preferences
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
  const savedMode = localStorage.getItem(STORAGE_KEY_MODE);

  if (savedTheme && THEMES[savedTheme]) {
    currentTheme = savedTheme;
  }

  if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
    currentMode = savedMode;
  } else {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      currentMode = 'light';
    }
  }

  applyTheme();

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY_MODE)) {
      currentMode = e.matches ? 'dark' : 'light';
      applyTheme();
    }
  });
}

/**
 * Apply current theme and mode to document
 */
function applyTheme() {
  const theme = THEMES[currentTheme];
  const colors = theme[currentMode];
  const oppositeColors = theme[currentMode === 'dark' ? 'light' : 'dark'];
  const root = document.documentElement;

  // Set data attributes for CSS targeting
  root.setAttribute('data-theme', currentTheme);
  root.setAttribute('data-mode', currentMode);

  // Apply color variables
  root.style.setProperty('--bg-app', colors.bgApp);
  root.style.setProperty('--bg-sidebar', colors.bgSidebar);
  root.style.setProperty('--bg-canvas', colors.bgCanvas);
  root.style.setProperty('--bg-card', colors.bgCard);
  root.style.setProperty('--bg-card-hover', colors.bgCardHover);
  root.style.setProperty('--bg-elevated', colors.bgElevated);
  root.style.setProperty('--bg-input', colors.bgInput);

  root.style.setProperty('--border-subtle', colors.borderSubtle);
  root.style.setProperty('--border-default', colors.borderDefault);
  root.style.setProperty('--border-strong', colors.borderStrong);

  root.style.setProperty('--text-primary', colors.textPrimary);
  root.style.setProperty('--text-secondary', colors.textSecondary);
  root.style.setProperty('--text-tertiary', colors.textTertiary);
  root.style.setProperty('--text-inverse', currentMode === 'dark' ? colors.bgApp : colors.textPrimary);

  root.style.setProperty('--accent-primary', colors.accentPrimary);
  root.style.setProperty('--accent-primary-hover', colors.accentPrimaryHover);
  root.style.setProperty('--accent-primary-subtle', colors.accentPrimary.replace(')', ' / 0.1)').replace('oklch', 'oklch'));
  root.style.setProperty('--accent-primary-glow', colors.accentPrimary.replace(')', ' / 0.2)').replace('oklch', 'oklch'));
  root.style.setProperty('--accent-sage', colors.accentSage);
  root.style.setProperty('--accent-gold', colors.accentGold);

  // Compute accent subtle properly for OKLCH
  const accentSubtle = colors.accentPrimary.includes('/')
    ? colors.accentPrimary
    : colors.accentPrimary.replace(')', ' / 0.1)');
  root.style.setProperty('--accent-primary-subtle', accentSubtle);

  const accentGlow = colors.accentPrimary.includes('/')
    ? colors.accentPrimary
    : colors.accentPrimary.replace(')', ' / 0.2)');
  root.style.setProperty('--accent-primary-glow', accentGlow);

  // Comparison layout colors (always shows both light and dark sides)
  const lightColors = theme.light;
  const darkColors = theme.dark;
  root.style.setProperty('--bg-comparison-light', lightColors.bgCard);
  root.style.setProperty('--bg-comparison-dark', darkColors.bgCard);
  root.style.setProperty('--text-comparison-light-primary', lightColors.textPrimary);
  root.style.setProperty('--text-comparison-light-secondary', lightColors.textSecondary);
  root.style.setProperty('--text-comparison-light-tertiary', lightColors.textTertiary);
  root.style.setProperty('--text-comparison-dark-primary', darkColors.textPrimary);
  root.style.setProperty('--text-comparison-dark-secondary', darkColors.textSecondary);
  root.style.setProperty('--text-comparison-dark-tertiary', darkColors.textTertiary);

  // Shadow colors - use theme-appropriate shadow color
  const shadowColor = currentMode === 'dark'
    ? 'oklch(0 0 0 / 0.5)'
    : 'oklch(0.3 0.02 ' + (colors.bgApp.match(/\d+\)$/)?.[0]?.replace(')', '') || '0') + ' / 0.15)';
  root.style.setProperty('--shadow-color', shadowColor);

  // Modal overlay color - adapts to mode
  const overlayColor = currentMode === 'dark'
    ? 'oklch(0.05 0.01 0 / 0.85)'
    : 'oklch(0.2 0.01 0 / 0.6)';
  root.style.setProperty('--modal-overlay-bg', overlayColor);

  // Update body class for additional CSS hooks
  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(`theme-${currentMode}`);

  // Dispatch event for other components
  window.dispatchEvent(new CustomEvent('themechange', {
    detail: { theme: currentTheme, mode: currentMode }
  }));
}

/**
 * Set theme
 */
function setTheme(themeId) {
  if (THEMES[themeId]) {
    currentTheme = themeId;
    localStorage.setItem(STORAGE_KEY_THEME, themeId);
    applyTheme();
  }
}

/**
 * Set mode (light/dark)
 */
function setMode(mode) {
  if (mode === 'light' || mode === 'dark') {
    currentMode = mode;
    localStorage.setItem(STORAGE_KEY_MODE, mode);
    applyTheme();
  }
}

/**
 * Toggle between light and dark mode
 */
function toggleMode() {
  setMode(currentMode === 'dark' ? 'light' : 'dark');
}

/**
 * Get current theme
 */
function getTheme() {
  return currentTheme;
}

/**
 * Get current mode
 */
function getMode() {
  return currentMode;
}

/**
 * Get all available themes
 */
function getThemes() {
  return Object.entries(THEMES).map(([id, theme]) => ({
    id,
    name: theme.name,
    icon: theme.icon
  }));
}

/**
 * Get theme info
 */
function getThemeInfo(themeId) {
  return THEMES[themeId] || null;
}

export {
  initialize,
  setTheme,
  setMode,
  toggleMode,
  getTheme,
  getMode,
  getThemes,
  getThemeInfo,
  applyTheme
};
