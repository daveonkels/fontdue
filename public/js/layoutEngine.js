/**
 * layoutEngine.js - Typography Workbench
 * Renders all typographic layouts in the canvas area
 */

/**
 * Layout definitions
 * Each layout has a unique ID, name, category, and render function
 */
const LAYOUTS = [
  // ============================================================================
  // EDITORIAL/MAGAZINE LAYOUTS
  // ============================================================================
  {
    id: 'hero',
    name: 'Hero Spread',
    category: 'editorial',
    render: () => `
      <article class="layout-card layout-hero">
        <span class="layout-card__label">Hero Spread</span>
        <span class="layout-hero__eyebrow preview-text">Featured Story</span>
        <h1 class="layout-hero__headline preview-text">The Future of Typography in Digital Design</h1>
        <p class="layout-hero__deck preview-text">How modern typefaces are reshaping the way we read, communicate, and experience digital content across every screen and platform.</p>
        <p class="layout-hero__byline preview-text">By <strong>Sarah Chen</strong> · December 2024</p>
      </article>
    `
  },
  {
    id: 'quote',
    name: 'Pull Quote',
    category: 'editorial',
    render: () => `
      <article class="layout-card layout-quote">
        <span class="layout-card__label">Pull Quote</span>
        <span class="layout-quote__mark preview-text">"</span>
        <blockquote class="layout-quote__text preview-text">Good typography is invisible. Bad typography is everywhere.</blockquote>
        <cite class="layout-quote__attribution preview-text">— Oliver Reichenstein</cite>
      </article>
    `
  },
  {
    id: 'article',
    name: 'Article Start',
    category: 'editorial',
    render: () => `
      <article class="layout-card layout-article">
        <span class="layout-card__label">Article Start</span>
        <span class="layout-article__category preview-text">Design Systems</span>
        <h2 class="layout-article__title preview-text">Building a Typographic Scale That Works</h2>
        <div class="layout-article__body preview-text">
          <p>Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing, as well as adjusting the space between pairs of letters.</p>
          <h3 class="layout-article__subhead preview-text">The Importance of Hierarchy</h3>
          <p>Visual hierarchy helps readers scan content quickly and understand the relative importance of different elements on the page.</p>
        </div>
      </article>
    `
  },
  {
    id: 'toc',
    name: 'Table of Contents',
    category: 'editorial',
    render: () => `
      <article class="layout-card layout-toc">
        <span class="layout-card__label">Table of Contents</span>
        <h3 class="layout-toc__title preview-text">Contents</h3>
        <ul class="layout-toc__list">
          <li class="layout-toc__item">
            <span class="layout-toc__chapter preview-text">Introduction to Type</span>
            <span class="layout-toc__page preview-text">01</span>
          </li>
          <li class="layout-toc__item">
            <span class="layout-toc__chapter preview-text">Anatomy of Letterforms</span>
            <span class="layout-toc__page preview-text">14</span>
          </li>
          <li class="layout-toc__item">
            <span class="layout-toc__chapter preview-text">Building a Type Scale</span>
            <span class="layout-toc__page preview-text">28</span>
          </li>
          <li class="layout-toc__item">
            <span class="layout-toc__chapter preview-text">Pairing Typefaces</span>
            <span class="layout-toc__page preview-text">45</span>
          </li>
          <li class="layout-toc__item">
            <span class="layout-toc__chapter preview-text">Responsive Typography</span>
            <span class="layout-toc__page preview-text">62</span>
          </li>
        </ul>
      </article>
    `
  },

  // ============================================================================
  // MARKETING/BRAND LAYOUTS
  // ============================================================================
  {
    id: 'poster',
    name: 'Poster',
    category: 'marketing',
    render: () => `
      <article class="layout-card layout-poster">
        <span class="layout-card__label">Poster</span>
        <span class="layout-poster__date preview-text">Dec 15, 2024</span>
        <h2 class="layout-poster__headline preview-text">Design Conference NYC</h2>
        <span class="layout-poster__cta preview-text">Get Tickets →</span>
      </article>
    `
  },
  {
    id: 'business-card',
    name: 'Business Card',
    category: 'marketing',
    render: () => `
      <article class="layout-card layout-card-biz">
        <span class="layout-card__label">Business Card</span>
        <div>
          <h3 class="layout-card-biz__name preview-text">Alexandra Kim</h3>
          <p class="layout-card-biz__title preview-text">Senior Type Designer</p>
        </div>
        <div>
          <p class="layout-card-biz__contact preview-text">
            alex@typefoundry.com<br>
            +1 (555) 123-4567
          </p>
          <p class="layout-card-biz__company preview-text">Type Foundry Co.</p>
        </div>
      </article>
    `
  },
  {
    id: 'landing',
    name: 'Landing Hero',
    category: 'marketing',
    render: () => `
      <article class="layout-card layout-landing">
        <span class="layout-card__label">Landing Hero</span>
        <h2 class="layout-landing__headline preview-text">Build <em>beautiful</em> products faster</h2>
        <p class="layout-landing__subhead preview-text">The modern design platform for teams who ship. Create, collaborate, and iterate at the speed of thought.</p>
        <a href="#" class="layout-landing__cta preview-text">Start for free →</a>
      </article>
    `
  },
  {
    id: 'pricing',
    name: 'Pricing Card',
    category: 'marketing',
    render: () => `
      <article class="layout-card layout-pricing">
        <span class="layout-card__label">Pricing Card</span>
        <span class="layout-pricing__tier preview-text">Professional</span>
        <div class="layout-pricing__price preview-text">
          <span class="layout-pricing__amount">$49</span>
          <span class="layout-pricing__period">/month</span>
        </div>
        <ul class="layout-pricing__features">
          <li class="layout-pricing__feature preview-text">Unlimited projects</li>
          <li class="layout-pricing__feature preview-text">Advanced analytics</li>
          <li class="layout-pricing__feature preview-text">Priority support</li>
          <li class="layout-pricing__feature preview-text">Custom integrations</li>
        </ul>
        <button class="layout-pricing__button preview-text">Get Started</button>
      </article>
    `
  },

  // ============================================================================
  // UI/APP LAYOUTS
  // ============================================================================
  {
    id: 'dashboard',
    name: 'Dashboard Header',
    category: 'ui',
    render: () => `
      <article class="layout-card layout-dashboard">
        <span class="layout-card__label">Dashboard Header</span>
        <div class="layout-dashboard__header">
          <h2 class="layout-dashboard__title preview-text">Analytics Overview</h2>
          <nav class="layout-dashboard__nav">
            <span class="layout-dashboard__nav-item layout-dashboard__nav-item--active preview-text">Day</span>
            <span class="layout-dashboard__nav-item preview-text">Week</span>
            <span class="layout-dashboard__nav-item preview-text">Month</span>
            <span class="layout-dashboard__nav-item preview-text">Year</span>
          </nav>
        </div>
        <div class="layout-dashboard__metrics">
          <div class="layout-dashboard__metric">
            <span class="layout-dashboard__metric-label preview-text">Total Revenue</span>
            <span class="layout-dashboard__metric-value preview-text">$84,230</span>
            <span class="layout-dashboard__metric-change preview-text">↑ 12.5%</span>
          </div>
          <div class="layout-dashboard__metric">
            <span class="layout-dashboard__metric-label preview-text">Active Users</span>
            <span class="layout-dashboard__metric-value preview-text">2,847</span>
            <span class="layout-dashboard__metric-change preview-text">↑ 8.2%</span>
          </div>
          <div class="layout-dashboard__metric">
            <span class="layout-dashboard__metric-label preview-text">Conversion</span>
            <span class="layout-dashboard__metric-value preview-text">3.24%</span>
            <span class="layout-dashboard__metric-change preview-text">↑ 2.1%</span>
          </div>
          <div class="layout-dashboard__metric">
            <span class="layout-dashboard__metric-label preview-text">Avg. Session</span>
            <span class="layout-dashboard__metric-value preview-text">4m 32s</span>
            <span class="layout-dashboard__metric-change preview-text">↑ 0.8%</span>
          </div>
        </div>
      </article>
    `
  },
  {
    id: 'mobile',
    name: 'Mobile App Screen',
    category: 'ui',
    render: () => `
      <article class="layout-card layout-mobile">
        <span class="layout-card__label">Mobile App</span>
        <div class="layout-mobile__status">
          <span class="preview-text">9:41</span>
          <span class="preview-text">⚡️ 100%</span>
        </div>
        <div class="layout-mobile__header">
          <h2 class="layout-mobile__title preview-text">Messages</h2>
        </div>
        <div class="layout-mobile__list">
          <div class="layout-mobile__item">
            <div class="layout-mobile__item-icon"></div>
            <div class="layout-mobile__item-content">
              <span class="layout-mobile__item-title preview-text">Design Team</span>
              <span class="layout-mobile__item-subtitle preview-text">Sarah: Updated the mockups!</span>
            </div>
            <span class="layout-mobile__item-badge preview-text">3</span>
          </div>
          <div class="layout-mobile__item">
            <div class="layout-mobile__item-icon"></div>
            <div class="layout-mobile__item-content">
              <span class="layout-mobile__item-title preview-text">Alex Chen</span>
              <span class="layout-mobile__item-subtitle preview-text">Can we sync tomorrow?</span>
            </div>
            <span class="layout-mobile__item-badge preview-text">1</span>
          </div>
          <div class="layout-mobile__item">
            <div class="layout-mobile__item-icon"></div>
            <div class="layout-mobile__item-content">
              <span class="layout-mobile__item-title preview-text">Product Updates</span>
              <span class="layout-mobile__item-subtitle preview-text">New release notes available</span>
            </div>
          </div>
        </div>
      </article>
    `
  },
  {
    id: 'form',
    name: 'Form',
    category: 'ui',
    render: () => `
      <article class="layout-card layout-form">
        <span class="layout-card__label">Form</span>
        <h3 class="layout-form__title preview-text">Create Account</h3>
        <div class="layout-form__group">
          <label class="layout-form__label preview-text">Full Name</label>
          <input type="text" class="layout-form__input preview-text" placeholder="Enter your name" disabled>
        </div>
        <div class="layout-form__group">
          <label class="layout-form__label preview-text">Email Address</label>
          <input type="email" class="layout-form__input preview-text" placeholder="you@example.com" disabled>
          <span class="layout-form__help preview-text">We'll never share your email.</span>
        </div>
        <div class="layout-form__group">
          <label class="layout-form__label preview-text">Password</label>
          <input type="password" class="layout-form__input preview-text" placeholder="••••••••" disabled>
        </div>
        <button class="layout-form__button preview-text">Create Account</button>
      </article>
    `
  },
  {
    id: 'notifications',
    name: 'Notifications',
    category: 'ui',
    render: () => `
      <article class="layout-card layout-notification">
        <span class="layout-card__label">Notifications</span>
        <div class="layout-notification__item layout-notification__item--success">
          <svg class="layout-notification__icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <div class="layout-notification__content">
            <span class="layout-notification__title preview-text">Changes saved</span>
            <span class="layout-notification__message preview-text">Your preferences have been updated.</span>
          </div>
          <span class="layout-notification__time preview-text">2m ago</span>
        </div>
        <div class="layout-notification__item layout-notification__item--warning">
          <svg class="layout-notification__icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <div class="layout-notification__content">
            <span class="layout-notification__title preview-text">Storage almost full</span>
            <span class="layout-notification__message preview-text">You've used 90% of your storage.</span>
          </div>
          <span class="layout-notification__time preview-text">1h ago</span>
        </div>
        <div class="layout-notification__item layout-notification__item--error">
          <svg class="layout-notification__icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <div class="layout-notification__content">
            <span class="layout-notification__title preview-text">Upload failed</span>
            <span class="layout-notification__message preview-text">Please try again later.</span>
          </div>
          <span class="layout-notification__time preview-text">3h ago</span>
        </div>
      </article>
    `
  },

  // ============================================================================
  // TECHNICAL SPECIMENS
  // ============================================================================
  {
    id: 'scale',
    name: 'Type Scale',
    category: 'specimen',
    render: () => `
      <article class="layout-card layout-scale">
        <span class="layout-card__label">Type Scale</span>
        <h3 class="layout-scale__title">Type Scale</h3>
        <div class="layout-scale__item">
          <span class="layout-scale__size">128px</span>
          <span class="layout-scale__sample layout-scale__sample--9xl preview-text">Aa</span>
        </div>
        <div class="layout-scale__item">
          <span class="layout-scale__size">96px</span>
          <span class="layout-scale__sample layout-scale__sample--8xl preview-text">Aa</span>
        </div>
        <div class="layout-scale__item">
          <span class="layout-scale__size">72px</span>
          <span class="layout-scale__sample layout-scale__sample--7xl preview-text">Hamburgers</span>
        </div>
        <div class="layout-scale__item">
          <span class="layout-scale__size">60px</span>
          <span class="layout-scale__sample layout-scale__sample--6xl preview-text">Hamburgers</span>
        </div>
        <div class="layout-scale__item">
          <span class="layout-scale__size">48px</span>
          <span class="layout-scale__sample layout-scale__sample--5xl preview-text">Hamburgers</span>
        </div>
        <div class="layout-scale__item">
          <span class="layout-scale__size">36px</span>
          <span class="layout-scale__sample layout-scale__sample--4xl preview-text">Hamburgers</span>
        </div>
        <div class="layout-scale__item">
          <span class="layout-scale__size">30px</span>
          <span class="layout-scale__sample layout-scale__sample--3xl preview-text">The quick brown fox</span>
        </div>
        <div class="layout-scale__item">
          <span class="layout-scale__size">24px</span>
          <span class="layout-scale__sample layout-scale__sample--2xl preview-text">The quick brown fox jumps over</span>
        </div>
        <div class="layout-scale__item">
          <span class="layout-scale__size">20px</span>
          <span class="layout-scale__sample layout-scale__sample--xl preview-text">The quick brown fox jumps over the lazy dog</span>
        </div>
        <div class="layout-scale__item">
          <span class="layout-scale__size">18px</span>
          <span class="layout-scale__sample layout-scale__sample--lg preview-text">The quick brown fox jumps over the lazy dog</span>
        </div>
        <div class="layout-scale__item">
          <span class="layout-scale__size">16px</span>
          <span class="layout-scale__sample layout-scale__sample--base preview-text">The quick brown fox jumps over the lazy dog</span>
        </div>
        <div class="layout-scale__item">
          <span class="layout-scale__size">14px</span>
          <span class="layout-scale__sample layout-scale__sample--sm preview-text">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.</span>
        </div>
      </article>
    `
  },
  {
    id: 'weights',
    name: 'Weight Ramp',
    category: 'specimen',
    render: () => `
      <article class="layout-card layout-weights">
        <span class="layout-card__label">Weight Ramp</span>
        <h3 class="layout-weights__title">Weight Ramp</h3>
        <div class="layout-weights__item">
          <span class="layout-weights__value">100</span>
          <span class="layout-weights__sample preview-text weight-100">Typography</span>
        </div>
        <div class="layout-weights__item">
          <span class="layout-weights__value">200</span>
          <span class="layout-weights__sample preview-text weight-200">Typography</span>
        </div>
        <div class="layout-weights__item">
          <span class="layout-weights__value">300</span>
          <span class="layout-weights__sample preview-text weight-300">Typography</span>
        </div>
        <div class="layout-weights__item">
          <span class="layout-weights__value">400</span>
          <span class="layout-weights__sample preview-text weight-400">Typography</span>
        </div>
        <div class="layout-weights__item">
          <span class="layout-weights__value">500</span>
          <span class="layout-weights__sample preview-text weight-500">Typography</span>
        </div>
        <div class="layout-weights__item">
          <span class="layout-weights__value">600</span>
          <span class="layout-weights__sample preview-text weight-600">Typography</span>
        </div>
        <div class="layout-weights__item">
          <span class="layout-weights__value">700</span>
          <span class="layout-weights__sample preview-text weight-700">Typography</span>
        </div>
        <div class="layout-weights__item">
          <span class="layout-weights__value">800</span>
          <span class="layout-weights__sample preview-text weight-800">Typography</span>
        </div>
        <div class="layout-weights__item">
          <span class="layout-weights__value">900</span>
          <span class="layout-weights__sample preview-text weight-900">Typography</span>
        </div>
      </article>
    `
  },
  {
    id: 'charset',
    name: 'Character Set',
    category: 'specimen',
    render: () => `
      <article class="layout-card layout-charset">
        <span class="layout-card__label">Character Set</span>
        <h3 class="layout-charset__title">Character Set</h3>
        <div class="layout-charset__section">
          <span class="layout-charset__label">Uppercase</span>
          <p class="layout-charset__chars preview-text">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
        </div>
        <div class="layout-charset__section">
          <span class="layout-charset__label">Lowercase</span>
          <p class="layout-charset__chars preview-text">abcdefghijklmnopqrstuvwxyz</p>
        </div>
        <div class="layout-charset__section">
          <span class="layout-charset__label">Numbers</span>
          <p class="layout-charset__chars preview-text">0123456789</p>
        </div>
        <div class="layout-charset__section">
          <span class="layout-charset__label">Punctuation</span>
          <p class="layout-charset__chars preview-text">!@#$%^&*()_+-=[]{}|;':",.<>?/~\`</p>
        </div>
      </article>
    `
  },
  {
    id: 'pangrams',
    name: 'Pangrams',
    category: 'specimen',
    render: () => `
      <article class="layout-card layout-pangrams">
        <span class="layout-card__label">Pangrams</span>
        <h3 class="layout-pangrams__title">Pangrams</h3>
        <div class="layout-pangrams__item">
          <p class="layout-pangrams__text preview-text">The quick brown fox jumps over the lazy dog.</p>
          <span class="layout-pangrams__lang">English</span>
        </div>
        <div class="layout-pangrams__item">
          <p class="layout-pangrams__text preview-text">Pack my box with five dozen liquor jugs.</p>
          <span class="layout-pangrams__lang">English</span>
        </div>
        <div class="layout-pangrams__item">
          <p class="layout-pangrams__text preview-text">How vexingly quick daft zebras jump!</p>
          <span class="layout-pangrams__lang">English</span>
        </div>
        <div class="layout-pangrams__item">
          <p class="layout-pangrams__text preview-text">Sphinx of black quartz, judge my vow.</p>
          <span class="layout-pangrams__lang">English</span>
        </div>
      </article>
    `
  },
  {
    id: 'kerning',
    name: 'Kerning Pairs',
    category: 'specimen',
    render: () => `
      <article class="layout-card layout-kerning">
        <span class="layout-card__label">Kerning Pairs</span>
        <h3 class="layout-kerning__title">Kerning Pairs</h3>
        <div class="layout-kerning__pairs">
          <span class="layout-kerning__pair preview-text">AV</span>
          <span class="layout-kerning__pair preview-text">AW</span>
          <span class="layout-kerning__pair preview-text">AY</span>
          <span class="layout-kerning__pair preview-text">FA</span>
          <span class="layout-kerning__pair preview-text">LT</span>
          <span class="layout-kerning__pair preview-text">LY</span>
          <span class="layout-kerning__pair preview-text">PA</span>
          <span class="layout-kerning__pair preview-text">TA</span>
          <span class="layout-kerning__pair preview-text">To</span>
          <span class="layout-kerning__pair preview-text">Tr</span>
          <span class="layout-kerning__pair preview-text">VA</span>
          <span class="layout-kerning__pair preview-text">WA</span>
          <span class="layout-kerning__pair preview-text">Ya</span>
          <span class="layout-kerning__pair preview-text">Yo</span>
          <span class="layout-kerning__pair preview-text">ff</span>
          <span class="layout-kerning__pair preview-text">fi</span>
        </div>
      </article>
    `
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    category: 'specimen',
    render: () => `
      <article class="layout-card layout-paragraph">
        <span class="layout-card__label">Paragraph</span>
        <h3 class="layout-paragraph__title">Paragraph Specimen</h3>
        <p class="layout-paragraph__text preview-text">Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing, as well as adjusting the space between pairs of letters. The term typography is also applied to the style, arrangement, and appearance of the letters, numbers, and symbols created by the process. Type design is a closely related craft, sometimes considered part of typography; most typographers do not design typefaces, and some type designers do not consider themselves typographers. Typography also may be used as an ornamental and decorative device, unrelated to the communication of information.</p>
      </article>
    `
  },
  {
    id: 'numbers',
    name: 'Numbers & Data',
    category: 'specimen',
    render: () => `
      <article class="layout-card layout-numbers">
        <span class="layout-card__label">Numbers & Data</span>
        <h3 class="layout-numbers__title">Numbers & Data</h3>
        <span class="layout-numbers__hero preview-text">$1,234,567.89</span>
        <span class="layout-numbers__label preview-text">Total Revenue (USD)</span>
        <div class="layout-numbers__row">
          <span class="layout-numbers__item-label preview-text">Growth Rate</span>
          <span class="layout-numbers__item-value preview-text">+24.8%</span>
        </div>
        <div class="layout-numbers__row">
          <span class="layout-numbers__item-label preview-text">Active Users</span>
          <span class="layout-numbers__item-value preview-text">847,293</span>
        </div>
        <div class="layout-numbers__row">
          <span class="layout-numbers__item-label preview-text">Conversion</span>
          <span class="layout-numbers__item-value preview-text">3.14%</span>
        </div>
      </article>
    `
  },
  {
    id: 'comparison',
    name: 'Light vs Dark',
    category: 'specimen',
    render: () => `
      <article class="layout-card layout-comparison">
        <span class="layout-card__label">Light vs Dark</span>
        <div class="layout-comparison__side layout-comparison__side--light">
          <span class="layout-comparison__label">Light Mode</span>
          <h3 class="layout-comparison__headline preview-text">Clarity in every pixel</h3>
          <p class="layout-comparison__body preview-text">See how your typeface performs on light backgrounds, where contrast and readability take center stage.</p>
        </div>
        <div class="layout-comparison__side layout-comparison__side--dark">
          <span class="layout-comparison__label">Dark Mode</span>
          <h3 class="layout-comparison__headline preview-text">Elegance after dark</h3>
          <p class="layout-comparison__body preview-text">Experience the same typeface in dark mode, where subtlety and atmosphere define the reading experience.</p>
        </div>
      </article>
    `
  }
];

/**
 * Get all layout definitions
 */
export function getLayouts() {
  return LAYOUTS;
}

/**
 * Get layouts by category
 */
export function getLayoutsByCategory(category) {
  return LAYOUTS.filter(layout => layout.category === category);
}

/**
 * Get all categories
 */
export function getCategories() {
  return [
    { id: 'editorial', name: 'Editorial' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'ui', name: 'UI/App' },
    { id: 'specimen', name: 'Specimens' }
  ];
}

/**
 * Render all layouts to the canvas
 */
export function renderAllLayouts(container) {
  if (!container) {
    console.error('No container provided for layouts');
    return;
  }

  const html = LAYOUTS.map(layout => layout.render()).join('');
  container.innerHTML = `<div class="layout-grid">${html}</div>`;
}

/**
 * Render a single layout
 */
export function renderLayout(layoutId, container) {
  const layout = LAYOUTS.find(l => l.id === layoutId);
  if (!layout || !container) return;

  container.innerHTML = layout.render();
}

/**
 * Get layout count
 */
export function getLayoutCount() {
  return LAYOUTS.length;
}
