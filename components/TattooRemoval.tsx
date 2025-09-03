import React, { useState, useCallback } from 'react';
import type { View } from '../types';
import { editImage } from '../services/geminiService';
import { saveIdea } from '../services/tattooService';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import ResultDisplay from './ResultDisplay';

interface TattooRemovalProps {
  onNavigate: (view: View) => void;
}

const TattooRemoval: React.FC<TattooRemovalProps> = ({ onNavigate }) => {
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
    
    setIsLoading(true);
    setError(null);
    setResultImage(null);

    const generatedPrompt = `Using the provided image of a person, realistically remove the tattoo described as: "${removalDescription}". Heal the skin where the tattoo was, making it look natural and as if the tattoo was never there.`;
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
        <h2 className="text-3xl font-bold">Tattoo Removal Visualizer</h2>
        <p className="text-gray-400 mt-2">Curious what a cover-up might look like? See a preview of your skin without a specific tattoo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">1. Your Photo with Tattoo</h3>
          <ImageUploader onImageReady={handleImageReady} />
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">2. Tattoo to Remove</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="removalDescription" className="block text-sm font-medium text-gray-300 mb-1">Describe the tattoo and its location *</label>
              <textarea
                id="removalDescription"
                value={removalDescription}
                onChange={(e) => setRemovalDescription(e.target.value)}
                placeholder="e.g., The small rose tattoo on my right wrist"
                className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows={5}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !userImage}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <LoadingSpinner /> : 'Visualize Removal'}
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
        loadingText="Digitally removing your tattoo... This can take a moment."
        initialText="Your tattoo removal preview will appear here."
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

export default TattooRemoval;