import React from 'react';
import { BackArrowIcon } from './icons/BackArrowIcon';
import CreditDisplay from './CreditDisplay';
import { getUserSubscription, updateUserSubscription } from '../services/subscriptionService';

type Theme = 'light' | 'dark';

interface HeaderProps {
  showBackButton: boolean;
  onBack: () => void;
  theme: Theme;
  onUpgradeClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton, onBack, theme, onUpgradeClick }) => {
  const handleReset = async () => {
    console.log('Reset button clicked');
    try {
      const subscription = getUserSubscription();
      const result = await updateUserSubscription({
        currentFreeCredits: 5,
        currentSubscriptionCredits: 0
      });
      console.log('Reset result:', result);
      alert('Credits reset to 5');
      window.location.reload(); // Force refresh to update UI
    } catch (error) {
      console.error('Reset failed:', error);
      alert('Reset failed: ' + error);
    }
  };

  const handleUnlimited = async () => {
    console.log('999 button clicked');
    try {
      const subscription = getUserSubscription();
      const result = await updateUserSubscription({
        currentFreeCredits: 999,
        currentSubscriptionCredits: 0
      });
      console.log('Unlimited result:', result);
      alert('Credits set to 999');
      window.location.reload(); // Force refresh to update UI
    } catch (error) {
      console.error('Unlimited failed:', error);
      alert('Unlimited failed: ' + error);
    }
  };

  return (
    <header className="sticky top-0 z-50 header-safe" style={{ 
      paddingTop: 'max(env(safe-area-inset-top, 0px), 60px)',
      backgroundColor: 'rgba(0,0,0,0.1)'
    }}>
      <div className={`backdrop-blur-md border-b transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900/70 border-slate-800/50' 
          : 'bg-white/70 border-slate-200/50'
      }`} style={{ 
        minHeight: '80px',
        paddingTop: '20px',
        paddingBottom: '20px'
      }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center flex-1">
             {showBackButton && (
              <button
                onClick={onBack}
                className={`mr-4 p-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  theme === 'dark' 
                    ? 'hover:bg-slate-800/50 text-slate-300 hover:text-white' 
                    : 'hover:bg-slate-100/50 text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Go back"
              >
                <BackArrowIcon />
              </button>
            )}
             <div className="flex-grow-0">
               <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight">
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500">
                   InkPreview
                 </span>
               </h1>
               <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                 Preview Before You Ink
                 </p>
             </div>
          </div>
          <div className="flex items-center justify-end space-x-2">
            {/* Debug buttons - remove for production */}
            <button 
              onClick={handleReset}
              className="text-xs px-3 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 active:bg-red-700"
            >
              Reset
            </button>
            <button 
              onClick={handleUnlimited}
              className="text-xs px-3 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 active:bg-green-700"
            >
              999
            </button>
            <CreditDisplay theme={theme} onUpgradeClick={onUpgradeClick} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;