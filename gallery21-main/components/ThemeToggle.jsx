// components/ThemeToggle.jsx
'use client'

import React, { useEffect, useState } from 'react';
import { LightMode, DarkMode } from '@mui/icons-material';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check the user's preference on initial load
    const storedPreference = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedPreference) {
        setIsDarkMode(storedPreference === 'dark');
        document.documentElement.classList.toggle('dark', storedPreference === 'dark');
      } else {
        setIsDarkMode(prefersDark);
        document.documentElement.classList.toggle('dark', prefersDark);
      }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200"
    >
      {isDarkMode ? <span><LightMode /> Light Mode</span> : <span><DarkMode /> Dark Mode</span> }
    </button>
  );
};

export default ThemeToggle;
