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
}> = ({ icon, title, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center p-6 rounded-xl bg-onyx-900 border border-onyx-800 transition-all duration-300 hover:bg-onyx-800 hover:border-electric-500/30 hover:-translate-y-1"
    >
      <div className="w-12 h-12 rounded-lg bg-onyx-800 flex items-center justify-center text-electric-500 mb-3 group-hover:scale-110 transition-transform duration-300 group-hover:text-electric-400">
        {icon}
      </div>
      <span className="text-xs font-heading uppercase tracking-widest text-steel-400 group-hover:text-white transition-colors">
        {title}
      </span>
    </button>
  );
};

const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-onyx-900 border border-onyx-800 p-8 shadow-2xl">
        <div className="relative z-10">
          <h1 className="font-display text-5xl md:text-6xl tracking-wide uppercase mb-4 leading-tight">
            <span className="text-white">Your Body.</span>
            <br />
            <span className="text-electric-500">Your Art.</span>
          </h1>

          <p className="text-steel-300 text-lg max-w-xl mb-8 leading-relaxed font-light">
            Professional AI tattoo visualization. Preview designs on your skin with studio-quality realism.
          </p>

          <button
            onClick={() => onNavigate('create')}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-electric-600 hover:bg-electric-500 rounded-lg font-heading uppercase tracking-widest text-sm text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:-translate-y-0.5"
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
        <h2 className="font-heading text-sm uppercase tracking-widest text-steel-500 mb-6 pl-1">
          Studio Tools
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            accentColor="cyan"
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
            accentColor="cyan"
          />
        </div>

        {/* Saved Ideas - Full Width Card */}
        <div className="mt-4">
          <button
            onClick={() => onNavigate('saved')}
            className="w-full group flex items-center justify-between p-6 rounded-xl bg-onyx-900 border border-onyx-800 transition-all duration-300 hover:bg-onyx-800 hover:border-electric-500/30 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-onyx-800 flex items-center justify-center text-electric-500 group-hover:scale-110 transition-transform duration-300 group-hover:text-electric-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <div className="text-left">
                <span className="block text-sm font-heading uppercase tracking-widest text-white mb-1">
                  Saved Collection
                </span>
                <span className="text-xs text-steel-400">
                  View your saved designs and try-ons
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-onyx-800 flex items-center justify-center text-steel-400 group-hover:text-electric-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="bg-onyx-900/50 border border-onyx-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-4 bg-electric-500" />
          <h3 className="font-heading text-sm uppercase tracking-widest text-white">
            Studio Guide
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <span className="font-display text-2xl text-electric-700/50">01</span>
            <div>
              <div className="text-sm font-medium text-white mb-1">Lighting Matters</div>
              <div className="text-xs text-steel-400 leading-relaxed">Ensure your photo is well-lit and in focus for the most realistic preview results.</div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="font-display text-2xl text-electric-700/50">02</span>
            <div>
              <div className="text-sm font-medium text-white mb-1">Be Descriptive</div>
              <div className="text-xs text-steel-400 leading-relaxed">Detailed prompts help the AI understand exactly what style and subject you want.</div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="font-display text-2xl text-electric-700/50">03</span>
            <div>
              <div className="text-sm font-medium text-white mb-1">Curate</div>
              <div className="text-xs text-steel-400 leading-relaxed">Save your favorite designs to build a cohesive collection before booking.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
