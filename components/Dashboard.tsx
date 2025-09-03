import React from 'react';
import type { View } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { CameraIcon } from './icons/CameraIcon';
import { EraserIcon } from './icons/EraserIcon';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const DashboardCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-slate-100 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all duration-300 text-left w-full h-full flex flex-col group"
  >
    <div className="mb-4 text-rose-500">{icon}</div>
    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 flex-grow">{description}</p>
    <div className="mt-4 text-sm font-semibold text-rose-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-indigo-600 transition-colors">
      Get Started &rarr;
    </div>
  </button>
);


const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-2 text-slate-900 dark:text-white">Unleash Your Inner Ink</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Visualize your next tattoo like never before. Use AI to try on designs, create new concepts, or even see what you'd look like without old ink.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <DashboardCard
          icon={<CameraIcon />}
          title="Tattoo Try-On"
          description="Upload a photo of yourself and describe your ideal tattoo. See a realistic preview on your own skin in seconds."
          onClick={() => onNavigate('tryOn')}
        />
        <DashboardCard
          icon={<SparklesIcon />}
          title="Idea Generator"
          description="Don't have a design yet? Describe your concept, style, and elements to generate unique, custom tattoo art from scratch."
          onClick={() => onNavigate('generator')}
        />
        <DashboardCard
          icon={<EraserIcon />}
          title="Tattoo Removal"
          description="Curious about a cover-up or removal? Upload a photo of your existing tattoo and let AI show you a glimpse of a clean slate."
          onClick={() => onNavigate('removal')}
        />
      </div>
    </div>
  );
};

export default Dashboard;