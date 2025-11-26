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
  accentColor?: 'cyan' | 'magenta';
}> = ({ label, icon, isActive, onClick, theme, accentColor = 'cyan' }) => {
  const activeStyles = accentColor === 'cyan'
    ? 'text-electric-400 neon-text-cyan'
    : 'text-magenta-400 neon-text-magenta';

  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center w-full py-2 px-1 transition-all duration-300 ${isActive
          ? 'text-electric-500'
          : theme === 'dark'
            ? 'text-steel-500 hover:text-steel-300'
            : 'text-steel-400 hover:text-steel-600'
        }`}
    >
      {/* Active indicator - clean dot */}
      {isActive && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-electric-500 shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
      )}

      {/* Icon Container */}
      <div className={`relative z-10 p-2 rounded-lg transition-all duration-300 ${isActive
          ? theme === 'dark'
            ? 'bg-onyx-800'
            : 'bg-steel-100'
          : theme === 'dark'
            ? 'group-hover:bg-onyx-800/50'
            : 'group-hover:bg-steel-100/50'
        }`}>
        {icon}
      </div>

      {/* Label */}
      <span className={`text-[10px] mt-1 font-heading font-medium uppercase tracking-widest transition-all duration-300 ${isActive
          ? ''
          : theme === 'dark'
            ? 'text-steel-500 group-hover:text-steel-400'
            : 'text-steel-400 group-hover:text-steel-600'
        }`}>
        {label}
      </span>
    </button>
  );
};


const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate, theme }) => {
  // Determine if a view is active for the nav items
  const isHomeActive = activeView === 'home';
  const isCreateActive = ['create', 'tryOn', 'generator', 'removal', 'coverup'].includes(activeView);
  const isSavedActive = activeView === 'saved';
  const isSettingsActive = ['settings', 'privacy', 'terms', 'disclaimer'].includes(activeView);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 w-full z-50 border-t border-onyx-800"
      style={{
        position: 'fixed !important',
        bottom: '0px !important',
        left: '0px !important',
        right: '0px !important',
        width: '100% !important',
        height: 'calc(56px + env(safe-area-inset-bottom, 0px) + 48px)',
        paddingTop: '6px',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 48px)',
        backgroundColor: theme === 'dark' ? '#050505' : '#ffffff',
        zIndex: '9999 !important',
        pointerEvents: 'auto',
        transform: 'translateZ(0) !important',
        willChange: 'transform !important',
        backfaceVisibility: 'hidden !important',
        WebkitBackfaceVisibility: 'hidden !important',
        isolation: 'isolate',
        contain: 'layout style paint'
      }}
    >
      {/* Background with blur effect */}
      <div
        className="backdrop-blur-xl"
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(5, 5, 5, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)'
        }}
      >
        {/* Navigation items */}
        <div className="relative flex justify-around items-center px-2 py-1">
          <NavItem
            label="Home"
            icon={<HomeIcon />}
            isActive={isHomeActive}
            onClick={() => onNavigate('home')}
            theme={theme}
            accentColor="cyan"
          />
          <NavItem
            label="Create"
            icon={<CreateIcon />}
            isActive={isCreateActive}
            onClick={() => onNavigate('create')}
            theme={theme}
            accentColor="cyan"
          />
          <NavItem
            label="Saved"
            icon={<SavedIcon />}
            isActive={isSavedActive}
            onClick={() => onNavigate('saved')}
            theme={theme}
            accentColor="cyan"
          />
          <NavItem
            label="Settings"
            icon={<SettingsIcon />}
            isActive={isSettingsActive}
            onClick={() => onNavigate('settings')}
            theme={theme}
            accentColor="cyan"
          />
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;