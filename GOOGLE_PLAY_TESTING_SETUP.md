# Google Play Console Testing Setup Guide

## Overview
This guide will help you set up real testing on Google Play Console using Internal Testing, which allows you to test with real users and real payment processing.

## Prerequisites
- Google Play Console account ($25 one-time registration fee)
- Signed APK/AAB file
- RevenueCat Android production API key
- Google Play Console test accounts

## Step 1: Prepare Your App for Production

### 1.1 Set Up Production Environment Variables
```bash
# Make sure your .env.production has the correct Android production API key
nano .env.production

# Verify it contains:
VITE_REVENUECAT_API_KEY=rcb_your_actual_android_production_key
```

### 1.2 Build Production Version
```bash
# Build for Android production
npm run build:android:prod

# This creates the production build with your API keys
```

## Step 2: Create Signed APK/AAB in Android Studio

### 2.1 Open Android Studio
```bash
npx cap open android
```

### 2.2 Generate Signed Bundle (Recommended for Google Play)
1. In Android Studio: **Build** → **Generate Signed Bundle/APK**
2. Choose **Android App Bundle** (recommended)
3. Click **Next**

### 2.3 Create or Use Keystore
**Option A: Create New Keystore (First Time)**
1. Click **Create new...**
2. Fill in:
   - **Key store path**: Choose a secure location
   - **Password**: Create a strong password (save this!)
   - **Key alias**: `inkpreview-key`
   - **Key password**: Same as store password
   - **Validity**: 25 years
   - **Certificate**: Fill in your details
3. Click **OK**

**Option B: Use Existing Keystore**
1. Browse to your existing keystore file
2. Enter passwords
3. Click **Next**

### 2.4 Build Release Version
1. **Destination Folder**: Choose where to save the AAB
2. **Build Variants**: Select **release**
3. Click **Create**
4. Wait for build to complete

## Step 3: Set Up Google Play Console

### 3.1 Create App Listing
1. Go to [Google Play Console](https://play.google.com/console/)
2. Click **Create app**
3. Fill in:
   - **App name**: InkPreview
   - **Default language**: English
   - **App or game**: App
   - **Free or paid**: Free (with in-app purchases)
4. Click **Create app**

### 3.2 Upload Your AAB
1. Go to **Production** → **Releases**
2. Click **Create new release**
3. **Upload**: Drag your `.aab` file
4. **Release name**: `1.0 (1)` (or your version)
5. **Release notes**: Add what's new in this version
6. Click **Save**

## Step 4: Set Up In-App Products (RevenueCat Subscriptions)

### 4.1 Create Subscription Products
1. Go to **Monetize** → **Products** → **Subscriptions**
2. Click **Create subscription**

**Quick Spark (Weekly)**
- **Product ID**: `com.inkpreview.quickspark.weekly`
- **Name**: Quick Spark
- **Description**: Perfect for trying out new designs
- **Price**: $4.99
- **Billing period**: 1 week

**Deep Dive (Monthly)**
- **Product ID**: `com.inkpreview.deepdive.monthly`
- **Name**: Deep Dive
- **Description**: For serious tattoo enthusiasts
- **Price**: $12.99
- **Billing period**: 1 month

### 4.2 Configure RevenueCat Integration
1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. **Project Settings** → **Integrations**
3. **Google Play Console**:
   - Upload your Google Play service account JSON
   - Link your Google Play app
4. **Products**:
   - Add the subscription products you created
   - Match the Product IDs exactly

## Step 5: Set Up Internal Testing

### 5.1 Create Internal Testing Track
1. In Google Play Console: **Testing** → **Internal testing**
2. Click **Create new release**
3. **Upload**: Same AAB file as production
4. **Release notes**: Internal testing version
5. Click **Save**

### 5.2 Add Test Users
1. **Testers** tab → **Create email list**
2. Add test email addresses (Gmail accounts)
3. **Copy the opt-in URL**
4. Send the URL to your testers

### 5.3 Configure Test Accounts
1. **Setup** → **License testing**
2. Add test Gmail addresses
3. These accounts can make test purchases without real charges

## Step 6: Test Your App

### 6.1 Install Test Version
1. Testers click the opt-in URL
2. Install the app from Google Play
3. Sign in with test account

### 6.2 Test Core Features
- [ ] App launches without crashes
- [ ] HomeDashboard loads properly
- [ ] Navigation works correctly
- [ ] All 4 tools are accessible
- [ ] RevenueCat integration works

### 6.3 Test Payment Flow
1. Try to upgrade to subscription
2. Complete test purchase (no real charge)
3. Verify subscription status updates
4. Check RevenueCat dashboard for test purchases

## Step 7: Monitor and Debug

### 7.1 Google Play Console Monitoring
- **Crashes & ANRs**: Check for app crashes
- **Reviews**: Monitor user feedback
- **Analytics**: Track user behavior

### 7.2 RevenueCat Dashboard
- **Customers**: See test purchases
- **Revenue**: Track subscription metrics
- **Events**: Monitor purchase events

### 7.3 Debug Tools
```bash
# View device logs
adb logcat | grep InkPreview

# Check RevenueCat logs
adb logcat | grep RevenueCat
```

## Step 8: Common Issues and Solutions

### Issue: "App not available in your country"
**Solution**: 
- Check **Pricing & distribution** settings
- Ensure your country is selected

### Issue: "Invalid API key" in production
**Solution**:
- Verify you're using Android production key (starts with `rcb_`)
- Check `.env.production` file
- Rebuild: `npm run build:android:prod`

### Issue: Test purchases not working
**Solution**:
- Verify test accounts are added to License testing
- Check Google Play Console service account JSON in RevenueCat
- Ensure Product IDs match exactly

### Issue: App crashes on launch
**Solution**:
- Check Google Play Console crash reports
- Verify all environment variables are set
- Test on different devices

## Step 9: Going to Production

### 9.1 Final Checklist
- [ ] All features tested and working
- [ ] Payment flow tested with real test accounts
- [ ] App store listing complete
- [ ] Privacy policy and terms uploaded
- [ ] App content rating completed

### 9.2 Submit for Review
1. **Production** → **Releases**
2. Click **Review release**
3. Complete all required sections
4. Click **Start rollout to production**

### 9.3 Review Process
- **Review time**: 1-3 days typically
- **Status updates**: Check Play Console for updates
- **Common rejections**: Policy violations, crashes, missing permissions

## Step 10: Post-Launch Monitoring

### 10.1 Key Metrics to Watch
- **Install rate**: How many users install
- **Crash rate**: Should be < 1%
- **Subscription conversion**: Track upgrade rates
- **User reviews**: Monitor feedback

### 10.2 RevenueCat Analytics
- **MRR**: Monthly recurring revenue
- **Churn rate**: Subscription cancellations
- **LTV**: Customer lifetime value

## Quick Commands Reference

```bash
# Build for production
npm run build:android:prod

# Open Android Studio
npx cap open android

# Check connected devices
adb devices

# View logs
adb logcat | grep InkPreview

# Test RevenueCat integration
adb logcat | grep RevenueCat
```

## Support Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [RevenueCat Android Integration](https://docs.revenuecat.com/docs/android)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [Google Play Billing](https://developer.android.com/google/play/billing)

## Next Steps

1. **Set up your production environment** with real API keys
2. **Create signed AAB** in Android Studio
3. **Upload to Google Play Console** and set up internal testing
4. **Test with real users** and real payment processing
5. **Submit for production** review

Your app is ready for real-world testing! 🚀
