import React from 'react';
import type { View } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { CreateIcon } from './icons/CreateIcon';
import { SavedIcon } from './icons/SavedIcon';
import { SettingsIcon } from './icons/SettingsIcon';

interface BottomNavProps {
  activeView: View;
  onNavigate: (view: View) => void;
  theme: 'light' | 'dark';
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  theme: 'light' | 'dark';
}> = ({ label, icon, isActive, onClick, theme }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center w-full py-3 px-2 transition-all duration-300 text-slate-500 ${
        theme === 'dark' ? 'hover:text-slate-300' : 'hover:text-slate-700'
      }`}
    >
      
      {/* Icon Container */}
      <div className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${
        theme === 'dark' ? 'group-hover:bg-slate-800' : 'group-hover:bg-slate-100'
      }`}>
        {icon}
      </div>
      
      {/* Label */}
      <span className={`text-xs mt-2 font-medium transition-all duration-300 text-slate-500 ${
        theme === 'dark' ? 'group-hover:text-slate-300' : 'group-hover:text-slate-700'
      }`}>
        {label}
      </span>
      
    </button>
  );
};


const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate, theme }) => {
  return (
    <nav style={{ 
        position: 'fixed',
        bottom: '40px',
        left: '0',
        right: '0',
        width: '100%',
        height: '70px',
        paddingTop: '8px',
        backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 1)' : 'rgba(255, 255, 255, 1)',
        zIndex: 9999,
        pointerEvents: 'auto'
      }}
    >
      {/* Background with blur effect */}
      <div 
        className="backdrop-blur-md border-t"
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          borderColor: theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.5)',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)'
        }}
      >
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r via-transparent ${
          theme === 'dark' 
            ? 'from-ink-950/30 to-neon-950/30' 
            : 'from-ink-50/30 to-neon-50/30'
        }`} />
        
        {/* Navigation items */}
        <div className="relative flex justify-around items-center px-2 py-2">
          <NavItem
            label="Home"
            icon={<HomeIcon />}
            isActive={activeView === 'home'}
            onClick={() => onNavigate('home')}
            theme={theme}
          />
          <NavItem
            label="Create"
            icon={<CreateIcon />}
            isActive={activeView === 'create'}
            onClick={() => onNavigate('create')}
            theme={theme}
          />
          <NavItem
            label="My Ideas"
            icon={<SavedIcon />}
            isActive={activeView === 'saved'}
            onClick={() => onNavigate('saved')}
            theme={theme}
          />
          <NavItem
            label="Settings"
            icon={<SettingsIcon />}
            isActive={activeView === 'settings'}
            onClick={() => onNavigate('settings')}
            theme={theme}
          />
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;