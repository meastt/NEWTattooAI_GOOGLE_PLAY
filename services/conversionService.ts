// Conversion optimization service for InkPreview
// World-class conversion tactics tailored for tattoo app users

interface UserJourney {
  userId: string;
  generationsUsed: number;
  sharesCount: number;
  savesCount: number;
  lastActiveDate: string;
  hasSharedFirst: boolean;
  onboardingCompleted: boolean;
  conversionTouchpoints: ConversionTouchpoint[];
  lastConversionAttempt: string | null;
  currentStreak: number; // consecutive days of usage
}

interface ConversionTouchpoint {
  type: 'onboarding' | 'value_demo' | 'social_proof' | 'scarcity' | 'success_moment';
  timestamp: string;
  action: string;
  converted: boolean;
}

const CONVERSION_STORAGE_KEY = 'inkpreview_conversion_data';

// Get user's conversion journey data
export const getUserJourney = (): UserJourney => {
  const stored = localStorage.getItem(CONVERSION_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse conversion data');
    }
  }

  // Initialize new user journey
  const newJourney: UserJourney = {
    userId: localStorage.getItem('tattoo_app_user_id') || 'anonymous',
    generationsUsed: 0,
    sharesCount: 0,
    savesCount: 0,
    lastActiveDate: new Date().toISOString(),
    hasSharedFirst: false,
    onboardingCompleted: false,
    conversionTouchpoints: [],
    lastConversionAttempt: null,
    currentStreak: 1
  };

  localStorage.setItem(CONVERSION_STORAGE_KEY, JSON.stringify(newJourney));
  return newJourney;
};

// Update user journey data
export const updateUserJourney = (updates: Partial<UserJourney>): UserJourney => {
  const current = getUserJourney();
  const updated = { ...current, ...updates, lastActiveDate: new Date().toISOString() };
  localStorage.setItem(CONVERSION_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

// Track user actions for conversion optimization
export const trackUserAction = (action: 'generate' | 'share' | 'save') => {
  const journey = getUserJourney();
  
  const updates: Partial<UserJourney> = {};
  
  switch (action) {
    case 'generate':
      updates.generationsUsed = (journey.generationsUsed || 0) + 1;
      break;
    case 'share':
      updates.sharesCount = (journey.sharesCount || 0) + 1;
      if (!journey.hasSharedFirst) {
        updates.hasSharedFirst = true;
      }
      break;
    case 'save':
      updates.savesCount = (journey.savesCount || 0) + 1;
      break;
  }
  
  updateUserJourney(updates);
};

// Smart conversion timing - when should we show upgrade prompts?
export const shouldShowConversionPrompt = (): { show: boolean; type: string; reason: string } => {
  const journey = getUserJourney();
  const now = new Date();
  const lastAttempt = journey.lastConversionAttempt ? new Date(journey.lastConversionAttempt) : null;
  
  // Don't annoy users - minimum 24hr cooldown between prompts
  if (lastAttempt && (now.getTime() - lastAttempt.getTime()) < 24 * 60 * 60 * 1000) {
    return { show: false, type: 'cooldown', reason: 'Recent attempt' };
  }

  // MOMENT 1: After first successful share (highest intent)
  if (journey.hasSharedFirst && journey.generationsUsed >= 2) {
    return { 
      show: true, 
      type: 'post_share_success', 
      reason: 'User shared = high engagement' 
    };
  }

  // MOMENT 2: Hit free credit limit (pain point)
  if (journey.generationsUsed >= 3 && !journey.hasSharedFirst) {
    return { 
      show: true, 
      type: 'credit_limit_educational', 
      reason: 'Credits depleted, educate about value' 
    };
  }

  // MOMENT 3: Power user pattern (high value user)
  if (journey.generationsUsed >= 8 && (journey.sharesCount + journey.savesCount) >= 3) {
    return { 
      show: true, 
      type: 'power_user_conversion', 
      reason: 'High usage pattern detected' 
    };
  }

  return { show: false, type: 'none', reason: 'Not optimal timing' };
};

// Get personalized conversion message based on user behavior
export const getConversionMessage = (type: string) => {
  switch (type) {
    case 'post_share_success':
      return {
        title: "Love your designs? 🎨",
        subtitle: "Create unlimited tattoo concepts",
        message: "You just shared an amazing design! Unlock unlimited generations to explore every tattoo idea you've ever had.",
        cta: "Start 7-Day Free Trial",
        urgency: false,
        socialProof: true
      };

    case 'credit_limit_educational':
      return {
        title: "Ready for more ideas? 💡",
        subtitle: "Your creativity shouldn't have limits",
        message: "You've explored our basic features. See what unlimited generations can do for your tattoo journey.",
        cta: "Unlock Full Access",
        urgency: false,
        socialProof: false
      };

    case 'power_user_conversion':
      return {
        title: "You're a tattoo visionary! ⚡",
        subtitle: "Join our pro community",
        message: "You've created amazing designs. Join thousands of tattoo enthusiasts with unlimited access.",
        cta: "Upgrade Now - 50% Off",
        urgency: true,
        socialProof: true
      };

    default:
      return {
        title: "Unlock Your Tattoo Potential",
        subtitle: "Create unlimited designs",
        message: "Take your tattoo ideas to the next level with unlimited generations.",
        cta: "Try Premium",
        urgency: false,
        socialProof: false
      };
  }
};

// Track conversion attempt
export const trackConversionAttempt = (type: string) => {
  const journey = getUserJourney();
  const touchpoint: ConversionTouchpoint = {
    type: type as any,
    timestamp: new Date().toISOString(),
    action: type,
    converted: false
  };
  
  updateUserJourney({
    lastConversionAttempt: new Date().toISOString(),
    conversionTouchpoints: [...journey.conversionTouchpoints, touchpoint]
  });
};

// Simple onboarding check
export const shouldShowOnboarding = (): boolean => {
  const journey = getUserJourney();
  return !journey.onboardingCompleted && journey.generationsUsed === 0;
};

export const completeOnboarding = () => {
  updateUserJourney({ onboardingCompleted: true });
};

// App Store rating prompt (strategic timing)
export const shouldShowRatingPrompt = (): boolean => {
  const journey = getUserJourney();
  
  // Only ask for rating after user has shared (happy moment)
  if (!journey.hasSharedFirst) return false;
  
  // Ask after they've used the app meaningfully (3+ generations, 2+ shares)
  if (journey.generationsUsed >= 3 && journey.sharesCount >= 2) {
    // Check if we haven't asked recently
    const lastRatingPrompt = localStorage.getItem('last_rating_prompt');
    if (!lastRatingPrompt) return true;
    
    const daysSinceLastPrompt = (Date.now() - parseInt(lastRatingPrompt)) / (1000 * 60 * 60 * 24);
    return daysSinceLastPrompt > 30; // Only ask once per month max
  }
  
  return false;
};

export const trackRatingPromptShown = () => {
  localStorage.setItem('last_rating_prompt', Date.now().toString());
};