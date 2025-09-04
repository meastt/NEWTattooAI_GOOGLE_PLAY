import React, { useState, useEffect } from 'react';
import { getGalleryIdeas } from '../services/tattooService';
import type { Idea } from '../types';
import LoadingSpinner from './LoadingSpinner';

const Home: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setIsLoading(true);
        const galleryIdeas = await getGalleryIdeas();
        if (galleryIdeas.length === 0) {
            setError('Could not load inspiration gallery. The database may be offline or empty.');
        } else {
            setIdeas(galleryIdeas);
        }
      } catch (err) {
        setError('Failed to fetch gallery ideas.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-ink-500/10 to-neon-500/10 rounded-full blur-3xl" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500">
            Inspiration
          </span>
          <br />
          <span className="text-slate-900 dark:text-white">Gallery</span>
        </h1>
        
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
          Discover unique designs crafted by AI to spark your next tattoo idea. 
          Each piece is a masterpiece waiting to become part of your story.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800">AI Generated</span>
          <span className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800">Unique Designs</span>
          <span className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800">Multiple Styles</span>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-ink-200 dark:border-ink-800 rounded-full animate-spin border-t-ink-500 dark:border-t-ink-400"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-neon-500/30"></div>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">Loading inspiration...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-8 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="masonry-container">
          {ideas.map((idea, index) => (
            <div 
              key={idea.id} 
              className="masonry-item mb-6 group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                <img 
                  src={idea.image_url} 
                  alt={idea.prompt} 
                  className="w-full h-auto block transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-medium line-clamp-2">{idea.prompt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style>{`
        .masonry-container {
          column-count: 1;
          column-gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .masonry-container {
            column-count: 2;
          }
        }
        @media (min-width: 768px) {
          .masonry-container {
            column-count: 3;
          }
        }
        @media (min-width: 1024px) {
          .masonry-container {
            column-count: 4;
          }
        }
        .masonry-item {
          break-inside: avoid;
          animation: slideUp 0.6s ease-out both;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Home;