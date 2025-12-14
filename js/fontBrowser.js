/**
 * fontBrowser.js - Fontdue
 * Font browser modal UI for discovering and adding fonts from repositories
 */

import * as fontCatalog from './fontCatalog.js';
import * as fontManager from './fontManager.js';
import * as fontLoader from './fontLoader.js';

/**
 * Browser state
 */
const state = {
  activeTab: 'google',
  searchQuery: '',
  categoryFilter: 'all',
  currentCatalog: null,
  isLoading: false,
  loadingFullCatalog: false,
  previewedFonts: new Set()
};

/**
 * DOM element references
 */
let modal = null;
let fontGrid = null;
let searchInput = null;
let categorySelect = null;
let statusEl = null;
let loadFullBtn = null;

/**
 * Debounce utility
 */
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Initialize the font browser
 */
export function initialize() {
  modal = document.getElementById('font-browser-modal');
  if (!modal) {
    console.warn('Font browser modal not found');
    return;
  }

  fontGrid = modal.querySelector('#font-grid');
  searchInput = modal.querySelector('#browser-search');
  categorySelect = modal.querySelector('#browser-category');
  statusEl = modal.querySelector('#browser-status');
  loadFullBtn = modal.querySelector('#load-full-catalog');

  setupEventListeners();
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  // Tab switching
  const tabs = modal.querySelectorAll('.browser-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const source = tab.dataset.source;
      if (source === 'manual') {
        close();
        openManualAddModal();
      } else {
        switchTab(source);
      }
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      state.searchQuery = searchInput.value;
      renderFontGrid();
    }, 200));
  }

  // Category filter
  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      state.categoryFilter = categorySelect.value;
      renderFontGrid();
    });
  }

  // Load full catalog button
  if (loadFullBtn) {
    loadFullBtn.addEventListener('click', handleLoadFullCatalog);
  }

  // Close button
  const closeBtn = modal.querySelector('[data-action="close-modal"]');
  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      close();
    }
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal-overlay--open')) {
      close();
    }
  });

  // Font grid click delegation
  if (fontGrid) {
    fontGrid.addEventListener('click', handleFontGridClick);
  }
}

/**
 * Open the font browser modal
 */
export async function open() {
  if (!modal) {
    initialize();
  }

  modal.classList.add('modal-overlay--open');
  document.body.style.overflow = 'hidden';

  // Reset state
  state.searchQuery = '';
  state.categoryFilter = 'all';
  if (searchInput) searchInput.value = '';
  if (categorySelect) categorySelect.value = 'all';

  // Load initial catalog
  await loadCatalog(state.activeTab);
}

/**
 * Close the font browser modal
 */
export function close() {
  if (modal) {
    modal.classList.remove('modal-overlay--open');
    document.body.style.overflow = '';
  }
}

/**
 * Switch to a different source tab
 * @param {string} source - 'google', 'bunny', or 'fontshare'
 */
async function switchTab(source) {
  if (source === state.activeTab) return;

  state.activeTab = source;
  state.searchQuery = '';
  state.categoryFilter = 'all';

  if (searchInput) searchInput.value = '';
  if (categorySelect) categorySelect.value = 'all';

  // Update tab UI
  const tabs = modal.querySelectorAll('.browser-tab');
  tabs.forEach(tab => {
    tab.classList.toggle('browser-tab--active', tab.dataset.source === source);
  });

  // Update load full catalog button visibility
  if (loadFullBtn) {
    loadFullBtn.style.display = source === 'fontshare' ? 'none' : '';
    updateLoadFullButton();
  }

  await loadCatalog(source);
}

/**
 * Load catalog for a source
 * @param {string} source - 'google', 'bunny', or 'fontshare'
 */
async function loadCatalog(source) {
  state.isLoading = true;
  showLoadingState();

  try {
    // Check if full catalog is loaded
    if (fontCatalog.isFullCatalogLoaded(source)) {
      state.currentCatalog = fontCatalog.getCachedCatalog(`full${source.charAt(0).toUpperCase() + source.slice(1)}`);
    } else {
      state.currentCatalog = await fontCatalog.loadCuratedCatalog(source);
    }

    renderFontGrid();
    updateLoadFullButton();
  } catch (error) {
    console.error('Error loading catalog:', error);
    showError('Failed to load font catalog');
  } finally {
    state.isLoading = false;
  }
}

/**
 * Handle load full catalog button click
 */
