import React from 'react';
import { initiateAppleIAP } from '../services/subscriptionService';
import { SUBSCRIPTION_PLANS } from '../services/subscriptionService';
import { getSubscriptionInfo } from '../services/creditService';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, theme }) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async (productId: string) => {
    setIsProcessing(true);
    setError(null);
    setSelectedPlan(productId);

    try {
      // Initiate Apple In-App Purchase
      const result = await initiateAppleIAP(productId);
      
      if (result.success) {
        // Trigger a storage event to update credit display
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'tattoo_app_subscription',
          newValue: JSON.stringify(getSubscriptionInfo())
        }));
        
        onClose();
      } else {
        setError(result.error || 'Purchase failed. Please try again.');
      }
    } catch (err) {
      setError('Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
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
              Choose Your Plan
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Unlock more AI generations and premium features
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          {/* Subscription Plans */}
          <div className="space-y-4 mb-6">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-800/50 hover:border-ink-500'
                    : 'border-slate-200 bg-slate-50/50 hover:border-ink-400'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 ml-1">
                        /{plan.period}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-ink-500 dark:text-ink-400">
                      {plan.credits}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      generations
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <svg className="w-2 h-2 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subscribe Button */}
                <button
                  onClick={() => handleUpgrade(plan.productId)}
                  disabled={isProcessing}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 ${
                    isProcessing && selectedPlan === plan.productId
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-ink-500 to-neon-500 hover:from-ink-600 hover:to-neon-600 transform hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isProcessing && selectedPlan === plan.productId ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Subscribe to ${plan.name}`
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            This is a demo purchase flow. In production, this would integrate with Apple In-App Purchase.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;