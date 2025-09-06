import React from 'react';
import type { View } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { CameraIcon } from './icons/CameraIcon';
import { EraserIcon } from './icons/EraserIcon';
import { PaletteIcon } from './icons/PaletteIcon';
import { ClockIcon } from './icons/ClockIcon';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const DashboardCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  delay?: number;
}> = ({ icon, title, description, onClick, delay = 0 }) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 hover:border-ink-300 dark:hover:border-ink-600 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 text-left w-full h-full flex flex-col hover:scale-105 hover:shadow-2xl hover:shadow-ink-500/10 dark:hover:shadow-ink-500/20"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Background Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-ink-50/50 via-transparent to-neon-50/50 dark:from-ink-950/30 dark:via-transparent dark:to-neon-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Icon Container */}
    <div className="relative mb-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ink-100 to-neon-100 dark:from-ink-900 dark:to-neon-900 flex items-center justify-center text-ink-600 dark:text-ink-400 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-ink-500 to-neon-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    
    {/* Content */}
    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-ink-600 group-hover:to-neon-600 transition-all duration-300">
      {title}
    </h3>
    <p className="text-slate-600 dark:text-slate-400 flex-grow leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
      {description}
    </p>
    
    {/* Action Indicator */}
    <div className="mt-6 flex items-center text-sm font-semibold text-ink-500 dark:text-ink-400 group-hover:text-ink-600 dark:group-hover:text-ink-300 transition-colors duration-300">
      <span>Get Started</span>
      <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </div>
    
    {/* Hover Effect Border */}
    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-ink-500 group-hover:to-neon-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </button>
);


const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-ink-500/10 to-neon-500/10 rounded-full blur-3xl" />
        </div>
        
        <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500">
            Unleash Your
          </span>
          <br />
          <span className="text-slate-900 dark:text-white">Inner Ink</span>
        </h2>
        
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
          Visualize your next tattoo like never before. Use AI to try on designs, create new concepts, 
          or even see what you'd look like without old ink. Your canvas awaits.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="px-4 py-2 rounded-full bg-ink-100 dark:bg-ink-900 text-ink-700 dark:text-ink-300 font-medium">
            AI-Powered
          </span>
          <span className="px-4 py-2 rounded-full bg-neon-100 dark:bg-neon-900 text-neon-700 dark:text-neon-300 font-medium">
            Realistic Preview
          </span>
          <span className="px-4 py-2 rounded-full bg-skin-100 dark:bg-skin-900 text-skin-700 dark:text-skin-300 font-medium">
            Multiple Styles
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <DashboardCard
            icon={<CameraIcon />}
            title="Tattoo Try-On"
            description="Upload a photo of yourself and describe your ideal tattoo. See a realistic preview on your own skin in seconds."
            onClick={() => onNavigate('tryOn')}
            delay={100}
          />
        </div>
        
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <DashboardCard
            icon={<SparklesIcon />}
            title="Idea Generator"
            description="Don't have a design yet? Describe your concept, style, and elements to generate unique, custom tattoo art from scratch."
            onClick={() => onNavigate('generator')}
            delay={200}
          />
        </div>
        
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <DashboardCard
            icon={<EraserIcon />}
            title="Tattoo Removal"
            description="See a preview of your skin without a specific tattoo. Perfect for visualizing a clean slate before making decisions."
            onClick={() => onNavigate('removal')}
            delay={300}
          />
        </div>
        
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <DashboardCard
            icon={<PaletteIcon />}
            title="Cover-Up Designer"
            description="Transform an old tattoo into something new. Upload your current tattoo and design a beautiful cover-up over it."
            onClick={() => onNavigate('coverup')}
            delay={400}
          />
        </div>
        
        <div className="animate-slide-up md:col-span-2 lg:col-span-1" style={{ animationDelay: '0.5s' }}>
          <DashboardCard
            icon={<ClockIcon />}
            title="Time Machine"
            description="See how your tattoo will look in 10, 20, or 30 years. Smart aging simulation based on style, skin type, and placement."
            onClick={() => onNavigate('aging')}
            delay={500}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;