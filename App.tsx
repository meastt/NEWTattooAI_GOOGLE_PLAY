import React, { useState, useCallback, useEffect } from 'react';
import type { View } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TattooTryOn from './components/TattooTryOn';
import TattooGenerator from './components/TattooGenerator';
import TattooRemoval from './components/TattooRemoval';
import PrivacyPolicy from './components/PrivacyPolicy';
import Disclaimer from './components/Disclaimer';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import SavedIdeas from './components/SavedIdeas';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
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
    if (['home', 'privacy', 'disclaimer'].includes(currentView)) {
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
        return <TattooTryOn onNavigate={navigateTo} />;
      case 'generator':
        return <TattooGenerator onNavigate={navigateTo} />;
      case 'removal':
        return <TattooRemoval onNavigate={navigateTo} />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'disclaimer':
        return <Disclaimer />;
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
    <div className={`min-h-screen font-sans flex flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 ${theme}`}>
      {showHeader && (
        <Header
          showBackButton={true}
          onBack={() => navigateTo(getBackButtonTarget())}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
       {!showHeader && (
        <Header
          showBackButton={false}
          onBack={() => {}}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
      <main className="flex-grow container mx-auto px-4 py-8 pb-24">
        {renderContent()}
      </main>
      <div className="md:hidden">
        <BottomNav activeView={getActiveTab()} onNavigate={navigateTo} />
      </div>
      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export default App;