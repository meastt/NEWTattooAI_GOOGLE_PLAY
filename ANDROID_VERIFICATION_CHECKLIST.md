# Quick Verification Script for Android Production Build

## ✅ What's Been Configured

### 1. Environment Variables Setup
- ✅ Created `.env.production.template` with RevenueCat configuration
- ✅ Added Android build scripts to `package.json`:
  - `npm run build:android` - Standard Android build
  - `npm run build:android:prod` - Production Android build with NODE_ENV=production

### 2. Android Gradle Configuration
- ✅ Updated `android/app/build.gradle` to handle environment variables
- ✅ Added `buildConfigField` for both debug and release builds
- ✅ Environment variables are now available during Android build process

### 3. Vite Configuration
- ✅ Verified `vite.config.ts` properly loads environment variables
- ✅ Production mode correctly loads `.env.production` file
- ✅ RevenueCat API key is properly injected into the build

### 4. Build Process
- ✅ Created comprehensive setup script (`setup-android-production.sh`)
- ✅ Created detailed documentation (`ANDROID_PRODUCTION_SETUP.md`)

## 🚀 Next Steps for You

### Step 1: Set Up Your Production Environment
```bash
# Run the setup script
./setup-android-production.sh

# Edit the .env.production file with your actual API keys
nano .env.production
```

### Step 2: Get Your RevenueCat Android Production API Key
1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Navigate to **Project Settings** → **API Keys**
3. Copy your **Android Production** API key (starts with `rcb_`)
4. Replace `YOUR_PRODUCTION_REVENUECAT_API_KEY` in `.env.production`

### Step 3: Build for Android Production
```bash
# Build for Android production
npm run build:android:prod

# Open Android Studio
npx cap open android
```

### Step 4: Create Signed APK/AAB in Android Studio
1. **Build** → **Generate Signed Bundle/APK**
2. Choose **Android App Bundle** (recommended for Google Play)
3. Use your existing signing key or create a new one
4. Build the release version

### Step 5: Upload to Google Play Console
1. Go to [Google Play Console](https://play.google.com/console/)
2. Upload your AAB file
3. Test with **Internal Testing** first
4. Verify payments work with test accounts

## 🔍 Verification Checklist

- [ ] `.env.production` file exists with actual RevenueCat API key
- [ ] RevenueCat API key is Android production key (starts with `rcb_`)
- [ ] Build completes without errors: `npm run build:android:prod`
- [ ] Android Studio opens successfully: `npx cap open android`
- [ ] Signed APK/AAB builds successfully in Android Studio
- [ ] Test purchases work in Google Play Console internal testing
- [ ] RevenueCat dashboard shows test purchases

## 🐛 Troubleshooting

### "Invalid API Key" Error
- Verify you're using Android production key (not iOS)
- Check `.env.production` file exists and has correct key
- Ensure key starts with `rcb_` for Android

### Build Failures
- Run `npm run build:android:prod` to see detailed error messages
- Check that all environment variables are set in `.env.production`
- Verify Vite build completes successfully before Capacitor copy

### Payment Issues
- Verify Google Play Console products match RevenueCat configuration
- Check RevenueCat dashboard for integration status
- Use Google Play Console test accounts for testing

## 📞 Support Resources
- [RevenueCat Android Integration Guide](https://docs.revenuecat.com/docs/android)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)

Your Android production build is now properly configured for RevenueCat payments! 🎉
