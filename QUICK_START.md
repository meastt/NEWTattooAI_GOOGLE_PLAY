# Quick Start: Google Play Store Submission

## 🚀 You're Almost Ready!

Your repo is already well-configured for Android. Here's what you need to do:

## Immediate Next Steps (In Order)

### 1. Set Up Production Environment (5 minutes)
```bash
./setup-android-production.sh
nano .env.production  # Add your real API keys
```

**What you need:**
- RevenueCat Android production API key (starts with `rcb_`)
- Gemini API key
- Supabase URL and anonymous key

### 2. Build Your App (10 minutes)
```bash
npm install                    # If not done already
npm run build:android:prod     # Build for production
npx cap open android          # Open in Android Studio
```

### 3. Create Signed Bundle (30 minutes)
- In Android Studio: **Build** → **Generate Signed Bundle/APK**
- Choose **Android App Bundle (.aab)**
- Create or use existing keystore
- Build release version

### 4. Google Play Console Setup (1-2 hours)
- Create developer account ($25 one-time fee)
- Create app listing
- Upload your `.aab` file
- Complete store listing, content rating, privacy policy

### 5. Set Up Subscriptions (30 minutes)
- Create products in Play Console:
  - `com.inkpreview.quickspark.weekly` ($4.99/week)
  - `com.inkpreview.deepdive.monthly` ($12.99/month)
- Configure RevenueCat integration
- Upload Google Play service account JSON to RevenueCat

### 6. Test Everything (1 hour)
- Set up Internal Testing track
- Add test users
- Test purchases (no real charges)
- Verify everything works

## 📚 Detailed Guides

- **Full step-by-step guide**: `GOOGLE_PLAY_SUBMISSION_GUIDE.md`
- **Check your progress**: `./check-readiness.sh`
- **Testing setup**: `GOOGLE_PLAY_TESTING_SETUP.md`
- **Production setup**: `ANDROID_PRODUCTION_SETUP.md`

## ✅ Quick Status Check

Run this to see what's done and what's left:
```bash
./check-readiness.sh
```

## 🎯 Key Points

1. **RevenueCat Key**: Must be Android production key (starts with `rcb_`)
2. **Product IDs**: Must match exactly between Play Console and your code
3. **Keystore**: Save it securely - you'll need it for all future updates
4. **Test First**: Always test with Internal Testing before production

## 💡 Need Help?

- Check the detailed guide: `GOOGLE_PLAY_SUBMISSION_GUIDE.md`
- Review the checklist: `ANDROID_VERIFICATION_CHECKLIST.md`
- Test setup guide: `GOOGLE_PLAY_TESTING_SETUP.md`

---

**You've got this!** Start with step 1 and work through them one at a time. 🚀

