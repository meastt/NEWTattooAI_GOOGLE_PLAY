# Complete Android Setup & Deployment Guide

> **📱 Just want to test in an emulator?** See [EMULATOR_TESTING_STEPS.md](EMULATOR_TESTING_STEPS.md) for a quick 5-minute setup.

This comprehensive guide covers everything from testing to Google Play Store deployment.

---

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Testing in Android Studio](#testing-in-android-studio)
3. [RevenueCat Configuration](#revenuecat-configuration)
4. [Building for Production](#building-for-production)
5. [Google Play Console Setup](#google-play-console-setup)
6. [Testing with Internal Testing](#testing-with-internal-testing)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Environment Setup

### Prerequisites

- Node.js installed
- Android Studio installed ([download](https://developer.android.com/studio))
- Google Play Developer account ($25 one-time fee)

### Step 1: Configure Environment Variables

Create `.env.production` file in project root:

```bash
# Copy the template (or create manually)
cp .env.production.template .env.production

# Edit with your actual keys
nano .env.production
```

Required keys:

```bash
# RevenueCat PUBLIC SDK KEY (NOT Secret API Key!)
VITE_REVENUECAT_API_KEY=rcb_or_goog_your_sdk_key_here

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Supabase Backend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### How to Get Your API Keys

#### RevenueCat SDK Key (The Tricky One!)

**⚠️ Common Mistake**: Don't use the Secret API Key (v1/v2) from the API Keys tab!

**Correct Location**:
1. Go to https://app.revenuecat.com/
2. Click **"Platforms"** in left sidebar (NOT "API Keys"!)
3. Select your app (iOS or Android - the SDK key works for both)
4. Find **"Public SDK Key"** or **"SDK Key"**
5. Copy it - should start with `rcb_` or `goog_`

**Why this matters**: The SDK key is for your mobile app. The Secret API Keys are for server-side REST API calls.

#### Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Create or copy your API key

#### Supabase Keys
1. Go to your Supabase project dashboard
2. Settings → API
3. Copy Project URL and anon/public key

---

## Securing Your API Keys (Crucial for Production!)

Google will warn you about "Unrestricted API keys". You **MUST** restrict them to prevent unauthorized use and potential billing issues.

### 1. Restrict by Application (Android)

1. Go to **Google Cloud Console** > **APIs & Services** > **Credentials**.
2. Click on your **Gemini API Key**.
3. Under **Application restrictions**, select **Android apps**.
4. Click **Add an item**.
5. **Package name**: `com.inkpreview.app`
6. **SHA-1 certificate fingerprint**:
   - You need the fingerprint from your **release keystore** (the one you created in Android Studio).
   - Run this command in your terminal (update path to your keystore):
     ```bash
     keytool -list -v -keystore ~/Documents/inkpreview-keystore.jks -alias inkpreview-key
     ```
   - Copy the **SHA1** fingerprint (it looks like `AA:BB:CC:11:22...`).
7. Click **Done** and **Save**.

### 2. Restrict by API

1. In the same API key settings, under **API restrictions**, select **Restrict key**.
2. Click the dropdown and select **Generative Language API** (this is the API for Gemini).
3. Click **Save**.

Now your key can ONLY be used by YOUR app to call Gemini.

---

## Testing in Android Studio

### Quick Testing Steps

```bash
# Build for Android
npm run build:android:prod

# Open Android Studio
npx cap open android
```

### Create Android Emulator

1. In Android Studio: **Tools** → **Device Manager**
2. Click **"Create Device"**
3. Choose **Pixel 7** or **Pixel 8**
4. Select **API Level 34** (Android 14) - download if needed
5. Click **Next** → **Finish**

### Run Your App

1. Select your emulator from the device dropdown
2. Click the green **▶️ Run** button
3. Wait for installation and launch

### Viewing Logs (Like Xcode Console)

- **View** → **Tool Windows** → **Logcat**
- Filter by package: `com.inkpreview.app`
- Look for RevenueCat initialization messages

---

## RevenueCat Configuration

### Finding Your SDK Key

The SDK key location varies based on your RevenueCat setup:

**Modern Projects**:
- Dashboard → **Platforms** → Select your app → "Public SDK Key"

**Older Projects**:
- Dashboard → **Project Settings** → **API Keys** → Look for "SDK Keys" section (separate from Secret Keys)

**Key Format**:
- ✅ Starts with `rcb_` or `goog_` (correct!)
- ❌ Starts with `sk_` (wrong - that's a Secret Key)

### Google Play Service Account

For production, you'll need to:
1. Create service account in Google Play Console
2. Download JSON key file
3. Upload to RevenueCat Dashboard → Integrations → Google Play

---

## Building for Production

### Step 1: Verify Your Configuration

```bash
# Run the readiness checker
./check-readiness.sh

# Should show:
# ✅ RevenueCat API key is configured (Android production key)
# ✅ Gemini API key is configured
# ✅ Supabase keys are configured
```

### Step 2: Build Production Bundle

```bash
# Install dependencies
npm install

# Build for production
npm run build:android:prod

# Open Android Studio
npx cap open android
```

### Step 3: Generate Signed Bundle in Android Studio

This is required for Google Play submission.

1. **Build** → **Generate Signed Bundle/APK**
2. Select **Android App Bundle** (.aab)
3. Click **Next**

#### Create Keystore (First Time Only)

1. Click **"Create new..."**
2. Fill in:
   - **Key store path**: `~/Documents/inkpreview-keystore.jks` (save somewhere secure!)
   - **Password**: Create a STRONG password (save in password manager!)
   - **Key alias**: `inkpreview-key`
   - **Key password**: Same as store password
   - **Validity**: 25 years
   - **Certificate**: Your name/organization
3. Click **OK**

⚠️ **CRITICAL**: Save your keystore file and password! You can NEVER update your app without them!

#### Build the Bundle

1. Select **release** build variant
2. Choose destination folder
3. Click **Create**
4. Wait 2-5 minutes for build

Your `.aab` file is ready for upload!

---

## Google Play Console Setup

### Step 1: Create Developer Account

1. Go to https://play.google.com/console/
2. Pay $25 registration fee (one-time)
3. Complete developer profile

### Step 2: Create App Listing

1. Click **"Create app"**
2. Fill in:
   - **App name**: InkPreview
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
3. Accept declarations
4. Click **"Create app"**

### Step 3: Complete Store Listing

Required sections:
- **App details**: Name, short description, full description
- **Graphics**: Screenshots (2+), feature graphic, icon
- **Categorization**: App category, content rating
- **Privacy Policy**: Public URL (required!)
- **Data Safety**: What data you collect

### Step 4: Create Subscription Products

1. **Monetize** → **Products** → **Subscriptions**
2. Click **"Create subscription"**

**Product 1: Quick Spark (Weekly)**
- Product ID: `com.inkpreview.quickspark.weekly` (MUST match exactly!)
- Name: Quick Spark
- Description: Perfect for trying out new designs. 30 AI generations per week.
- Price: $4.99 USD
- Billing period: 1 week

**Product 2: Deep Dive (Monthly)**
- Product ID: `com.inkpreview.deepdive.monthly` (MUST match exactly!)
- Name: Deep Dive
- Description: For serious tattoo enthusiasts. 120 AI generations per month.
- Price: $12.99 USD
- Billing period: 1 month

### Step 5: Configure RevenueCat Integration

1. Go to RevenueCat Dashboard
2. **Project Settings** → **Integrations**
3. Find **Google Play** section
4. Upload your service account JSON (from Play Console)
5. Add products with matching Product IDs

---

## Testing with Internal Testing

Before going live, test with real Google Play infrastructure.

### Step 1: Create Internal Testing Track

1. **Testing** → **Internal testing**
2. Click **"Create new release"**
3. Upload your `.aab` file
4. Add release notes
5. Click **"Save"**

### Step 2: Add Test Users

1. **Testers** tab → **"Create email list"**
2. Add Gmail addresses
3. Copy the opt-in URL
4. Send to testers

### Step 3: Configure License Testing

1. **Setup** → **License testing**
2. Add same Gmail addresses
3. These accounts can test purchases without real charges

### Step 4: Test Your App

- [ ] App launches successfully
- [ ] All 4 tools work (Try-On, Generator, Removal, Coverup)
- [ ] Navigation functions properly
- [ ] Subscription upgrade flow works
- [ ] Test purchase completes (no real charge)
- [ ] RevenueCat dashboard shows test purchase

---

## Production Deployment

### Final Checklist

Before submitting:

- [ ] All internal tests passed
- [ ] Payment flow verified
- [ ] Privacy policy uploaded and accessible
- [ ] Content rating completed
- [ ] Store listing 100% complete (Play Console will show %)
- [ ] Screenshots and graphics uploaded
- [ ] RevenueCat products match Play Console exactly

### Submit for Review

1. **Production** → **Releases**
2. Click **"Create new release"**
3. Upload your `.aab` file
4. Add release notes
5. **Review release** → Complete any missing items
6. Click **"Start rollout to production"**

### Review Timeline

- **Review time**: 1-3 days typically
- **Status updates**: Via email and Play Console
- **First release**: May take longer (up to 7 days)

---

## Troubleshooting

### Issue: "Invalid API Key"

**Symptoms**: RevenueCat initialization fails

**Solution**:
1. Verify you're using **Public SDK Key** (not Secret API Key)
2. Check key starts with `rcb_` or `goog_`
3. Key should be from **Platforms** section, not API Keys tab
4. Rebuild: `npm run build:android:prod`

### Issue: Build Fails in Android Studio

**Solution**:
1. Check Gradle logs for errors
2. Verify all environment variables are set in `.env.production`
3. Try: **Build** → **Clean Project** → **Rebuild Project**
4. Check Android Studio is up to date

### Issue: Test Purchases Not Working

**Solution**:
1. Verify test accounts added to License Testing
2. Check service account JSON uploaded to RevenueCat
3. Ensure Product IDs match EXACTLY (case-sensitive!)
4. Wait 2-3 hours after creating products (Google Play sync delay)

### Issue: App Crashes on Launch

**Solution**:
1. Check Logcat for error messages
2. Verify all API keys are correct
3. Test on different emulator/device
4. Check Google Play Console → Crashes & ANRs

### Issue: Emulator is Slow

**Solution**:
1. Enable hardware acceleration in AVD settings
2. Allocate more RAM (4GB minimum, 8GB recommended)
3. Use x86_64 system images (not ARM)
4. Close other apps to free up system resources

---

## Quick Command Reference

```bash
# Setup
./setup-android-production.sh           # Create .env.production template
./check-readiness.sh                    # Verify configuration

# Development
npm install                             # Install dependencies
npm run dev                             # Run in browser (testing)

# Android
npm run build:android:prod             # Build for Android production
npx cap open android                   # Open Android Studio
npx cap run android                    # Build & run directly

# Debugging
adb devices                            # List connected devices
adb logcat | grep InkPreview          # View app logs
adb logcat | grep RevenueCat          # View RevenueCat logs
```

---

## Support Resources

- **RevenueCat**: https://docs.revenuecat.com/docs/android
- **Android Studio**: https://developer.android.com/studio
- **Capacitor**: https://capacitorjs.com/docs/android
- **Google Play Console**: https://support.google.com/googleplay/android-developer/

---

## Next Steps

1. ✅ Complete environment setup
2. ✅ Test in Android emulator
3. ✅ Create signed bundle
4. ✅ Set up Google Play Console
5. ✅ Test with Internal Testing
6. ✅ Submit for production review
7. ✅ Monitor and iterate!

**Your app is ready for the world! 🚀**

