/**
 * main.js - Fontdue
 * Main entry point - orchestrates initialization and app state
 */

import * as fontManager from './fontManager.js';
import * as fontLoader from './fontLoader.js';
import * as layoutEngine from './layoutEngine.js';
import * as ui from './ui.js';
import * as themeManager from './themeManager.js';
import * as fontBrowser from './fontBrowser.js';

/**
 * Minimum splash screen display time (ms)
 */
const MIN_SPLASH_TIME = 2400;

/**
 * Initialize the application
 */
async function init() {
  const splashStart = Date.now();
  console.log('Fontdue initializing...');

  // Initialize theme manager first for immediate visual setup
  themeManager.initialize();
  initializeThemeUI();

  // Initialize font manager (loads starter fonts if first run)
  await fontManager.initialize();

  // Render layouts to canvas
  const canvas = document.querySelector('.main');
  if (canvas) {
    layoutEngine.renderAllLayouts(canvas);
    console.log(`Rendered ${layoutEngine.getLayoutCount()} layouts`);
  }

  // Load all fonts
  const fonts = fontManager.getAllFonts();
  console.log(`Loading ${fonts.length} fonts...`);

  const { loaded, failed } = await fontLoader.loadFonts(fonts);
  console.log(`Fonts loaded: ${loaded}, failed: ${failed}`);

  // Apply the selected font
  const selectedFont = fontManager.getSelectedFont();
  if (selectedFont) {
    fontLoader.applyPreviewFont(selectedFont);
    console.log(`Applied font: ${selectedFont.name}`);
  }

  // Initialize UI and font browser
  ui.initialize();
  fontBrowser.initialize();

  // Update layout count in header
  const layoutCount = document.querySelector('[data-layout-count]');
  if (layoutCount) {
    layoutCount.textContent = layoutEngine.getLayoutCount();
  }

  console.log('Fontdue ready!');

  // Hide splash screen after minimum display time
  const elapsed = Date.now() - splashStart;
  const remainingTime = Math.max(0, MIN_SPLASH_TIME - elapsed);

  setTimeout(() => {
    hideSplash();
  }, remainingTime);
}

/**
 * Hide the splash screen with animation
 */
function hideSplash() {
  const splash = document.getElementById('splash');
  if (splash) {
    splash.classList.add('splash--hidden');
    // Remove from DOM after animation completes
    setTimeout(() => {
      splash.remove();
    }, 600);
  }
}

/**
 * Initialize theme UI controls
 */
function initializeThemeUI() {
  const themePicker = document.getElementById('theme-picker');
  const themeList = document.querySelector('[data-theme-list]');
  const themeIcon = document.querySelector('[data-theme-icon]');
  const themeName = document.querySelector('[data-theme-name]');
  const modeToggle = document.querySelector('[data-action="toggle-mode"]');
  const themePickerTrigger = document.querySelector('[data-action="toggle-theme-picker"]');

  // Populate theme list
  if (themeList) {
    const themes = themeManager.getThemes();
    themeList.innerHTML = themes.map(theme => `
      <div class="theme-option${theme.id === themeManager.getTheme() ? ' theme-option--active' : ''}"
           data-theme="${theme.id}">
        <div class="theme-option__swatch">${theme.icon}</div>
        <span class="theme-option__name">${theme.name}</span>
      </div>
    `).join('');

    // Theme selection handlers
    themeList.addEventListener('click', (e) => {
      const option = e.target.closest('.theme-option');
      if (option) {
        const newTheme = option.dataset.theme;
        themeManager.setTheme(newTheme);
        updateThemeUI();
        themePicker?.classList.remove('theme-picker--open');
      }
    });
  }

  // Theme picker toggle
  if (themePickerTrigger && themePicker) {
    themePickerTrigger.addEventListener('click', () => {
      themePicker.classList.toggle('theme-picker--open');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!themePicker.contains(e.target)) {
        themePicker.classList.remove('theme-picker--open');
      }
    });
  }

  // Mode toggle
  if (modeToggle) {
    modeToggle.addEventListener('click', () => {
      themeManager.toggleMode();
    });
  }

  // Update UI on theme change
  window.addEventListener('themechange', updateThemeUI);

  // Initial UI update
  updateThemeUI();

  function updateThemeUI() {
    const currentTheme = themeManager.getTheme();
    const themes = themeManager.getThemes();
    const themeInfo = themes.find(t => t.id === currentTheme);

    if (themeIcon && themeInfo) {
      themeIcon.textContent = themeInfo.icon;
    }
    if (themeName && themeInfo) {
      themeName.textContent = themeInfo.name;
    }

    // Update active state in list
    if (themeList) {
      themeList.querySelectorAll('.theme-option').forEach(option => {
        option.classList.toggle('theme-option--active', option.dataset.theme === currentTheme);
      });
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential external use
export { fontManager, fontLoader, layoutEngine, ui, themeManager, fontBrowser };
