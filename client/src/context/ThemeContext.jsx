import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('vittara_theme');
      return saved === 'bright' ? 'bright' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'bright') {
      root.classList.add('light');
      body.classList.add('light');
    } else {
      root.classList.remove('light');
      body.classList.remove('light');
    }
    body.style.backgroundColor = theme === 'bright' ? '#F5F7FB' : '#000000';
    body.style.color = theme === 'bright' ? '#002970' : '#FFFFFF';
    try {
      localStorage.setItem('vittara_theme', theme);
    } catch {
      // storage unavailable
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'bright' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}