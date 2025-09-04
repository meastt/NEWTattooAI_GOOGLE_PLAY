import React, { useState, useEffect } from 'react';
import { getGalleryIdeas } from '../services/tattooService';
import type { Idea } from '../types';
import LoadingSpinner from './LoadingSpinner';

const Home: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duplicatedIdeas, setDuplicatedIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setIsLoading(true);
        const galleryIdeas = await getGalleryIdeas();
        if (galleryIdeas.length === 0) {
            setError('Could not load inspiration gallery. The database may be offline or empty.');
        } else {
            setIdeas(galleryIdeas);
            // Create multiple copies for continuous scrolling
            const multipliedIdeas = [];
            for (let i = 0; i < 3; i++) {
              multipliedIdeas.push(...galleryIdeas.map((idea, index) => ({ 
                ...idea, 
                id: `${idea.id}_${i}_${index}` 
              })));
            }
            setDuplicatedIdeas(multipliedIdeas);
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
        <div className="waterfall-container overflow-hidden">
          {/* Column 1 */}
          <div className="waterfall-column waterfall-column-1">
            <div className="waterfall-scroll">
              {duplicatedIdeas.filter((_, index) => index % 3 === 0).map((idea, index) => (
                <div 
                  key={`col1-${idea.id}`} 
                  className="waterfall-item"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg mb-4">
                    <img 
                      src={idea.image_url} 
                      alt={idea.prompt} 
                      className="w-full h-auto block object-cover"
                      loading="lazy"
                      style={{ maxHeight: '200px', minHeight: '120px' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-xs font-medium line-clamp-2 drop-shadow-sm">
                        {idea.prompt.substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div className="waterfall-column waterfall-column-2">
            <div className="waterfall-scroll">
              {duplicatedIdeas.filter((_, index) => index % 3 === 1).map((idea, index) => (
                <div 
                  key={`col2-${idea.id}`} 
                  className="waterfall-item"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg mb-4">
                    <img 
                      src={idea.image_url} 
                      alt={idea.prompt} 
                      className="w-full h-auto block object-cover"
                      loading="lazy"
                      style={{ maxHeight: '180px', minHeight: '140px' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-xs font-medium line-clamp-2 drop-shadow-sm">
                        {idea.prompt.substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 */}
          <div className="waterfall-column waterfall-column-3">
            <div className="waterfall-scroll">
              {duplicatedIdeas.filter((_, index) => index % 3 === 2).map((idea, index) => (
                <div 
                  key={`col3-${idea.id}`} 
                  className="waterfall-item"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg mb-4">
                    <img 
                      src={idea.image_url} 
                      alt={idea.prompt} 
                      className="w-full h-auto block object-cover"
                      loading="lazy"
                      style={{ maxHeight: '220px', minHeight: '100px' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-xs font-medium line-clamp-2 drop-shadow-sm">
                        {idea.prompt.substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .waterfall-container {
          display: flex;
          gap: 1rem;
          height: 70vh;
          mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
        }

        .waterfall-column {
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        .waterfall-scroll {
          animation-iteration-count: infinite;
          animation-timing-function: linear;
          animation-fill-mode: none;
        }

        .waterfall-column-1 .waterfall-scroll {
          animation-name: scrollUp;
          animation-duration: 180s;
        }

        .waterfall-column-2 .waterfall-scroll {
          animation-name: scrollUp;
          animation-duration: 150s;
          animation-delay: -40s;
        }

        .waterfall-column-3 .waterfall-scroll {
          animation-name: scrollUp;
          animation-duration: 200s;
          animation-delay: -100s;
        }

        @keyframes scrollUp {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(-100%);
          }
        }

        .waterfall-item {
          margin-bottom: 1rem;
          animation: fadeInScale 0.6s ease-out both;
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .waterfall-container {
            height: 60vh;
            gap: 0.75rem;
          }
          .waterfall-column-1 .waterfall-scroll {
            animation-duration: 160s;
          }
          .waterfall-column-2 .waterfall-scroll {
            animation-duration: 130s;
          }
          .waterfall-column-3 .waterfall-scroll {
            animation-duration: 180s;
          }
        }

        /* Hover pause effect */
        .waterfall-container:hover .waterfall-scroll {
          animation-play-state: paused;
        }

        /* Smooth gradient masks for better visual flow */
        .waterfall-column::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, transparent 100%);
          z-index: 10;
          pointer-events: none;
        }

        .dark .waterfall-column::before {
          background: linear-gradient(to bottom, rgba(15,23,42,0.8) 0%, transparent 100%);
        }

        .waterfall-column::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(to top, rgba(255,255,255,0.8) 0%, transparent 100%);
          z-index: 10;
          pointer-events: none;
        }

        .dark .waterfall-column::after {
          background: linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 100%);
        }
      `}</style>
    </div>
  );
};

export default Home;