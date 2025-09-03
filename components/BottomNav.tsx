import React from 'react';
import type { View } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { CreateIcon } from './icons/CreateIcon';
import { SavedIcon } from './icons/SavedIcon';

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
  const activeClasses = 'text-rose-500';
  const inactiveClasses = 'text-slate-500 hover:text-slate-900 dark:hover:white';
  
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};


const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 flex justify-around z-20">
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
    </nav>
  );
};

export default BottomNav;