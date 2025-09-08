import React, { useState, useCallback, useEffect } from 'react';
import type { View } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TattooTryOn from './components/TattooTryOn';
import TattooGenerator from './components/TattooGenerator';
import TattooRemovalOnly from './components/TattooRemovalOnly';
import TattooCoverup from './components/TattooCoverup';
import PrivacyPolicy from './components/PrivacyPolicy';
import Disclaimer from './components/Disclaimer';
import Settings from './components/Settings';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
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
    if (['home', 'privacy', 'disclaimer', 'settings'].includes(currentView)) {
        return 'home';
    }
    return currentView as View;
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
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
      case 'disclaimer':
        return <Disclaimer />;
      case 'settings':
        return <Settings onNavigate={navigateTo} theme={theme} toggleTheme={toggleTheme} />;
      default:
        return <Home />;
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
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
      paddingLeft: 'env(safe-area-inset-left, 0px)',
      paddingRight: 'env(safe-area-inset-right, 0px)'
    }}>
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10">
        <div className={`absolute inset-0 transition-all duration-1000 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-ink-950' 
            : 'bg-gradient-to-br from-slate-50 via-white to-ink-50'
        }`} />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-float ${
            theme === 'dark' ? 'bg-ink-500' : 'bg-ink-300'
          }`} />
          <div className={`absolute top-1/2 -left-20 w-60 h-60 rounded-full opacity-15 animate-float ${
            theme === 'dark' ? 'bg-neon-500' : 'bg-neon-300'
          }`} style={{ animationDelay: '2s' }} />
          <div className={`absolute bottom-20 right-1/4 w-40 h-40 rounded-full opacity-10 animate-float ${
            theme === 'dark' ? 'bg-skin-500' : 'bg-skin-300'
          }`} style={{ animationDelay: '4s' }} />
        </div>
        
        {/* Subtle Pattern Overlay */}
        <div className={`absolute inset-0 opacity-5 ${
          theme === 'dark' ? 'bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)]' : 'bg-[radial-gradient(circle_at_1px_1px,_black_1px,_transparent_0)]'
        }`} style={{ backgroundSize: '20px 20px' }} />
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
          paddingTop: '130px', // Keep same visual spacing
          paddingBottom: '130px',
          minHeight: 'calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 40px)'
        }}
      >
        <div className="container mx-auto px-4 py-8">
          {renderContent()}
        </div>
      </main>
      
      {/* Bottom Navigation - Mobile only */}
      <div className="md:hidden">
        <BottomNav activeView={getActiveTab()} onNavigate={navigateTo} theme={theme} />
      </div>
      
      {/* Floating Upgrade Button - Show on most views, hide for paid subscribers */}
      {!['settings', 'privacy', 'disclaimer'].includes(currentView) && !hasActiveSubscription() && (
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