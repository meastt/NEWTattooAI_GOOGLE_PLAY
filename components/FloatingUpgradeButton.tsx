import React from 'react';

interface FloatingUpgradeButtonProps {
  onUpgradeClick: () => void;
  theme: 'light' | 'dark';
  credits?: number;
}

const FloatingUpgradeButton: React.FC<FloatingUpgradeButtonProps> = ({ 
  onUpgradeClick, 
  theme, 
  credits = 0 
}) => {
  const isLowCredits = credits <= 2;
  
  return (
    <button
      onClick={onUpgradeClick}
      className={`fixed z-40 group transition-all duration-300 hover:scale-105 ${
        isLowCredits ? 'animate-pulse' : ''
      }`}
      style={{
        bottom: '130px',
        right: '16px'
      }}
    >
      {/* Outer glow effect */}
      <div className={`absolute inset-0 rounded-2xl blur-sm transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-orange-400/50 to-ink-400/50' 
          : 'bg-gradient-to-r from-orange-500/50 to-ink-500/50'
      } ${isLowCredits ? 'animate-pulse' : ''}`} />
      
      {/* Main button */}
      <div className={`relative px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-slate-900/95 border-orange-400/60 text-orange-300 hover:bg-slate-800/95 hover:border-orange-300'
          : 'bg-white/95 border-orange-500/60 text-orange-600 hover:bg-slate-50/95 hover:border-orange-400'
      } backdrop-blur-md`}>
        {/* Inner glow */}
        <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-orange-400/10 to-ink-400/10' 
            : 'bg-gradient-to-r from-orange-500/10 to-ink-500/10'
        }`} />
        
        {/* Content */}
        <div className="relative flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
            isLowCredits 
              ? 'bg-red-400 animate-pulse' 
              : 'bg-orange-400'
          }`} />
          <span className="text-sm font-semibold tracking-wide">
            {isLowCredits ? 'Upgrade Now' : 'Upgrade'}
          </span>
          <div className={`w-1 h-1 rounded-full ${
            theme === 'dark' ? 'bg-orange-300' : 'bg-orange-500'
          }`} />
        </div>
        
        {/* Low credits indicator */}
        {isLowCredits && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}
      </div>
    </button>
  );
};

export default FloatingUpgradeButton;
