# 🚀 START HERE - Testing Your App in 5 Minutes

## ⚡ The One Thing Blocking You

Your app is 95% ready! You just need to fix ONE API key.

---

## 🔑 Step 1: Get Your RevenueCat SDK Key (2 minutes)

### The Problem
Your `.env.production` has a RevenueCat key, but it's not in the right format for Android.

### The Solution

1. **Open RevenueCat Dashboard**: https://app.revenuecat.com/
   
2. **Click "Platforms"** in the left sidebar
   - ⚠️ Do NOT go to "API Keys" tab - that's the wrong place!
   
3. **Select your app** (either iOS or Android - the SDK key works for both)
   
4. **Find "Public SDK Key"** or "SDK Key"
   - Should start with `rcb_` or `goog_`
   - Example: `rcb_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456`
   
5. **Copy this key**

---

## ✏️ Step 2: Update Your Environment File (1 minute)

```bash
# Open the file
nano .env.production

# Find this line:
VITE_REVENUECAT_API_KEY=your_current_key_here

# Replace with your new key:
VITE_REVENUECAT_API_KEY=rcb_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456

# Save and exit (Ctrl+X, then Y, then Enter)
```

---

## 🔨 Step 3: Build Your App (1 minute)

```bash
npm run build:android:prod
npx cap open android
```

This will:
1. Build your app with the correct API key
2. Open Android Studio

---

## 📱 Step 4: Run in Emulator (1 minute setup, if first time)

### If you already have an emulator:
1. Select it from the device dropdown
2. Click the green ▶️ Run button
3. Done! Your app will launch

### If you need to create an emulator:
1. **Tools** → **Device Manager**
2. **Create Device**
3. Choose **Pixel 7** or **Pixel 8**
4. Select **API Level 34** (Android 14)
5. Click **Finish**
6. Now click the green ▶️ Run button

---

## ✅ Verification

After your app launches, check Logcat (View → Tool Windows → Logcat):
- Should see: `RevenueCat SDK initialized successfully`
- Should NOT see: `Invalid API key` error

If you see the success message, you're good to go! 🎉

---

## 📖 Next Steps

### Just Testing?
- Play with your app in the emulator
- Test all 4 features (Try-On, Generator, Removal, Coverup)
- Subscription features will show UI but won't process real payments

### Ready for Production?
See [ANDROID_SETUP_GUIDE.md](ANDROID_SETUP_GUIDE.md) for:
- Creating signed bundle for Google Play
- Setting up Google Play Console
- Testing with real payment processing
- Submitting for review

---

## 🆘 Troubleshooting

### "Could not read script ... cordova.variables.gradle"

The Android project needs to be synced:
```bash
npx cap sync android
npx cap open android
```

### "I can't find the SDK key in RevenueCat!"

Make sure you're looking in **Platforms** section, NOT "API Keys" tab:
```
✅ CORRECT: Dashboard → Platforms → [Your App] → Public SDK Key
❌ WRONG:   Dashboard → API Keys → Secret API Keys (v1/v2)
```

### "I updated the key but still getting 'Invalid API Key'"

Did you rebuild?
```bash
npm run build:android:prod
npx cap open android
```

### "My emulator is super slow"

1. Close other apps
2. In Android Studio: Tools → Device Manager → Edit your device → Allocate 8GB RAM
3. Make sure hardware acceleration is enabled

---

## 📋 Quick Status Check

Run this anytime to see what's ready:
```bash
./check-readiness.sh
```

You should see:
- ✅ .env.production file exists
- ✅ RevenueCat API key is configured (Android production key) ← Should be green after you fix it!
- ✅ Gemini API key is configured
- ✅ Supabase keys are configured
- ✅ Dependencies installed
- ✅ Build output exists

---

## 🎯 Summary

**What's Blocking You**: RevenueCat SDK key format
**Time to Fix**: 2 minutes
**Total Time to Test**: 5 minutes

**After fixing the key, you'll be testing your app in the emulator!** 🚀

---

Need more details? See:
- [EMULATOR_TESTING_STEPS.md](EMULATOR_TESTING_STEPS.md) - Detailed emulator testing
- [ANDROID_SETUP_GUIDE.md](ANDROID_SETUP_GUIDE.md) - Complete production guide
- [README.md](README.md) - Project overview

