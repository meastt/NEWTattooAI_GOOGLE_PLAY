import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { SaveIcon } from './icons/SaveIcon';
import { ExportIcon } from './icons/ExportIcon';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
  loadingText: string;
  initialText: string;
  prompt: string;
  onSave: (prompt: string, imageDataUrl: string) => Promise<void>;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  isLoading,
  error,
  resultImage,
  loadingText,
  initialText,
  prompt,
  onSave,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveClick = async () => {
    if (!resultImage) return;
    setIsSaving(true);
    setIsSaved(false);
    try {
      await onSave(prompt, resultImage);
      setIsSaved(true);
    } catch (error) {
      console.error("Failed to save idea:", error);
      // Optionally show an error message to the user
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportClick = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    const fileName = prompt.substring(0, 30).replace(/\s+/g, '_').toLowerCase() || 'tattoo-idea';
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-12 animate-slide-up">
      <h3 className="text-3xl font-display font-bold text-center mb-8">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-600 to-neon-500">
          Your Design
        </span>
      </h3>
      
      <div className="w-full min-h-[30rem] bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center p-8 shadow-xl">
        {isLoading && (
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-ink-200 dark:border-ink-800 rounded-full animate-spin border-t-ink-500 dark:border-t-ink-400"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-neon-500/30"></div>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-300 font-medium">{loadingText}</p>
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
        
        {!isLoading && !error && resultImage && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <img 
                src={resultImage} 
                alt="Generated tattoo result" 
                className="max-w-full max-h-[40rem] rounded-2xl object-contain shadow-2xl group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
              <button
                onClick={handleSaveClick}
                disabled={isSaving || isSaved}
                className="bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500 hover:from-ink-700 hover:via-ink-600 hover:to-neon-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center gap-3 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-ink-500/25 disabled:shadow-none group"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                ) : (
                  <SaveIcon />
                )}
                <span>{isSaved ? 'Saved!' : isSaving ? 'Saving...' : 'Save Idea'}</span>
              </button>
              
              <button
                onClick={handleExportClick}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl group"
              >
                <ExportIcon />
                <span>Export Image</span>
              </button>
            </div>
          </div>
        )}
        
        {!isLoading && !error && !resultImage && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-ink-100 to-neon-100 dark:from-ink-900 dark:to-neon-900 flex items-center justify-center">
              <svg className="w-10 h-10 text-ink-500 dark:text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">{initialText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;