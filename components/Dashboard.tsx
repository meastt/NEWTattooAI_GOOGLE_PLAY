
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
    className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-emerald-500 hover:bg-gray-700/50 transition-all duration-300 text-left w-full h-full flex flex-col"
  >
    <div className="mb-4 text-emerald-400">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-400 flex-grow">{description}</p>
  </button>
);


const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-2 text-white">Unleash Your Inner Ink</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
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