async function handleLoadFullCatalog() {
  const source = state.activeTab;

  if (source === 'fontshare') {
    showToast('Fontshare does not have a full catalog API', 'info');
    return;
  }

  // For Google, prompt for API key
  if (source === 'google') {
    const savedKey = fontManager.getSetting('googleApiKey');
    let apiKey = savedKey;

    if (!apiKey) {
      apiKey = prompt(
        'Enter your Google Fonts API key:\n\n' +
        'Get a free key at:\nhttps://console.cloud.google.com/apis/credentials\n\n' +
        '(This is optional - curated fonts work without a key)'
      );

      if (!apiKey) return;

      // Save the key
      fontManager.setSetting('googleApiKey', apiKey);
    }

    state.loadingFullCatalog = true;
    loadFullBtn.disabled = true;
    loadFullBtn.textContent = 'Loading...';

    try {
      state.currentCatalog = await fontCatalog.fetchFullCatalog('google', apiKey);
      renderFontGrid();
      updateLoadFullButton();
      showToast(`Loaded ${state.currentCatalog.fonts.length} fonts from Google Fonts`, 'success');
    } catch (error) {
      console.error('Error loading full Google catalog:', error);
      showToast(error.message || 'Failed to load full catalog', 'error');
      // Clear bad API key
      if (error.message.includes('Invalid API key')) {
        fontManager.setSetting('googleApiKey', null);
      }
    } finally {
      state.loadingFullCatalog = false;
      loadFullBtn.disabled = false;
      updateLoadFullButton();
    }
  } else if (source === 'bunny') {
    state.loadingFullCatalog = true;
    loadFullBtn.disabled = true;
    loadFullBtn.textContent = 'Loading...';

    try {
      state.currentCatalog = await fontCatalog.fetchFullCatalog('bunny');
      renderFontGrid();
      updateLoadFullButton();
      showToast(`Loaded ${state.currentCatalog.fonts.length} fonts from Bunny Fonts`, 'success');
    } catch (error) {
      console.error('Error loading full Bunny catalog:', error);
      showToast('Failed to load full catalog', 'error');
    } finally {
      state.loadingFullCatalog = false;
      loadFullBtn.disabled = false;
      updateLoadFullButton();
    }
  }
}

/**
 * Update load full catalog button state
 */
function updateLoadFullButton() {
  if (!loadFullBtn) return;

  const source = state.activeTab;
  const isFullLoaded = fontCatalog.isFullCatalogLoaded(source);

  if (isFullLoaded) {
    loadFullBtn.textContent = 'Full Catalog Loaded';
    loadFullBtn.disabled = true;
  } else {
    loadFullBtn.textContent = source === 'google' ? 'Load Full Catalog (API Key)' : 'Load Full Catalog';
    loadFullBtn.disabled = false;
  }
}

/**
 * Render the font grid
 */
function renderFontGrid() {
  if (!fontGrid || !state.currentCatalog) return;

  const fonts = fontCatalog.searchCatalog(
    state.currentCatalog,
    state.searchQuery,
    { category: state.categoryFilter }
  );

  if (fonts.length === 0) {
    fontGrid.innerHTML = `
      <div class="font-grid__empty">
        <p>No fonts found</p>
        ${state.searchQuery ? '<p class="text-sm">Try a different search term</p>' : ''}
      </div>
    `;
    updateStatus(0, state.currentCatalog.fonts.length);
    return;
  }

  // Limit display for performance (virtual scroll would be better for full catalogs)
  const displayFonts = fonts.slice(0, 100);

  fontGrid.innerHTML = displayFonts.map(font => createFontCard(font, state.activeTab)).join('');

  updateStatus(fonts.length, state.currentCatalog.fonts.length);

  // Lazy load font previews on scroll
  observeFontPreviews();
}

/**
 * Create font card HTML
 * @param {Object} font - Catalog font
 * @param {string} source - Font source
 * @returns {string} HTML string
 */
function createFontCard(font, source) {
  const fontId = `${source}-${font.id}`;
  const isAdded = fontManager.hasFontInCollection(fontId);
  const weightCount = font.weights.length;
  const weightLabel = weightCount === 1 ? '1 weight' : `${weightCount} weights`;

  return `
    <div class="font-card ${isAdded ? 'font-card--added' : ''}"
         data-font-id="${font.id}"
         data-source="${source}">
      <div class="font-card__preview" data-family="${font.family}">
        Aa
      </div>
      <div class="font-card__info">
        <span class="font-card__name" title="${font.name}">${font.name}</span>
        <span class="font-card__meta">${weightLabel}</span>
      </div>
      <button class="font-card__action ${isAdded ? 'font-card__action--remove' : 'font-card__action--add'}"
              title="${isAdded ? 'Remove from collection' : 'Add to collection'}"
              data-action="${isAdded ? 'remove' : 'add'}">
        ${isAdded ? getCheckIcon() : getPlusIcon()}
      </button>
    </div>
  `;
}

/**
 * Handle clicks on font grid
 * @param {Event} e - Click event
 */
