# 🚀 Quick Steps to Test in Android Emulator

## What You Need to Do RIGHT NOW

### Step 1: Fix RevenueCat API Key (5 minutes)

Your RevenueCat API key needs to be the Android SDK key.

1. Go to https://app.revenuecat.com/
2. Click **"Platforms"** in the left sidebar (NOT "API Keys"!)
3. Select your **Android app** (or iOS app, the SDK key works for both platforms)
4. Find the **"Public SDK Key"** - it should start with `rcb_` or `goog_`
5. Copy this key

### Step 2: Update Your .env.production File

```bash
# Open the file
nano .env.production

# Replace the VITE_REVENUECAT_API_KEY value with the key you just copied
# Make sure it starts with 'rcb_' or 'goog_'
# Save and exit (Ctrl+X, then Y, then Enter)
```

### Step 3: Rebuild Your App

```bash
# Build for Android
npm run build:android:prod

# Open Android Studio
npx cap open android
```

### Step 4: Create an Android Emulator (if you don't have one)

In Android Studio:
1. Click **Tools** → **Device Manager** (or AVD Manager)
2. Click **"Create Device"**
3. Select **Pixel 7** or **Pixel 8**
4. Choose system image: **API Level 34** (Android 14) - click Download if needed
5. Click **Next** → **Finish**

### Step 5: Run Your App

1. In Android Studio, make sure your emulator is selected in the device dropdown (top toolbar)
2. Click the green **▶️ Run** button
3. Wait for the app to install and launch (first time takes 2-3 minutes)

## 🎉 That's It!

Your app should now be running in the Android emulator. You can test all features except actual payment processing (you'll need Google Play Console for that).

## Troubleshooting

### If you see "Could not read script ... cordova.variables.gradle":
This means the Android project needs to be synced:
```bash
npx cap sync android
npx cap open android
```

### If the emulator is slow:
- Make sure hardware acceleration is enabled
- Allocate more RAM in AVD settings (4GB minimum)
- Use an x86_64 system image (not ARM)

### If the app crashes:
- Check Logcat in Android Studio (View → Tool Windows → Logcat)
- Look for RevenueCat initialization errors
- Verify your API key is correct

### If you see "Invalid API Key":
- Make sure the key starts with `rcb_` or `goog_`
- Rebuild after changing the key: `npm run build:android:prod`

