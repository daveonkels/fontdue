/**
 * ui.js - Fontdue
 * Handles all UI interactions: sidebar, modals, font list, toasts
 */

import * as fontManager from './fontManager.js';
import * as fontLoader from './fontLoader.js';
import * as fontBrowser from './fontBrowser.js';

// DOM element references
let sidebar, fontList, searchInput, addFontModal, currentFontDisplay;
let hamburger, sidebarOverlay;

// State
let localFontsCache = null;
let isMobileMenuOpen = false;

/**
 * Initialize UI components
 */
export function initialize() {
  // Cache DOM references
  sidebar = document.querySelector('.sidebar');
  fontList = document.querySelector('.sidebar__content');
  searchInput = document.querySelector('.search-input');
  addFontModal = document.querySelector('#add-font-modal');
  currentFontDisplay = document.querySelector('.current-font__name');
  hamburger = document.getElementById('hamburger');
  sidebarOverlay = document.getElementById('sidebar-overlay');

  // Set up event listeners
  setupEventListeners();
  setupMobileMenu();

  // Render initial state
  renderFontList();
  updateCurrentFontDisplay();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  // Add font button - opens font browser
  const addFontBtn = document.querySelector('[data-action="add-font"]');
  if (addFontBtn) {
    addFontBtn.addEventListener('click', () => fontBrowser.open());
  }

  // Modal close buttons
  document.querySelectorAll('[data-action="close-modal"]').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Modal overlay click to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  });

  // Font source radio buttons
  document.querySelectorAll('[name="font-source"]').forEach(radio => {
    radio.addEventListener('change', handleFontSourceChange);
  });

  // Add font form submission
  const addFontForm = document.querySelector('#add-font-form');
  if (addFontForm) {
    addFontForm.addEventListener('submit', handleAddFont);
  }

  // File upload
  const uploadZone = document.querySelector('.upload-zone');
  if (uploadZone) {
    setupFileUpload(uploadZone);
  }

  // Local fonts button
  const loadLocalFontsBtn = document.querySelector('[data-action="load-local-fonts"]');
  if (loadLocalFontsBtn) {
    loadLocalFontsBtn.addEventListener('click', loadLocalFonts);
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboard);

  // Settings toggle
  const settingsBtn = document.querySelector('[data-action="toggle-settings"]');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', toggleSettingsDropdown);
  }

  // Export/Import
  document.querySelector('[data-action="export-collection"]')?.addEventListener('click', handleExport);
  document.querySelector('[data-action="import-collection"]')?.addEventListener('click', handleImport);
  document.querySelector('[data-action="reset-collection"]')?.addEventListener('click', handleReset);

  // Listen for font collection changes (from font browser)
  window.addEventListener('fontCollectionChanged', () => {
    renderFontList();
    updateCurrentFontDisplay();
  });

  // Handle window resize - close mobile menu on desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isMobileMenuOpen) {
      closeMobileMenu();
    }
  });
}

/**
 * Set up mobile menu (hamburger) functionality
 */
function setupMobileMenu() {
  if (!hamburger || !sidebar || !sidebarOverlay) return;

  // Hamburger button click
  hamburger.addEventListener('click', toggleMobileMenu);

  // Overlay click to close
  sidebarOverlay.addEventListener('click', closeMobileMenu);

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileMenuOpen) {
      closeMobileMenu();
    }
  });
}

/**
 * Toggle mobile menu open/closed
 */
