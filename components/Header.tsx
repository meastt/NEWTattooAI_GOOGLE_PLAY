import React from 'react';
import { BackArrowIcon } from './icons/BackArrowIcon';
import ThemeToggle from './ThemeToggle';

type Theme = 'light' | 'dark';

interface HeaderProps {
  showBackButton: boolean;
  onBack: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton, onBack, theme, toggleTheme }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center flex-1">
           {showBackButton && (
            <button
              onClick={onBack}
              className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Go back"
            >
              <BackArrowIcon />
            </button>
          )}
           <div className="flex-grow-0">
             <h1 className="text-xl md:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-600">
                AI Tattoo Artist
             </h1>
           </div>
        </div>
        <div className="flex items-center justify-end">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </header>
  );
};

export default Header;