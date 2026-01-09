#!/bin/bash

# Quick deployment script for Vercel
# Usage: ./deploy.sh

echo "🚀 Preparing for Vercel deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - WAXUM Leaderboard"
    echo "✅ Git initialized"
    echo ""
    echo "⚠️  Next steps:"
    echo "1. Create a GitHub repository"
    echo "2. Run: git remote add origin YOUR_REPO_URL"
    echo "3. Run: git push -u origin main"
    echo "4. Import project in Vercel dashboard"
    echo ""
else
    echo "✅ Git repository found"
    echo ""
    echo "📝 Current status:"
    git status
    echo ""
    echo "💡 To deploy:"
    echo "1. Commit your changes: git add . && git commit -m 'Your message'"
    echo "2. Push to GitHub: git push"
    echo "3. Vercel will auto-deploy on push"
fi

echo ""
echo "🔒 SECURITY REMINDER:"
echo "⚠️  Make sure to change the admin password in admin.html before deploying!"
echo "⚠️  Current password is visible in the code - change it to something secure!"
