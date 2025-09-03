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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-2 text-white">Inspiration Gallery</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Discover unique designs to spark your next tattoo idea.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="masonry-container">
          {ideas.map((idea) => (
            <div key={idea.id} className="masonry-item mb-4">
              <img 
                src={idea.image_url} 
                alt={idea.prompt} 
                className="rounded-lg w-full h-auto block transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
      <style>{`
        .masonry-container {
          column-count: 2;
          column-gap: 1rem;
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
        }
      `}</style>
    </div>
  );
};

export default Home;