async function handleFontGridClick(e) {
  const actionBtn = e.target.closest('.font-card__action');
  const card = e.target.closest('.font-card');

  if (!card) return;

  const fontId = card.dataset.fontId;
  const source = card.dataset.source;

  if (actionBtn) {
    const action = actionBtn.dataset.action;

    if (action === 'add') {
      await addFontToCollection(fontId, source, card);
    } else if (action === 'remove') {
      removeFontFromCollection(fontId, source, card);
    }
  }
}

/**
 * Add a font to the user's collection
 * @param {string} fontId - Font ID in catalog
 * @param {string} source - Font source
 * @param {Element} card - Card element
 */
async function addFontToCollection(fontId, source, card) {
  const catalogFont = state.currentCatalog.fonts.find(f => f.id === fontId);
  if (!catalogFont) return;

  const appFont = fontCatalog.catalogFontToAppFont(catalogFont, source);

  try {
    fontManager.addFont(appFont);
    await fontLoader.loadFont(appFont);

    // Update card UI
    card.classList.add('font-card--added');
    const btn = card.querySelector('.font-card__action');
    btn.classList.remove('font-card__action--add');
    btn.classList.add('font-card__action--remove');
    btn.dataset.action = 'remove';
    btn.title = 'Remove from collection';
    btn.innerHTML = getCheckIcon();

    showToast(`Added ${catalogFont.name}`, 'success');

    // Dispatch event for sidebar update
    window.dispatchEvent(new CustomEvent('fontCollectionChanged'));
  } catch (error) {
    console.error('Error adding font:', error);
    showToast('Failed to add font', 'error');
  }
}

/**
 * Remove a font from the user's collection
 * @param {string} fontId - Font ID in catalog
 * @param {string} source - Font source
 * @param {Element} card - Card element
 */
function removeFontFromCollection(fontId, source, card) {
  const fullId = `${source}-${fontId}`;

  try {
    fontManager.deleteFont(fullId);

    // Update card UI
    card.classList.remove('font-card--added');
    const btn = card.querySelector('.font-card__action');
    btn.classList.remove('font-card__action--remove');
    btn.classList.add('font-card__action--add');
    btn.dataset.action = 'add';
    btn.title = 'Add to collection';
    btn.innerHTML = getPlusIcon();

    showToast('Removed from collection', 'info');

    // Dispatch event for sidebar update
    window.dispatchEvent(new CustomEvent('fontCollectionChanged'));
  } catch (error) {
    console.error('Error removing font:', error);
    showToast('Failed to remove font', 'error');
  }
}

/**
 * Observe font cards for lazy loading previews
 */
function observeFontPreviews() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const preview = entry.target;
        const family = preview.dataset.family;

        if (family && !state.previewedFonts.has(family)) {
          loadFontPreview(family, preview);
          state.previewedFonts.add(family);
        }

        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '50px' });

  const previews = fontGrid.querySelectorAll('.font-card__preview');
  previews.forEach(preview => observer.observe(preview));
}

/**
 * Load a font for preview
 * @param {string} family - Font family
 * @param {Element} preview - Preview element
 */
async function loadFontPreview(family, preview) {
  const source = state.activeTab;
  const url = fontCatalog.buildStylesheetUrl({ family, weights: [400] }, source);

  try {
    // Create temporary link to load font
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);

    // Apply font family once loaded
    await document.fonts.ready;
    preview.style.fontFamily = `'${family}', sans-serif`;
  } catch (error) {
    // Silently fail for preview
  }
}

/**
 * Update status text
 * @param {number} showing - Number of fonts shown
 * @param {number} total - Total fonts in catalog
 */
function updateStatus(showing, total) {
  if (statusEl) {
    if (showing === total) {
      statusEl.textContent = `Showing ${total} fonts`;
    } else {
      statusEl.textContent = `Showing ${showing} of ${total} fonts`;
    }
  }
}

/**
 * Show loading state
 */
function showLoadingState() {
  if (fontGrid) {
    fontGrid.innerHTML = `
      <div class="font-grid__loading">
        <div class="spinner"></div>
        <p>Loading fonts...</p>
      </div>
    `;
  }
}

/**
 * Show error state
 * @param {string} message - Error message
 */
function showError(message) {
  if (fontGrid) {
    fontGrid.innerHTML = `
      <div class="font-grid__error">
        <p>${message}</p>
      </div>
    `;
  }
}

/**
 * Show a toast notification
 * @param {string} message - Message to show
 * @param {string} type - 'success', 'error', or 'info'
 */
function showToast(message, type = 'info') {
  // Use existing toast system if available
  if (typeof window.showToast === 'function') {
    window.showToast(message, type);
    return;
  }

  // Simple fallback toast
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-default);
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Open the manual add modal
 */
function openManualAddModal() {
  const manualModal = document.getElementById('add-font-modal');
  if (manualModal) {
    manualModal.classList.add('modal-overlay--open');
  }
}

/**
 * SVG Icons
 */
function getPlusIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>`;
}

function getCheckIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>`;
}

// Export for external use
export { state };
