# RevenueCat API Key Guide: What You Need for Android

## 🎯 Quick Answer

**For your Capacitor mobile app, you need the PUBLIC SDK KEY, NOT the Secret API Key (v1/v2).**

The v1/v2 choice is for **Secret API Keys** which are used for **server-side** REST API calls, not for mobile apps.

---

## 📱 What You Actually Need

### Public SDK Key (For Mobile App)

You need the **Android Public SDK Key** from RevenueCat dashboard:

**Where to find it:**
1. Go to RevenueCat Dashboard: https://app.revenuecat.com/
2. Navigate to: **Project Settings** → **API Keys**
3. Look for: **"Public SDK Keys"** or **"App-specific keys"** section
4. Find: **Android** or **Google Play** key

**Key format:**
- Modern keys: Start with `rcb_` (RevenueCat Billing)
- Older keys: May start with `andr_` (Android)

**This is what goes in your `.env.production`:**
```
VITE_REVENUECAT_API_KEY=rcb_your_android_sdk_key_here
```

---

## 🔐 Secret API Keys (v1/v2) - NOT What You Need

**Secret API Keys** are for:
- Server-side REST API calls
- Webhook verification
- Backend integrations
- NOT for mobile app SDK configuration

**If RevenueCat is asking you to choose v1 or v2:**
- You're probably in the wrong section
- Look for **"Public SDK Keys"** instead
- Or **"App-specific keys"** section

---

## ✅ What Your Code Uses

Looking at your `revenueCatService.ts`:
```typescript
await Purchases.configure({ 
  apiKey: REVENUECAT_API_KEY,  // ← This needs the PUBLIC SDK KEY
  ...
});
```

The `Purchases.configure()` method expects the **Public SDK Key**, not a Secret API Key.

---

## 📋 Step-by-Step: Finding Your Android SDK Key

1. **Go to RevenueCat Dashboard**
   - https://app.revenuecat.com/

2. **Navigate to API Keys**
   - Click: **Project Settings** (gear icon)
   - Click: **API Keys** tab

3. **Find Public SDK Keys Section**
   - Look for a section labeled:
     - **"Public SDK Keys"** OR
     - **"App-specific keys"** OR
     - **"SDK Keys"**

4. **Find Android Key**
   - Look for a key labeled:
     - **"Android"** OR
     - **"Google Play"** OR
     - **"Android Production"**
   - The key should start with `rcb_` or `andr_`

5. **Copy the Key**
   - Click the copy icon or select and copy
   - It should look like: `rcb_abcdefghijklmnopqrstuvwxyz1234567890`

---

## ⚠️ Common Confusion

**If you see "Secret API Keys" with v1/v2 options:**
- ❌ This is NOT what you need for the mobile app
- ✅ Skip this section
- ✅ Look for "Public SDK Keys" instead

**If you only see Secret API Keys:**
- Your RevenueCat project might need Android app configuration first
- Make sure you've added an Android app to your RevenueCat project
- The Public SDK Key appears after you configure the Android app

---

## 🔍 How to Verify You Have the Right Key

The correct key will:
- ✅ Start with `rcb_` (modern) or `andr_` (older)
- ✅ Be labeled as "Android" or "Google Play"
- ✅ Be in the "Public SDK Keys" section
- ✅ Work with `Purchases.configure()` in your mobile app

The wrong key will:
- ❌ Start with `sk_` (Secret Key)
- ❌ Be labeled as "Secret API Key"
- ❌ Have v1/v2 version options
- ❌ Be used for REST API calls, not SDK

---

## 💡 Still Can't Find It?

If you can't find the Android Public SDK Key:

1. **Check if Android app is configured:**
   - RevenueCat Dashboard → **Apps**
   - Make sure you have an Android/Google Play app added

2. **Create Android app if missing:**
   - Click **+ New App**
   - Select **Android** or **Google Play**
   - Configure it
   - The Public SDK Key will appear after setup

3. **Contact RevenueCat Support:**
   - They can help you locate the correct key
   - Or verify your Android app configuration

---

## ✅ Summary

| What You Need | Where to Find | Format |
|--------------|---------------|--------|
| **Public SDK Key** | Project Settings → API Keys → Public SDK Keys | `rcb_...` or `andr_...` |
| Secret API Key (v1/v2) | ❌ NOT NEEDED | `sk_...` |

**Bottom line:** Use the **Public SDK Key** for Android, ignore the v1/v2 Secret API Key option.

