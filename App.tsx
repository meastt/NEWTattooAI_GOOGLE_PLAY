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
  const [theme] = useState<Theme>('dark'); // Enforce dark mode

  useEffect(() => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');

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
  }, []);

  const toggleTheme = () => {
    // Theme toggle disabled - always dark
  };

  const navigateTo = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

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
    // Flattened hierarchy: Tools go back to Home, not Create menu
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
      {/* Premium Studio Background */}
      <div className="fixed inset-0 -z-10 bg-onyx-950">
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-onyx-900/50 to-onyx-950 pointer-events-none" />

        {/* Very subtle ambient glow - refined */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-electric-900/10 to-transparent opacity-40 pointer-events-none" />
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
          paddingBottom: 'env(safe-area-inset-bottom, 20px)', // Minimal bottom padding since nav is gone
          minHeight: '100dvh',
          overflowX: 'hidden',
          maxWidth: '100vw'
        }}
      >
        <div className="container mx-auto px-4 py-4" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
          {renderContent()}
        </div>
      </main>

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