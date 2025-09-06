import React, { useState, useCallback } from 'react';
import type { View } from '../types';
import { editImage } from '../services/geminiService';
import { saveIdea } from '../services/tattooService';
import { canGenerate, consumeCredit } from '../services/creditService';
import ImageUploader from './ImageUploader';
import ResultDisplay from './ResultDisplay';

interface TattooRemovalOnlyProps {
  onNavigate: (view: View) => void;
  onUpgradeClick?: () => void;
}

const TattooRemovalOnly: React.FC<TattooRemovalOnlyProps> = ({ onNavigate, onUpgradeClick }) => {
  const [userImage, setUserImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [removalDescription, setRemovalDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleImageReady = useCallback((base64: string, mimeType: string) => {
    setUserImage({ base64, mimeType });
    setResultImage(null);
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userImage || !removalDescription) {
      setError("Please upload an image and describe the tattoo to remove.");
      return;
    }

    // Check if user has credits
    if (!canGenerate()) {
      if (onUpgradeClick) {
        onUpgradeClick();
      }
      setError("You need credits to generate images. Please upgrade or wait for your credits to reset.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResultImage(null);

    const generatedPrompt = `Using the provided image of a person, realistically remove the tattoo described as: "${removalDescription}". Heal the skin where the tattoo was, making it look natural and as if the tattoo was never there. Do not add any new tattoos or markings. The result should show clean, natural skin in that area.`;
    setPrompt(generatedPrompt);

    try {
      // Consume credit before generation
      const creditResult = await consumeCredit();
      if (!creditResult.success) {
        setError("Failed to use credit. Please try again.");
        setIsLoading(false);
        return;
      }

      console.log('Starting tattoo removal with prompt:', generatedPrompt);
      const result = await editImage(userImage.base64, userImage.mimeType, generatedPrompt);
      console.log('Tattoo removal result:', result);
      
      if (result.imageUrl) {
        setResultImage(result.imageUrl);
      } else {
        setError("The AI could not remove the tattoo. Please try a different description or image.");
      }
    } catch (err) {
      console.error('Error in tattoo removal:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (prompt: string, imageDataUrl: string) => {
    await saveIdea({ prompt, imageDataUrl });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in" style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}>
      {/* Header */}
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
            Tattoo Removal
          </span>
          <br />
          <span className="text-slate-900 dark:text-white">Visualizer</span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          See a preview of your skin without a specific tattoo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <h3 className="text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">1. Your Photo with Tattoo</h3>
          <ImageUploader onImageReady={handleImageReady} />
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <h3 className="text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">2. Tattoo to Remove</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="removalDescription" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Describe the tattoo and its location *
              </label>
              <textarea
                id="removalDescription"
                value={removalDescription}
                onChange={(e) => setRemovalDescription(e.target.value)}
                placeholder="e.g., The small rose tattoo on my right wrist"
                className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:border-red-400 transition-all duration-300 hover:border-red-300 dark:hover:border-red-600 resize-none"
                rows={5}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !userImage}
              className="w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-700 hover:via-red-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center group shadow-lg hover:shadow-xl hover:shadow-red-500/25 disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                  <span>Removing Tattoo...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>🚫 Remove Tattoo</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      <ResultDisplay
        isLoading={isLoading}
        error={error}
        resultImage={resultImage}
        prompt={prompt}
        onSave={handleSave}
        onUpgradeClick={onUpgradeClick}
        loadingText="Digitally removing your tattoo... This can take a moment."
        initialText="Your tattoo removal preview will appear here."
      />

      {(!isLoading && (resultImage || error)) && (
        <div className="mt-6 text-center">
          <button 
            onClick={() => onNavigate('create')}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Create Hub
          </button>
        </div>
      )}
    </div>
  );
};

export default TattooRemovalOnly;