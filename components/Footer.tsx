import React from 'react';
import type { View } from '../types';

interface FooterProps {
  onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-700/50 mt-12">
      <div className="container mx-auto px-4 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        <div className="flex justify-center space-x-8 mb-6">
          <button 
            onClick={() => onNavigate('privacy')} 
            className="hover:text-ink-600 dark:hover:text-ink-400 transition-colors duration-300 font-medium"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => onNavigate('disclaimer')} 
            className="hover:text-ink-600 dark:hover:text-ink-400 transition-colors duration-300 font-medium"
          >
            Disclaimer
          </button>
        </div>
        <p className="text-slate-600 dark:text-slate-300 font-medium">
          &copy; {new Date().getFullYear()} InkVision AI. All rights reserved.
        </p>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Generated images are for conceptual purposes only. Consult a professional tattoo artist.
        </p>
      </div>
    </footer>
  );
};

export default Footer;