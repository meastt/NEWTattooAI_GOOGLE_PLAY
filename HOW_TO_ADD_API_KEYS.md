# How to Fill Out .env.production

## Current Status
✅ `.env.production` file created
❌ API keys need to be added

## What You Need to Do

### Step 1: Open the File
```bash
nano .env.production
```
Or use any text editor you prefer (VS Code, TextEdit, etc.)

### Step 2: Replace the Placeholder Values

You need to replace these 4 placeholders with your actual production API keys:

#### 1. RevenueCat Android Production API Key (REQUIRED)
```
VITE_REVENUECAT_API_KEY=rcb_your_actual_key_here
```

**Where to get it:**
1. Go to https://app.revenuecat.com/
2. Navigate to **Project Settings** → **API Keys**
3. Find the **Android Production** key
4. **IMPORTANT**: It must start with `rcb_` (Android keys start with `rcb_`, iOS keys start with `rck_`)

#### 2. Gemini API Key
```
GEMINI_API_KEY=your_gemini_key_here
```

**Where to get it:**
- Go to https://makersuite.google.com/app/apikey
- Use your production Gemini API key
- (Should be the same as your iOS app if you're using the same project)

#### 3. Supabase URL
```
VITE_SUPABASE_URL=https://your-project.supabase.co
```

**Where to get it:**
- Go to your Supabase project dashboard
- **Settings** → **API**
- Copy the **Project URL**

#### 4. Supabase Anonymous Key
```
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Where to get it:**
- Same Supabase dashboard
- **Settings** → **API**
- Copy the **anon/public** key

### Step 3: Save the File

After adding all your keys, save the file.

### Step 4: Rebuild Your App

Once you've added the keys, rebuild:
```bash
npm run build:android:prod
```

You should now see:
```
Vite Environment Variables: {
  mode: 'production',
  hasGeminiKey: true,        ← Should be true
  hasRevenueCatKey: true,    ← Should be true
  revenueCatKeyLength: 50+   ← Should show the length
}
```

### Step 5: Verify It Worked

Run the readiness checker:
```bash
./check-readiness.sh
```

You should see:
- ✅ RevenueCat API key is configured (Android production key)
- ✅ Gemini API key is configured
- ✅ Supabase keys are configured

## Example of What It Should Look Like

```bash
# Production Environment Variables for Android/Google Play
VITE_REVENUECAT_API_KEY=rcb_abcdefghijklmnopqrstuvwxyz1234567890
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
```

## ⚠️ Important Security Notes

- ✅ `.env.production` is already in `.gitignore` (won't be committed)
- ✅ Never share your API keys publicly
- ✅ Use production keys (not development/test keys)
- ✅ Keep a backup of your keys in a secure password manager

## Need Help Finding Your Keys?

- **RevenueCat**: https://app.revenuecat.com/ → Project Settings → API Keys
- **Gemini**: https://makersuite.google.com/app/apikey
- **Supabase**: Your Supabase project → Settings → API

## After Adding Keys

Once you've filled in all the keys:
1. Save `.env.production`
2. Run `npm run build:android:prod` again
3. Verify the build shows your keys are loaded
4. Then proceed to create the signed bundle in Android Studio

