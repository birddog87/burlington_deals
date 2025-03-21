#!/bin/bash

echo "🚀 Deploying Burlington Deals API to Render..."

# Navigate to project directory
cd "$( dirname "${BASH_SOURCE[0]}" )"

# Ensure all changes are committed to Git
echo "📝 Checking for uncommitted changes..."
if [[ $(git status --porcelain) ]]; then
  echo "❗ You have uncommitted changes. Commit them before deploying."
  git status
  exit 1
fi

# Push changes to GitHub (which will trigger Render deployment)
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Backend deployment initiated! Check Render for deployment status."
echo "🔗 https://dashboard.render.com/"
