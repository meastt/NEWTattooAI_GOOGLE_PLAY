#!/bin/bash

# Android Production Build Setup Script
# This script helps set up the environment for Android production builds with RevenueCat

echo "🚀 Android Production Build Setup for RevenueCat"
echo "================================================"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production file not found!"
    echo "📝 Creating from template..."
    
    if [ -f ".env.production.template" ]; then
        cp .env.production.template .env.production
        echo "✅ Created .env.production from template"
        echo "⚠️  Please edit .env.production and add your actual API keys"
    else
        echo "❌ Template file not found. Creating basic .env.production..."
        cat > .env.production << EOF
# Production Environment Variables for Android/Google Play
VITE_REVENUECAT_API_KEY=YOUR_PRODUCTION_REVENUECAT_API_KEY
GEMINI_API_KEY=YOUR_PRODUCTION_GEMINI_API_KEY
VITE_SUPABASE_URL=YOUR_PRODUCTION_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_PRODUCTION_SUPABASE_ANON_KEY
EOF
        echo "✅ Created basic .env.production file"
        echo "⚠️  Please edit .env.production and add your actual API keys"
    fi
else
    echo "✅ .env.production file exists"
fi

# Check if RevenueCat API key is set
if grep -q "YOUR_PRODUCTION_REVENUECAT_API_KEY" .env.production 2>/dev/null; then
    echo "⚠️  RevenueCat API key not configured in .env.production"
    echo "📋 Please get your Android production API key from:"
    echo "   https://app.revenuecat.com/ → Project Settings → API Keys"
    echo "   Make sure to use the ANDROID production key (starts with 'rcb_')"
else
    echo "✅ RevenueCat API key appears to be configured"
fi

# Check Node.js and npm
echo ""
echo "🔍 Checking build environment..."
if command -v node &> /dev/null; then
    echo "✅ Node.js version: $(node --version)"
else
    echo "❌ Node.js not found"
fi

if command -v npm &> /dev/null; then
    echo "✅ npm version: $(npm --version)"
else
    echo "❌ npm not found"
fi

# Check Capacitor
if command -v npx &> /dev/null; then
    echo "✅ npx available"
else
    echo "❌ npx not found"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Edit .env.production with your actual API keys"
echo "2. Run: npm run build:android:prod"
echo "3. Run: npx cap open android"
echo "4. Build signed APK/AAB in Android Studio"
echo "5. Upload to Google Play Console"
echo ""
echo "📖 For detailed instructions, see: ANDROID_PRODUCTION_SETUP.md"
