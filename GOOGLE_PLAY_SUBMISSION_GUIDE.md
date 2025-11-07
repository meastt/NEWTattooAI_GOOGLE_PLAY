# Google Play Store Submission Guide for InkPreview

## 🎯 Overview
This guide will walk you through preparing your InkPreview app for Google Play Store submission. Since you're new to Android development, each step includes explanations and what to expect.

**Current Status**: Your repo already has most of the technical setup done! You mainly need to:
1. Add your production API keys
2. Build the app
3. Create a signed release bundle
4. Set up Google Play Console
5. Test everything

---

## ✅ What's Already Configured (You Don't Need to Do This!)

- ✅ Android build scripts (`npm run build:android:prod`)
- ✅ Environment variable handling for production builds
- ✅ RevenueCat integration code
- ✅ Subscription products configured (`com.inkpreview.quickspark.weekly` and `com.inkpreview.deepdive.monthly`)
- ✅ Android Gradle configuration
- ✅ Capacitor Android setup
- ✅ Helper scripts and documentation

---

## 📋 Step-by-Step Checklist

### Phase 1: Environment Setup (15-30 minutes)

#### Step 1.1: Create Production Environment File
```bash
# Run the setup script (it will create .env.production if it doesn't exist)
./setup-android-production.sh
```

#### Step 1.2: Get Your API Keys

You'll need to gather these keys from your existing services:

**A. RevenueCat Android Production API Key**
1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Navigate to **Project Settings** → **API Keys**
3. Find the **Android Production** key (it starts with `rcb_`)
4. Copy this key

**B. Gemini API Key** (if different from iOS)
- Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Use your production key

**C. Supabase Keys** (if different from iOS)
- Get from your Supabase project dashboard
- URL and anonymous key

#### Step 1.3: Edit `.env.production` File
```bash
# Open the file in a text editor
nano .env.production
# or use any text editor you prefer
```

Replace the placeholder values:
```bash
VITE_REVENUECAT_API_KEY=rcb_your_actual_android_production_key_here
GEMINI_API_KEY=your_production_gemini_key_here
VITE_SUPABASE_URL=your_production_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key_here
```

