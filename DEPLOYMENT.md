# Firebase Hosting Deployment Guide

This guide will walk you through deploying your React/Vite social media application to Firebase Hosting.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Firebase Project Setup](#firebase-project-setup)
- [Local Configuration](#local-configuration)
- [Deployment](#deployment)
- [Custom Domain Setup](#custom-domain-setup)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Advanced Features](#advanced-features)

---

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher)
   ```bash
   node --version
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **Firebase CLI** (install globally)
   ```bash
   npm install -g firebase-tools
   ```

4. **Google/Firebase Account**
   - You can use your existing Google account
   - Firebase offers a generous free tier

---

## Firebase Project Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., `social-media-app`)
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

### Step 2: Login to Firebase CLI

```bash
firebase login
```

This will open a browser window for authentication. Sign in with your Google account.

### Step 3: Initialize Firebase in Your Project

Navigate to your project directory and run:

```bash
cd c:\sero-fero\social_media
firebase init hosting
```

You'll be prompted with several questions:

1. **"Please select an option"**: Choose **"Use an existing project"**
2. **"Select a default Firebase project"**: Choose the project you just created
3. **"What do you want to use as your public directory?"**: Enter `dist`
4. **"Configure as a single-page app?"**: Enter `y` (yes)
5. **"Set up automatic builds and deploys with GitHub?"**: Enter `n` (no) for now
6. **"File dist/index.html already exists. Overwrite?"**: Enter `n` (no)

> [!NOTE]
> The Firebase CLI will create `firebase.json` and `.firebaserc` files. We've already created these with optimal settings, so the init command will just link your project.

### Step 4: Update Firebase Project ID

Open `.firebaserc` and replace `your-firebase-project-id` with your actual Firebase project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

You can find your project ID in the Firebase Console under Project Settings.

---

## Local Configuration

### Environment Variables

Your `.env.local` file contains your Appwrite configuration. Make sure all values are correct:

```env
VITE_APPWRITE_PROJECT_ID=...
VITE_APPWRITE_URL=...
VITE_APPWRITE_STORAGE_ID=...
VITE_APPWRITE_DATABASE_ID=...
VITE_APPWRITE_SAVES_COLLECTION_ID=...
VITE_APPWRITE_USERS_COLLECTION_ID=...
VITE_APPWRITE_POSTS_COLLECTION_ID=...
VITE_APPWRITE_COMMENTS_COLLECTION_ID=...
VITE_APPWRITE_FOLLOW_COLLECTION_ID=...
```

> [!IMPORTANT]
> Vite injects these variables at **build time**. They will be bundled into your JavaScript files. Ensure your Appwrite backend has proper security rules configured.

### Test Build Locally

Before deploying, test the production build locally:

```bash
# Build the production bundle
npm run build

# Preview the production build
npm run preview
```

Visit `http://localhost:4173` and verify:
- ✅ App loads correctly
- ✅ Authentication works (sign-up, sign-in)
- ✅ Appwrite backend connectivity
- ✅ All routes work properly
- ✅ No console errors

---

## Deployment

### Option 1: Using the Deployment Script (Recommended)

We've created a deployment script for you. On Windows, you can run it using Git Bash or WSL:

```bash
bash deploy-firebase.sh
```

Or run the commands manually (see Option 2).

### Option 2: Manual Deployment

```bash
# Step 1: Build the production bundle
npm run build

# Step 2: Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Deployment Output

After successful deployment, you'll see output like:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project-id/overview
Hosting URL: https://your-project-id.web.app
```

🎉 **Your app is now live!** Visit the Hosting URL to see your deployed application.

---

## Custom Domain Setup

### Step 1: Add Custom Domain in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Hosting** in the left sidebar
4. Click **"Add custom domain"**
5. Enter your domain name (e.g., `www.yourdomain.com`)
6. Follow the verification steps

### Step 2: Update DNS Records

Firebase will provide DNS records to add to your domain registrar:

- **A records** for apex domain (@)
- **TXT record** for verification

### Step 3: Wait for SSL Certificate

Firebase automatically provisions a free SSL certificate. This can take up to 24 hours.

---

## Environment Variables

### Understanding Build-Time Variables

Vite uses environment variables at **build time**, not runtime. This means:

- Variables are replaced during the build process
- They become part of your JavaScript bundle
- Changing them requires rebuilding and redeploying

### Security Considerations

> [!WARNING]
> **Client-Side Exposure**: All environment variables prefixed with `VITE_` are exposed in the client-side code. Never store sensitive secrets (like API keys with write access) in these variables.

**Best Practices:**
- ✅ Use Appwrite's built-in security rules
- ✅ Configure proper permissions in Appwrite Console
- ✅ Use Appwrite's authentication and authorization
- ❌ Don't store sensitive backend secrets in frontend env vars

### Updating Environment Variables

If you need to change Appwrite endpoints or configuration:

1. Update `.env.local`
2. Rebuild: `npm run build`
3. Redeploy: `firebase deploy --only hosting`

---

## Troubleshooting

### Issue: "Command not found: firebase"

**Solution:** Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

### Issue: "Permission denied" when deploying

**Solution:** Login again:
```bash
firebase login --reauth
```

### Issue: 404 errors on page refresh

**Solution:** This is already configured in `firebase.json` with the rewrite rule. If you still see 404s, verify:
```json
"rewrites": [
  {
    "source": "**",
    "destination": "/index.html"
  }
]
```

### Issue: Appwrite connection errors

**Solution:** 
1. Check browser console for specific errors
2. Verify `.env.local` values are correct
3. Ensure Appwrite backend is accessible from the internet
4. Check Appwrite CORS settings in Appwrite Console
5. Add your Firebase Hosting domain to Appwrite's allowed origins

### Issue: Build fails with "out of memory"

**Solution:** Increase Node.js memory:
```bash
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Issue: Slow initial load time

**Solution:**
1. Enable code splitting (Vite does this by default)
2. Optimize images (use WebP format)
3. Use lazy loading for routes
4. Check Firebase Hosting CDN is working

---

## Advanced Features

### Preview Channels

Test changes before deploying to production:

```bash
# Deploy to a preview channel
firebase hosting:channel:deploy preview-name

# Example
firebase hosting:channel:deploy feature-test
```

This creates a temporary URL like: `https://your-project-id--feature-test-abc123.web.app`

### Rollback to Previous Version

View deployment history:
```bash
firebase hosting:releases:list
```

Rollback to a specific version in the Firebase Console:
1. Go to **Hosting** → **Release history**
2. Click on a previous release
3. Click **"Rollback"**

### CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_APPWRITE_PROJECT_ID: ${{ secrets.VITE_APPWRITE_PROJECT_ID }}
          VITE_APPWRITE_URL: ${{ secrets.VITE_APPWRITE_URL }}
          # Add all other env vars as GitHub secrets
          
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

### Performance Monitoring

Enable Firebase Performance Monitoring:

1. Install the SDK:
   ```bash
   npm install firebase
   ```

2. Add to your app (optional):
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getPerformance } from 'firebase/performance';

   const firebaseConfig = {
     // Your config
   };

   const app = initializeApp(firebaseConfig);
   const perf = getPerformance(app);
   ```

### Analytics

Firebase Hosting automatically integrates with Google Analytics if you enabled it during project creation.

---

## Quick Reference

### Common Commands

```bash
# Login to Firebase
firebase login

# Build production bundle
npm run build

# Preview build locally
npm run preview

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy to preview channel
firebase hosting:channel:deploy preview-name

# View deployment history
firebase hosting:releases:list

# Open Firebase Console
firebase open hosting
```

### File Structure

```
social_media/
├── dist/                    # Build output (created by npm run build)
├── src/                     # Source code
├── .env.local              # Local environment variables (not committed)
├── .firebaserc             # Firebase project configuration
├── firebase.json           # Firebase Hosting configuration
├── deploy-firebase.sh      # Deployment script
└── DEPLOYMENT.md           # This file
```

---

## Support

- **Firebase Documentation**: https://firebase.google.com/docs/hosting
- **Vite Documentation**: https://vitejs.dev/guide/
- **Appwrite Documentation**: https://appwrite.io/docs

---

## Next Steps

After successful deployment:

1. ✅ Test your live application thoroughly
2. ✅ Set up a custom domain (optional)
3. ✅ Configure Firebase Analytics (optional)
4. ✅ Set up CI/CD with GitHub Actions (optional)
5. ✅ Monitor performance and errors
6. ✅ Share your app with users! 🎉
