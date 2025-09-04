import React, { useState, useEffect } from 'react';
import { getSubscriptionInfo, getRemainingExports } from '../services/creditService';

interface CreditDisplayProps {
  theme: 'light' | 'dark';
  onUpgradeClick?: () => void;
}

const CreditDisplay: React.FC<CreditDisplayProps> = ({ theme, onUpgradeClick }) => {
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
  const [remainingExports, setRemainingExports] = useState<number>(0);

  const refreshCredits = () => {
    const info = getSubscriptionInfo();
    setSubscriptionInfo(info);
    setRemainingExports(getRemainingExports());
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
      <div className={`flex items-center space-x-3 px-4 py-2 rounded-2xl transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-ink-900/50 to-neon-900/50 border border-ink-700/50' 
          : 'bg-gradient-to-r from-ink-50 to-neon-50 border border-ink-200/50'
      }`}>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-ink-500 to-neon-500 animate-pulse"></div>
          <span className={`text-sm font-bold ${
            theme === 'dark' ? 'text-ink-300' : 'text-ink-700'
          }`}>
            {subscriptionInfo.plan?.name || 'PRO'}
          </span>
        </div>
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {subscriptionInfo.isUnlimited ? '∞ Unlimited' : `${subscriptionInfo.totalCredits} credits`}
        </span>
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          ∞ exports
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 px-4 py-2 rounded-2xl transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-slate-800/50 border border-slate-700/50' 
        : 'bg-white/50 border border-slate-200/50'
    }`}>
      {/* Generation Credits */}
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          subscriptionInfo.totalCredits > 2 
            ? 'bg-green-500' 
            : subscriptionInfo.totalCredits > 0 
              ? 'bg-yellow-500' 
              : 'bg-red-500'
        }`}></div>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {subscriptionInfo.totalCredits} credits
        </span>
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>

      {/* Export Credits */}
      <div className="flex items-center space-x-2">
        <svg className="w-3 h-3 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {remainingExports} exports
        </span>
      </div>

      {/* Upgrade Button */}
      {(subscriptionInfo.totalCredits <= 1 || remainingExports <= 1) && onUpgradeClick && (
        <>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
          <button
            onClick={onUpgradeClick}
            className="text-xs font-bold text-ink-600 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-300 transition-colors duration-300"
          >
            Upgrade
          </button>
        </>
      )}
    </div>
  );
};

export default CreditDisplay;