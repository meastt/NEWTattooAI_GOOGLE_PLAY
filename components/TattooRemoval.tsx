import React, { useState, useCallback } from 'react';
import type { View, TattooStyle, TattooColor } from '../types';
import { TATTOO_STYLES, TATTOO_COLORS, TATTOO_STYLE_DESCRIPTIONS } from '../constants';
import { editImage } from '../services/geminiService';
import { saveIdea } from '../services/tattooService';
import { canGenerate, consumeCredit } from '../services/creditService';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import ResultDisplay from './ResultDisplay';

interface TattooRemovalProps {
  onNavigate: (view: View) => void;
  onUpgradeClick?: () => void;
}

const TattooRemoval: React.FC<TattooRemovalProps> = ({ onNavigate, onUpgradeClick }) => {
  const [userImage, setUserImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [actionType, setActionType] = useState<'remove' | 'coverup'>('remove');
  const [removalDescription, setRemovalDescription] = useState('');
  
  // Cover-up specific fields
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
    
    if (!userImage || !removalDescription) {
      setError("Please upload an image and describe the existing tattoo.");
      return;
    }
    
    if (actionType === 'coverup' && !coverupIdea) {
      setError("Please describe your cover-up tattoo idea.");
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

    let generatedPrompt = '';
    
    if (actionType === 'remove') {
      generatedPrompt = `Using the provided image of a person, realistically remove the tattoo described as: "${removalDescription}". Heal the skin where the tattoo was, making it look natural and as if the tattoo was never there. Do not add any new tattoos or markings.`;
    } else {
      generatedPrompt = `Using the provided image of a person, replace the existing tattoo described as "${removalDescription}" with a new tattoo design. The new tattoo should be: ${coverupIdea}. The new tattoo style should be ${coverupStyle}, ${coverupColor}. Make sure the new tattoo completely covers and replaces the old tattoo in the same location. The result should look like a professional cover-up tattoo.`;
    }
    
    setPrompt(generatedPrompt);

    try {
      // Consume credit before generation
      const creditResult = await consumeCredit();
      if (!creditResult.success) {
        setError("Failed to use credit. Please try again.");
        setIsLoading(false);
        return;
      }

      console.log('Starting image generation with prompt:', generatedPrompt);
      const result = await editImage(userImage.base64, userImage.mimeType, generatedPrompt);
      console.log('Image generation result:', result);
      
      if (result.imageUrl) {
        setResultImage(result.imageUrl);
      } else {
        setError("The AI could not generate an image. Please try a different prompt or image.");
      }
    } catch (err) {
      console.error('Error in tattoo removal/coverup:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (prompt: string, imageDataUrl: string) => {
    await saveIdea({ prompt, imageDataUrl });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-ink-500/10 to-neon-500/10 rounded-full blur-3xl" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500">
            Tattoo {actionType === 'remove' ? 'Removal' : 'Cover-Up'}
          </span>
          <br />
          <span className="text-slate-900 dark:text-white">Visualizer</span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {actionType === 'remove' 
            ? "See a preview of your skin without a specific tattoo."
            : "See how a new tattoo design could cover up an existing one."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <h3 className="text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">1. Your Photo with Tattoo</h3>
          <ImageUploader onImageReady={handleImageReady} />
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <h3 className="text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">2. What do you want to do?</h3>
          <div className="space-y-6">
            {/* Action Toggle */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Choose your option *</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setActionType('remove')}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                    actionType === 'remove'
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  🚫 I want it gone!
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('coverup')}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                    actionType === 'coverup'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  🎨 I want a cover-up
                </button>
              </div>
            </div>
            {/* Existing Tattoo Description */}
            <div>
              <label htmlFor="removalDescription" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Describe the existing tattoo and its location *
              </label>
              <textarea
                id="removalDescription"
                value={removalDescription}
                onChange={(e) => setRemovalDescription(e.target.value)}
                placeholder="e.g., The small rose tattoo on my right wrist"
                className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-ink-500 focus:border-ink-500 dark:focus:border-ink-400 transition-all duration-300 hover:border-ink-300 dark:hover:border-ink-600 resize-none"
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

            {/* Cover-up Fields - Only show when cover-up is selected */}
            {actionType === 'coverup' && (
              <>
                <div>
                  <label htmlFor="coverupIdea" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    New cover-up tattoo idea *
                  </label>
                  <textarea
                    id="coverupIdea"
                    value={coverupIdea}
                    onChange={(e) => setCoverupIdea(e.target.value)}
                    placeholder="e.g., A large phoenix rising from flames to cover the rose"
                    className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-ink-500 focus:border-ink-500 dark:focus:border-ink-400 transition-all duration-300 hover:border-ink-300 dark:hover:border-ink-600 resize-none"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="coverupStyle" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cover-up Style</label>
                    <select 
                      id="coverupStyle" 
                      value={coverupStyle} 
                      onChange={(e) => setCoverupStyle(e.target.value as TattooStyle)} 
                      className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-ink-500 focus:border-ink-500 dark:focus:border-ink-400 transition-all duration-300 hover:border-ink-300 dark:hover:border-ink-600"
                    >
                      {TATTOO_STYLES.slice(0, 10).map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="coverupColor" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Color</label>
                    <select 
                      id="coverupColor" 
                      value={coverupColor} 
                      onChange={(e) => setCoverupColor(e.target.value as TattooColor)} 
                      className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-ink-500 focus:border-ink-500 dark:focus:border-ink-400 transition-all duration-300 hover:border-ink-300 dark:hover:border-ink-600"
                    >
                      {TATTOO_COLORS.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}
            <button 
              type="submit" 
              disabled={isLoading || !userImage}
              className="w-full bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500 hover:from-ink-700 hover:via-ink-600 hover:to-neon-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center group shadow-lg hover:shadow-xl hover:shadow-ink-500/25 disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                  <span>{actionType === 'remove' ? 'Removing Tattoo...' : 'Creating Cover-up...'}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{actionType === 'remove' ? 'Visualize Removal' : 'Visualize Cover-up'}</span>
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
        loadingText={actionType === 'remove' 
          ? "Digitally removing your tattoo... This can take a moment."
          : "Creating your cover-up design... This can take a moment."
        }
        initialText={actionType === 'remove' 
          ? "Your tattoo removal preview will appear here."
          : "Your cover-up tattoo preview will appear here."
        }
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

export default TattooRemoval;