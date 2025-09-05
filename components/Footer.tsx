import React from 'react';
import type { View } from '../types';

interface FooterProps {
  onNavigate: (view: View) => void;
  theme: 'light' | 'dark';
}

const Footer: React.FC<FooterProps> = ({ onNavigate, theme }) => {
  return (
    <footer style={{ 
      backgroundColor: theme === 'dark' ? 'purple' : 'orange', 
      height: '300px',
      marginTop: '48px'
    }}>
      <div className="container mx-auto px-4 py-6 text-center text-sm" style={{ color: 'white', fontSize: '20px' }}>
        <div className="flex justify-center space-x-8 mb-4">
          <button 
            onClick={() => onNavigate('privacy')} 
            className={`hover:text-ink-600 transition-colors duration-300 font-medium ${theme === 'dark' ? 'text-slate-400 hover:text-ink-400' : 'text-slate-600 hover:text-ink-600'}`}
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => onNavigate('disclaimer')} 
            className={`hover:text-ink-600 transition-colors duration-300 font-medium ${theme === 'dark' ? 'text-slate-400 hover:text-ink-400' : 'text-slate-600 hover:text-ink-600'}`}
          >
            Disclaimer
          </button>
        </div>
        <p style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
          THEME: {theme.toUpperCase()} - FOOTER TEST
        </p>
        <p style={{ color: 'white', fontSize: '18px' }}>
          &copy; {new Date().getFullYear()} InkSync. All rights reserved.
        </p>
        <p style={{ color: 'white', fontSize: '16px' }}>
          Generated images are for conceptual purposes only. Consult a professional tattoo artist.
        </p>
      </div>
    </footer>
  );
};

export default Footer;