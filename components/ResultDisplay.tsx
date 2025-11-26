import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { SaveIcon } from './icons/SaveIcon';
import { ShareIcon } from './icons/ShareIcon';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
  loadingText: string;
  initialText: string;
  prompt: string;
  onSave: (prompt: string, imageDataUrl: string) => Promise<void>;
  onUpgradeClick?: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  isLoading,
  error,
  resultImage,
  loadingText,
  initialText,
  prompt,
  onSave,
  onUpgradeClick,
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

  const handleShareClick = async () => {
    if (!resultImage) return;

    try {
      // For Capacitor Share, we need to write the file to the cache directory first
      // to get a valid URI that can be shared.
      const fileName = `share_${Date.now()}.png`;

      // Strip the data URL prefix to get just the base64 data
      const base64Data = resultImage.split(',')[1];

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      console.log('File written to cache:', savedFile.uri);

      await Share.share({
        title: 'My Tattoo Design',
        text: 'Check out this tattoo design I created with InkPreview!',
        url: savedFile.uri,
        dialogTitle: 'Share your design',
      });
      console.log('Share dialog opened successfully');
    } catch (error) {
      console.error('Failed to share:', error);
      // Fallback to download on error (e.g. share sheet cancelled or not supported)
      try {
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = 'tattoo-design-inkpreview.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        console.error('Fallback download failed:', e);
      }
    }
  };

  return (
    <div className="mt-10 animate-slide-up">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-electric-500/30" />
        <h3 className="font-display text-2xl tracking-wider uppercase">
          <span className="text-white">RESULT</span>
        </h3>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-magenta-500/30" />
      </div>

      <div className="w-full min-h-[28rem] bg-void-900/80 backdrop-blur-sm border border-void-700 rounded-2xl flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{
        overflowX: 'hidden',
        maxWidth: '100%',
        contain: 'layout style paint'
      }}>
        {/* Corner accents */}
        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-electric-500/30 rounded-tl" />
        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-magenta-500/30 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-electric-500/30 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-magenta-500/30 rounded-br" />

        {isLoading && (
          <div className="text-center">
            <div className="relative mb-6 w-16 h-16 mx-auto">
              <div className="w-16 h-16 border-2 border-void-600 rounded-full animate-spin border-t-electric-500"></div>
              <div className="absolute inset-0 w-16 h-16 border-2 border-transparent rounded-full animate-ping border-t-magenta-500/30"></div>
            </div>
            <p className="text-steel-400 font-medium text-sm">{loadingText}</p>
          </div>
        )}

        {error && (
          <div className="text-center p-6 rounded-xl bg-red-500/10 border border-red-500/30 max-w-md">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-red-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && resultImage && (
          <div className="flex flex-col items-center gap-5 w-full">
            <div className="relative group">
              <img
                src={resultImage}
                alt="Generated tattoo result"
                className="max-w-full max-h-[36rem] rounded-xl object-contain shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  contain: 'layout style paint',
                  willChange: 'transform'
                }}
                onLoad={() => {
                  setTimeout(() => {
                    const header = document.querySelector('header');
                    const nav = document.querySelector('nav');
                    if (header) header.style.transform = 'translateZ(0)';
                    if (nav) nav.style.transform = 'translateZ(0)';
                  }, 10);
                }}
              />
              {/* Neon border glow on hover */}
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-electric-500/50 to-magenta-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
              <button
                onClick={handleSaveClick}
                disabled={isSaving || isSaved}
                className={`${isSaved ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-electric-500/20 border-electric-500/30 hover:border-electric-500/50 text-electric-400 hover:text-electric-300'} border font-heading uppercase tracking-wider text-xs py-3 px-5 rounded-xl transition-all duration-300 flex items-center gap-2 disabled:cursor-not-allowed`}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-electric-400/30 rounded-full animate-spin border-t-electric-400" />
                ) : (
                  <SaveIcon />
                )}
                <span>{isSaved ? 'Saved!' : isSaving ? 'Saving...' : 'Save Idea'}</span>
              </button>

              <button
                onClick={handleShareClick}
                className="bg-magenta-500/20 border border-magenta-500/30 hover:border-magenta-500/50 text-magenta-400 hover:text-magenta-300 font-heading uppercase tracking-wider text-xs py-3 px-5 rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <ShareIcon />
                <span>Share</span>
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && !resultImage && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-void-800 border border-void-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-steel-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-steel-500 text-sm font-heading uppercase tracking-wider">{initialText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;