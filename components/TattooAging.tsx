import React, { useState, useCallback } from 'react';
import type { View, TattooStyle } from '../types';
import { TATTOO_STYLES, TATTOO_STYLE_DESCRIPTIONS } from '../constants';
import { editImage } from '../services/geminiService';
import { saveIdea } from '../services/tattooService';
import { canGenerate, consumeCredit } from '../services/creditService';
import ImageUploader from './ImageUploader';
import ResultDisplay from './ResultDisplay';

interface TattooAgingProps {
  onNavigate: (view: View) => void;
  onUpgradeClick?: () => void;
}

type AgingPeriod = '10' | '20' | '30';
type SkinType = 'fair' | 'medium' | 'dark';
type BodyLocation = 'face/neck' | 'hands' | 'arms' | 'chest/back' | 'legs' | 'protected';

const TattooAging: React.FC<TattooAgingProps> = ({ onNavigate, onUpgradeClick }) => {
  const [userImage, setUserImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [tattooDescription, setTattooDescription] = useState('');
  const [tattooStyle, setTattooStyle] = useState<TattooStyle>(TATTOO_STYLES[0]);
  const [agingPeriod, setAgingPeriod] = useState<AgingPeriod>('20');
  const [skinType, setSkinType] = useState<SkinType>('medium');
  const [bodyLocation, setBodyLocation] = useState<BodyLocation>('arms');
  const [prompt, setPrompt] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleImageReady = useCallback((base64: string, mimeType: string) => {
    setUserImage({ base64, mimeType });
    setResultImage(null);
    setError(null);
  }, []);

  const generateAgingPrompt = () => {
    // Base aging factors
    let agingFactors = [];
    let agingDescription = '';

    // Time-based aging
    const years = parseInt(agingPeriod);
    if (years >= 30) {
      agingFactors.push('severe fading with 60-70% color loss', 'heavy line blurring and spreading', 'significant ink bleeding', 'wrinkled and sagging skin texture');
      agingDescription = 'heavily deteriorated and barely recognizable';
    } else if (years >= 20) {
      agingFactors.push('major fading with 40-50% color loss', 'noticeable line spreading and softening', 'moderate ink bleeding', 'aged skin texture changes');
      agingDescription = 'significantly aged with major quality loss';
    } else {
      agingFactors.push('visible fading with 20-30% color loss', 'mild line softening and spread', 'early ink bleeding effects');
      agingDescription = 'noticeably aged with clear deterioration';
    }

    // Style-based aging
    const styleAgingMap: Record<string, string[]> = {
      'Fine Line': ['lines becoming extremely faint and barely visible', 'multiple line breaks and gaps', 'all delicate details completely lost', 'appearing ghost-like'],
      'Minimalist': ['simple lines heavily faded and widened', 'clean edges now soft and blurry', 'losing minimalist aesthetic'],
      'Watercolor': ['colors almost completely washed out', 'all edges extremely blurred beyond recognition', 'painterly effect totally gone', 'looks like water stains'],
      'American Traditional': ['bold lines somewhat holding but spread wider', 'colors significantly dulled but outlines visible', 'classic look compromised'],
      'Japanese Irezumi': ['outlines still present but thicker', 'traditional colors heavily muted', 'fine details in scales/waves lost'],
      'Blackwork': ['solid black areas showing gray patches', 'edges significantly softened', 'bold impact reduced'],
      'Tribal': ['thick lines spread and fuzzy', 'sharp points now rounded', 'pattern clarity diminished'],
      'Realism': ['fine details completely degraded into blobs', 'shading became muddy gray masses', 'realistic appearance lost'],
      'Photorealism': ['total detail destruction', 'photographic quality completely gone', 'unrecognizable as original subject']
    };

    if (styleAgingMap[tattooStyle]) {
      agingFactors.push(...styleAgingMap[tattooStyle]);
    }

    // Skin type factors
    const skinAgingMap: Record<SkinType, string[]> = {
      'fair': ['more visible fading due to sun damage', 'potential scarring more apparent'],
      'medium': ['moderate aging with balanced fading'],
      'dark': ['colors may appear muddy', 'white ink completely faded', 'better line preservation']
    };
    agingFactors.push(...skinAgingMap[skinType]);

    // Body location factors
    const locationAgingMap: Record<BodyLocation, string[]> = {
      'face/neck': ['severe sun damage and fading', 'skin texture changes affecting appearance'],
      'hands': ['extreme fading from washing and sun', 'design significantly degraded'],
      'arms': ['moderate sun exposure aging', 'some stretching from muscle changes'],
      'chest/back': ['protected from sun so better preservation', 'some stretching with age'],
      'legs': ['moderate aging', 'some stretching or sagging with age'],
      'protected': ['minimal environmental damage', 'best preservation of original design']
    };
    agingFactors.push(...locationAgingMap[bodyLocation]);

    return `Using the provided image, show how the tattoo described as "${tattooDescription}" would look after ${agingPeriod} years of aging. Apply realistic aging effects for a ${tattooStyle} style tattoo on ${skinType} skin in the ${bodyLocation} area. 

AGING EFFECTS TO APPLY:
${agingFactors.map(factor => `- ${factor}`).join('\n')}

The tattoo should appear ${agingDescription}. Show realistic skin aging, ink fading, line blurring, and color changes that would naturally occur over ${agingPeriod} years. Consider sun exposure, skin elasticity changes, and natural ink degradation. The result should be a realistic preview of how this specific tattoo would look after ${agingPeriod} years of normal aging and wear.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userImage || !tattooDescription) {
      setError("Please upload an image and describe the tattoo to age.");
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

    const generatedPrompt = generateAgingPrompt();
    setPrompt(generatedPrompt);

    try {
      // Consume credit before generation
      const creditResult = await consumeCredit();
      if (!creditResult.success) {
        setError("Failed to use credit. Please try again.");
        setIsLoading(false);
        return;
      }

      console.log('Starting tattoo aging simulation with prompt:', generatedPrompt);
      const result = await editImage(userImage.base64, userImage.mimeType, generatedPrompt);
      console.log('Tattoo aging result:', result);
      
      if (result.imageUrl) {
        setResultImage(result.imageUrl);
      } else {
        setError("The AI could not simulate the aging process. Please try different parameters.");
      }
    } catch (err) {
      console.error('Error in tattoo aging simulation:', err);
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-red-500">
            Tattoo Time Machine
          </span>
          <br />
          <span className="text-slate-900 dark:text-white">Aging Simulator</span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          See how your tattoo will look in 10, 20, or 30 years based on style, skin type, and location.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <h3 className="text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">1. Your Fresh Tattoo</h3>
          <ImageUploader onImageReady={handleImageReady} />
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <h3 className="text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">2. Aging Parameters</h3>
          <div className="space-y-6">
            {/* Tattoo Description */}
            <div>
              <label htmlFor="tattooDescription" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Describe the tattoo and its current appearance *
              </label>
              <textarea
                id="tattooDescription"
                value={tattooDescription}
                onChange={(e) => setTattooDescription(e.target.value)}
                placeholder="e.g., A detailed dragon tattoo with fine line work and red/black colors on my forearm"
                className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-600 resize-none"
                rows={3}
                required
              />
            </div>

            {/* Time Period */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Time Travel: How far into the future? *</label>
              <div className="grid grid-cols-3 gap-3">
                {(['10', '20', '30'] as AgingPeriod[]).map(period => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setAgingPeriod(period)}
                    className={`px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                      agingPeriod === period
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {period} Years
                  </button>
                ))}
              </div>
            </div>

            {/* Style and Factors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tattooStyle" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tattoo Style</label>
                <select 
                  id="tattooStyle" 
                  value={tattooStyle} 
                  onChange={(e) => setTattooStyle(e.target.value as TattooStyle)} 
                  className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-600"
                >
                  {TATTOO_STYLES.slice(0, 15).map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="skinType" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Skin Type</label>
                <select 
                  id="skinType" 
                  value={skinType} 
                  onChange={(e) => setSkinType(e.target.value as SkinType)} 
                  className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-600"
                >
                  <option value="fair">Fair - Light, sun-sensitive</option>
                  <option value="medium">Medium - Balanced skin tone</option>
                  <option value="dark">Dark - Melanin-rich skin</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="bodyLocation" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Body Location (Sun Exposure)</label>
              <select 
                id="bodyLocation" 
                value={bodyLocation} 
                onChange={(e) => setBodyLocation(e.target.value as BodyLocation)} 
                className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-600"
              >
                <option value="face/neck">Face/Neck - High sun exposure</option>
                <option value="hands">Hands - Extreme sun & washing</option>
                <option value="arms">Arms/Shoulders - Moderate sun</option>
                <option value="chest/back">Chest/Back - Usually covered</option>
                <option value="legs">Legs - Variable exposure</option>
                <option value="protected">Protected area - Minimal sun</option>
              </select>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Location affects fading due to sun exposure and daily wear
              </p>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !userImage}
              className="w-full bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 hover:from-amber-700 hover:via-orange-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center group shadow-lg hover:shadow-xl hover:shadow-orange-500/25 disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                  <span>Time Traveling...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>⏰ See {agingPeriod} Years Later</span>
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
        loadingText={`Simulating ${agingPeriod} years of tattoo aging... This may take a moment.`}
        initialText="Your aged tattoo preview will appear here."
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

export default TattooAging;