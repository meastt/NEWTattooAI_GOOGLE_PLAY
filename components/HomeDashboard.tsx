import React from 'react';
import type { View } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { EraserIcon } from './icons/EraserIcon';
import { PaletteIcon } from './icons/PaletteIcon';

interface HomeDashboardProps {
  onNavigate: (view: View) => void;
}

const ToolCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  delay?: number;
}> = ({ icon, title, description, onClick, delay = 0 }) => {
  return (
    <div 
      className="animate-slide-up cursor-pointer group"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-slate-200 dark:border-slate-700 h-full">
        <div className="flex flex-col items-center text-center h-full">
          <div className="w-16 h-16 bg-gradient-to-br from-ink-500 to-neon-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-grow">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in">
      {/* Quick Onboarding Card */}
      <div className="bg-gradient-to-r from-ink-500 to-neon-500 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <SparklesIcon />
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-bold mb-2">Welcome to InkPreview</h2>
            <p className="text-white/90 leading-relaxed mb-4">
              Transform your tattoo ideas into reality with AI-powered tools. Choose from our four powerful features below to get started.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">AI-Powered</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Realistic Previews</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Multiple Styles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ToolCard
          icon={<CameraIcon />}
          title="Tattoo Try-On"
          description="Upload a photo of yourself and describe your ideal tattoo. See a realistic preview on your own skin in seconds."
          onClick={() => onNavigate('tryOn')}
          delay={100}
        />
        
        <ToolCard
          icon={<SparklesIcon />}
          title="Idea Generator"
          description="Don't have a design yet? Describe your concept, style, and elements to generate unique, custom tattoo art from scratch."
          onClick={() => onNavigate('generator')}
          delay={200}
        />
        
        <ToolCard
          icon={<EraserIcon />}
          title="Tattoo Removal"
          description="See a preview of your skin without a specific tattoo. Perfect for visualizing a clean slate before making decisions."
          onClick={() => onNavigate('removal')}
          delay={300}
        />
        
        <ToolCard
          icon={<PaletteIcon />}
          title="Cover-Up Designer"
          description="Transform an old tattoo into something new. Upload your current tattoo and design a beautiful cover-up over it."
          onClick={() => onNavigate('coverup')}
          delay={400}
        />
      </div>

      {/* Quick Stats or Tips */}
      <div className="mt-8 bg-slate-100 dark:bg-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 text-center">
          💡 Quick Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-300">
          <div className="text-center">
            <div className="font-medium text-slate-900 dark:text-white mb-1">Best Photos</div>
            <div>Use well-lit, clear photos for best results</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-slate-900 dark:text-white mb-1">Detailed Descriptions</div>
            <div>Be specific about style, size, and placement</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-slate-900 dark:text-white mb-1">Save Your Ideas</div>
            <div>Keep your favorite designs in "My Ideas"</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
