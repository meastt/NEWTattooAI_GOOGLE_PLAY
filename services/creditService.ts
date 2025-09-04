import { supabase } from './supabaseClient';
import { 
  getUserRemainingCredits, 
  canGenerate as subscriptionCanGenerate, 
  consumeCredit as subscriptionConsumeCredit,
  hasActiveSubscription,
  getCurrentSubscriptionPlan
} from './subscriptionService';

export interface UserCredits {
  userId: string;
  credits: number;
  exportsUsed: number;
  isPremium: boolean;
  lastUpdated: string;
}

const CREDITS_STORAGE_KEY = 'tattoo_app_credits';
const DEFAULT_CREDITS = 5;
const MAX_FREE_EXPORTS = 3;

// Generate anonymous user ID
const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem('tattoo_app_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem('tattoo_app_user_id', userId);
  }
  return userId;
};

// Initialize user credits in localStorage
const initializeUserCredits = (): UserCredits => {
  const userId = getOrCreateUserId();
  const defaultCredits: UserCredits = {
    userId,
    credits: DEFAULT_CREDITS,
    exportsUsed: 0,
    isPremium: false,
    lastUpdated: new Date().toISOString()
  };
  
  localStorage.setItem(CREDITS_STORAGE_KEY, JSON.stringify(defaultCredits));
  return defaultCredits;
};

// Get user credits from localStorage
export const getUserCredits = (): UserCredits => {
  const stored = localStorage.getItem(CREDITS_STORAGE_KEY);
  if (!stored) {
    return initializeUserCredits();
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return initializeUserCredits();
  }
};

// Update user credits in localStorage and sync to Supabase
export const updateUserCredits = async (updates: Partial<UserCredits>): Promise<UserCredits> => {
  const current = getUserCredits();
  const updated: UserCredits = {
    ...current,
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  
  // Save to localStorage
  localStorage.setItem(CREDITS_STORAGE_KEY, JSON.stringify(updated));
  
  // Sync to Supabase if available
  if (supabase) {
    try {
      await supabase
        .from('user_credits')
        .upsert({
          user_id: updated.userId,
          credits: updated.credits,
          exports_used: updated.exportsUsed,
          is_premium: updated.isPremium,
          last_updated: updated.lastUpdated
        });
    } catch (error) {
      console.warn('Failed to sync credits to Supabase:', error);
    }
  }
  
  return updated;
};

// Sync credits from Supabase to localStorage
export const syncCreditsFromSupabase = async (): Promise<UserCredits> => {
  const localCredits = getUserCredits();
  
  if (!supabase) {
    return localCredits;
  }
  
  try {
    const { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', localCredits.userId)
      .single();
    
    if (error || !data) {
      // If no record exists in Supabase, create one
      await updateUserCredits({});
      return localCredits;
    }
    
    // If Supabase data is newer, update localStorage
    const supabaseCredits: UserCredits = {
      userId: data.user_id,
      credits: data.credits,
      exportsUsed: data.exports_used,
      isPremium: data.is_premium,
      lastUpdated: data.last_updated
    };
    
    if (new Date(supabaseCredits.lastUpdated) > new Date(localCredits.lastUpdated)) {
      localStorage.setItem(CREDITS_STORAGE_KEY, JSON.stringify(supabaseCredits));
      return supabaseCredits;
    }
    
    return localCredits;
  } catch (error) {
    console.warn('Failed to sync credits from Supabase:', error);
    return localCredits;
  }
};

// Check if user can generate (has credits) - now uses subscription system
export const canGenerate = (): boolean => {
  return subscriptionCanGenerate();
};

// Check if user can export/download
export const canExport = (): boolean => {
  const credits = getUserCredits();
  const hasSubscription = hasActiveSubscription();
  return hasSubscription || credits.exportsUsed < MAX_FREE_EXPORTS;
};

// Consume a credit for generation - now uses subscription system
export const consumeCredit = async (): Promise<{ success: boolean; remainingCredits: number }> => {
  return await subscriptionConsumeCredit();
};

// Consume an export
export const consumeExport = async (): Promise<{ success: boolean; remainingExports: number }> => {
  const current = getUserCredits();
  const hasSubscription = hasActiveSubscription();
  
  if (hasSubscription) {
    return { success: true, remainingExports: -1 }; // -1 indicates unlimited
  }
  
  if (current.exportsUsed >= MAX_FREE_EXPORTS) {
    return { success: false, remainingExports: 0 };
  }
  
  const updated = await updateUserCredits({ exportsUsed: current.exportsUsed + 1 });
  const remainingExports = MAX_FREE_EXPORTS - updated.exportsUsed;
  return { success: true, remainingExports };
};

// Upgrade to premium (legacy function - now handled by subscription system)
export const upgradeToPremium = async (): Promise<UserCredits> => {
  return await updateUserCredits({ isPremium: true });
};

// Get remaining exports count
export const getRemainingExports = (): number => {
  const credits = getUserCredits();
  const hasSubscription = hasActiveSubscription();
  if (hasSubscription) return -1; // Unlimited
  return Math.max(0, MAX_FREE_EXPORTS - credits.exportsUsed);
};

// Get total remaining credits (now uses subscription system)
export const getTotalRemainingCredits = (): number => {
  return getUserRemainingCredits();
};

// Get subscription info for display
export const getSubscriptionInfo = () => {
  const hasSubscription = hasActiveSubscription();
  const plan = getCurrentSubscriptionPlan();
  const totalCredits = getUserRemainingCredits();
  
  return {
    hasSubscription,
    plan,
    totalCredits,
    isUnlimited: hasSubscription && plan?.credits === -1
  };
};

// Initialize credits on app start
export const initializeCreditService = async (): Promise<UserCredits> => {
  return await syncCreditsFromSupabase();
};