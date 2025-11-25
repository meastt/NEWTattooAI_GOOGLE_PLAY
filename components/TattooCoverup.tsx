import React, { useState, useCallback } from 'react';
import type { View, TattooStyle, TattooColor } from '../types';
import { TATTOO_STYLES, TATTOO_COLORS, TATTOO_STYLE_DESCRIPTIONS } from '../constants';
import { editImage } from '../services/geminiService';
import { saveIdea } from '../services/tattooService';
import { canGenerate } from '../services/creditService';
import ImageUploader from './ImageUploader';
import ResultDisplay from './ResultDisplay';

interface TattooCoverupProps {
  onNavigate: (view: View) => void;
  onUpgradeClick?: () => void;
}

const TattooCoverup: React.FC<TattooCoverupProps> = ({ onNavigate, onUpgradeClick }) => {
  const [userImage, setUserImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [existingTattooDescription, setExistingTattooDescription] = useState('');
  const [coverupIdea, setCoverupIdea] = useState('');
  const [coverupStyle, setCoverupStyle] = useState<TattooStyle>(TATTOO_STYLES[0]);
  const [coverupColor, setCoverupColor] = useState<TattooColor>(TATTOO_COLORS[1]);
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
    
    if (!userImage || !existingTattooDescription || !coverupIdea) {
      setError("Please upload an image, describe the existing tattoo, and your cover-up idea.");
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

    const generatedPrompt = `Using the provided image of a person, replace the existing tattoo described as "${existingTattooDescription}" with a new tattoo design. The new tattoo should be: ${coverupIdea}. The new tattoo style should be ${coverupStyle}, ${coverupColor}. Make sure the new tattoo completely covers and replaces the old tattoo in the same location. The result should look like a professional cover-up tattoo that strategically hides the original tattoo underneath.`;
    setPrompt(generatedPrompt);

    try {
      console.log('Starting tattoo cover-up with prompt:', generatedPrompt);
      const result = await editImage(userImage.base64, userImage.mimeType, generatedPrompt);
      console.log('Tattoo cover-up result:', result);
      
      if (result.imageUrl) {
        setResultImage(result.imageUrl);
      } else {
        setError("The AI could not create the cover-up design. Please try a different description or image.");
      }
    } catch (err) {
      console.error('Error in tattoo cover-up:', err);
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-electric-500/10 to-magenta-500/10 rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-gradient-to-r from-electric-500/10 to-magenta-500/10 border border-electric-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse" />
          <span className="text-xs font-heading uppercase tracking-wider text-electric-400">AI Cover-Up</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl tracking-wider uppercase mb-3">
          <span className="text-white neon-text-cyan">COVER-UP</span>
          <span className="text-magenta-400"> DESIGNER</span>
        </h1>
        <p className="text-lg text-steel-400 max-w-xl mx-auto leading-relaxed">
          Visualize new designs that cover your existing tattoo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo Upload Card */}
        <div className="bg-void-900/80 backdrop-blur-sm p-6 rounded-2xl border border-void-700">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-void-700">
            <span className="font-display text-2xl text-electric-500/50">01</span>
            <h3 className="font-heading text-lg uppercase tracking-wider text-white">Current Tattoo</h3>
          </div>
          <ImageUploader onImageReady={handleImageReady} />
        </div>

        {/* Cover-up Form Card */}
        <form onSubmit={handleSubmit} className="bg-void-900/80 backdrop-blur-sm p-6 rounded-2xl border border-void-700">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-void-700">
            <span className="font-display text-2xl text-magenta-500/50">02</span>
            <h3 className="font-heading text-lg uppercase tracking-wider text-white">Cover-Up Design</h3>
          </div>
          <div className="space-y-5">
            {/* Existing Tattoo Description */}
            <div>
              <label htmlFor="existingTattooDescription" className="block font-heading text-sm uppercase tracking-wider text-steel-300 mb-2">
                Existing tattoo description *
              </label>
              <textarea
                id="existingTattooDescription"
                value={existingTattooDescription}
                onChange={(e) => setExistingTattooDescription(e.target.value)}
                placeholder="e.g., The faded butterfly on my shoulder"
                className="w-full bg-void-800 border border-void-600 rounded-xl p-4 text-white placeholder-steel-500 focus:outline-none focus:border-electric-500/50 transition-all duration-300 resize-none"
                rows={3}
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

            {/* Cover-up Idea */}
            <div>
              <label htmlFor="coverupIdea" className="block font-heading text-sm uppercase tracking-wider text-steel-300 mb-2">
                New cover-up idea *
              </label>
              <textarea
                id="coverupIdea"
                value={coverupIdea}
                onChange={(e) => setCoverupIdea(e.target.value)}
                placeholder="e.g., A large phoenix with spread wings"
                className="w-full bg-void-800 border border-void-600 rounded-xl p-4 text-white placeholder-steel-500 focus:outline-none focus:border-magenta-500/50 transition-all duration-300 resize-none"
                rows={3}
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

            {/* Style and Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="coverupStyle" className="block font-heading text-sm uppercase tracking-wider text-steel-300 mb-2">Style</label>
                <select
                  id="coverupStyle"
                  value={coverupStyle}
                  onChange={(e) => setCoverupStyle(e.target.value as TattooStyle)}
                  className="w-full bg-void-800 border border-void-600 rounded-xl p-3 text-white focus:outline-none focus:border-electric-500/50 transition-all duration-300"
                >
                  {TATTOO_STYLES.slice(0, 15).map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-steel-500 line-clamp-2">
                  {TATTOO_STYLE_DESCRIPTIONS[coverupStyle]}
                </p>
              </div>

              <div>
                <label htmlFor="coverupColor" className="block font-heading text-sm uppercase tracking-wider text-steel-300 mb-2">Color</label>
                <select
                  id="coverupColor"
                  value={coverupColor}
                  onChange={(e) => setCoverupColor(e.target.value as TattooColor)}
                  className="w-full bg-void-800 border border-void-600 rounded-xl p-3 text-white focus:outline-none focus:border-magenta-500/50 transition-all duration-300"
                >
                  {TATTOO_COLORS.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !userImage}
              className="w-full bg-gradient-to-r from-electric-500 to-magenta-500 hover:shadow-neon-dual text-white font-heading uppercase tracking-wider py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                  <span>Creating Cover-up...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <span>Design Cover-up</span>
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
        loadingText="Creating your cover-up design... This can take a moment."
        initialText="Your cover-up tattoo preview will appear here."
      />

      {(!isLoading && (resultImage || error)) && (
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('create')}
            className="inline-flex items-center gap-2 bg-void-800 border border-void-600 hover:border-electric-500/50 text-steel-300 hover:text-white font-heading uppercase tracking-wider text-sm py-3 px-6 rounded-xl transition-all duration-300"
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

export default TattooCoverup;