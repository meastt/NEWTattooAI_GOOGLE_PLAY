# Android Production Build Guide for RevenueCat Integration

## Overview
This guide ensures your RevenueCat API key is properly configured for Android production builds and Google Play Store deployment.

## Step 1: Set Up Environment Variables

### Create Production Environment File
```bash
# Copy the template
cp .env.production.template .env.production

# Edit the file and replace YOUR_PRODUCTION_REVENUECAT_API_KEY with your actual key
nano .env.production
```

### Required Environment Variables
```bash
# RevenueCat API Key for Android Production
VITE_REVENUECAT_API_KEY=your_actual_revenuecat_android_production_key

# Other production keys as needed
GEMINI_API_KEY=your_production_gemini_key
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## Step 2: Build for Android Production

### Option A: Using the new build script (Recommended)
```bash
# Build for Android production
npm run build:android:prod

# Open Android Studio
npx cap open android
```

### Option B: Manual build process
```bash
# Set environment variable
export VITE_REVENUECAT_API_KEY="your_actual_revenuecat_key"

# Build the web app
npm run build

# Copy to Android
npx cap copy android

# Open Android Studio
npx cap open android
```

## Step 3: Verify RevenueCat Configuration

### Check Your RevenueCat Dashboard
1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Navigate to Project Settings → API Keys
3. Ensure you're using the **Android** production API key (not iOS)
4. Verify the key starts with `rcb_` (Android) not `rcb_` (iOS)

### Verify in Android Studio
1. Open Android Studio
2. Build → Generate Signed Bundle/APK
3. Choose "Android App Bundle" for Google Play
4. Test the build process

## Step 4: Test Payment Flow

### Before Publishing to Google Play
1. **Internal Testing**: Upload to Google Play Console as Internal Test
2. **Test Purchases**: Use Google Play Console test accounts
3. **Verify RevenueCat Integration**: Check RevenueCat dashboard for test purchases

### Debugging Tips
- Check Android logs: `adb logcat | grep RevenueCat`
- Verify API key in logs (first 10 characters)
- Test with Google Play Console test accounts

## Step 5: Google Play Store Configuration

### Required Google Play Console Setup
1. **In-app Products**: Create your subscription products
   - `com.inkpreview.quickspark.weekly` ($4.99/week)
   - `com.inkpreview.deepdive.monthly` ($12.99/month)

2. **RevenueCat Integration**: 
   - Add your Google Play service account JSON to RevenueCat
   - Configure webhook endpoints if needed

3. **App Signing**: Ensure you're using the correct signing key

## Troubleshooting

### Common Issues
1. **"Invalid API Key" Error**: 
   - Verify you're using Android production key (starts with `rcb_`)
   - Check `.env.production` file exists and has correct key

2. **Build Failures**:
   - Ensure all environment variables are set
   - Check Vite build logs for missing variables

3. **Payment Not Processing**:
   - Verify Google Play Console products match RevenueCat configuration
   - Check RevenueCat dashboard for integration status

### Debug Commands
```bash
# Check environment variables during build
npm run build:android:prod -- --debug

# Verify Capacitor configuration
npx cap doctor

# Check Android build
cd android && ./gradlew assembleDebug
```

## Security Notes
- Never commit `.env.production` to version control
- Use different API keys for development and production
- Regularly rotate your API keys
- Monitor RevenueCat dashboard for unusual activity

## Next Steps
1. Set up your `.env.production` file with actual API keys
2. Test the build process: `npm run build:android:prod`
3. Upload to Google Play Console for testing
4. Verify payment processing works correctly
5. Publish to production
