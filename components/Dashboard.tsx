import React from 'react';
import type { View } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { CameraIcon } from './icons/CameraIcon';
import { EraserIcon } from './icons/EraserIcon';
import { PaletteIcon } from './icons/PaletteIcon';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const DashboardCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  delay?: number;
  accentColor: 'cyan' | 'magenta';
  number: string;
}> = ({ icon, title, description, onClick, delay = 0, accentColor, number }) => {
  const glowColor = accentColor === 'cyan'
    ? 'rgba(0, 212, 255, 0.15)'
    : 'rgba(255, 0, 255, 0.15)';
  const borderColor = accentColor === 'cyan'
    ? 'border-electric-500/30 hover:border-electric-400/60'
    : 'border-magenta-500/30 hover:border-magenta-400/60';
  const iconBg = accentColor === 'cyan'
    ? 'bg-electric-500/10 group-hover:bg-electric-500/20'
    : 'bg-magenta-500/10 group-hover:bg-magenta-500/20';
  const iconColor = accentColor === 'cyan'
    ? 'text-electric-400'
    : 'text-magenta-400';
  const numberColor = accentColor === 'cyan'
    ? 'text-electric-500/20'
    : 'text-magenta-500/20';

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden bg-void-900/80 dark:bg-void-900/80 backdrop-blur-sm p-6 rounded-2xl border ${borderColor} transition-all duration-500 text-left w-full min-h-[180px] flex flex-col hover:scale-[1.02] hover:-translate-y-1`}
      style={{
        animationDelay: `${delay}ms`,
        boxShadow: `0 0 40px ${glowColor}`
      }}
    >
      {/* Large background number */}
      <span className={`absolute -right-2 -top-4 font-display text-[120px] leading-none ${numberColor} select-none pointer-events-none transition-all duration-500 group-hover:scale-110 group-hover:opacity-50`}>
        {number}
      </span>

      {/* Scan line effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[200%] animate-scan" />
      </div>

      {/* Icon Container */}
      <div className="relative mb-4 z-10">
        <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} transition-all duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className="font-heading text-xl font-bold text-white mb-2 uppercase tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-electric-400 group-hover:to-magenta-400 transition-all duration-300 z-10">
        {title}
      </h3>
      <p className="text-steel-400 text-sm flex-grow leading-relaxed group-hover:text-steel-300 transition-colors duration-300 z-10">
        {description}
      </p>

      {/* Action Indicator */}
      <div className={`mt-4 flex items-center text-xs font-heading font-semibold uppercase tracking-wider ${iconColor} transition-colors duration-300 z-10`}>
        <span>Launch</span>
        <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>

      {/* Corner accent */}
      <div className={`absolute bottom-0 right-0 w-16 h-16 ${accentColor === 'cyan' ? 'bg-electric-500/10' : 'bg-magenta-500/10'} blur-2xl rounded-full translate-x-1/2 translate-y-1/2 group-hover:scale-150 transition-transform duration-500`} />
    </button>
  );
};


const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12 relative pt-8">
        {/* Background glow effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-electric-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-magenta-500/10 rounded-full blur-3xl" />
        </div>

        {/* Main headline */}
        <h2 className="font-display text-5xl md:text-7xl tracking-wider mb-4 uppercase">
          <span className="text-white dark:text-white neon-text-cyan">CREATE</span>
        </h2>

        <p className="text-lg text-steel-400 dark:text-steel-400 max-w-2xl mx-auto leading-relaxed mb-8 font-sans">
          Choose your creative path. Generate designs, preview on your skin, remove old ink, or design a cover-up.
        </p>

        {/* Feature tags */}
        <div className="flex flex-wrap justify-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-electric-500/10 text-electric-400 font-heading uppercase tracking-wider border border-electric-500/20">
            AI-Powered
          </span>
          <span className="px-3 py-1.5 rounded-full bg-magenta-500/10 text-magenta-400 font-heading uppercase tracking-wider border border-magenta-500/20">
            Realistic
          </span>
          <span className="px-3 py-1.5 rounded-full bg-void-700 text-steel-300 font-heading uppercase tracking-wider border border-void-600">
            45+ Styles
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl mb-8">
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <DashboardCard
            icon={<CameraIcon />}
            title="Tattoo Try-On"
            description="Upload a photo and see a realistic preview of your tattoo on your own skin."
            onClick={() => onNavigate('tryOn')}
            delay={100}
            accentColor="cyan"
            number="01"
          />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <DashboardCard
            icon={<SparklesIcon />}
            title="Idea Generator"
            description="Describe your vision and let AI create unique tattoo designs from scratch."
            onClick={() => onNavigate('generator')}
            delay={200}
            accentColor="magenta"
            number="02"
          />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <DashboardCard
            icon={<EraserIcon />}
            title="Tattoo Removal"
            description="Preview what your skin would look like without a specific tattoo."
            onClick={() => onNavigate('removal')}
            delay={300}
            accentColor="cyan"
            number="03"
          />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <DashboardCard
            icon={<PaletteIcon />}
            title="Cover-Up Designer"
            description="Transform old tattoos into something new with AI-designed cover-ups."
            onClick={() => onNavigate('coverup')}
            delay={400}
            accentColor="magenta"
            number="04"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;