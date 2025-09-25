# Android Studio Testing Guide for InkPreview

## Overview
This guide will walk you through testing your InkPreview app in Android Studio, similar to how you'd test in Xcode with simulators.

## Prerequisites
- Android Studio installed (download from [developer.android.com](https://developer.android.com/studio))
- Your app built and ready (we'll do this together)

## Step 1: Build Your App for Android

### First, ensure your environment is set up:
```bash
# Make sure you have your production API keys
cp .env.production.template .env.production
# Edit .env.production with your actual RevenueCat API key
```

### Build the app:
```bash
# Build for Android production
npm run build:android:prod

# This will:
# 1. Build your React app with production environment variables
# 2. Copy the built files to the Android project
```

## Step 2: Open Android Studio

### Launch Android Studio:
1. Open Android Studio
2. Click "Open an existing Android Studio project"
3. Navigate to your project folder
4. Select the `android` folder (not the root project folder)
5. Click "OK"

**Note**: This is similar to opening an `.xcodeproj` file in Xcode.

## Step 3: Set Up Android Virtual Device (AVD)

### Create a Virtual Device (like iOS Simulator):
1. In Android Studio, go to **Tools** → **AVD Manager**
2. Click **"Create Virtual Device"**
3. Choose a device (recommended: **Pixel 7** or **Pixel 8**)
4. Select a system image:
   - **API Level 34** (Android 14) - Recommended
   - **API Level 33** (Android 13) - Also good
5. Click **"Next"** → **"Finish"**

### Start the Virtual Device:
1. In AVD Manager, click the **▶️ Play button** next to your device
2. Wait for the emulator to boot up (takes 1-2 minutes first time)

## Step 4: Build and Run Your App

### Method 1: Using Android Studio (Recommended)
1. In Android Studio, click the **▶️ Run button** (green triangle)
2. Select your virtual device from the dropdown
3. Click **"OK"**
4. Android Studio will:
   - Build your app
   - Install it on the emulator
   - Launch it automatically

### Method 2: Using Terminal (Alternative)
```bash
# In your project root
npx cap run android

# This will:
# 1. Build your app
# 2. Open Android Studio
# 3. Install and run on connected device/emulator
```

## Step 5: Testing Your App

### What to Test:
1. **App Launch**: Does the app open without crashes?
2. **Home Dashboard**: Does the new dashboard load properly?
3. **Navigation**: Test bottom navigation between screens
4. **RevenueCat Integration**: Test subscription flow (use test accounts)
5. **Core Features**: Test each tool (Try-On, Generator, etc.)

### Debugging Tips:

#### View Logs (like Xcode Console):
1. In Android Studio, go to **View** → **Tool Windows** → **Logcat**
2. Filter by your app package: `com.inkpreview.app`
3. Look for errors or RevenueCat initialization messages

#### Check Environment Variables:
Look for logs like:
```
RevenueCat Configuration Check: {
  hasKey: true,
  keyLength: 32,
  keyPrefix: "rcb_..."
}
```

## Step 6: Testing RevenueCat Payments

### Set Up Test Accounts:
1. Go to [Google Play Console](https://play.google.com/console/)
2. Navigate to **Setup** → **License testing**
3. Add test accounts (Gmail addresses)
4. These accounts can make test purchases without real charges

### Test Purchase Flow:
1. In your app, try to upgrade to a subscription
2. Use a test account to complete the purchase
3. Verify the subscription status updates correctly

## Step 7: Common Issues and Solutions

### Issue: "App not installed" Error
**Solution**: 
```bash
# Clean and rebuild
npm run build:android:prod
# Then try running again
```

### Issue: RevenueCat "Invalid API Key"
**Solution**:
1. Check your `.env.production` file has the correct Android API key
2. Verify the key starts with `rcb_` (Android) not `rcb_` (iOS)
3. Rebuild: `npm run build:android:prod`

### Issue: App Crashes on Launch
**Solution**:
1. Check Logcat for error messages
2. Verify all environment variables are set
3. Try running on a different virtual device

### Issue: Slow Emulator Performance
**Solution**:
1. Enable hardware acceleration in AVD settings
2. Allocate more RAM to the emulator (4GB+ recommended)
3. Use x86_64 system images for better performance

## Step 8: Building for Release (Google Play)

### Generate Signed APK/AAB:
1. In Android Studio: **Build** → **Generate Signed Bundle/APK**
2. Choose **Android App Bundle** (recommended for Google Play)
3. Create or use existing keystore
4. Build release version

### Upload to Google Play Console:
1. Go to [Google Play Console](https://play.google.com/console/)
2. Create new app or update existing
3. Upload your AAB file
4. Set up store listing and pricing
5. Submit for review

## Android Studio vs Xcode Comparison

| Xcode | Android Studio |
|-------|----------------|
| iOS Simulator | Android Virtual Device (AVD) |
| Console Logs | Logcat |
| .xcodeproj | android/ folder |
| Build & Run (⌘R) | Run button (▶️) |
| Product → Archive | Build → Generate Signed Bundle |
| App Store Connect | Google Play Console |

## Quick Commands Reference

```bash
# Build for Android
npm run build:android:prod

# Run on connected device/emulator
npx cap run android

# Open Android Studio
npx cap open android

# Check connected devices
adb devices

# View logs
adb logcat | grep InkPreview
```

## Next Steps

1. **Set up your `.env.production`** with actual API keys
2. **Create an AVD** in Android Studio
3. **Build and test** your app
4. **Test RevenueCat** with test accounts
5. **Generate signed AAB** for Google Play upload

## Support Resources

- [Android Studio Documentation](https://developer.android.com/studio)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [RevenueCat Android Integration](https://docs.revenuecat.com/docs/android)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)

Your app is now ready for Android testing! The process is very similar to iOS development, just with different tools. 🚀
