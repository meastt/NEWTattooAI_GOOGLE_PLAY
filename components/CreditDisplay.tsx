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
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-2xl transition-all duration-300 min-w-0 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-ink-900/50 to-neon-900/50 border border-ink-700/50' 
          : 'bg-gradient-to-r from-ink-50 to-neon-50 border border-ink-200/50'
      }`}>
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-ink-500 to-neon-500 animate-pulse flex-shrink-0"></div>
          <span className={`text-sm font-bold truncate ${
            theme === 'dark' ? 'text-ink-300' : 'text-ink-700'
          }`}>
            {subscriptionInfo.plan?.name || 'PRO'}
          </span>
        </div>
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 flex-shrink-0"></div>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate">
          {subscriptionInfo.isUnlimited ? '∞ Unlimited' : `${subscriptionInfo.totalCredits} credits`}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-2xl transition-all duration-300 min-w-0 ${
      theme === 'dark' 
        ? 'bg-slate-800/50 border border-slate-700/50' 
        : 'bg-white/50 border border-slate-200/50'
    }`}>
      {/* Credits */}
      <div className="flex items-center space-x-2 min-w-0">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
          subscriptionInfo.totalCredits > 2 
            ? 'bg-green-500' 
            : subscriptionInfo.totalCredits > 0 
              ? 'bg-yellow-500' 
              : 'bg-red-500'
        }`}></div>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate">
          {subscriptionInfo.totalCredits} credits
        </span>
      </div>

      {/* Upgrade Button */}
      {subscriptionInfo.totalCredits <= 1 && onUpgradeClick && (
        <>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 flex-shrink-0"></div>
          <button
            onClick={onUpgradeClick}
            className="text-xs font-bold text-ink-600 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-300 transition-colors duration-300 flex-shrink-0"
          >
            Upgrade
          </button>
        </>
      )}
    </div>
  );
};

export default CreditDisplay;