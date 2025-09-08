import React, { useState, useCallback } from 'react';
import type { View, TattooStyle, TattooColor, TattooSize } from '../types';
import { TATTOO_STYLES, TATTOO_COLORS, TATTOO_SIZES, TATTOO_SIZE_DESCRIPTIONS, TATTOO_STYLE_DESCRIPTIONS } from '../constants';
import { generateSizedPrompt } from '../utils/tattooSizing';
import { editImage } from '../services/geminiService';
import { saveIdea } from '../services/tattooService';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import ResultDisplay from './ResultDisplay';

interface TattooTryOnProps {
  onNavigate: (view: View) => void;
  onUpgradeClick?: () => void;
}

const TattooTryOn: React.FC<TattooTryOnProps> = ({ onNavigate, onUpgradeClick }) => {
  const [userImage, setUserImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState<TattooStyle>(TATTOO_STYLES[0]);
  const [bodyPart, setBodyPart] = useState('');
  const [color, setColor] = useState<TattooColor>(TATTOO_COLORS[0]);
  const [size, setSize] = useState<TattooSize>(TATTOO_SIZES[1]); // Default to 'Small'
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
    if (!userImage || !subject || !bodyPart) {
      setError("Please upload an image and fill out all required fields.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResultImage(null);

    const generatedPrompt = generateSizedPrompt(subject, style, bodyPart, color, size);
    setPrompt(generatedPrompt);

    try {
      const result = await editImage(userImage.base64, userImage.mimeType, generatedPrompt);
      if (result.imageUrl) {
        setResultImage(result.imageUrl);
      } else {
        setError("The AI could not generate an image. Please try a different prompt or image.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (prompt: string, imageDataUrl: string) => {
    await saveIdea({ prompt, imageDataUrl });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in" style={{ overflowX: 'hidden', maxWidth: '100%' }}>
      {/* Header */}
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-ink-500/10 to-neon-500/10 rounded-full blur-3xl" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500">
            Tattoo Try-On
          </span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          See your tattoo idea on your skin before the needle ever touches it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <h3 className="text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">1. Your Photo</h3>
          <ImageUploader onImageReady={handleImageReady} />
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <h3 className="text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">2. Your Tattoo Idea</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tattoo Subject *</label>
              <textarea
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., A majestic lion with a crown"
                className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-ink-500 focus:border-ink-500 dark:focus:border-ink-400 transition-all duration-300 hover:border-ink-300 dark:hover:border-ink-600 resize-none"
                rows={3}
                required
              />
            </div>
            <div>
              <label htmlFor="bodyPart" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Body Part *</label>
              <input
                type="text"
                id="bodyPart"
                value={bodyPart}
                onChange={(e) => setBodyPart(e.target.value)}
                placeholder="e.g., Left forearm"
                className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-ink-500 focus:border-ink-500 dark:focus:border-ink-400 transition-all duration-300 hover:border-ink-300 dark:hover:border-ink-600"
                required
              />
            </div>
            <div>
              <label htmlFor="size" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Size *</label>
              <select 
                id="size" 
                value={size} 
                onChange={(e) => setSize(e.target.value as TattooSize)} 
                className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-ink-500 focus:border-ink-500 dark:focus:border-ink-400 transition-all duration-300 hover:border-ink-300 dark:hover:border-ink-600"
                required
              >
                {TATTOO_SIZES.map(s => (
                  <option key={s} value={s}>
                    {s} - {TATTOO_SIZE_DESCRIPTIONS[s]}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Choose the size relative to your body part. For your ankle example, "Small" would be perfect for a 2-4 inch running shoe design.
              </p>
            </div>
             <div>
              <label htmlFor="style" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Style</label>
              <select 
                id="style" 
                value={style} 
                onChange={(e) => setStyle(e.target.value as TattooStyle)} 
                className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-ink-500 focus:border-ink-500 dark:focus:border-ink-400 transition-all duration-300 hover:border-ink-300 dark:hover:border-ink-600"
              >
                <optgroup label="Traditional & Classic">
                  <option value="American Traditional">American Traditional</option>
                  <option value="Japanese Irezumi">Japanese Irezumi</option>
                  <option value="Neo-Traditional">Neo-Traditional</option>
                  <option value="Traditional Sailor">Traditional Sailor</option>
                </optgroup>
                
                <optgroup label="Modern & Contemporary">
                  <option value="Fine Line">Fine Line</option>
                  <option value="Minimalist">Minimalist</option>
                  <option value="Geometric">Geometric</option>
                  <option value="Abstract">Abstract</option>
                  <option value="Watercolor">Watercolor</option>
                  <option value="Sketch Style">Sketch Style</option>
                </optgroup>
                
                <optgroup label="Black & Bold">
                  <option value="Blackwork">Blackwork</option>
                  <option value="Tribal">Tribal</option>
                  <option value="Dotwork">Dotwork</option>
                  <option value="Ornamental">Ornamental</option>
                  <option value="Mandala">Mandala</option>
                </optgroup>
                
                <optgroup label="Realistic & Portrait">
                  <option value="Realism">Realism</option>
                  <option value="Photorealism">Photorealism</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Biomechanical">Biomechanical</option>
                </optgroup>
                
                <optgroup label="Text & Lettering">
                  <option value="Script/Cursive">Script/Cursive</option>
                  <option value="Old English">Old English</option>
                  <option value="Sans Serif">Sans Serif</option>
                  <option value="Serif/Roman">Serif/Roman</option>
                  <option value="Calligraphy">Calligraphy</option>
                  <option value="Gothic Lettering">Gothic Lettering</option>
                  <option value="Graffiti Style">Graffiti Style</option>
                  <option value="Hand Lettered">Hand Lettered</option>
                </optgroup>
                
                <optgroup label="Cultural & Spiritual">
                  <option value="Celtic">Celtic</option>
                  <option value="Norse/Viking">Norse/Viking</option>
                  <option value="Polynesian">Polynesian</option>
                  <option value="Aztec/Mayan">Aztec/Mayan</option>
                  <option value="Hindu/Buddhist">Hindu/Buddhist</option>
                  <option value="Chinese">Chinese</option>
                </optgroup>
                
                <optgroup label="Artistic & Unique">
                  <option value="Surrealism">Surrealism</option>
                  <option value="Pop Art">Pop Art</option>
                  <option value="Comic Book">Comic Book</option>
                  <option value="Gothic">Gothic</option>
                  <option value="Art Nouveau">Art Nouveau</option>
                  <option value="Chicano">Chicano</option>
                </optgroup>
                
                <optgroup label="Fun & Playful">
                  <option value="Cartoon">Cartoon</option>
                  <option value="Anime/Manga">Anime/Manga</option>
                  <option value="Retro/Vintage">Retro/Vintage</option>
                  <option value="Pin-Up">Pin-Up</option>
                  <option value="Kawaii/Cute">Kawaii/Cute</option>
                </optgroup>
              </select>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {TATTOO_STYLE_DESCRIPTIONS[style]}
              </p>
            </div>
            <div>
              <label htmlFor="color" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Color</label>
              <select id="color" value={color} onChange={(e) => setColor(e.target.value as TattooColor)} className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-ink-500 focus:border-ink-500 dark:focus:border-ink-400 transition-all duration-300 hover:border-ink-300 dark:hover:border-ink-600">
                {TATTOO_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !userImage}
              className="w-full bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500 hover:from-ink-700 hover:via-ink-600 hover:to-neon-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center group shadow-lg hover:shadow-xl hover:shadow-ink-500/25 disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                  <span>Visualizing Tattoo...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Visualize Tattoo</span>
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
        loadingText="Applying your virtual tattoo... This can take a moment."
        initialText="Your virtual tattoo preview will appear here."
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

export default TattooTryOn;