'use client';

import { useEffect, useState } from 'react';

const THEMES = ["light", "dark"];

const THEME_MAP = {
  light: "pastel",
  dark: "halloween"
} as const;

export const ThemePicker = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', THEME_MAP[savedTheme as keyof typeof THEME_MAP]);
    setCurrentTheme(savedTheme);
  }, []);

  const handleThemeChange = (theme: string) => {
    document.documentElement.setAttribute('data-theme', THEME_MAP[theme as keyof typeof THEME_MAP]);
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        {THEMES.map((theme) => (
          <li key={theme}>
            <button
              className={`${currentTheme === theme ? 'active' : ''}`}
              onClick={() => handleThemeChange(theme)}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}; 