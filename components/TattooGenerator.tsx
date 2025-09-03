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
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Tattoo Idea Generator</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Bring your imagination to life. Describe any concept and get a unique design.</p>
      </div>

      <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Main Subject *</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., A celestial wolf howling at a geometric moon"
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 focus:ring-rose-500 focus:border-rose-500 transition"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="style" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Style</label>
              <select id="style" value={style} onChange={(e) => setStyle(e.target.value as TattooStyle)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 focus:ring-rose-500 focus:border-rose-500 transition">
                {TATTOO_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Color</label>
              <select id="color" value={color} onChange={(e) => setColor(e.target.value as TattooColor)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 focus:ring-rose-500 focus:border-rose-500 transition">
                {TATTOO_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="details" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Additional Details</label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g., with swirling galaxy patterns in its fur, surrounded by constellations"
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 focus:ring-rose-500 focus:border-rose-500 transition"
              rows={3}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <LoadingSpinner /> : 'Generate Design'}
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