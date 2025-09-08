import React from 'react';
import type { View } from '../types';

interface FooterProps {
  onNavigate: (view: View) => void;
  theme: 'light' | 'dark';
}

const Footer: React.FC<FooterProps> = ({ onNavigate, theme }) => {
  return (
    <footer 
      className={`fixed bottom-0 left-0 right-0 w-full z-40 backdrop-blur-md border-t transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900/90 border-slate-800/50' 
          : 'bg-white/90 border-slate-200/50'
      }`}
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        minHeight: 'calc(120px + env(safe-area-inset-bottom, 0px))'
      }}
    >
      <div className="container mx-auto px-4 py-4 text-center">
        <div className="flex justify-center space-x-8 mb-3">
          <button 
            onClick={() => onNavigate('privacy')} 
            className={`hover:text-ink-600 transition-colors duration-300 font-medium text-sm ${
              theme === 'dark' ? 'text-slate-400 hover:text-ink-400' : 'text-slate-600 hover:text-ink-600'
            }`}
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => onNavigate('disclaimer')} 
            className={`hover:text-ink-600 transition-colors duration-300 font-medium text-sm ${
              theme === 'dark' ? 'text-slate-400 hover:text-ink-400' : 'text-slate-600 hover:text-ink-600'
            }`}
          >
            Disclaimer
          </button>
        </div>
        <p className={`text-sm font-medium mb-2 ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
        }`}>
          &copy; {new Date().getFullYear()} InkPreview. All rights reserved.
        </p>
        <p className={`text-xs ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Generated images are for conceptual purposes only. Consult a professional tattoo artist.
        </p>
      </div>
    </footer>
  );
};

export default Footer;