# Subscription System Implementation

This document outlines the comprehensive subscription system implemented for the TattooAI application, including Apple In-App Purchase (IAP) integration and credit management.

## Overview

The subscription system provides two paid tiers in addition to the free tier:
- **Free Plan**: 5 initial credits, 3 free exports
- **Quick Spark (Weekly)**: $4.99/week, 30 credits per week
- **Deep Dive (Monthly)**: $12.99/month, 120 credits per month

## Architecture

### Core Components

1. **Subscription Service** (`services/subscriptionService.ts`)
   - Manages subscription state and credit allocation
   - Handles Apple IAP integration
   - Implements credit reset logic for renewals

2. **Credit Service** (`services/creditService.ts`)
   - Updated to work with subscription system
   - Maintains backward compatibility
   - Provides unified credit management interface

3. **Types** (`types.ts`)
   - Defines subscription statuses and data structures
   - Includes subscription plan definitions

4. **UI Components**
   - `UpgradeModal.tsx`: Displays subscription plans and handles purchases
   - `CreditDisplay.tsx`: Shows current credit status and subscription info

## Key Features

### Credit Priority System
- **Priority 1**: Free credits (used first)
- **Priority 2**: Subscription credits (used after free credits are exhausted)
- Automatic credit reset on subscription renewal

### Apple IAP Integration
- Mock implementation for demo purposes
- Ready for real Apple StoreKit integration
- Handles purchase validation and subscription management

### Credit Reset Logic
- Weekly plans reset every 7 days
- Monthly plans reset every 30 days
- Automatic detection of new subscription periods
- Graceful handling of expired subscriptions

## Database Schema

The system includes a comprehensive database schema (`subscription-schema.sql`) with:

- `user_subscriptions`: Main subscription data
- `subscription_plans`: Plan definitions and pricing
- `iap_transactions`: Purchase tracking
- `credit_usage_log`: Analytics and debugging

## Usage Examples

### Checking Credits
```typescript
import { getUserRemainingCredits, canGenerate } from './services/creditService';

// Check if user can generate
if (canGenerate()) {
  // Proceed with generation
}

// Get total remaining credits
const totalCredits = getUserRemainingCredits();
```

### Consuming Credits
```typescript
import { consumeCredit } from './services/creditService';

const result = await consumeCredit();
if (result.success) {
  // Credit consumed successfully
  console.log(`Remaining credits: ${result.remainingCredits}`);
} else {
  // No credits available, show upgrade modal
  showUpgradeModal();
}
```

### Subscription Management
```typescript
import { 
  getUserSubscription, 
  hasActiveSubscription, 
  getCurrentSubscriptionPlan 
} from './services/subscriptionService';

// Check subscription status
const subscription = getUserSubscription();
const isActive = hasActiveSubscription();
const plan = getCurrentSubscriptionPlan();
```

## Apple IAP Integration

### Product IDs
- Quick Spark: `com.tattooai.quickspark.weekly`
- Deep Dive: `com.tattooai.deepdive.monthly`

### Purchase Flow
1. User selects subscription plan
2. `initiateAppleIAP()` is called with product ID
3. Apple IAP processes the purchase
4. `userDidPurchaseSubscription()` is called on success
5. Subscription is activated and credits are allocated

### Real Implementation
To integrate with real Apple IAP:

1. Replace the mock `initiateAppleIAP()` function with actual StoreKit integration
2. Implement receipt validation
3. Handle subscription renewals and cancellations
4. Add proper error handling for failed purchases

## Credit Reset Logic

The system automatically handles credit resets:

1. **On App Start**: Checks if credits need resetting
2. **On Credit Consumption**: Validates subscription status
3. **Background Processing**: Can be implemented for periodic checks

### Reset Conditions
- Weekly plans: Reset if 7+ days since last reset
- Monthly plans: Reset if 30+ days since last reset
- Subscription expired: Credits set to 0, status set to EXPIRED

## Error Handling

The system includes comprehensive error handling:

- Network failures during Supabase sync
- Invalid subscription states
- Purchase failures
- Credit consumption errors

## Security Considerations

- All subscription data is stored locally and synced to Supabase
- Product IDs are validated before processing
- Transaction IDs are tracked to prevent duplicate processing
- Credit consumption is atomic and consistent

## Testing

The system includes mock implementations for testing:

- Mock Apple IAP responses
- Simulated purchase flows
- Test data generation
- Error simulation

## Future Enhancements

1. **Real Apple IAP Integration**
   - StoreKit 2 implementation
   - Receipt validation
   - Subscription status checking

2. **Analytics**
   - Credit usage tracking
   - Subscription conversion metrics
   - User behavior analysis

3. **Advanced Features**
   - Family sharing support
   - Promotional offers
   - Subscription management UI

## Migration from Legacy System

The new subscription system is designed to be backward compatible:

- Existing credit system continues to work
- Gradual migration path available
- No breaking changes to existing APIs

## Support

For questions or issues with the subscription system:

1. Check the console for error messages
2. Verify Supabase connection
3. Check localStorage for subscription data
4. Review the credit usage log in the database

## Conclusion

This subscription system provides a robust foundation for monetizing the TattooAI application while maintaining a smooth user experience. The modular design allows for easy extension and integration with real payment systems.
