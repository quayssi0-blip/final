'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  ADMIN_THEME_CONFIG,
  getSystemTheme,
  getStoredTheme,
  setStoredTheme,
  resolveTheme,
  applyTheme
} from '../lib/admin-theme';

// Create theme context
const AdminThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: false,
  isLight: true
});

// Custom hook to use theme context
export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error('useAdminTheme must be used within AdminThemeProvider');
  }
  return context;
};

// Theme provider component
export default function AdminThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = resolveTheme();
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      const stored = getStoredTheme();
      // Only update if no stored preference (auto mode)
      if (!stored) {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  // Set theme function
  const setTheme = (newTheme) => {
    if (!ADMIN_THEME_CONFIG.themes[newTheme]) {
      console.warn(`Invalid theme: ${newTheme}. Available themes:`, Object.values(ADMIN_THEME_CONFIG.themes));
      return;
    }

    console.log(`AdminThemeProvider: Setting theme to ${newTheme}`);
    setThemeState(newTheme);
    applyTheme(newTheme);
    setStoredTheme(newTheme);
    console.log(`AdminThemeProvider: data-theme attribute set to ${document.documentElement.getAttribute('data-theme')}`);
  };

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Computed values
  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  // Context value
  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark,
    isLight
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  );
}

// Theme toggle button component
export function AdminThemeToggle() {
  const { theme, toggleTheme, isDark } = useAdminTheme();

  return (
    <button
      onClick={toggleTheme}
      className="admin-btn-ghost admin-flex admin-items-center admin-gap-2"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        // Sun icon for light mode
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
      <span className="admin-body-small">
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}

// Higher-order component for theme-aware components
export function withAdminTheme(Component) {
  return function ThemeWrappedComponent(props) {
    const themeProps = useAdminTheme();
    return <Component {...props} theme={themeProps} />;
  };
}

export { AdminThemeContext };