function toggleMobileMenu() {
  if (isMobileMenuOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

/**
 * Open mobile menu
 */
function openMobileMenu() {
  isMobileMenuOpen = true;
  hamburger?.classList.add('hamburger--active');
  hamburger?.setAttribute('aria-expanded', 'true');
  sidebar?.classList.add('sidebar--open');
  sidebarOverlay?.classList.add('sidebar-overlay--visible');
  document.body.style.overflow = 'hidden';
}

/**
 * Close mobile menu
 */
export function closeMobileMenu() {
  isMobileMenuOpen = false;
  hamburger?.classList.remove('hamburger--active');
  hamburger?.setAttribute('aria-expanded', 'false');
  sidebar?.classList.remove('sidebar--open');
  sidebarOverlay?.classList.remove('sidebar-overlay--visible');
  document.body.style.overflow = '';
}

/**
 * Render the font list in sidebar
 */
export function renderFontList(filter = '') {
  if (!fontList) return;

  const grouped = fontManager.getFontsGrouped();
  const query = filter.toLowerCase();

  // Filter fonts by search query
  const filterFonts = (fonts) => {
    if (!query) return fonts;
    return fonts.filter(f =>
      f.name.toLowerCase().includes(query) ||
      f.family.toLowerCase().includes(query)
    );
  };

  // Build HTML
  let html = '';

  // Favorites section
  const favorites = filterFonts(grouped.favorites);
  if (favorites.length > 0) {
    html += renderFontSection('Favorites', favorites, 'favorites');
  }

  // Web Fonts section (Google + Fontshare + CDN)
  const webFonts = filterFonts([...grouped.google, ...grouped.fontshare, ...grouped.cdn]);
  if (webFonts.length > 0) {
    html += renderFontSection('Web Fonts', webFonts, 'web');
  }

  // System Fonts section
  const systemFonts = filterFonts(grouped.system);
  if (systemFonts.length > 0) {
    html += renderFontSection('System', systemFonts, 'system');
  }

  // Uploaded Fonts section
  const uploadedFonts = filterFonts(grouped.upload);
  if (uploadedFonts.length > 0) {
    html += renderFontSection('Uploaded', uploadedFonts, 'upload');
  }

  // Empty state
  if (!html) {
    html = `
      <div class="empty-state">
        <svg class="empty-state__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 class="empty-state__title">No fonts found</h3>
        <p class="empty-state__description">Try a different search or add new fonts.</p>
      </div>
    `;
  }

  fontList.innerHTML = html;

  // Add click listeners to font items
  fontList.querySelectorAll('.font-item').forEach(item => {
    item.addEventListener('click', () => selectFont(item.dataset.fontId));
  });

  // Add favorite toggle listeners
  fontList.querySelectorAll('.font-item__favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(btn.closest('.font-item').dataset.fontId);
    });
  });

  // Add delete listeners
  fontList.querySelectorAll('.font-item__delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteFont(btn.closest('.font-item').dataset.fontId);
    });
  });
}

/**
 * Render a section of fonts
 */
function renderFontSection(title, fonts, sectionId) {
  const selectedId = fontManager.getSelectedFont()?.id;

  const fontItems = fonts.map(font => `
    <li class="font-item ${font.id === selectedId ? 'font-item--selected' : ''}" data-font-id="${font.id}">
      <button class="font-item__favorite ${font.favorite ? 'font-item__favorite--active' : ''}" title="Toggle favorite">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="${font.favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </button>
      <span class="font-item__name" style="font-family: '${font.family}', sans-serif">${font.name}</span>
      <span class="font-item__source">${getSourceLabel(font.source)}</span>
      <button class="font-item__delete" title="Remove font">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </li>
  `).join('');

  return `
    <section class="font-section" data-section="${sectionId}">
      <header class="font-section__header">
        <span>${title}</span>
        <span class="font-section__count">${fonts.length}</span>
      </header>
      <ul class="font-list">${fontItems}</ul>
    </section>
  `;
}

/**
 * Get readable label for font source
 */
function getSourceLabel(source) {
  const labels = {
    google: 'Google',
    fontshare: 'Fontshare',
    cdn: 'CDN',
    system: 'System',
    local: 'Local',
    upload: 'Upload'
  };
  return labels[source] || source;
}

/**
 * Select a font
 */
export async function selectFont(fontId) {
  const font = fontManager.getFont(fontId);
  if (!font) return;

  // Load the font
  await fontLoader.loadFont(font);

  // Apply to preview
  fontLoader.applyPreviewFont(font);

  // Update storage
  fontManager.setSelectedFont(fontId);

  // Update UI
  renderFontList(searchInput?.value || '');
  updateCurrentFontDisplay();

  // Close mobile menu if open (better UX on mobile)
  if (window.innerWidth <= 768) {
    closeMobileMenu();
  }

  // Dispatch event for other modules
  window.dispatchEvent(new CustomEvent('fontChanged', { detail: font }));
}

/**
 * Toggle favorite status
 */
function toggleFavorite(fontId) {
  fontManager.toggleFavorite(fontId);
  renderFontList(searchInput?.value || '');
}

/**
 * Delete a font
 */
function deleteFont(fontId) {
  const font = fontManager.getFont(fontId);
  if (!font) return;

  // Confirm deletion
  if (!confirm(`Remove "${font.name}" from your collection?`)) return;

  // If this is the selected font, select another
  const selected = fontManager.getSelectedFont();
  if (selected?.id === fontId) {
    const fonts = fontManager.getAllFonts();
    const otherFont = fonts.find(f => f.id !== fontId);
    if (otherFont) {
      selectFont(otherFont.id);
    }
  }

  fontManager.deleteFont(fontId);
  fontLoader.unloadFont(fontId);
  renderFontList(searchInput?.value || '');
  showToast('Font removed', 'success');
}

/**
 * Update the current font display in header
 */
