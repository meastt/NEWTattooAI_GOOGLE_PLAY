# InkPreview - AI Tattoo Design App

<div align="center">

[![Version](https://img.shields.io/badge/version-1.1.2-blue.svg)](package.json)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)](capacitor.config.ts)

AI-powered tattoo design and visualization app built with React, Capacitor, and Google's Gemini AI.

</div>

## 📱 Features

- **Try-On**: Visualize how tattoos would look on your body
- **Generator**: Create custom tattoo designs with AI
- **Removal**: See how you'd look without existing tattoos
- **Coverup**: Design coverups for existing tattoos
- **Subscriptions**: Weekly and monthly plans via RevenueCat

## 🚀 Quick Start

### For Emulator Testing (Start Here!)

**New to Android?** Follow these steps to test your app:

1. **Fix your RevenueCat API key** (if not done):
   ```bash
   # Get your SDK key from RevenueCat Dashboard → Platforms → Your App
   # Edit .env.production and add the SDK key (starts with 'rcb_' or 'goog_')
   nano .env.production
   ```

2. **Build and test**:
   ```bash
   npm install
   npm run build:android:prod
   npx cap open android
   ```

3. **In Android Studio**:
   - Create an emulator (Tools → Device Manager → Create Device)
   - Click the green Run ▶️ button
   - Your app will install and launch!

📖 **Detailed guide**: [EMULATOR_TESTING_STEPS.md](EMULATOR_TESTING_STEPS.md)

### For Production Deployment

Ready to publish to Google Play? See [ANDROID_SETUP_GUIDE.md](ANDROID_SETUP_GUIDE.md) for the complete process.

## 📁 Project Structure

```
├── components/          # React components
│   ├── TattooGenerator.tsx
│   ├── TattooTryOn.tsx
│   ├── TattooRemoval.tsx
│   └── TattooCoverup.tsx
├── services/           # Business logic
│   ├── geminiService.ts        # AI integration
│   ├── revenueCatService.ts    # Subscriptions
│   └── supabaseClient.ts       # Backend
├── android/            # Android native project
├── ios/               # iOS native project
└── dist/              # Built web assets
```

## 🔑 Required API Keys

You need these keys in your `.env.production` file:

- **RevenueCat SDK Key** (for subscriptions) - Get from [RevenueCat Dashboard](https://app.revenuecat.com/) → Platforms → Your App
- **Gemini API Key** (for AI features) - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Supabase Keys** (for backend) - Get from your [Supabase project](https://supabase.com)

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run locally in browser
npm run dev

# Build for Android
npm run build:android:prod

# Build for iOS
npm run build:ios

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios

# Check deployment readiness
./check-readiness.sh
```

## 📚 Documentation

- **[EMULATOR_TESTING_STEPS.md](EMULATOR_TESTING_STEPS.md)** - Test your app in Android emulator (START HERE!)
- **[ANDROID_SETUP_GUIDE.md](ANDROID_SETUP_GUIDE.md)** - Complete Android deployment guide
- **[check-readiness.sh](check-readiness.sh)** - Verify your setup is complete

## 🔐 Environment Variables

Create a `.env.production` file with:

```bash
# RevenueCat SDK Key (NOT Secret API Key!)
VITE_REVENUECAT_API_KEY=rcb_or_goog_your_sdk_key_here

# Gemini AI
GEMINI_API_KEY=your_gemini_key_here

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

⚠️ **Important**: Use the **Public SDK Key** from RevenueCat (found in Platforms section), NOT the Secret API Key!

## 📦 Subscription Products

This app uses RevenueCat for subscription management:

- **Quick Spark** (Weekly): `com.inkpreview.quickspark.weekly` - $4.99/week
- **Deep Dive** (Monthly): `com.inkpreview.deepdive.monthly` - $12.99/month

## 🧪 Testing

### Quick Emulator Test
```bash
npm run build:android:prod && npx cap open android
```

### Check Deployment Status
```bash
./check-readiness.sh
```

## 🚢 Deployment Status

Run `./check-readiness.sh` to see what's complete and what's pending for Google Play submission.

## 📝 License

Private project - All rights reserved

## 🙋‍♂️ Support

For issues or questions, check the documentation files or refer to:
- [RevenueCat Docs](https://docs.revenuecat.com/)
- [Capacitor Docs](https://capacitorjs.com/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
