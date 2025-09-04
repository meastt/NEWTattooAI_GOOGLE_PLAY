import React from 'react';
import { BackArrowIcon } from './icons/BackArrowIcon';
import ThemeToggle from './ThemeToggle';
import CreditDisplay from './CreditDisplay';

type Theme = 'light' | 'dark';

interface HeaderProps {
  showBackButton: boolean;
  onBack: () => void;
  theme: Theme;
  toggleTheme: () => void;
  onUpgradeClick?: () => void;
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton, onBack, theme, toggleTheme, onUpgradeClick, onSettingsClick }) => {
  return (
    <header className="sticky top-0 z-50">
      <div className={`backdrop-blur-md border-b transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900/70 border-slate-800/50' 
          : 'bg-white/70 border-slate-200/50'
      }`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center flex-1">
             {showBackButton && (
              <button
                onClick={onBack}
                className={`mr-4 p-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  theme === 'dark' 
                    ? 'hover:bg-slate-800/50 text-slate-300 hover:text-white' 
                    : 'hover:bg-slate-100/50 text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Go back"
              >
                <BackArrowIcon />
              </button>
            )}
             <div className="flex-grow-0">
               <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight">
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500">
                   InkVision
                 </span>
                 <span className={`ml-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                   AI
                 </span>
               </h1>
               <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                 Your Personal Tattoo Studio
               </p>
             </div>
          </div>
          <div className="flex items-center justify-end space-x-4">
            <CreditDisplay theme={theme} onUpgradeClick={onUpgradeClick} />
            {onSettingsClick && (
              <button
                onClick={onSettingsClick}
                className="group relative p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-105"
                aria-label="Settings"
              >
                <div className="relative">
                  <svg className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-ink-600 dark:group-hover:text-ink-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-ink-500/20 to-neon-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </button>
            )}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;