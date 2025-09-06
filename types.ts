export type View = 'home' | 'create' | 'saved' | 'tryOn' | 'generator' | 'removal' | 'privacy' | 'disclaimer' | 'settings';

export type TattooStyle = 
  // Traditional & Classic
  | 'American Traditional' | 'Japanese Irezumi' | 'Neo-Traditional' | 'Traditional Sailor'
  // Modern & Contemporary  
  | 'Fine Line' | 'Minimalist' | 'Geometric' | 'Abstract' | 'Watercolor' | 'Sketch Style'
  // Black & Bold
  | 'Blackwork' | 'Tribal' | 'Dotwork' | 'Ornamental' | 'Mandala'
  // Realistic & Portrait
  | 'Realism' | 'Photorealism' | 'Portrait' | 'Biomechanical'
  // Text & Lettering
  | 'Script/Cursive' | 'Old English' | 'Sans Serif' | 'Serif/Roman' | 'Calligraphy' | 'Gothic Lettering' | 'Graffiti Style' | 'Hand Lettered'
  // Cultural & Spiritual
  | 'Celtic' | 'Norse/Viking' | 'Polynesian' | 'Aztec/Mayan' | 'Hindu/Buddhist' | 'Chinese'
  // Artistic & Unique
  | 'Surrealism' | 'Pop Art' | 'Comic Book' | 'Gothic' | 'Art Nouveau' | 'Chicano'
  // Fun & Playful
  | 'Cartoon' | 'Anime/Manga' | 'Retro/Vintage' | 'Pin-Up' | 'Kawaii/Cute';
export type TattooColor = 'Full Color' | 'Black and Grey' | 'Outline Only';
export type TattooSize = 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Extra Large';

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
