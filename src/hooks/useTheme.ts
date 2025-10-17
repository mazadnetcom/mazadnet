import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dim';

export const useTheme = () => {
  // Set 'light' as the default, which matches the new :root styles in index.css
  const [theme, setThemeState] = useState<Theme>('light');

  // On initial load, check localStorage for a saved theme preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('twitter-clone-theme') as Theme | null;
    if (storedTheme && ['light', 'dim'].includes(storedTheme)) {
      setThemeState(storedTheme);
    }
  }, []);

  // When theme changes, update the class on the <html> element and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Always remove the theme class to reset to default (light)
    root.classList.remove('theme-dim');
    
    // If the selected theme is 'dim', add the class back
    if (theme === 'dim') {
      root.classList.add('theme-dim');
    }
    
    // Save the current preference
    localStorage.setItem('twitter-clone-theme', theme);
  }, [theme]);

  // A memoized function to update the theme state, exposed to components
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return { theme, setTheme };
};
