// Admin Theme Utilities and Configuration
// Theme state management, utilities, and color manipulation helpers

/**
 * Theme configuration object
 */
export const ADMIN_THEME_CONFIG = {
  themes: {
    light: 'light',
    dark: 'dark'
  },
  storageKey: 'admin-theme'
};

/**
 * Get system theme preference
 * @returns {string} 'light' or 'dark'
 */
export const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Get stored theme from localStorage
 * @returns {string|null} Stored theme or null
 */
export const getStoredTheme = () => {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem(ADMIN_THEME_CONFIG.storageKey);
  } catch (error) {
    console.warn('Failed to get stored theme:', error);
    return null;
  }
};

/**
 * Store theme in localStorage
 * @param {string} theme - Theme to store
 */
export const setStoredTheme = (theme) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(ADMIN_THEME_CONFIG.storageKey, theme);
  } catch (error) {
    console.warn('Failed to store theme:', error);
  }
};

/**
 * Resolve the current theme based on stored preference or system preference
 * @returns {string} Resolved theme
 */
export const resolveTheme = () => {
  const stored = getStoredTheme();
  return stored || getSystemTheme();
};

/**
 * Apply theme to document
 * @param {string} theme - Theme to apply
 */
export const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;

  document.documentElement.setAttribute('data-theme', theme);
};

/**
 * Color manipulation utilities
 */
export const colorUtils = {
  /**
   * Lighten a hex color
   * @param {string} color - Hex color (e.g., '#3b82f6')
   * @param {number} percent - Percentage to lighten (0-100)
   * @returns {string} Lightened hex color
   */
  lighten: (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  },

  /**
   * Darken a hex color
   * @param {string} color - Hex color
   * @param {number} percent - Percentage to darken (0-100)
   * @returns {string} Darkened hex color
   */
  darken: (color, percent) => {
    return colorUtils.lighten(color, -percent);
  },

  /**
   * Convert hex to RGB
   * @param {string} hex - Hex color
   * @returns {object} RGB object {r, g, b}
   */
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  /**
   * Convert RGB to hex
   * @param {number} r - Red (0-255)
   * @param {number} g - Green (0-255)
   * @param {number} b - Blue (0-255)
   * @returns {string} Hex color
   */
  rgbToHex: (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  /**
   * Get contrast color (black or white) for background
   * @param {string} hexColor - Background hex color
   * @returns {string} '#000000' or '#ffffff'
   */
  getContrastColor: (hexColor) => {
    const rgb = colorUtils.hexToRgb(hexColor);
    if (!rgb) return '#000000';

    // Calculate relative luminance
    const { r, g, b } = rgb;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#ffffff';
  }
};

/**
 * Theme-aware styling utilities
 */
export const themeUtils = {
  /**
   * Get CSS variable value
   * @param {string} variable - CSS variable name (without --)
   * @returns {string} CSS variable value
   */
  getCssVar: (variable) => {
    if (typeof window === 'undefined') return '';

    const root = document.documentElement;
    const styles = getComputedStyle(root);
    return styles.getPropertyValue(`--${variable}`).trim();
  },

  /**
   * Set CSS variable value
   * @param {string} variable - CSS variable name (without --)
   * @param {string} value - Value to set
   */
  setCssVar: (variable, value) => {
    if (typeof document === 'undefined') return;

    document.documentElement.style.setProperty(`--${variable}`, value);
  },

  /**
   * Get current theme colors
   * @returns {object} Theme color object
   */
  getThemeColors: () => {
    return {
      primary: themeUtils.getCssVar('admin-primary-500'),
      secondary: themeUtils.getCssVar('admin-neutral-500'),
      success: themeUtils.getCssVar('admin-success'),
      warning: themeUtils.getCssVar('admin-warning'),
      error: themeUtils.getCssVar('admin-error'),
      background: themeUtils.getCssVar('admin-bg-primary'),
      surface: themeUtils.getCssVar('admin-bg-secondary'),
      text: themeUtils.getCssVar('admin-text-primary'),
      textSecondary: themeUtils.getCssVar('admin-text-secondary')
    };
  }
};

/**
 * Animation and transition utilities
 */
export const animationUtils = {
  /**
   * Fade in element
   * @param {HTMLElement} element - Element to fade in
   * @param {number} duration - Duration in ms
   */
  fadeIn: (element, duration = 300) => {
    if (!element) return;

    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-in-out`;

    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  },

  /**
   * Fade out element
   * @param {HTMLElement} element - Element to fade out
   * @param {number} duration - Duration in ms
   */
  fadeOut: (element, duration = 300) => {
    if (!element) return;

    element.style.transition = `opacity ${duration}ms ease-in-out`;
    element.style.opacity = '0';

    setTimeout(() => {
      element.style.display = 'none';
    }, duration);
  },

  /**
   * Smooth scroll to element
   * @param {HTMLElement} element - Element to scroll to
   * @param {number} offset - Offset from top
   */
  scrollToElement: (element, offset = 0) => {
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Responsive utilities
 */
export const responsiveUtils = {
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  },

  /**
   * Check if current screen size matches breakpoint
   * @param {string} breakpoint - Breakpoint key
   * @returns {boolean} True if matches
   */
  isBreakpoint: (breakpoint) => {
    if (typeof window === 'undefined') return false;

    return window.innerWidth >= responsiveUtils.breakpoints[breakpoint];
  },

  /**
   * Get current breakpoint
   * @returns {string} Current breakpoint
   */
  getCurrentBreakpoint: () => {
    if (typeof window === 'undefined') return 'sm';

    const width = window.innerWidth;
    const breakpoints = Object.entries(responsiveUtils.breakpoints).reverse();

    for (const [key, value] of breakpoints) {
      if (width >= value) return key;
    }

    return 'sm';
  }
};

export default {
  ADMIN_THEME_CONFIG,
  getSystemTheme,
  getStoredTheme,
  setStoredTheme,
  resolveTheme,
  applyTheme,
  colorUtils,
  themeUtils,
  animationUtils,
  responsiveUtils
};