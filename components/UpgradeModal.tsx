import React from 'react';
import { initiateAppleIAP } from '../services/subscriptionService';
import { SUBSCRIPTION_PLANS } from '../services/subscriptionService';
import { getSubscriptionInfo } from '../services/creditService';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  isServicesReady: boolean;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, theme, isServicesReady }) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async (productId: string) => {
    if (!isServicesReady) {
      setError('Services are still initializing. Please wait a moment and try again.');
      return;
    }

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
      className="fixed inset-0 bg-onyx-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 1rem)', paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 1rem)' }}
    >
      <div className="relative w-full max-w-md max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 transform transition-all my-auto flex flex-col bg-onyx-900 border border-onyx-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg border border-onyx-700 hover:border-electric-500/50 text-steel-400 hover:text-white bg-onyx-800/90 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex-shrink-0 p-6 pb-4 border-b border-onyx-800">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-electric-500/10 to-electric-600/10 border border-electric-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-electric-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="font-display text-2xl tracking-wider uppercase text-white mb-1">
              UPGRADE
            </h2>
            <p className="text-steel-400 text-sm">
              Unlock more AI generations
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-xs text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {/* Subscription Plans */}
          <div className="space-y-4 mb-6">
            {SUBSCRIPTION_PLANS.map((plan, index) => {
              const isPopular = index === 1; // Mark second plan as popular

              return (
                <div
                  key={plan.id}
                  className={`relative p-5 rounded-xl border transition-all duration-300 ${isPopular
                      ? 'border-electric-500/50 bg-electric-500/5'
                      : 'border-onyx-700 bg-onyx-800/50 hover:border-electric-500/30'
                    }`}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-electric-600 rounded text-[10px] font-heading uppercase tracking-wider text-white">
                      Popular
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wide mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-steel-400 text-xs mb-2">
                        {plan.description}
                      </p>
                      <div className="flex items-baseline">
                        <span className="font-display text-3xl text-white">
                          ${plan.price}
                        </span>
                        <span className="text-steel-500 text-sm ml-1">
                          /{plan.period}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl text-electric-400">
                        {plan.credits}
                      </div>
                      <div className="text-xs text-steel-500 uppercase tracking-wider">
                        credits
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-1.5 mb-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded flex items-center justify-center bg-electric-500/20">
                          <svg className="w-2 h-2 text-electric-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs text-steel-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => handleUpgrade(plan.productId)}
                    disabled={isProcessing || !isServicesReady}
                    className={`w-full py-3 px-4 rounded-lg font-heading uppercase tracking-wider text-sm text-white transition-all duration-300 ${(isProcessing && selectedPlan === plan.productId) || !isServicesReady
                        ? 'bg-onyx-700 text-steel-500 cursor-not-allowed'
                        : isPopular
                          ? 'bg-electric-600 hover:bg-electric-500 hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]'
                          : 'bg-onyx-700 border border-onyx-600 hover:border-electric-500/50 hover:text-electric-400'
                      }`}
                  >
                    {isProcessing && selectedPlan === plan.productId ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : !isServicesReady ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      `Get ${plan.name}`
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-steel-500 text-center">
            Subscriptions auto-renew. Cancel anytime in settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;