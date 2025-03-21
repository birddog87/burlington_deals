#!/bin/bash

echo "🚀 Building and deploying Burlington Deals frontend..."

# Navigate to project directory
cd "$( dirname "${BASH_SOURCE[0]}" )"

# Build the React app
echo "📦 Building React app..."
npm run build

# Deploy to SiteGround - copying contents of build folder directly to public_html
echo "📤 Deploying to SiteGround..."
scp -P 18765 -r build/* u2849-ltl4m1dszx2y@ssh.burlingtondeals.ca:/home/customer/www/burlingtondeals.ca/public_html/

echo "✅ Frontend deployment complete!"
