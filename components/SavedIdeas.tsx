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
      
      // Create file from blob
      const fileName = idea.prompt.substring(0, 30).replace(/\s+/g, '_').toLowerCase() || 'saved-idea';
      const file = new File([blob], `${fileName}.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        // Use native share if available
        await navigator.share({
          files: [file],
          title: 'My Tattoo Design from InkPreview',
          text: `Check out this tattoo design: ${idea.prompt}`
        });
      } else {
        // Fallback: download the image
        const link = document.createElement('a');
        link.href = idea.image_data_url;
        link.download = `${fileName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Failed to export:', error);
      // Fallback to download
      const link = document.createElement('a');
      link.href = idea.image_data_url;
      const fileName = idea.prompt.substring(0, 30).replace(/\s+/g, '_').toLowerCase() || 'saved-idea';
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-ink-500/10 to-neon-500/10 rounded-full blur-3xl" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500">
            My Saved
          </span>
          <br />
          <span className="text-slate-900 dark:text-white">Ideas</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Your personal collection of generated tattoo concepts. Each design tells a story.
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-ink-200 dark:border-ink-800 rounded-full animate-spin border-t-ink-500 dark:border-t-ink-400"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-neon-500/30"></div>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">Loading your ideas...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-8 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium text-lg">{error}</p>
        </div>
      )}

      {!isLoading && !error && ideas.length === 0 && (
        <div className="text-center p-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-ink-100 to-neon-100 dark:from-ink-900 dark:to-neon-900 flex items-center justify-center">
            <svg className="w-10 h-10 text-ink-500 dark:text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">No saved ideas yet</p>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">Start creating amazing tattoo designs to build your collection.</p>
          <button 
            onClick={() => onNavigate('create')}
            className="bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500 hover:from-ink-700 hover:via-ink-600 hover:to-neon-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-ink-500/25 group"
          >
            <div className="flex items-center space-x-2">
              <span>Start Creating</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
        </div>
      )}

      {!isLoading && !error && ideas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ideas.map((idea, index) => (
            <div 
              key={idea.id} 
              className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={idea.image_data_url}
                alt={idea.prompt}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <button
                    onClick={() => handleExportClick(idea)}
                    className="bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500 hover:from-ink-700 hover:via-ink-600 hover:to-neon-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl group"
                >
                    <ExportIcon />
                    <span>Export</span>
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-medium line-clamp-2">{idea.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedIdeas;