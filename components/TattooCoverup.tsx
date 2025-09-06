import React, { useState, useCallback } from 'react';
import type { View, TattooStyle, TattooColor } from '../types';
import { TATTOO_STYLES, TATTOO_COLORS, TATTOO_STYLE_DESCRIPTIONS } from '../constants';
import { editImage } from '../services/geminiService';
import { saveIdea } from '../services/tattooService';
import { canGenerate, consumeCredit } from '../services/creditService';
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
      // Consume credit before generation
      const creditResult = await consumeCredit();
      if (!creditResult.success) {
        setError("Failed to use credit. Please try again.");
        setIsLoading(false);
        return;
      }

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
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500">
            Tattoo Cover-Up
          </span>
          <br />
          <span className="text-slate-900 dark:text-white">Designer</span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          See how a new tattoo design could cover up an existing one.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <h3 className="text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">1. Your Current Tattoo</h3>
          <ImageUploader onImageReady={handleImageReady} />
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <h3 className="text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">2. Cover-Up Design</h3>
          <div className="space-y-6">
            {/* Existing Tattoo Description */}
            <div>
              <label htmlFor="existingTattooDescription" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Describe the existing tattoo to cover *
              </label>
              <textarea
                id="existingTattooDescription"
                value={existingTattooDescription}
                onChange={(e) => setExistingTattooDescription(e.target.value)}
                placeholder="e.g., The faded butterfly on my shoulder"
                className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 resize-none"
                rows={3}
                required
              />
            </div>

            {/* Cover-up Idea */}
            <div>
              <label htmlFor="coverupIdea" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                New cover-up tattoo idea *
              </label>
              <textarea
                id="coverupIdea"
                value={coverupIdea}
                onChange={(e) => setCoverupIdea(e.target.value)}
                placeholder="e.g., A large phoenix with spread wings to cover the butterfly"
                className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 resize-none"
                rows={3}
                required
              />
            </div>

            {/* Style and Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="coverupStyle" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cover-up Style</label>
                <select 
                  id="coverupStyle" 
                  value={coverupStyle} 
                  onChange={(e) => setCoverupStyle(e.target.value as TattooStyle)} 
                  className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  {TATTOO_STYLES.slice(0, 15).map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {TATTOO_STYLE_DESCRIPTIONS[coverupStyle]}
                </p>
              </div>
              
              <div>
                <label htmlFor="coverupColor" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Color</label>
                <select 
                  id="coverupColor" 
                  value={coverupColor} 
                  onChange={(e) => setCoverupColor(e.target.value as TattooColor)} 
                  className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600"
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
              className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 hover:from-blue-700 hover:via-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center group shadow-lg hover:shadow-xl hover:shadow-blue-500/25 disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                  <span>Creating Cover-up...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>🎨 Design Cover-up</span>
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
        loadingText="Creating your cover-up design... This can take a moment."
        initialText="Your cover-up tattoo preview will appear here."
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

export default TattooCoverup;