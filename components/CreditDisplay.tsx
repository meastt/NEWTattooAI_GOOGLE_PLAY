import React, { useState, useEffect } from 'react';
import { getSubscriptionInfo } from '../services/creditService';

interface CreditDisplayProps {
  theme: 'light' | 'dark';
  onUpgradeClick?: () => void;
}

const CreditDisplay: React.FC<CreditDisplayProps> = ({ theme, onUpgradeClick }) => {
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);

  const refreshCredits = () => {
    const info = getSubscriptionInfo();
    setSubscriptionInfo(info);
  };

  useEffect(() => {
    refreshCredits();
    
    // Listen for credit updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tattoo_app_subscription' || e.key === 'tattoo_app_credits') {
        refreshCredits();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Refresh every 5 seconds to catch updates
    const interval = setInterval(refreshCredits, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (!subscriptionInfo) return null;

  if (subscriptionInfo.hasSubscription) {
    return (
      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300 min-w-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-electric-500/10 to-magenta-500/10 border border-electric-500/30'
          : 'bg-gradient-to-r from-electric-50 to-magenta-50 border border-electric-200/50'
      }`}>
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse flex-shrink-0"></div>
          <span className={`text-xs font-heading uppercase tracking-wider truncate ${
            theme === 'dark' ? 'text-electric-400' : 'text-electric-600'
          }`}>
            {subscriptionInfo.plan?.name || 'PRO'}
          </span>
        </div>
        <div className="w-px h-3 bg-void-600 flex-shrink-0"></div>
        <span className="text-xs font-medium text-steel-400 truncate">
          {subscriptionInfo.isUnlimited ? '∞' : `${subscriptionInfo.totalCredits}`}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300 min-w-0 ${
      theme === 'dark'
        ? 'bg-void-800/80 border border-void-600'
        : 'bg-white/80 border border-steel-200'
    }`}>
      {/* Credits */}
      <div className="flex items-center space-x-2 min-w-0">
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
          subscriptionInfo.totalCredits > 2
            ? 'bg-electric-400'
            : subscriptionInfo.totalCredits > 0
              ? 'bg-yellow-400'
              : 'bg-red-400'
        }`}></div>
        <span className="text-xs font-medium text-steel-400 truncate">
          {subscriptionInfo.totalCredits}
        </span>
      </div>

      {/* Upgrade Button */}
      {subscriptionInfo.totalCredits <= 1 && onUpgradeClick && (
        <>
          <div className="w-px h-3 bg-void-600 flex-shrink-0"></div>
          <button
            onClick={onUpgradeClick}
            className="text-xs font-heading uppercase tracking-wider text-magenta-400 hover:text-magenta-300 transition-colors duration-300 flex-shrink-0"
          >
            Upgrade
          </button>
        </>
      )}
    </div>
  );
};

export default CreditDisplay;