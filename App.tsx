import React, { useState, useCallback, useEffect } from 'react';
import type { View } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TattooTryOn from './components/TattooTryOn';
import TattooGenerator from './components/TattooGenerator';
import TattooRemoval from './components/TattooRemoval';
import PrivacyPolicy from './components/PrivacyPolicy';
import Disclaimer from './components/Disclaimer';
import Settings from './components/Settings';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import SavedIdeas from './components/SavedIdeas';
import UpgradeModal from './components/UpgradeModal';
import { initializeCreditService } from './services/creditService';
import { initializeSubscriptionService } from './services/subscriptionService';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
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
    // Initialize services on app start
    initializeCreditService();
    initializeSubscriptionService();
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const navigateTo = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  const getActiveTab = (): View => {
    if (['tryOn', 'generator', 'removal'].includes(currentView)) {
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
        return <TattooRemoval onNavigate={navigateTo} onUpgradeClick={() => setShowUpgradeModal(true)} />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'disclaimer':
        return <Disclaimer />;
      case 'settings':
        return <Settings onNavigate={navigateTo} />;
      default:
        return <Home />;
    }
  };

  const getBackButtonTarget = (): View => {
    if (['tryOn', 'generator', 'removal'].includes(currentView)) {
      return 'create';
    }
    return 'home';
  }

  const showHeader = !['home', 'create', 'saved'].includes(currentView);

  return (
    <div className={`min-h-screen font-sans flex flex-col relative overflow-hidden ${theme}`}>
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

      {showHeader && (
        <Header
          showBackButton={true}
          onBack={() => navigateTo(getBackButtonTarget())}
          theme={theme}
          toggleTheme={toggleTheme}
          onUpgradeClick={() => setShowUpgradeModal(true)}
        />
      )}
       {!showHeader && (
        <Header
          showBackButton={false}
          onBack={() => {}}
          theme={theme}
          toggleTheme={toggleTheme}
          onUpgradeClick={() => setShowUpgradeModal(true)}
        />
      )}
      <main className="flex-grow container mx-auto px-4 py-8 pb-24 relative z-10" style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}>
        {renderContent()}
      </main>
      <div className="md:hidden">
        <BottomNav activeView={getActiveTab()} onNavigate={navigateTo} />
      </div>
      <Footer onNavigate={navigateTo} />
      
      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        theme={theme}
      />
    </div>
  );
};

export default App;