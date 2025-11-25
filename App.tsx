import React, { useState, useCallback, useEffect } from 'react';
import type { View } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TattooTryOn from './components/TattooTryOn';
import TattooGenerator from './components/TattooGenerator';
import TattooRemovalOnly from './components/TattooRemovalOnly';
import TattooCoverup from './components/TattooCoverup';
import PrivacyPolicy from './components/PrivacyPolicy';
import Terms from './components/Terms';
import Disclaimer from './components/Disclaimer';
import Settings from './components/Settings';
import BottomNav from './components/BottomNav';
import HomeDashboard from './components/HomeDashboard';
import SavedIdeas from './components/SavedIdeas';
import UpgradeModal from './components/UpgradeModal';
import OnboardingTour from './components/OnboardingTour';
import SmartConversionModal from './components/SmartConversionModal';
import RatingPrompt from './components/RatingPrompt';
import FloatingUpgradeButton from './components/FloatingUpgradeButton';
import { initializeCreditService } from './services/creditService';
import { initializeSubscriptionService, getUserRemainingCredits, hasActiveSubscription } from './services/subscriptionService';
import { initializeRevenueCat } from './services/revenueCatService';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSmartConversion, setShowSmartConversion] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [isServicesInitialized, setIsServicesInitialized] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Apply theme class to document element for Tailwind dark mode
    document.documentElement.classList.toggle('dark', theme === 'dark');
    // Initialize services on app start
    const initializeServices = async () => {
      try {
        await initializeRevenueCat();
        await initializeCreditService();
        await initializeSubscriptionService();
        console.log('All services initialized successfully');
        setIsServicesInitialized(true);
      } catch (error) {
        console.error('Failed to initialize services:', error);
        setIsServicesInitialized(true); // Allow app to continue even if services fail
      }
    };
    initializeServices();
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const navigateTo = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  const getActiveTab = (): View => {
    if (['tryOn', 'generator', 'removal', 'coverup'].includes(currentView)) {
      return 'create';
    }
    if (['home', 'privacy', 'terms', 'disclaimer', 'settings'].includes(currentView)) {
        return 'home';
    }
    return currentView as View;
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeDashboard onNavigate={navigateTo} />;
      case 'create':
        return <Dashboard onNavigate={navigateTo} />;
      case 'saved':
        return <SavedIdeas onNavigate={navigateTo} />;
      case 'tryOn':
        return <TattooTryOn onNavigate={navigateTo} onUpgradeClick={() => setShowUpgradeModal(true)} />;
      case 'generator':
        return <TattooGenerator onNavigate={navigateTo} onUpgradeClick={() => setShowUpgradeModal(true)} />;
      case 'removal':
        return <TattooRemovalOnly onNavigate={navigateTo} onUpgradeClick={() => setShowUpgradeModal(true)} />;
      case 'coverup':
        return <TattooCoverup onNavigate={navigateTo} onUpgradeClick={() => setShowUpgradeModal(true)} />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <Terms />;
      case 'disclaimer':
        return <Disclaimer />;
      case 'settings':
        return <Settings onNavigate={navigateTo} theme={theme} toggleTheme={toggleTheme} />;
      default:
        return <HomeDashboard onNavigate={navigateTo} />;
    }
  };

  const getBackButtonTarget = (): View => {
    if (['tryOn', 'generator', 'removal', 'coverup'].includes(currentView)) {
      return 'create';
    }
    return 'home';
  }

  const showHeader = !['home', 'create', 'saved'].includes(currentView);

  return (
    <div className={`min-h-screen font-sans relative ${theme}`} style={{
      paddingLeft: 'env(safe-area-inset-left, 0px)',
      paddingRight: 'env(safe-area-inset-right, 0px)',
      overflowX: 'hidden',
      maxWidth: '100vw'
    }}>
      {/* Dynamic Background - Premium Studio Dark */}
      <div className="fixed inset-0 -z-10">
        <div className={`absolute inset-0 transition-all duration-1000 ${
          theme === 'dark'
            ? 'bg-void-950'
            : 'bg-gradient-to-br from-steel-50 via-white to-steel-100'
        }`} />

        {/* Subtle gradient overlays */}
        {theme === 'dark' && (
          <>
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-electric-500/5 to-transparent" />
            <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-magenta-500/5 to-transparent" />
          </>
        )}

        {/* Animated Neon Glow Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl animate-float ${
            theme === 'dark' ? 'bg-electric-500/10' : 'bg-electric-300/20'
          }`} />
          <div className={`absolute top-1/3 -left-32 w-72 h-72 rounded-full blur-3xl animate-float ${
            theme === 'dark' ? 'bg-magenta-500/10' : 'bg-magenta-300/20'
          }`} style={{ animationDelay: '3s' }} />
          <div className={`absolute bottom-20 right-1/4 w-48 h-48 rounded-full blur-3xl animate-float ${
            theme === 'dark' ? 'bg-electric-500/5' : 'bg-electric-300/10'
          }`} style={{ animationDelay: '5s' }} />
        </div>

        {/* Grid Pattern Overlay */}
        <div className={`absolute inset-0 ${
          theme === 'dark' ? 'opacity-[0.02]' : 'opacity-[0.03]'
        }`} style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        {/* Scanline effect - subtle */}
        {theme === 'dark' && (
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }}
          />
        )}
      </div>

      {/* Header - Always show but with different back button state */}
      <Header
        showBackButton={showHeader}
        onBack={() => navigateTo(getBackButtonTarget())}
        theme={theme}
        onUpgradeClick={() => setShowUpgradeModal(true)}
      />
      
      {/* Main Content */}
      <main 
        className="relative z-10" 
        style={{ 
          paddingTop: 'calc(72px + env(safe-area-inset-top, 0px))', // Match new header height (72px)
          paddingBottom: 'calc(104px + env(safe-area-inset-bottom, 0px))', // Match new bottom nav height (56px + 48px)
          minHeight: 'calc(100dvh - 72px - 104px)', // Use dynamic viewport height with new heights
          overflowX: 'hidden',
          maxWidth: '100vw'
        }}
      >
        <div className="container mx-auto px-4 py-4" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
          {renderContent()}
        </div>
      </main>
      
      {/* Bottom Navigation - Mobile and iPad */}
      <div className="xl:hidden">
        <BottomNav activeView={getActiveTab()} onNavigate={navigateTo} theme={theme} />
      </div>
      
      {/* Floating Upgrade Button - Show on most views, hide for paid subscribers */}
      {!['settings', 'privacy', 'terms', 'disclaimer'].includes(currentView) && !hasActiveSubscription() && (
        <FloatingUpgradeButton 
          onUpgradeClick={() => setShowUpgradeModal(true)}
          theme={theme}
          credits={getUserRemainingCredits()}
        />
      )}
      
      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        theme={theme}
        isServicesReady={isServicesInitialized}
      />

      {/* Onboarding Tour */}
      <OnboardingTour 
        onComplete={() => setShowOnboarding(false)}
        onUpgradeClick={() => setShowUpgradeModal(true)}
      />

      {/* Smart Conversion Modal */}
      <SmartConversionModal 
        onUpgradeClick={() => setShowUpgradeModal(true)}
        onClose={() => setShowSmartConversion(false)}
      />

      {/* Rating Prompt */}
      <RatingPrompt 
        onClose={() => setShowRatingPrompt(false)}
      />
    </div>
  );
};

export default App;