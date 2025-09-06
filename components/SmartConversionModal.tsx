import React, { useState, useEffect } from 'react';
import { 
  shouldShowConversionPrompt, 
  getConversionMessage, 
  trackConversionAttempt,
  getUserJourney 
} from '../services/conversionService';

interface SmartConversionModalProps {
  onUpgradeClick: () => void;
  onClose: () => void;
}

const SmartConversionModal: React.FC<SmartConversionModalProps> = ({ onUpgradeClick, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [conversionData, setConversionData] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const checkConversion = () => {
      const shouldShow = shouldShowConversionPrompt();
      if (shouldShow.show) {
        const message = getConversionMessage(shouldShow.type);
        setConversionData({ ...message, type: shouldShow.type });
        setIsVisible(true);
        
        // Track that we're showing this conversion attempt
        trackConversionAttempt(shouldShow.type);
        
        console.log(`🎯 Smart conversion: ${shouldShow.reason}`);
      }
    };

    // Small delay to let user appreciate their action first
    const timer = setTimeout(checkConversion, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleUpgrade = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onUpgradeClick();
      handleClose();
    }, 300);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
      onClose();
    }, 300);
  };

  if (!isVisible || !conversionData) return null;

  const journey = getUserJourney();
  const isHighValue = journey.generationsUsed >= 5;

  return (
    <div className={`fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden transform transition-all duration-300 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-ink-500 via-ink-600 to-neon-500 p-6 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-display font-bold mb-2">
              {conversionData.title}
            </h2>
            <p className="text-ink-100 font-medium">
              {conversionData.subtitle}
            </p>
          </div>
          
          {/* Floating elements for visual appeal */}
          <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-3 left-4 w-4 h-4 bg-neon-400/30 rounded-full animate-bounce"></div>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed text-center">
            {conversionData.message}
          </p>

          {/* Social proof for high-intent users */}
          {conversionData.socialProof && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-2xl mb-6">
              <p className="text-sm text-center text-slate-600 dark:text-slate-400 font-medium">
                <span className="text-green-600 dark:text-green-400 font-bold">12,000+</span> tattoo enthusiasts trust InkPreview for their designs
              </p>
            </div>
          )}

          {/* Urgency indicator for power users */}
          {conversionData.urgency && isHighValue && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-3 rounded-xl mb-6 border-l-4 border-orange-400">
              <p className="text-sm text-orange-700 dark:text-orange-300 font-semibold text-center">
                🔥 Limited time: First week FREE for power users like you
              </p>
            </div>
          )}

          {/* Value proposition */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-ink-600 dark:text-ink-400">∞</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Unlimited Generations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-600 dark:text-neon-400">⚡</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Priority Processing</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500 hover:from-ink-700 hover:via-ink-600 hover:to-neon-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              {conversionData.cta}
            </button>
            
            <button
              onClick={handleClose}
              className="w-full text-slate-500 dark:text-slate-400 font-medium py-3 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Maybe Later
            </button>
          </div>

          {/* Trust indicator */}
          <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-4">
            Cancel anytime • No hidden fees • 30-day guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartConversionModal;