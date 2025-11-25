import React, { useState, useCallback } from 'react';
import type { View } from '../types';
import { editImage } from '../services/geminiService';
import { saveIdea } from '../services/tattooService';
import { canGenerate } from '../services/creditService';
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
      <div className="text-center mb-10 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-magenta-500/10 rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-magenta-500/10 border border-magenta-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-magenta-400 animate-pulse" />
          <span className="text-xs font-heading uppercase tracking-wider text-magenta-400">AI Removal</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl tracking-wider uppercase mb-3">
          <span className="text-white neon-text-magenta">REMOVAL</span>
          <span className="text-magenta-400"> VISUALIZER</span>
        </h1>
        <p className="text-lg text-steel-400 max-w-xl mx-auto leading-relaxed">
          Preview your skin without a specific tattoo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo Upload Card */}
        <div className="bg-void-900/80 backdrop-blur-sm p-6 rounded-2xl border border-void-700">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-void-700">
            <span className="font-display text-2xl text-magenta-500/50">01</span>
            <h3 className="font-heading text-lg uppercase tracking-wider text-white">Your Photo</h3>
          </div>
          <ImageUploader onImageReady={handleImageReady} />
        </div>

        {/* Description Form Card */}
        <form onSubmit={handleSubmit} className="bg-void-900/80 backdrop-blur-sm p-6 rounded-2xl border border-void-700">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-void-700">
            <span className="font-display text-2xl text-magenta-500/50">02</span>
            <h3 className="font-heading text-lg uppercase tracking-wider text-white">Tattoo to Remove</h3>
          </div>
          <div className="space-y-5">
            <div>
              <label htmlFor="removalDescription" className="block font-heading text-sm uppercase tracking-wider text-steel-300 mb-2">
                Describe tattoo & location *
              </label>
              <textarea
                id="removalDescription"
                value={removalDescription}
                onChange={(e) => setRemovalDescription(e.target.value)}
                placeholder="e.g., The small rose tattoo on my right wrist"
                className="w-full bg-void-800 border border-void-600 rounded-xl p-4 text-white placeholder-steel-500 focus:outline-none focus:border-magenta-500/50 transition-all duration-300 resize-none"
                rows={5}
                required
                onFocus={() => {
                  setTimeout(() => {
                    const header = document.querySelector('header');
                    const nav = document.querySelector('nav');
                    if (header) header.style.transform = 'translateZ(0)';
                    if (nav) nav.style.transform = 'translateZ(0)';
                  }, 100);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    const header = document.querySelector('header');
                    const nav = document.querySelector('nav');
                    if (header) header.style.transform = 'translateZ(0)';
                    if (nav) nav.style.transform = 'translateZ(0)';
                  }, 100);
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !userImage}
              className="w-full bg-gradient-to-r from-magenta-500 to-magenta-600 hover:shadow-neon-magenta text-white font-heading uppercase tracking-wider py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                  <span>Removing Tattoo...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Remove Tattoo</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
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
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('create')}
            className="inline-flex items-center gap-2 bg-void-800 border border-void-600 hover:border-magenta-500/50 text-steel-300 hover:text-white font-heading uppercase tracking-wider text-sm py-3 px-6 rounded-xl transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Create Hub</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TattooRemovalOnly;