function updateCurrentFontDisplay() {
  if (!currentFontDisplay) return;
  const font = fontManager.getSelectedFont();
  if (font) {
    currentFontDisplay.textContent = font.name;
  }
}

/**
 * Handle search input
 */
function handleSearch(e) {
  renderFontList(e.target.value);
}

/**
 * Open add font modal
 */
export function openAddFontModal() {
  if (!addFontModal) return;
  addFontModal.classList.add('modal-overlay--open');

  // Reset form
  const form = addFontModal.querySelector('form');
  if (form) form.reset();

  // Show first source option's fields
  handleFontSourceChange();

  // Focus first input
  setTimeout(() => {
    addFontModal.querySelector('input:not([type="radio"])')?.focus();
  }, 100);
}

/**
 * Close any open modal
 */
export function closeModal() {
  document.querySelectorAll('.modal-overlay--open').forEach(modal => {
    modal.classList.remove('modal-overlay--open');
  });
}

/**
 * Handle font source change in add modal
 */
function handleFontSourceChange(e) {
  const source = document.querySelector('[name="font-source"]:checked')?.value || 'google';

  // Hide all source-specific fields
  document.querySelectorAll('[data-source-fields]').forEach(el => {
    el.style.display = 'none';
  });

  // Show relevant fields
  const fields = document.querySelector(`[data-source-fields="${source}"]`);
  if (fields) {
    fields.style.display = 'block';
  }
}

/**
 * Handle add font form submission
 */
async function handleAddFont(e) {
  e.preventDefault();

  const source = document.querySelector('[name="font-source"]:checked')?.value;
  let font = null;

  try {
    switch (source) {
      case 'google': {
        const name = document.querySelector('#google-font-name')?.value?.trim();
        if (!name) throw new Error('Please enter a font name');
        font = fontManager.createGoogleFont(name);
        break;
      }
      case 'fontshare': {
        const name = document.querySelector('#fontshare-font-name')?.value?.trim();
        if (!name) throw new Error('Please enter a font name');
        font = fontManager.createFontshareFont(name);
        break;
      }
      case 'cdn': {
        const name = document.querySelector('#cdn-font-name')?.value?.trim();
        const family = document.querySelector('#cdn-font-family')?.value?.trim();
        const url = document.querySelector('#cdn-font-url')?.value?.trim();
        if (!name || !url) throw new Error('Please fill in all fields');
        font = fontManager.createCdnFont(name, family || name, url);
        break;
      }
      case 'local': {
        const selectedFamily = document.querySelector('.local-font-item--selected')?.dataset?.family;
        if (!selectedFamily) throw new Error('Please select a font');
        font = fontManager.createLocalFont({ family: selectedFamily, fullName: selectedFamily });
        break;
      }
      case 'upload': {
        // Handled separately via file upload
        throw new Error('Please upload a font file');
      }
      default:
        throw new Error('Please select a font source');
    }

    if (font) {
      // Try to load the font first
      const loaded = await fontLoader.loadFont(font);
      if (!loaded) {
        throw new Error('Failed to load font. Please check the name or URL.');
      }

      // Add to collection
      fontManager.addFont(font);

      // Select it
      await selectFont(font.id);

      closeModal();
      showToast(`Added "${font.name}"`, 'success');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

/**
 * Set up file upload zone
 */
function setupFileUpload(zone) {
  const input = zone.querySelector('.upload-zone__input');

  // Click to open file dialog
  zone.addEventListener('click', () => input?.click());

  // Drag and drop
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('upload-zone--dragover');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('upload-zone--dragover');
  });

  zone.addEventListener('drop', async (e) => {
    e.preventDefault();
    zone.classList.remove('upload-zone--dragover');

    const files = Array.from(e.dataTransfer.files);
    await handleFileUpload(files);
  });

  // File input change
  input?.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    await handleFileUpload(files);
    e.target.value = ''; // Reset for re-upload
  });
}

/**
 * Handle uploaded font files
 */
async function handleFileUpload(files) {
  for (const file of files) {
    if (!fontLoader.isValidFontFile(file)) {
      showToast(`Invalid font file: ${file.name}`, 'error');
      continue;
    }

    try {
      const { dataUrl, filename, format } = await fontLoader.readFontFile(file);
      const fontName = fontLoader.extractFontName(filename);

      const font = fontManager.createUploadedFont(fontName, fontName, dataUrl, format);

      // Load and add
      await fontLoader.loadFont(font);
      fontManager.addFont(font);
      await selectFont(font.id);

      closeModal();
      showToast(`Added "${fontName}"`, 'success');
    } catch (error) {
      showToast(`Failed to upload ${file.name}`, 'error');
    }
  }
}

