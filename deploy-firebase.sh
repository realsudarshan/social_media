#!/bin/bash

# Firebase Hosting Deployment Script
# This script builds and deploys your React/Vite app to Firebase Hosting

set -e  # Exit on error

echo "🚀 Starting Firebase Hosting deployment..."

# Step 1: Build the production bundle
echo "📦 Building production bundle..."
npm run build

# Step 2: Deploy to Firebase Hosting
echo "🔥 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌐 Your app is now live on Firebase Hosting"
