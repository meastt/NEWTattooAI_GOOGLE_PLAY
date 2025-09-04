export type View = 'home' | 'create' | 'saved' | 'tryOn' | 'generator' | 'removal' | 'privacy' | 'disclaimer' | 'settings';

export type TattooStyle = 'American Traditional' | 'Japanese Irezumi' | 'Fine Line' | 'Neo-Traditional' | 'Tribal' | 'Realism' | 'Blackwork';
export type TattooColor = 'Full Color' | 'Black and Grey' | 'Outline Only';

export type SubscriptionStatus = 'FREE' | 'QUICK_SPARK' | 'DEEP_DIVE' | 'EXPIRED';

export interface Idea {
  id: number;
  image_url?: string;
  image_data_url?: string;
  prompt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'weekly' | 'monthly';
  credits: number;
  productId: string;
  description: string;
  features: string[];
}

export interface UserSubscription {
  userId: string;
  subscriptionStatus: SubscriptionStatus;
  currentFreeCredits: number;
  currentSubscriptionCredits: number;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  lastCreditResetDate: string | null;
  productId: string | null;
  isActive: boolean;
  lastUpdated: string;
}
