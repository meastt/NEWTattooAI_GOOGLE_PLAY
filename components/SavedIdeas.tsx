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
        <h1 className="text-4xl font-extrabold mb-2 text-slate-900 dark:text-white">My Saved Ideas</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Your personal collection of generated tattoo concepts.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 bg-red-500/10 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && ideas.length === 0 && (
        <div className="text-center text-slate-500 bg-slate-100 dark:bg-slate-900 p-8 rounded-lg border border-slate-200 dark:border-slate-800">
          <p className="text-xl mb-4">You haven't saved any ideas yet.</p>
          <button 
            onClick={() => onNavigate('create')}
            className="bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Start Creating
          </button>
        </div>
      )}

      {!isLoading && !error && ideas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ideas.map((idea) => (
            <div key={idea.id} className="group relative bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
              <img
                src={idea.image_data_url}
                alt={idea.prompt}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <button
                    onClick={() => handleExportClick(idea)}
                    className="bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
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