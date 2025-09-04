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
}

const Header: React.FC<HeaderProps> = ({ showBackButton, onBack, theme, toggleTheme, onUpgradeClick }) => {
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
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;