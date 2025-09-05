import React from 'react';
import type { View } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { CreateIcon } from './icons/CreateIcon';
import { SavedIcon } from './icons/SavedIcon';
import { SettingsIcon } from './icons/SettingsIcon';

interface BottomNavProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center w-full py-3 px-2 transition-all duration-300 ${
        isActive 
          ? 'text-ink-600 dark:text-ink-400' 
          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
      }`}
    >
      {/* Active Background */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-ink-100 to-neon-100 dark:from-ink-900/50 dark:to-neon-900/50 rounded-2xl mx-2" />
      )}
      
      {/* Icon Container */}
      <div className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-ink-500 to-neon-500 text-white shadow-lg' 
          : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
      }`}>
        {icon}
      </div>
      
      {/* Label */}
      <span className={`text-xs mt-2 font-medium transition-all duration-300 ${
        isActive ? 'text-ink-600 dark:text-ink-400' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
      }`}>
        {label}
      </span>
      
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-ink-500 to-neon-500 rounded-full" />
      )}
    </button>
  );
};


const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {/* Background with blur effect */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-700/50">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-50/30 via-transparent to-neon-50/30 dark:from-ink-950/30 dark:via-transparent dark:to-neon-950/30" />
        
        {/* Navigation items */}
        <div className="relative flex justify-around items-center px-2 py-2">
          <NavItem
            label="Home"
            icon={<HomeIcon />}
            isActive={activeView === 'home'}
            onClick={() => onNavigate('home')}
          />
          <NavItem
            label="Create"
            icon={<CreateIcon />}
            isActive={activeView === 'create'}
            onClick={() => onNavigate('create')}
          />
          <NavItem
            label="My Ideas"
            icon={<SavedIcon />}
            isActive={activeView === 'saved'}
            onClick={() => onNavigate('saved')}
          />
          <NavItem
            label="Settings"
            icon={<SettingsIcon />}
            isActive={activeView === 'settings'}
            onClick={() => onNavigate('settings')}
          />
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;