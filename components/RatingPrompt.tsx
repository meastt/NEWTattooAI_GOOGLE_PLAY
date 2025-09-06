import React, { useState, useEffect } from 'react';
import { shouldShowRatingPrompt, trackRatingPromptShown } from '../services/conversionService';

interface RatingPromptProps {
  onClose: () => void;
}

const RatingPrompt: React.FC<RatingPromptProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Show rating prompt only at the perfect moment
    const timer = setTimeout(() => {
      if (shouldShowRatingPrompt()) {
        setIsVisible(true);
        trackRatingPromptShown();
      }
    }, 3000); // Wait 3 seconds after they share

    return () => clearTimeout(timer);
  }, []);

  const handleRate = () => {
    // iOS App Store rating prompt
    if ((window as any).Capacitor && (window as any).Capacitor.isNativePlatform()) {
      // Capacitor environment - open App Store
      try {
        window.open('https://apps.apple.com/app/id[YOUR_APP_ID]', '_system');
      } catch (e) {
        console.log('Rating not available in this environment');
        // Fallback to web
        window.open('https://apps.apple.com/app/id[YOUR_APP_ID]', '_blank');
      }
    } else {
      // Web fallback
      window.open('https://apps.apple.com/app/id[YOUR_APP_ID]', '_blank');
    }
    handleClose();
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 z-50 transition-all duration-500 transform ${isAnimating ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 mx-auto max-w-sm">
        <div className="flex items-center gap-3">
          {/* App icon placeholder */}
          <div className="w-12 h-12 bg-gradient-to-r from-ink-500 to-neon-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">IP</span>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              Enjoying InkPreview?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Help others discover amazing tattoo designs
            </p>
          </div>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleRate}
            className="flex-1 bg-gradient-to-r from-ink-500 to-neon-500 text-white text-sm font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            ⭐ Rate App
          </button>
          <button
            onClick={handleClose}
            className="flex-1 text-slate-600 dark:text-slate-400 text-sm font-medium py-2 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingPrompt;