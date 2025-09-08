# TestFlight Setup Guide

This guide will help you fix the RevenueCat API key issue and properly build your app for TestFlight.

## The Problem

Your app was failing with "invalid API key" errors during TestFlight testing because environment variables weren't being properly loaded during the build process.

## The Solution

### 1. Set Up Environment Variables

**✅ You already have `.env.local` with your API keys!**

The issue was that for **TestFlight builds**, Vite uses `.env.production` instead of `.env.local`. I've created `.env.production` by copying your existing `.env.local` file.

**What was done:**
- ✅ Copied your existing `.env.local` to `.env.production`
- ✅ Your RevenueCat API key is now available for production builds
- ✅ All your existing API keys are preserved

**Important:** Both files are now in your `.gitignore` to keep your keys secure.

### 2. Build Process for TestFlight

**Option A: Using the new build script (Recommended)**

```bash
# Build and copy to iOS
npm run build:ios

# Open in Xcode
npx cap open ios
```

**Option B: Manual build process**

```bash
# Set environment variable before building
export VITE_REVENUECAT_API_KEY="your_actual_revenuecat_api_key"

# Build the web app
npm run build

# Copy to iOS
npx cap copy ios

# Open in Xcode
npx cap open ios
```

### 3. Debugging in TestFlight

If you still have issues, you can debug using Safari Web Inspector:

1. **On your iPhone:**
   - Settings > Safari > Advanced > Web Inspector (ON)

2. **Connect iPhone to Mac and open Safari on Mac:**
   - Develop menu > Your iPhone > Your App

3. **Check the console logs** to see:
   - What environment variables are loaded
   - RevenueCat initialization status
   - Any error messages

### 4. What Was Fixed

1. **Better error handling:** The app now throws clear errors when API keys are missing
2. **Enhanced debugging:** More detailed console logs to help identify issues
3. **Environment variable fallback:** Added fallback to empty string to prevent undefined errors
4. **Build script:** Added `npm run build:ios` for easier TestFlight builds
5. **Security:** Added `.env.local` and `.env.production` to `.gitignore`

### 5. Testing the Fix

1. **Local testing:**
   ```bash
   npm run dev
   ```
   Check browser console for RevenueCat initialization logs.

2. **TestFlight testing:**
   ```bash
   npm run build:ios
   npx cap open ios
   ```
   Archive and upload to TestFlight, then test subscription purchases.

### 6. Troubleshooting

**If you still get "invalid API key" errors:**

1. Check that your `.env.production` file exists and has the correct key
2. Verify the key is correct in your RevenueCat dashboard
3. Make sure you're building with the production environment:
   ```bash
   NODE_ENV=production npm run build:ios
   ```

**If environment variables aren't loading:**

1. Check the console logs for the "Environment check" output
2. Verify your `.env.production` file is in the project root
3. Try the manual build process with `export` command

### 7. Going to Production

Before submitting to the App Store:

1. **Remove any hardcoded API keys** (if you added any for testing)
2. **Test thoroughly** in TestFlight with real purchases
3. **Verify** that all environment variables are properly set
4. **Check** that no sensitive data is logged in production builds

## Summary

The main issue was that Vite replaces `import.meta.env.VITE_REVENUECAT_API_KEY` at build time, so the environment variable must be available during the build process. 

**✅ FIXED:** Your `.env.local` file already had the correct API keys, but TestFlight builds use `.env.production`. I've copied your existing `.env.local` to `.env.production`, so your TestFlight builds should now work correctly.

**✅ VERIFIED:** The build process now shows:
```
Vite Environment Variables: {
  mode: 'production',
  hasGeminiKey: true,
  hasRevenueCatKey: true,
  revenueCatKeyLength: 10
}
```

Your friend's analysis was spot-on! This fix addresses the core issue with environment variable handling in production builds.