/**
 * Load local system fonts (requires permission)
 */
async function loadLocalFonts() {
  const listContainer = document.querySelector('.local-fonts-list');
  if (!listContainer) return;

  if (!fontLoader.isLocalFontAccessSupported()) {
    listContainer.innerHTML = `
      <div class="empty-state" style="padding: 2rem;">
        <p class="empty-state__description">Local Font Access is not supported in this browser. Try Chrome or Edge.</p>
      </div>
    `;
    return;
  }

  try {
    listContainer.innerHTML = '<div class="loading-spinner" style="margin: 2rem auto;"></div>';

    const fonts = await fontLoader.getLocalFonts();
    localFontsCache = fonts;

    if (fonts.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state" style="padding: 2rem;">
          <p class="empty-state__description">No local fonts found.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = fonts.map(font => `
      <div class="local-font-item" data-family="${font.family}">
        <span class="local-font-item__name" style="font-family: '${font.family}', sans-serif">${font.family}</span>
      </div>
    `).join('');

    // Add click listeners
    listContainer.querySelectorAll('.local-font-item').forEach(item => {
      item.addEventListener('click', () => {
        listContainer.querySelectorAll('.local-font-item').forEach(i => i.classList.remove('local-font-item--selected'));
        item.classList.add('local-font-item--selected');
      });
    });
  } catch (error) {
    listContainer.innerHTML = `
      <div class="empty-state" style="padding: 2rem;">
        <p class="empty-state__description">${error.message}</p>
      </div>
    `;
  }
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboard(e) {
  // Escape to close modal
  if (e.key === 'Escape') {
    closeModal();
    return;
  }

  // Don't handle shortcuts when typing
  if (e.target.matches('input, textarea')) return;

  // Cmd/Ctrl + K to focus search
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    searchInput?.focus();
    return;
  }

  // Arrow keys to cycle fonts
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    cycleFonts(e.key === 'ArrowUp' ? -1 : 1);
    return;
  }
}

/**
 * Cycle through fonts with arrow keys
 */
function cycleFonts(direction) {
  const fonts = fontManager.getAllFonts();
  if (fonts.length === 0) return;

  const current = fontManager.getSelectedFont();
  const currentIndex = fonts.findIndex(f => f.id === current?.id);
  let newIndex = currentIndex + direction;

  if (newIndex < 0) newIndex = fonts.length - 1;
  if (newIndex >= fonts.length) newIndex = 0;

  selectFont(fonts[newIndex].id);
}

/**
 * Toggle settings dropdown
 */
function toggleSettingsDropdown() {
  const dropdown = document.querySelector('.settings-dropdown');
  dropdown?.classList.toggle('settings-dropdown--open');

  // Close when clicking outside
  const closeHandler = (e) => {
    if (!e.target.closest('.settings-dropdown') && !e.target.closest('[data-action="toggle-settings"]')) {
      dropdown?.classList.remove('settings-dropdown--open');
      document.removeEventListener('click', closeHandler);
    }
  };

  if (dropdown?.classList.contains('settings-dropdown--open')) {
    setTimeout(() => document.addEventListener('click', closeHandler), 0);
  }
}

/**
 * Export collection
 */
function handleExport() {
  const data = fontManager.exportCollection();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'typography-workbench-collection.json';
  a.click();

  URL.revokeObjectURL(url);
  showToast('Collection exported', 'success');
}

/**
 * Import collection
 */
function handleImport() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      if (fontManager.importCollection(text)) {
        renderFontList();
        showToast('Collection imported', 'success');
      } else {
        throw new Error('Invalid collection file');
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  input.click();
}

/**
 * Reset to defaults
 */
function handleReset() {
  if (!confirm('Reset to default fonts? This will remove all custom fonts.')) return;

  fontManager.resetToDefaults();
  renderFontList();
  selectFont(fontManager.getSelectedFont()?.id);
  showToast('Reset to defaults', 'success');
}

/**
 * Show a toast notification
 */
export function showToast(message, type = 'info') {
  const container = document.querySelector('.toast-container') || createToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;

  const icons = {
    success: '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>',
    error: '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>',
    info: '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>'
  };

  toast.innerHTML = `
    <svg class="toast__icon" viewBox="0 0 20 20" fill="currentColor">${icons[type] || icons.info}</svg>
    <span class="toast__message">${message}</span>
    <button class="toast__close">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>
  `;

  toast.querySelector('.toast__close').addEventListener('click', () => toast.remove());

  container.appendChild(toast);

  // Auto-remove after 4 seconds
  setTimeout(() => toast.remove(), 4000);
}

/**
 * Create toast container if it doesn't exist
 */
function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}
