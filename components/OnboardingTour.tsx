import React, { useState, useEffect } from 'react';
import { shouldShowOnboarding, completeOnboarding } from '../services/conversionService';

interface OnboardingTourProps {
  onComplete: () => void;
  onUpgradeClick?: () => void;
}

interface TourStep {
  title: string;
  description: string;
  illustration: string;
  benefit: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to InkPreview! 🎨",
    description: "Transform your tattoo ideas into reality with AI-powered design generation.",
    illustration: "✨",
    benefit: "See your concepts before you commit"
  },
  {
    title: "Try Before You Ink 📸",
    description: "Upload a photo and see exactly how any tattoo will look on your skin.",
    illustration: "📱",
    benefit: "Perfect placement, every time"
  },
  {
    title: "Unlimited Creativity 🚀",
    description: "Generate original designs, get cover-up ideas, or visualize removals.",
    illustration: "🎯",
    benefit: "Explore every possibility"
  },
  {
    title: "Don't Risk Permanent Regret 💎",
    description: "For less than the cost of a fancy coffee, ensure your tattoo is exactly what you want before it's permanent.",
    illustration: "☕",
    benefit: "Peace of mind for life"
  }
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete, onUpgradeClick }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (shouldShowOnboarding()) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    completeOnboarding();
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[10000] bg-void-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-void-900 rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-void-700 relative">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-electric-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-magenta-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Progress Bar */}
        <div className="h-1 bg-void-800">
          <div
            className="h-full bg-gradient-to-r from-electric-500 to-magenta-500 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center relative z-10">
          {/* Illustration */}
          <div className="text-6xl mb-8 animate-float">
            {step.illustration}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-display font-bold mb-4 text-white uppercase tracking-wide">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-lg text-steel-300 mb-8 leading-relaxed font-light">
            {step.description}
          </p>

          {/* Benefit Badge */}
          <div className="inline-block bg-void-800 border border-void-700 px-4 py-2 rounded-full mb-8">
            <span className="text-sm font-medium text-electric-400 uppercase tracking-wider">
              {step.benefit}
            </span>
          </div>

          {/* Upgrade CTA for final step */}
          {isLastStep && onUpgradeClick && (
            <div className="mb-8 animate-slide-up">
              <button
                onClick={onUpgradeClick}
                className="w-full bg-gradient-to-r from-electric-500 to-magenta-500 hover:from-electric-400 hover:to-magenta-400 text-white px-8 py-4 rounded-xl font-heading uppercase tracking-wider text-sm transition-all duration-300 shadow-lg hover:shadow-neon-dual transform hover:scale-[1.02]"
              >
                Start Premium Journey
              </button>
              <p className="text-xs text-steel-500 mt-3 font-medium uppercase tracking-wide">
                Try it risk-free
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handleSkip}
              className="text-steel-500 hover:text-white font-medium transition-colors text-sm uppercase tracking-wider"
            >
              Skip
            </button>

            <div className="flex space-x-2">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentStep
                      ? 'bg-electric-500 w-6'
                      : index < currentStep
                        ? 'bg-electric-500/50'
                        : 'bg-void-700'
                    }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="bg-void-800 hover:bg-void-700 border border-void-600 hover:border-electric-500/50 text-white px-6 py-2 rounded-lg font-heading uppercase tracking-wider text-xs transition-all duration-300"
            >
              {isLastStep ? "Let's Start" : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;