**⚠️ Important**: 
- The RevenueCat key MUST be the Android production key (starts with `rcb_`)
- Never commit `.env.production` to git (it's already in `.gitignore`)

---

### Phase 2: Build Your App (30-60 minutes)

#### Step 2.1: Install Dependencies (if not done)
```bash
npm install
```

#### Step 2.2: Build for Android Production
```bash
npm run build:android:prod
```

**What this does:**
- Builds your web app with production environment variables
- Copies everything to the Android project
- Prepares it for Android Studio

**Expected output**: Should complete without errors. You'll see build progress in the terminal.

#### Step 2.3: Open in Android Studio
```bash
npx cap open android
```

**What happens:**
- Android Studio will open (if installed)
- Your Android project will load
- Wait for Gradle sync to complete (first time can take 5-10 minutes)

**If Android Studio isn't installed:**
- Download from [developer.android.com/studio](https://developer.android.com/studio)
- Install it
- Run the command again

---

### Phase 3: Create Signed Release Bundle (30-45 minutes)

#### Step 3.1: Generate Signed Bundle in Android Studio

1. In Android Studio, go to: **Build** → **Generate Signed Bundle/APK**

2. Select **Android App Bundle** (recommended for Google Play)
   - Click **Next**

3. **Create or Select Keystore**:

   **If this is your first Android app:**
   - Click **Create new...**
   - Fill in:
     - **Key store path**: Choose a secure location (e.g., `~/Documents/inkpreview-keystore.jks`)
     - **Password**: Create a STRONG password (save this in a password manager!)
     - **Key alias**: `inkpreview-key`
     - **Key password**: Same as store password
     - **Validity**: 25 years (default)
     - **Certificate info**: Fill in your name, organization, etc.
   - Click **OK**

   **If you already have a keystore** (from iOS or previous Android builds):
   - Browse to your existing keystore file
   - Enter the passwords
   - Click **Next**

4. **Build Configuration**:
   - **Destination folder**: Choose where to save the `.aab` file
   - **Build variants**: Select **release**
   - Click **Create**

5. **Wait for build**: This takes 2-5 minutes

6. **Find your file**: The `.aab` file will be in the destination folder you chose
   - It will be named something like: `app-release.aab`
   - This is what you'll upload to Google Play!

**⚠️ CRITICAL**: Save your keystore file and passwords securely! If you lose them, you can't update your app on Google Play.

---

### Phase 4: Google Play Console Setup (1-2 hours)

#### Step 4.1: Create Google Play Developer Account
1. Go to [Google Play Console](https://play.google.com/console/)
2. Pay the **$25 one-time registration fee**
3. Complete your developer profile

#### Step 4.2: Create Your App Listing
1. Click **Create app**
2. Fill in:
   - **App name**: InkPreview
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free (with in-app purchases)
3. Click **Create app**

#### Step 4.3: Upload Your App Bundle
1. In the left sidebar, go to **Production** → **Releases**
2. Click **Create new release**
3. **Upload**: Drag and drop your `.aab` file (or click to browse)
4. **Release name**: `1.0 (1)` (or match your version from `package.json`)
5. **Release notes**: 
   ```
   Initial release of InkPreview for Android
   - AI-powered tattoo design generation
   - Try-on, removal, coverup, and generator tools
   - Weekly and monthly subscription options
   ```
6. Click **Save** (don't submit yet!)

#### Step 4.4: Set Up App Content
Complete these sections in Google Play Console:

**A. Store Listing**
- App name, short description, full description
- Screenshots (at least 2, up to 8)
- Feature graphic (1024x500px)
- App icon (512x512px)
- Privacy policy URL (required!)

**B. Content Rating**
- Complete the questionnaire
- Get your rating (usually "Everyone" or "Teen")

**C. Privacy Policy**
- Upload or link to your privacy policy
- Must be publicly accessible

**D. Data Safety**
- Answer questions about data collection
- Be honest about what data you collect

**E. Pricing & Distribution**
- Select countries where your app will be available
- Choose if it's free or paid (should be Free)

---

### Phase 5: Set Up In-App Products (30-45 minutes)

#### Step 5.1: Create Subscription Products in Google Play Console

1. Go to **Monetize** → **Products** → **Subscriptions**
2. Click **Create subscription**

**Product 1: Quick Spark (Weekly)**
- **Product ID**: `com.inkpreview.quickspark.weekly` (must match exactly!)
- **Name**: Quick Spark
- **Description**: Perfect for trying out new designs. 30 AI generations per week.
- **Price**: $4.99 USD
- **Billing period**: 1 week
- **Free trial**: Optional (you can add one if you want)
- Click **Save**

**Product 2: Deep Dive (Monthly)**
- **Product ID**: `com.inkpreview.deepdive.monthly` (must match exactly!)
- **Name**: Deep Dive
- **Description**: For serious tattoo enthusiasts. 120 AI generations per month.
- **Price**: $12.99 USD
- **Billing period**: 1 month
- **Free trial**: Optional
- Click **Save**

#### Step 5.2: Configure RevenueCat Integration

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Navigate to **Project Settings** → **Integrations**
3. Find **Google Play Console** section
4. **Upload Google Play Service Account JSON**:
   - In Google Play Console: **Settings** → **API access**
   - Create a service account (if not done)
   - Download the JSON key file
   - Upload it to RevenueCat
5. **Link your app**: Select your InkPreview app
6. **Add Products**:
   - Go to **Products** in RevenueCat
   - Add both subscription products
   - Make sure Product IDs match exactly:
     - `com.inkpreview.quickspark.weekly`
     - `com.inkpreview.deepdive.monthly`

---

### Phase 6: Internal Testing (1-2 hours)

#### Step 6.1: Create Internal Testing Track
1. In Google Play Console: **Testing** → **Internal testing**
2. Click **Create new release**
3. Upload the same `.aab` file you created earlier
4. Add release notes: "Internal testing version"
5. Click **Save**

#### Step 6.2: Add Test Users
1. Go to **Testers** tab
2. Click **Create email list**
3. Add your Gmail addresses (and any testers)
4. Click **Save**
5. **Copy the opt-in URL** - this is what testers use to install

#### Step 6.3: Set Up License Testing
1. Go to **Setup** → **License testing**
2. Add the same Gmail addresses
3. These accounts can make test purchases without real charges

#### Step 6.4: Test Your App
1. Send the opt-in URL to your test accounts
2. Install the app from Google Play Store
3. Test core features:
   - [ ] App launches
   - [ ] Navigation works
   - [ ] All 4 tools accessible (Try-on, Removal, Coverup, Generator)
   - [ ] Subscription upgrade flow works
   - [ ] Test purchase completes (no real charge)
   - [ ] Subscription status updates in app
   - [ ] Check RevenueCat dashboard - purchase should appear

---

### Phase 7: Final Verification (30 minutes)

Before submitting to production, verify:

- [ ] `.env.production` has real API keys (not placeholders)
- [ ] RevenueCat API key is Android production key (starts with `rcb_`)
- [ ] Build completes: `npm run build:android:prod`
- [ ] Signed `.aab` file created successfully
- [ ] Google Play Console app listing is complete
- [ ] Both subscription products created in Play Console
- [ ] RevenueCat integration configured with service account JSON
- [ ] Product IDs match exactly between Play Console and RevenueCat
- [ ] Internal testing works
- [ ] Test purchases work (check RevenueCat dashboard)
- [ ] Privacy policy is accessible
- [ ] Content rating completed

---

### Phase 8: Submit for Production Review (15 minutes)

1. Go to **Production** → **Releases** in Google Play Console
2. Click **Review release**
3. Complete any remaining required sections
4. Click **Start rollout to production**
5. **Review time**: Typically 1-3 days
6. Google will email you with status updates

---

## 🐛 Troubleshooting Common Issues

### "Invalid API Key" Error
- **Check**: Is your RevenueCat key the Android production key? (starts with `rcb_`)
- **Fix**: Update `.env.production` and rebuild: `npm run build:android:prod`

### Build Fails
- **Check**: Are all environment variables set in `.env.production`?
- **Fix**: Run `./setup-android-production.sh` and fill in all keys

### Test Purchases Not Working
- **Check**: Are test accounts added to License Testing?
- **Check**: Does RevenueCat have your Google Play service account JSON?
- **Check**: Do Product IDs match exactly in Play Console and RevenueCat?

### App Crashes on Launch
- **Check**: Google Play Console → **Crashes & ANRs** for error details
- **Check**: Are all environment variables set correctly?
- **Check**: Test on different devices/emulators

---

## 📞 Helpful Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [RevenueCat Android Integration](https://docs.revenuecat.com/docs/android)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [Android Studio User Guide](https://developer.android.com/studio/intro)

---

## 🎉 Next Steps After Launch

1. Monitor crash reports in Google Play Console
2. Track subscription metrics in RevenueCat dashboard
3. Respond to user reviews
4. Plan updates and new features
5. Monitor analytics and user behavior

---

## Quick Command Reference

```bash
# Setup production environment
./setup-android-production.sh

# Build for production
npm run build:android:prod

# Open Android Studio
npx cap open android

# Check connected devices
adb devices

# View app logs
adb logcat | grep InkPreview

# View RevenueCat logs
adb logcat | grep RevenueCat
```

---

**You've got this!** Your app is already well-configured. Follow these steps one at a time, and you'll have InkPreview on Google Play Store soon! 🚀

