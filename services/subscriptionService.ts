import type { SubscriptionPlan, UserSubscription, SubscriptionStatus } from '../types';

// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'quick-spark',
    name: 'Quick Spark',
    price: 4.99,
    period: 'weekly',
    credits: 30,
    productId: 'com.inkpreview.quickspark.weekly',
    description: 'Perfect for trying out new designs',
    features: [
      '30 AI generations per week',
      'Unlimited exports & downloads',
      'Priority support',
      'Advanced AI models'
    ]
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive',
    price: 12.99,
    period: 'monthly',
    credits: 120,
    productId: 'com.inkpreview.deepdive.monthly',
    description: 'For serious tattoo enthusiasts',
    features: [
      '120 AI generations per month',
      'Unlimited exports & downloads',
      'Priority support',
      'Advanced AI models',
      'Early access to new features'
    ]
  }
];

const SUBSCRIPTION_STORAGE_KEY = 'tattoo_app_subscription';
const DEFAULT_FREE_CREDITS = 5;

// Generate anonymous user ID
const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem('tattoo_app_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem('tattoo_app_user_id', userId);
  }
  return userId;
};

// Initialize user subscription in localStorage
const initializeUserSubscription = (): UserSubscription => {
  const userId = getOrCreateUserId();
  const defaultSubscription: UserSubscription = {
    userId,
    subscriptionStatus: 'FREE',
    currentFreeCredits: DEFAULT_FREE_CREDITS,
    currentSubscriptionCredits: 0,
    subscriptionStartDate: null,
    subscriptionEndDate: null,
    lastCreditResetDate: null,
    productId: null,
    isActive: false,
    lastUpdated: new Date().toISOString()
  };

  localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(defaultSubscription));
  return defaultSubscription;
};

// Get user subscription from localStorage
export const getUserSubscription = (): UserSubscription => {
  const stored = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
  if (!stored) {
    return initializeUserSubscription();
  }

  try {
    const subscription = JSON.parse(stored);

    // Safety check: Prevent users from having excessive free credits
    // Max free credits should never exceed 50 (likely from testing)
    if (subscription.currentFreeCredits > 50 && subscription.subscriptionStatus === 'FREE') {
      console.warn('Detected excessive free credits, resetting to default');
      subscription.currentFreeCredits = DEFAULT_FREE_CREDITS;
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscription));
    }

    return subscription;
  } catch {
    return initializeUserSubscription();
  }
};

// Update user subscription in localStorage
export const updateUserSubscription = async (updates: Partial<UserSubscription>): Promise<UserSubscription> => {
  const current = getUserSubscription();
  const updated: UserSubscription = {
    ...current,
    ...updates,
    lastUpdated: new Date().toISOString()
  };

  // Save to localStorage
  localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(updated));

  return updated;
};

// Sync subscription (Legacy: Supabase removed, just returns local)
export const syncSubscriptionFromSupabase = async (): Promise<UserSubscription> => {
  return getUserSubscription();
};

// Check if subscription needs credit reset
const checkAndResetCredits = (subscription: UserSubscription): UserSubscription => {
  const now = new Date();
  const lastReset = subscription.lastCreditResetDate ? new Date(subscription.lastCreditResetDate) : null;
  const subscriptionEnd = subscription.subscriptionEndDate ? new Date(subscription.subscriptionEndDate) : null;

  // Check if subscription has expired
  if (subscriptionEnd && now > subscriptionEnd) {
    return {
      ...subscription,
      subscriptionStatus: 'EXPIRED',
      currentSubscriptionCredits: 0,
      isActive: false
    };
  }

  // Check if credits need to be reset for active subscription
  if (subscription.isActive && subscription.subscriptionStatus !== 'FREE' && lastReset) {
    const plan = SUBSCRIPTION_PLANS.find(p => p.productId === subscription.productId);
    if (plan) {
      const resetInterval = plan.period === 'weekly' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
      const timeSinceReset = now.getTime() - lastReset.getTime();

      if (timeSinceReset >= resetInterval) {
        return {
          ...subscription,
          currentSubscriptionCredits: plan.credits,
          lastCreditResetDate: now.toISOString()
        };
      }
    }
  }

  return subscription;
};

