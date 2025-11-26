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
    <header
      className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-xl transition-all duration-300 bg-onyx-950/90 border-b border-onyx-800"
      style={{
        minHeight: '72px',
        top: '0px !important',
        left: '0 !important',
        right: '0 !important',
        position: 'fixed !important',
        width: '100% !important',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)',
        paddingBottom: '8px',
        transform: 'translateZ(0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center flex-1">
          {showBackButton && (
            <button
              onClick={onBack}
              className="mr-3 p-2.5 rounded-xl transition-all duration-300 hover:scale-105 border border-onyx-700 hover:border-electric-500/50 text-steel-400 hover:text-electric-400 hover:bg-onyx-800"
              aria-label="Go back"
            >
              <BackArrowIcon />
            </button>
          )}
          <div className="flex-grow-0">
            <h1 className="font-display text-2xl md:text-3xl tracking-wider uppercase">
              <span className="text-white">
                INK
              </span>
              <span className="text-electric-500">
                PREVIEW
              </span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-heading font-medium text-steel-500">
              Preview Before You Ink
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <CreditDisplay theme={theme} onUpgradeClick={onUpgradeClick} />
        </div>
      </div>
    </header>
  );
};

export default Header;