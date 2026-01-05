# Android Build & Release Commands

Quick reference for rebuilding your Android app and creating a new AAB file for Google Play release.

## Prerequisites

Make sure you're in the project directory:
```bash
cd NEWTattooAI_GOOGLE_PLAY
```

## Step 1: Verify Configuration

```bash
# Check that all environment variables are set
./check-readiness.sh
```

## Step 2: Build for Android Production

```bash
# Install/update dependencies (if needed)
npm install

# Build the web app and sync to Android
npm run build:android:prod
```

This command:
- Builds your React/Vite app for production
- Copies the built files to the Android project
- Uses production environment variables from `.env.production`

## Step 3: Open Android Studio

```bash
npx cap open android
```

This opens the Android project in Android Studio.

## Step 4: Generate Signed AAB Bundle

In Android Studio:

1. **Build** → **Generate Signed Bundle/APK**
2. Select **Android App Bundle** (.aab)
3. Click **Next**

### If you already have a keystore:
- Select your existing keystore file (e.g., `~/Documents/inkpreview-keystore.jks`)
- Enter keystore password
- Select key alias: `inkpreview-key`
- Enter key password
- Click **Next**

### If creating a new keystore (first time only):
1. Click **"Create new..."**
2. Fill in:
   - **Key store path**: `~/Documents/inkpreview-keystore.jks` (save securely!)
   - **Password**: Create a STRONG password (save in password manager!)
   - **Key alias**: `inkpreview-key`
   - **Key password**: Same as store password
   - **Validity**: 25 years
   - **Certificate**: Your name/organization
3. Click **OK**

### Build the Bundle:
1. Select **release** build variant
2. Choose destination folder (default is usually fine)
3. Click **Create**
4. Wait 2-5 minutes for build to complete

Your `.aab` file will be saved in: `android/app/release/app-release.aab`

## Alternative: Command Line Build (Advanced)

If you have your keystore configured in `android/app/build.gradle`, you can also build from command line:

```bash
cd android
./gradlew bundleRelease
```

The AAB will be at: `android/app/build/outputs/bundle/release/app-release.aab`

## Quick Command Summary

```bash
# Full rebuild process
cd NEWTattooAI_GOOGLE_PLAY
npm install                    # Update dependencies (if needed)
npm run build:android:prod     # Build web app and sync to Android
npx cap open android          # Open in Android Studio
# Then use Android Studio GUI to generate signed AAB
```

## Updating Version Number

Before building a new release, update the version:

1. **package.json**: Update `"version"` field (e.g., `"1.2.1"`)
2. **android/app/build.gradle**: Update both:
   - `versionCode` (increment by 1, e.g., `36`)
   - `versionName` (match package.json, e.g., `"1.2.1"`)

Example:
```gradle
versionCode 36
versionName "1.2.1"
```

## Troubleshooting

### Build fails with "VITE_REVENUECAT_API_KEY not found"
- Make sure `.env.production` exists and has all required keys
- Run `./check-readiness.sh` to verify

### "Keystore file not found"
- Make sure you're using the correct path to your keystore
- If you lost your keystore, you'll need to create a new one (this will require creating a new app in Google Play Console)

### Build is slow
- Close other applications
- In Android Studio: **File** → **Invalidate Caches** → **Invalidate and Restart**

## Next Steps After Building AAB

1. Upload to Google Play Console
2. Go to **Production** → **Releases** → **Create new release**
3. Upload your `.aab` file
4. Add release notes
5. Review and submit

---

**Note**: Always keep your keystore file and password secure! You cannot update your app on Google Play without them.


