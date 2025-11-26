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
      className={`fixed z-40 group transition-all duration-300 hover:scale-105 ${isLowCredits ? 'animate-pulse' : ''
        }`}
      style={{
        bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))', // Moved to bottom right
        right: '20px'
      }}
    >
      {/* Outer glow effect */}
      <div className={`absolute inset-0 rounded-2xl blur-sm transition-all duration-300 ${'bg-gradient-to-r from-electric-500/50 to-electric-400/50'
        } ${isLowCredits ? 'animate-pulse' : ''}`} />

      {/* Main button */}
      <div className={`relative px-4 py-3 rounded-2xl border transition-all duration-300 ${'bg-onyx-900/95 border-electric-500/60 text-electric-400 hover:bg-onyx-800/95 hover:border-electric-400'
        } backdrop-blur-md`}>
        {/* Inner glow */}
        <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${'bg-gradient-to-r from-electric-500/10 to-electric-400/10'
          }`} />

        {/* Content */}
        <div className="relative flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isLowCredits
              ? 'bg-red-500 animate-pulse'
              : 'bg-electric-400'
            }`} />
          <span className="text-sm font-heading font-semibold tracking-wide uppercase">
            {isLowCredits ? 'Upgrade Now' : 'Upgrade'}
          </span>
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
