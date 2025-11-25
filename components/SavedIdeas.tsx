import React, { useState, useEffect } from 'react';
import { getSavedIdeas } from '../services/tattooService';
import type { View, Idea } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { ExportIcon } from './icons/ExportIcon';

interface SavedIdeasProps {
  onNavigate: (view: View) => void;
}

const SavedIdeas: React.FC<SavedIdeasProps> = ({ onNavigate }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setIsLoading(true);
        const savedIdeas = await getSavedIdeas();
        setIdeas(savedIdeas);
      } catch (err) {
        setError('Failed to fetch your saved ideas.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  const handleExportClick = async (idea: Idea) => {
    if (!idea.image_data_url) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(idea.image_data_url);
      const blob = await response.blob();
      
      // Create file from blob (use generic filename to avoid embedding prompt text)
      const file = new File([blob], `tattoo-design-inkpreview.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        // Use native share if available - share image only (no prompt/text)
        await navigator.share({ files: [file] });
      } else {
        // Fallback: download the image
        const link = document.createElement('a');
        link.href = idea.image_data_url;
        link.download = `tattoo-design-inkpreview.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Failed to export:', error);
      // Fallback to download
      const link = document.createElement('a');
      link.href = idea.image_data_url;
      link.download = `tattoo-design-inkpreview.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-electric-500/10 rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse" />
          <span className="text-xs font-heading uppercase tracking-wider text-electric-400">Collection</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl tracking-wider uppercase mb-3">
          <span className="text-white neon-text-cyan">SAVED IDEAS</span>
        </h1>
        <p className="text-lg text-steel-400 max-w-xl mx-auto leading-relaxed">
          Your personal archive of generated tattoo designs.
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="relative">
            <div className="w-14 h-14 border-2 border-void-600 rounded-full animate-spin border-t-electric-500"></div>
            <div className="absolute inset-0 w-14 h-14 border-2 border-transparent rounded-full animate-ping border-t-magenta-500/30"></div>
          </div>
          <p className="mt-4 text-steel-400 font-medium text-sm">Loading collection...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-6 rounded-xl bg-red-500/10 border border-red-500/30 max-w-md mx-auto">
          <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-red-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && ideas.length === 0 && (
        <div className="text-center p-10 bg-void-900/80 backdrop-blur-sm rounded-2xl border border-void-700 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-void-800 border border-void-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-steel-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="font-heading text-lg uppercase tracking-wider text-white mb-2">Empty Collection</p>
          <p className="text-steel-400 text-sm mb-6">Start creating designs to build your archive.</p>
          <button
            onClick={() => onNavigate('create')}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-electric-500 to-magenta-500 rounded-xl font-heading uppercase tracking-wider text-sm text-white hover:shadow-neon-dual transition-all duration-300 hover:scale-105 group"
          >
            <span>Start Creating</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      )}

      {!isLoading && !error && ideas.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {ideas.map((idea, index) => (
            <div
              key={idea.id}
              className="group relative bg-void-900 rounded-xl overflow-hidden border border-void-700 hover:border-electric-500/50 transition-all duration-300 hover:scale-[1.02] animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={idea.image_data_url}
                  alt={idea.prompt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
                <button
                  onClick={() => handleExportClick(idea)}
                  className="bg-electric-500/20 border border-electric-500/30 hover:border-electric-500/50 text-electric-400 hover:text-electric-300 font-heading uppercase tracking-wider text-xs py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 mb-2"
                >
                  <ExportIcon />
                  <span>Export</span>
                </button>
                <p className="text-steel-300 text-xs line-clamp-2 text-center">{idea.prompt}</p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-electric-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedIdeas;