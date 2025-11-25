import React from 'react';
import type { View } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { EraserIcon } from './icons/EraserIcon';
import { PaletteIcon } from './icons/PaletteIcon';

interface HomeDashboardProps {
  onNavigate: (view: View) => void;
}

const QuickActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  accentColor: 'cyan' | 'magenta';
}> = ({ icon, title, onClick, accentColor }) => {
  const borderColor = accentColor === 'cyan'
    ? 'border-electric-500/20 hover:border-electric-400/50'
    : 'border-magenta-500/20 hover:border-magenta-400/50';
  const iconColor = accentColor === 'cyan'
    ? 'text-electric-400'
    : 'text-magenta-400';
  const glowColor = accentColor === 'cyan'
    ? 'group-hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]'
    : 'group-hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]';

  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center p-4 rounded-xl bg-void-800/50 border ${borderColor} transition-all duration-300 hover:bg-void-800 ${glowColor}`}
    >
      <div className={`w-10 h-10 rounded-lg bg-void-700 flex items-center justify-center ${iconColor} mb-2 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <span className="text-xs font-heading uppercase tracking-wider text-steel-300 group-hover:text-white transition-colors">
        {title}
      </span>
    </button>
  );
};

const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-void-900 border border-void-700 p-8">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-64 h-64 bg-electric-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-magenta-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-electric-400 animate-pulse" />
            <span className="text-xs font-heading uppercase tracking-[0.2em] text-electric-400">
              System Online
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl tracking-wider uppercase mb-3">
            <span className="text-white">WELCOME TO</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-400 to-magenta-400">
              INKPREVIEW
            </span>
          </h1>

          <p className="text-steel-400 text-lg max-w-xl mb-6 leading-relaxed">
            AI-powered tattoo visualization studio. Preview designs on your skin, generate custom art, or explore new ideas.
          </p>

          <button
            onClick={() => onNavigate('create')}
            className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-electric-500 to-magenta-500 rounded-lg font-heading uppercase tracking-wider text-sm text-white hover:shadow-neon-dual transition-all duration-300 hover:scale-105"
          >
            <span>Start Creating</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="font-heading text-sm uppercase tracking-wider text-steel-500 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickActionCard
            icon={<CameraIcon />}
            title="Try-On"
            onClick={() => onNavigate('tryOn')}
            accentColor="cyan"
          />
          <QuickActionCard
            icon={<SparklesIcon />}
            title="Generate"
            onClick={() => onNavigate('generator')}
            accentColor="magenta"
          />
          <QuickActionCard
            icon={<EraserIcon />}
            title="Remove"
            onClick={() => onNavigate('removal')}
            accentColor="cyan"
          />
          <QuickActionCard
            icon={<PaletteIcon />}
            title="Cover-Up"
            onClick={() => onNavigate('coverup')}
            accentColor="magenta"
          />
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="bg-void-900/50 border border-void-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-electric-500 rounded-full" />
          <h3 className="font-heading text-sm uppercase tracking-wider text-white">
            Pro Tips
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-electric-500/10 flex items-center justify-center text-electric-400 flex-shrink-0">
              <span className="font-display text-lg">01</span>
            </div>
            <div>
              <div className="text-sm font-medium text-white mb-1">Clear Photos</div>
              <div className="text-xs text-steel-400">Well-lit, high-res images get the best AI results</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-magenta-500/10 flex items-center justify-center text-magenta-400 flex-shrink-0">
              <span className="font-display text-lg">02</span>
            </div>
            <div>
              <div className="text-sm font-medium text-white mb-1">Be Specific</div>
              <div className="text-xs text-steel-400">Detailed descriptions create better designs</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-electric-500/10 flex items-center justify-center text-electric-400 flex-shrink-0">
              <span className="font-display text-lg">03</span>
            </div>
            <div>
              <div className="text-sm font-medium text-white mb-1">Save Ideas</div>
              <div className="text-xs text-steel-400">Build your collection in the Saved tab</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
