import { Purchases, PACKAGE_TYPE, PurchasesOffering } from '@revenuecat/purchases-capacitor';
import type { SubscriptionPlan, UserSubscription, SubscriptionStatus } from '../types';

// RevenueCat API Key from environment variables
const REVENUECAT_API_KEY = import.meta.env.VITE_REVENUECAT_API_KEY || '';

// Debug logging for environment variables (simplified)
console.log('RevenueCat Service Loading...');

// Subscription Plans Configuration (matches your existing plans)
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

// Track if RevenueCat has been configured to prevent double initialization
let isRevenueCatConfigured = false;

// Initialize RevenueCat
export const initializeRevenueCat = async (): Promise<void> => {
  try {
    if (isRevenueCatConfigured) {
      console.log('RevenueCat already configured, skipping initialization');
      return;
    }

    // Check API key configuration
    console.log('RevenueCat Configuration Check:', {
      hasKey: !!REVENUECAT_API_KEY,
      keyLength: REVENUECAT_API_KEY.length,
      keyPrefix: REVENUECAT_API_KEY ? REVENUECAT_API_KEY.substring(0, 10) : 'NO_KEY'
    });

    if (!REVENUECAT_API_KEY || REVENUECAT_API_KEY === 'YOUR_API_KEY_HERE') {
      // In production, this should throw an error
      const errorMsg = 'RevenueCat API key not configured. The key is: ' + (REVENUECAT_API_KEY || 'undefined');
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    // Initialize RevenueCat with your API key
    await Purchases.configure({ 
      apiKey: REVENUECAT_API_KEY,
      appUserID: getOrCreateUserId(),
      // Enable automatic collection of Apple Search Ads attribution
      shouldShowInAppMessagesAutomatically: true,
      // Enable automatic collection of subscriber attributes
      shouldAutomaticallySyncSubscriberAttributes: true
    });
    
    isRevenueCatConfigured = true;
    console.log('RevenueCat initialized successfully');
  } catch (error: any) {
    console.error('Failed to initialize RevenueCat:', error);
    console.error('API Key used:', REVENUECAT_API_KEY);
    // Re-throw the error so you can see it in production
    throw error;
  }
};

// Generate anonymous user ID (same as before)
const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem('tattoo_app_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem('tattoo_app_user_id', userId);
  }
  return userId;
};

// Initialize user subscription in localStorage (same as before)
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

// Get available offerings from RevenueCat
export const getAvailableOfferings = async (): Promise<PurchasesOffering[]> => {
  try {
    if (!isRevenueCatConfigured) {
      await initializeRevenueCat();
    }
    
    const offerings = await Purchases.getOfferings();
    
    if (offerings.current) {
      // Return available packages
      return [offerings.current];
    }
    
    return [];
  } catch (error) {
    console.error('Failed to get offerings:', error);
    return [];
  }
};

// Purchase a subscription using RevenueCat
export const purchaseSubscription = async (productId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Ensure RevenueCat is configured before making purchase
    if (!isRevenueCatConfigured) {
      await initializeRevenueCat();
    }
    
    // Get current offerings
    const offerings = await Purchases.getOfferings();
    
    if (!offerings.current) {
      return { success: false, error: 'No subscription offerings available' };
    }
    
    // Find the package that matches our product ID
    const targetPackage = offerings.current.availablePackages.find(
      pkg => pkg.product.identifier === productId
    );
    
    if (!targetPackage) {
      return { success: false, error: 'Subscription plan not found' };
    }
    
    // Purchase the package - this will trigger Apple's payment flow
    const purchaserInfo = await Purchases.purchasePackage({ aPackage: targetPackage });
    
    // Check if the purchase was successful
    if (purchaserInfo.customerInfo.entitlements.active) {
      // Update local subscription state
      const plan = SUBSCRIPTION_PLANS.find(p => p.productId === productId);
      if (plan) {
        await updateUserSubscription({
          subscriptionStatus: plan.id === 'quick-spark' ? 'QUICK_SPARK' : 'DEEP_DIVE',
          currentSubscriptionCredits: plan.credits,
          subscriptionStartDate: new Date().toISOString(),
          subscriptionEndDate: null, // RevenueCat manages this
          lastCreditResetDate: new Date().toISOString(),
          productId: productId,
          isActive: true
        });
      }
      
      return { success: true };
    } else {
      return { success: false, error: 'Purchase was not activated' };
    }
    
  } catch (error: any) {
    console.error('Purchase failed:', error);
    
    // Handle specific error cases
    if (error.code === 'PURCHASE_CANCELLED_ERROR') {
      return { success: false, error: 'Purchase was cancelled' };
    } else if (error.code === 'PURCHASE_NOT_ALLOWED_ERROR') {
      return { success: false, error: 'Purchases not allowed on this device' };
    } else if (error.code === 'PAYMENT_PENDING_ERROR') {
      return { success: false, error: 'Payment is pending approval' };
    }
    
    return { success: false, error: error.message || 'Purchase failed' };
  }
};

// Check current subscription status from RevenueCat
export const syncSubscriptionStatus = async (): Promise<UserSubscription> => {
  try {
    // Ensure RevenueCat is configured before syncing
    if (!isRevenueCatConfigured) {
      await initializeRevenueCat();
    }
    
    const purchaserInfo = await Purchases.getCustomerInfo();
    const localSubscription = getUserSubscription();
    
    // Check if user has active entitlements
    const hasActiveSubscription = Object.keys(purchaserInfo.entitlements.active).length > 0;
    
    if (hasActiveSubscription) {
      // User has active subscription - sync the status
      const activeEntitlement = Object.values(purchaserInfo.entitlements.active)[0];
      const plan = SUBSCRIPTION_PLANS.find(p => p.productId === activeEntitlement.productIdentifier);
      
      if (plan) {
        return await updateUserSubscription({
          subscriptionStatus: plan.id === 'quick-spark' ? 'QUICK_SPARK' : 'DEEP_DIVE',
          currentSubscriptionCredits: plan.credits,
          productId: plan.productId,
          isActive: true,
          subscriptionEndDate: activeEntitlement.expirationDate || null
        });
      }
    } else {
      // No active subscription
      if (localSubscription.isActive) {
        return await updateUserSubscription({
          subscriptionStatus: 'EXPIRED',
          currentSubscriptionCredits: 0,
          isActive: false
        });
      }
    }
    
    return localSubscription;
  } catch (error) {
    console.error('Failed to sync subscription status:', error);
    return getUserSubscription();
  }
};

// Check if subscription needs credit reset
const checkAndResetCredits = (subscription: UserSubscription): UserSubscription => {
  const now = new Date();
  const lastReset = subscription.lastCreditResetDate ? new Date(subscription.lastCreditResetDate) : null;
  
  // For RevenueCat, we rely on their subscription management
  // But we still handle credit resets for active subscriptions
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

// Consume a credit for generation
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

// Initialize RevenueCat service (assumes RevenueCat is already initialized)
export const initializeSubscriptionService = async (): Promise<UserSubscription> => {
  return await syncSubscriptionStatus();
};