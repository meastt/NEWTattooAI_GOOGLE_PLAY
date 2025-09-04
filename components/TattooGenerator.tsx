import React, { useState } from 'react';
import type { View, TattooStyle, TattooColor } from '../types';
import { TATTOO_STYLES, TATTOO_COLORS } from '../constants';
import { generateImage } from '../services/geminiService';
import { saveIdea } from '../services/tattooService';
import LoadingSpinner from './LoadingSpinner';
import ResultDisplay from './ResultDisplay';

interface TattooGeneratorProps {
  onNavigate: (view: View) => void;
}

const TattooGenerator: React.FC<TattooGeneratorProps> = ({ onNavigate }) => {
  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState<TattooStyle>(TATTOO_STYLES[0]);
  const [color, setColor] = useState<TattooColor>(TATTOO_COLORS[1]);
  const [details, setDetails] = useState('');
  const [prompt, setPrompt] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) {
      setError("Please provide a subject for the tattoo.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResultImage(null);

    const generatedPrompt = `A tattoo design of a ${subject}. The style should be ${style}, ${color}. Additional details: ${details}. The design should be on a clean, white background.`;
    setPrompt(generatedPrompt);

    try {
      const imageUrl = await generateImage(generatedPrompt);
      setResultImage(imageUrl);
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
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-ink-500/10 to-neon-500/10 rounded-full blur-3xl" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500">
            Tattoo Idea
          </span>
          <br />
          <span className="text-slate-900 dark:text-white">Generator</span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Bring your imagination to life. Describe any concept and get a unique design crafted by AI.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Subject */}
          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Main Subject *
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., A celestial wolf howling at a geometric moon"
              className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-ink-500 focus:border-ink-500 dark:focus:border-ink-400 transition-all duration-300 hover:border-ink-300 dark:hover:border-ink-600"
              required
            />
          </div>

          {/* Style and Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="style" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Style
              </label>
              <select 
                id="style" 
                value={style} 
                onChange={(e) => setStyle(e.target.value as TattooStyle)} 
                className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-ink-500 focus:border-ink-500 dark:focus:border-ink-400 transition-all duration-300 hover:border-ink-300 dark:hover:border-ink-600"
              >
                {TATTOO_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="color" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Color
              </label>
              <select 
                id="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value as TattooColor)} 
                className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-ink-500 focus:border-ink-500 dark:focus:border-ink-400 transition-all duration-300 hover:border-ink-300 dark:hover:border-ink-600"
              >
                {TATTOO_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <label htmlFor="details" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Additional Details
            </label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g., with swirling galaxy patterns in its fur, surrounded by constellations"
              className="w-full bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-ink-500 focus:border-ink-500 dark:focus:border-ink-400 transition-all duration-300 hover:border-ink-300 dark:hover:border-ink-600 resize-none"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500 hover:from-ink-700 hover:via-ink-600 hover:to-neon-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center group shadow-lg hover:shadow-xl hover:shadow-ink-500/25 disabled:shadow-none"
          >
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                <span>Generating Design...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Generate Design</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </button>
        </form>
      </div>

      <ResultDisplay
        isLoading={isLoading}
        error={error}
        resultImage={resultImage}
        prompt={prompt}
        onSave={handleSave}
        loadingText="Generating your unique tattoo design... This may take a few moments."
        initialText="Your generated tattoo design will appear here."
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

export default TattooGenerator;