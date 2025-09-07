import React from 'react';
import { BackArrowIcon } from './icons/BackArrowIcon';
import CreditDisplay from './CreditDisplay';

type Theme = 'light' | 'dark';

interface HeaderProps {
  showBackButton: boolean;
  onBack: () => void;
  theme: Theme;
  onUpgradeClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton, onBack, theme, onUpgradeClick }) => {
  return (
    <header style={{ 
      position: 'absolute',
      top: 'calc(12px + env(safe-area-inset-top, 0px))',
      left: '0',
      right: '0',
      width: '100vw',
      height: 'auto',
      paddingTop: '30px',
      backgroundColor: 'rgba(0,0,0,0.1)',
      zIndex: 9999,
      pointerEvents: 'auto'
    }}>
      <div className={`backdrop-blur-md border-b transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900/70 border-slate-800/50' 
          : 'bg-white/70 border-slate-200/50'
      }`} style={{ 
        minHeight: '75px',
        paddingTop: '15px',
        paddingBottom: '15px'
      }}>
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
                   InkPreview
                 </span>
               </h1>
               <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                 Preview Before You Ink
                 </p>
             </div>
          </div>
          <div className="flex items-center justify-end">
            <CreditDisplay theme={theme} onUpgradeClick={onUpgradeClick} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;