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

  const handleExportClick = (idea: Idea) => {
    if (!idea.image_data_url) return;
    const link = document.createElement('a');
    link.href = idea.image_data_url;
    const fileName = idea.prompt.substring(0, 30).replace(/\s+/g, '_').toLowerCase() || 'saved-idea';
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-2 text-white">My Saved Ideas</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Your personal collection of generated tattoo concepts.
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

      {!isLoading && !error && ideas.length === 0 && (
        <div className="text-center text-gray-400 bg-gray-800 p-8 rounded-lg">
          <p className="text-xl mb-4">You haven't saved any ideas yet.</p>
          <button 
            onClick={() => onNavigate('create')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Start Creating
          </button>
        </div>
      )}

      {!isLoading && !error && ideas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ideas.map((idea) => (
            <div key={idea.id} className="group relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              <img
                src={idea.image_data_url}
                alt={idea.prompt}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <button
                    onClick={() => handleExportClick(idea)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                    <ExportIcon />
                    Export
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedIdeas;
