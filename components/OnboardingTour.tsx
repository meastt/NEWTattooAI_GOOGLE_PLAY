import React, { useState, useEffect } from 'react';
import { shouldShowOnboarding, completeOnboarding } from '../services/conversionService';

interface OnboardingTourProps {
  onComplete: () => void;
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
  }
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
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
    <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-fade-in">
        {/* Progress Bar */}
        <div className="h-1 bg-slate-200 dark:bg-slate-700">
          <div 
            className="h-full bg-gradient-to-r from-ink-500 to-neon-500 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Illustration */}
          <div className="text-6xl mb-6 animate-bounce">
            {step.illustration}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-display font-bold mb-4 text-slate-900 dark:text-white">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            {step.description}
          </p>

          {/* Benefit Badge */}
          <div className="inline-block bg-gradient-to-r from-ink-100 to-neon-100 dark:from-ink-900 dark:to-neon-900 px-4 py-2 rounded-full mb-8">
            <span className="text-sm font-semibold text-ink-600 dark:text-ink-400">
              {step.benefit}
            </span>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Skip
            </button>

            <div className="flex space-x-2">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-ink-500 w-6'
                      : index < currentStep
                      ? 'bg-neon-400'
                      : 'bg-slate-200 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-ink-500 to-neon-500 hover:from-ink-600 hover:to-neon-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLastStep ? "Let's Start!" : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;