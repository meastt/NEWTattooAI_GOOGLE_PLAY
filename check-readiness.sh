#!/bin/bash

# Google Play Store Readiness Checker
# This script checks if you're ready to submit to Google Play Store

echo "🔍 Checking Google Play Store Readiness for InkPreview"
echo "======================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Track overall status
ALL_GOOD=true

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        return 0
    else
        echo -e "${RED}❌${NC} $2"
        ALL_GOOD=false
        return 1
    fi
}

# Function to check if value is set (not placeholder)
check_value() {
    if grep -q "$1" "$2" 2>/dev/null && ! grep -q "YOUR_\|PLACEHOLDER\|REPLACE" "$2" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $3"
        return 0
    else
        echo -e "${RED}❌${NC} $3"
        ALL_GOOD=false
        return 1
    fi
}

echo "📁 Phase 1: Environment Setup"
echo "----------------------------"

# Check .env.production exists
if check_file ".env.production" ".env.production file exists"; then
    # Check RevenueCat key
    if grep -q "VITE_REVENUECAT_API_KEY" .env.production 2>/dev/null; then
        REVENUECAT_KEY=$(grep "VITE_REVENUECAT_API_KEY" .env.production | cut -d '=' -f2 | tr -d ' "')
        if [[ "$REVENUECAT_KEY" == rcb_* ]] && [[ "$REVENUECAT_KEY" != "YOUR_PRODUCTION_REVENUECAT_API_KEY" ]]; then
            echo -e "${GREEN}✅${NC} RevenueCat API key is configured (Android production key)"
        else
            echo -e "${RED}❌${NC} RevenueCat API key missing or not Android production key (should start with 'rcb_')"
            ALL_GOOD=false
        fi
    else
        echo -e "${RED}❌${NC} RevenueCat API key not found in .env.production"
        ALL_GOOD=false
    fi
    
    # Check Gemini key
    if grep -q "GEMINI_API_KEY" .env.production 2>/dev/null; then
        GEMINI_KEY=$(grep "GEMINI_API_KEY" .env.production | cut -d '=' -f2 | tr -d ' "')
        if [[ "$GEMINI_KEY" != "YOUR_PRODUCTION_GEMINI_API_KEY" ]] && [[ -n "$GEMINI_KEY" ]]; then
            echo -e "${GREEN}✅${NC} Gemini API key is configured"
        else
            echo -e "${YELLOW}⚠️${NC}  Gemini API key may not be configured"
        fi
    fi
    
    # Check Supabase keys
    if grep -q "VITE_SUPABASE_URL" .env.production 2>/dev/null && grep -q "VITE_SUPABASE_ANON_KEY" .env.production 2>/dev/null; then
        SUPABASE_URL=$(grep "VITE_SUPABASE_URL" .env.production | cut -d '=' -f2 | tr -d ' "')
        if [[ "$SUPABASE_URL" != "YOUR_PRODUCTION_SUPABASE_URL" ]] && [[ -n "$SUPABASE_URL" ]]; then
            echo -e "${GREEN}✅${NC} Supabase keys are configured"
        else
            echo -e "${YELLOW}⚠️${NC}  Supabase keys may not be configured"
        fi
    fi
else
    echo -e "${YELLOW}💡${NC}  Run './setup-android-production.sh' to create .env.production"
fi

echo ""
echo "🔨 Phase 2: Build Configuration"
echo "-------------------------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} Dependencies installed"
else
    echo -e "${RED}❌${NC} Dependencies not installed. Run 'npm install'"
    ALL_GOOD=false
fi

# Check if dist folder exists (indicates build has been run)
if [ -d "dist" ]; then
    echo -e "${GREEN}✅${NC} Build output exists (dist folder)"
else
    echo -e "${YELLOW}⚠️${NC}  Build output not found. Run 'npm run build:android:prod'"
fi

# Check Android project exists
if [ -d "android" ]; then
    echo -e "${GREEN}✅${NC} Android project exists"
    
    # Check build.gradle
    if [ -f "android/app/build.gradle" ]; then
        echo -e "${GREEN}✅${NC} Android build.gradle configured"
    fi
else
    echo -e "${RED}❌${NC} Android project not found"
    ALL_GOOD=false
fi

echo ""
echo "📦 Phase 3: Release Bundle"
echo "--------------------------"

# Check for .aab file (look in common locations)
AAB_FOUND=false
if find . -name "*.aab" -type f 2>/dev/null | grep -q .; then
    echo -e "${GREEN}✅${NC} Found .aab file(s)"
    find . -name "*.aab" -type f 2>/dev/null | head -3 | while read file; do
        echo -e "   📄 $file"
    done
    AAB_FOUND=true
else
    echo -e "${YELLOW}⚠️${NC}  No .aab file found. Create one in Android Studio"
fi

echo ""
echo "⚙️  Phase 4: Configuration Files"
echo "---------------------------------"

check_file "package.json" "package.json exists"
check_file "capacitor.config.ts" "Capacitor config exists"
check_file "vite.config.ts" "Vite config exists"

# Check version in package.json
if [ -f "package.json" ]; then
    VERSION=$(grep '"version"' package.json | head -1 | cut -d '"' -f4)
    if [ -n "$VERSION" ]; then
        echo -e "${GREEN}✅${NC} App version: $VERSION"
    fi
fi

echo ""
echo "📋 Phase 5: Manual Checklist"
echo "----------------------------"
echo "These items need to be verified manually:"
echo ""
echo -e "${YELLOW}☐${NC} Google Play Console account created (\$25 fee paid)"
echo -e "${YELLOW}☐${NC} App listing created in Google Play Console"
echo -e "${YELLOW}☐${NC} Store listing completed (screenshots, description, etc.)"
echo -e "${YELLOW}☐${NC} Content rating questionnaire completed"
echo -e "${YELLOW}☐${NC} Privacy policy URL added"
echo -e "${YELLOW}☐${NC} Subscription products created in Play Console:"
echo -e "   ${YELLOW}☐${NC} com.inkpreview.quickspark.weekly"
echo -e "   ${YELLOW}☐${NC} com.inkpreview.deepdive.monthly"
echo -e "${YELLOW}☐${NC} RevenueCat integration configured (service account JSON uploaded)"
echo -e "${YELLOW}☐${NC} Internal testing track created"
echo -e "${YELLOW}☐${NC} Test purchases verified working"
echo -e "${YELLOW}☐${NC} App tested on physical device or emulator"

echo ""
echo "======================================================"
if [ "$ALL_GOOD" = true ] && [ "$AAB_FOUND" = true ]; then
    echo -e "${GREEN}🎉 Great progress!${NC}"
    echo "You've completed the technical setup. Now focus on:"
    echo "1. Google Play Console setup"
    echo "2. Creating subscription products"
    echo "3. Testing your app"
elif [ "$ALL_GOOD" = true ]; then
    echo -e "${YELLOW}⚠️  Almost there!${NC}"
    echo "Complete the remaining steps:"
    echo "1. Create signed .aab bundle in Android Studio"
    echo "2. Set up Google Play Console"
    echo "3. Test your app"
else
    echo -e "${RED}❌ Some issues found${NC}"
    echo "Please fix the issues above before proceeding."
fi
echo ""
echo "📖 For detailed instructions, see: GOOGLE_PLAY_SUBMISSION_GUIDE.md"
echo ""

