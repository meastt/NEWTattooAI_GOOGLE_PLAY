import React from 'react';
import type { View } from '../types';

interface FooterProps {
  onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-slate-500 dark:text-slate-400 text-sm">
        <div className="flex justify-center space-x-6">
          <button onClick={() => onNavigate('privacy')} className="hover:text-rose-500 transition-colors">Privacy Policy</button>
          <button onClick={() => onNavigate('disclaimer')} className="hover:text-rose-500 transition-colors">Disclaimer</button>
        </div>
        <p className="mt-4">&copy; {new Date().getFullYear()} AI Tattoo Artist. All rights reserved.</p>
        <p className="mt-2">Generated images are for conceptual purposes only. Consult a professional tattoo artist.</p>
      </div>
    </footer>
  );
};

export default Footer;