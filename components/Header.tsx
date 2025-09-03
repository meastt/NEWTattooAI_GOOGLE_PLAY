
import React from 'react';
import { BackArrowIcon } from './icons/BackArrowIcon';

interface HeaderProps {
  showBackButton: boolean;
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton, onBack }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center">
           {showBackButton && (
            <button
              onClick={onBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Go back to dashboard"
            >
              <BackArrowIcon />
            </button>
          )}
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            AI Tattoo Artist
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