// Get total remaining credits for user
export const getUserRemainingCredits = (): number => {
  let subscription = getUserSubscription();

  // Check and apply credit resets
  subscription = checkAndResetCredits(subscription);

  // Update subscription if changes were made
  if (subscription !== getUserSubscription()) {
    updateUserSubscription(subscription);
  }

  return subscription.currentFreeCredits + subscription.currentSubscriptionCredits;
};

// Check if user can generate (has credits)
export const canGenerate = (): boolean => {
  return getUserRemainingCredits() > 0;
};

// Consume a credit for generation (with priority: free credits first)
export const consumeCredit = async (): Promise<{ success: boolean; remainingCredits: number }> => {
  const subscription = getUserSubscription();

  // Check and apply credit resets first
  const updatedSubscription = checkAndResetCredits(subscription);
  if (updatedSubscription !== subscription) {
    await updateUserSubscription(updatedSubscription);
  }

  // Priority 1: Use free credits first
  if (updatedSubscription.currentFreeCredits > 0) {
    const newSubscription = await updateUserSubscription({
      currentFreeCredits: updatedSubscription.currentFreeCredits - 1
    });
    return {
      success: true,
      remainingCredits: newSubscription.currentFreeCredits + newSubscription.currentSubscriptionCredits
    };
  }

  // Priority 2: Use subscription credits
  if (updatedSubscription.currentSubscriptionCredits > 0) {
    const newSubscription = await updateUserSubscription({
      currentSubscriptionCredits: updatedSubscription.currentSubscriptionCredits - 1
    });
    return {
      success: true,
      remainingCredits: newSubscription.currentFreeCredits + newSubscription.currentSubscriptionCredits
    };
  }

  return { success: false, remainingCredits: 0 };
};

// Handle successful Apple IAP purchase
export const userDidPurchaseSubscription = async (
  userId: string,
  productId: string,
  transactionId: string,
  expirationDate: string
): Promise<UserSubscription> => {
  const plan = SUBSCRIPTION_PLANS.find(p => p.productId === productId);
  if (!plan) {
    throw new Error(`Unknown product ID: ${productId}`);
  }

  const now = new Date();
  const endDate = new Date(expirationDate);

  return await updateUserSubscription({
    subscriptionStatus: plan.id === 'quick-spark' ? 'QUICK_SPARK' : 'DEEP_DIVE',
    currentSubscriptionCredits: plan.credits,
    subscriptionStartDate: now.toISOString(),
    subscriptionEndDate: endDate.toISOString(),
    lastCreditResetDate: now.toISOString(),
    productId: productId,
    isActive: true
  });
};

// Handle subscription cancellation/expiration
export const handleSubscriptionExpiration = async (): Promise<UserSubscription> => {
  return await updateUserSubscription({
    subscriptionStatus: 'EXPIRED',
    currentSubscriptionCredits: 0,
    isActive: false
  });
};

// Get subscription status
export const getSubscriptionStatus = (): SubscriptionStatus => {
  const subscription = getUserSubscription();
  return subscription.subscriptionStatus;
};

// Check if user has active subscription
export const hasActiveSubscription = (): boolean => {
  const subscription = getUserSubscription();
  return subscription.isActive && subscription.subscriptionStatus !== 'FREE' && subscription.subscriptionStatus !== 'EXPIRED';
};

// Get current subscription plan
export const getCurrentSubscriptionPlan = (): SubscriptionPlan | null => {
  const subscription = getUserSubscription();
  if (!subscription.productId) return null;

  return SUBSCRIPTION_PLANS.find(plan => plan.productId === subscription.productId) || null;
};

// Initialize subscription service
export const initializeSubscriptionService = async (): Promise<UserSubscription> => {
  return getUserSubscription();
};

// Apple IAP Integration via RevenueCat
export const initiateAppleIAP = async (productId: string): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  try {
    // Import RevenueCat service
    const { purchaseSubscription } = await import('./revenueCatService');

    // Use RevenueCat to handle the real purchase
    const result = await purchaseSubscription(productId);

    return {
      success: result.success,
      error: result.error,
      transactionId: result.success ? `revenuecat_${Date.now()}` : undefined
    };
  } catch (error) {
    console.error('RevenueCat purchase failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Purchase failed'
    };
  }
};
