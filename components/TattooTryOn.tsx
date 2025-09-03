import React, { useState, useCallback } from 'react';
import type { View, TattooStyle, TattooColor } from '../types';
import { TATTOO_STYLES, TATTOO_COLORS } from '../constants';
import { editImage } from '../services/geminiService';
import { saveIdea } from '../services/tattooService';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import ResultDisplay from './ResultDisplay';

interface TattooTryOnProps {
  onNavigate: (view: View) => void;
}

const TattooTryOn: React.FC<TattooTryOnProps> = ({ onNavigate }) => {
  const [userImage, setUserImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState<TattooStyle>(TATTOO_STYLES[0]);
  const [bodyPart, setBodyPart] = useState('');
  const [color, setColor] = useState<TattooColor>(TATTOO_COLORS[0]);
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

    const generatedPrompt = `Using the provided image of a person, add a realistic-looking tattoo. The tattoo is of a ${subject}. It should be in the ${style} style, located on the person's ${bodyPart}. The tattoo's color should be ${color}.`;
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
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Tattoo Try-On</h2>
        <p className="text-gray-400 mt-2">See your tattoo idea on your skin before the needle ever touches it.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">1. Your Photo</h3>
          <ImageUploader onImageReady={handleImageReady} />
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">2. Your Tattoo Idea</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Tattoo Subject *</label>
              <textarea
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., A majestic lion with a crown"
                className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label htmlFor="bodyPart" className="block text-sm font-medium text-gray-300 mb-1">Body Part *</label>
              <input
                type="text"
                id="bodyPart"
                value={bodyPart}
                onChange={(e) => setBodyPart(e.target.value)}
                placeholder="e.g., Left forearm"
                className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
             <div>
              <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-1">Style</label>
              <select id="style" value={style} onChange={(e) => setStyle(e.target.value as TattooStyle)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500">
                {TATTOO_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-300 mb-1">Color</label>
              <select id="color" value={color} onChange={(e) => setColor(e.target.value as TattooColor)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500">
                {TATTOO_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !userImage}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <LoadingSpinner /> : 'Visualize Tattoo'}
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
        loadingText="Applying your virtual tattoo... This can take a moment."
        initialText="Your virtual tattoo preview will appear here."
      />

      {(!isLoading && (resultImage || error)) && (
        <div className="mt-6 text-center">
          <button 
            onClick={() => onNavigate('create')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Create Hub
          </button>
        </div>
      )}
    </div>
  );
};

export default TattooTryOn;