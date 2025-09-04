import React from 'react';
import { upgradeToPremium, getUserCredits } from '../services/creditService';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, theme }) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate Apple In-App Purchase flow
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      // In a real app, this would be called after successful Apple IAP
      await upgradeToPremium();
      
      // Trigger a storage event to update credit display
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'tattoo_app_credits',
        newValue: JSON.stringify(getUserCredits())
      }));
      
      onClose();
    } catch (err) {
      setError('Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl transform transition-all ${
        theme === 'dark' 
          ? 'bg-slate-900 border border-slate-700' 
          : 'bg-white border border-slate-200'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            theme === 'dark' 
              ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' 
              : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-8 pb-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-ink-500 to-neon-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">
              Upgrade to Pro
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Unlock unlimited generations and exports
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Unlimited AI generations</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Unlimited exports & downloads</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Priority support</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Advanced AI models</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          {/* Pricing */}
          <div className={`mb-6 p-6 rounded-2xl border-2 border-dashed transition-colors ${
            theme === 'dark' 
              ? 'border-ink-600 bg-ink-950/20' 
              : 'border-ink-300 bg-ink-50/50'
          }`}>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                $4.99
                <span className="text-lg font-normal text-slate-600 dark:text-slate-400">/month</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Cancel anytime</p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 ${
              isProcessing
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-ink-500 to-neon-500 hover:from-ink-600 hover:to-neon-600 transform hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              'Subscribe Now'
            )}
          </button>

          {/* Disclaimer */}
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
            This is a demo purchase flow. In production, this would integrate with Apple In-App Purchase.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;