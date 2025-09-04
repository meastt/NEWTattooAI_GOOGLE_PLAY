import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

type Theme = 'light' | 'dark';

interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="group relative p-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:border-ink-300 dark:hover:border-ink-600 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative">
        <div className={`transition-colors duration-300 ${
          theme === 'light' 
            ? 'text-slate-700 group-hover:text-ink-600' 
            : 'text-slate-300 group-hover:text-ink-400'
        }`}>
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-ink-500/10 to-neon-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </button>
  );
};

export default ThemeToggle;
