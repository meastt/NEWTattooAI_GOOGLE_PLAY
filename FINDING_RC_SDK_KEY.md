# Finding RevenueCat SDK Keys: The Right Location

## 🎯 The Issue

You're looking in the **API Keys** tab, but SDK keys are actually in the **Platforms** section!

---

## ✅ Where SDK Keys Actually Are

### For iOS App (Why You See It There)
- RevenueCat Dashboard → **Platforms** → Select your iOS app
- SDK key is shown in the app's details page

### For Android App (Where You Need to Look)
- RevenueCat Dashboard → **Platforms** → Select your Android app  
- SDK key should be shown in the app's details page

---

## 📍 Step-by-Step: Finding Android SDK Key

1. **Go to RevenueCat Dashboard**
   - https://app.revenuecat.com/

2. **Click on "Platforms"** (in the left sidebar)
   - NOT "Project Settings" → "API Keys"
   - Look for a section called **"Platforms"** or **"Apps"**

3. **Select Your Android App**
   - Find "InkPreview" Android app
   - Click on it

4. **Look for "Public SDK Key" or "SDK Key"**
   - It should be displayed on the app's main page
   - Usually near the top, in the app details section
   - Format: `rcb_...` or `andr_...`

---

## 🔍 Why This Happens

**The difference:**

| Location | What's Shown | Scope |
|---------|-------------|-------|
| **API Keys Tab** | Secret API Keys (v1/v2) | Project-wide, for server-side |
| **Platforms Section** | SDK API Keys | App-specific, for mobile SDK |

**Why iOS shows both:**
- The API Keys tab shows project-wide Secret Keys
- The Platforms section shows iOS-specific SDK key
- Both are visible because they're in different places

**Why Android only shows Secret Keys:**
- You're looking in the API Keys tab (project-wide)
- The Android SDK key is in Platforms → Android App
- You need to navigate to the Platforms section!

---

## 🚨 Common Mistake

**Wrong Location:**
- ❌ Project Settings → API Keys → (only shows Secret Keys)

**Correct Location:**
- ✅ Platforms → [Select Android App] → Public SDK Key

---

## 💡 If You Still Don't See It

### Check 1: Is Android App Fully Configured?
- Go to Platforms → Android App
- Make sure the app is fully set up
- SDK key appears after app configuration is complete

### Check 2: Check App Settings
- In the Android app page, look for:
  - "Settings" tab
  - "Configuration" section
  - "SDK Key" or "Public Key" field

### Check 3: Permissions
- Make sure you have admin/owner access
- SDK keys are only visible to project owners/admins

### Check 4: App Bundle ID
- Make sure the Android app has a bundle ID configured
- SDK key generation requires bundle ID

---

## 📋 Alternative: Check iOS App for Reference

Since iOS shows the SDK key:
1. Go to **Platforms** → iOS App
2. Note where the SDK key is displayed
3. Go to **Platforms** → Android App
4. Look in the same location

The SDK keys are platform-specific but displayed in the same location (Platforms section).

---

## ✅ Quick Summary

**What you're seeing:**
- API Keys tab → Secret API Keys (v1/v2) ← Project-wide, server-side
- This is CORRECT, but not what you need for mobile app

**What you need:**
- Platforms → Android App → Public SDK Key ← App-specific, mobile SDK
- This is where your Android SDK key is!

**Action:**
- Navigate to **Platforms** section (not API Keys tab)
- Select your Android app
- Find the Public SDK Key there

---

## 🎯 Next Steps

1. Go to **Platforms** section in RevenueCat
2. Click on your Android InkPreview app
3. Find the Public SDK Key (starts with `rcb_` or `andr_`)
4. Copy it to your `.env.production` file
5. Rebuild your app

The SDK key IS there - you just need to look in the Platforms section instead of the API Keys tab! 🚀

