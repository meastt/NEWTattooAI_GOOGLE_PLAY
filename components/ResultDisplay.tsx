import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { SaveIcon } from './icons/SaveIcon';
import { ExportIcon } from './icons/ExportIcon';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
  loadingText: string;
  initialText: string;
  prompt: string;
  onSave: (prompt: string, imageDataUrl: string) => Promise<void>;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  isLoading,
  error,
  resultImage,
  loadingText,
  initialText,
  prompt,
  onSave,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveClick = async () => {
    if (!resultImage) return;
    setIsSaving(true);
    setIsSaved(false);
    try {
      await onSave(prompt, resultImage);
      setIsSaved(true);
    } catch (error) {
      console.error("Failed to save idea:", error);
      // Optionally show an error message to the user
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportClick = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    const fileName = prompt.substring(0, 30).replace(/\s+/g, '_').toLowerCase() || 'tattoo-idea';
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-center mb-4">Result</h3>
      <div className="w-full min-h-[30rem] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center p-4">
        {isLoading && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <LoadingSpinner />
            </div>
            <p className="text-lg text-gray-300">{loadingText}</p>
          </div>
        )}
        {error && <p className="text-red-400 text-lg">{error}</p>}
        {!isLoading && !error && resultImage && (
          <div className="flex flex-col items-center gap-4">
            <img src={resultImage} alt="Generated tattoo result" className="max-w-full max-h-[40rem] rounded-lg object-contain" />
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handleSaveClick}
                disabled={isSaving || isSaved}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {isSaving ? <LoadingSpinner /> : <SaveIcon />}
                {isSaved ? 'Saved!' : isSaving ? 'Saving...' : 'Save Idea'}
              </button>
              <button
                onClick={handleExportClick}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <ExportIcon />
                Export Image
              </button>
            </div>
          </div>
        )}
        {!isLoading && !error && !resultImage && (
          <p className="text-gray-500">{initialText}</p>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;