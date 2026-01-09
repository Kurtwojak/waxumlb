#!/bin/bash

# Push to GitHub using Personal Access Token
# Usage: ./push-with-token.sh YOUR_TOKEN

if [ -z "$1" ]; then
    echo "Usage: ./push-with-token.sh YOUR_GITHUB_TOKEN"
    echo ""
    echo "To create a token:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Give it a name like 'waxum-deploy'"
    echo "4. Select scope: 'repo' (full control)"
    echo "5. Click 'Generate token'"
    echo "6. Copy the token and use it here"
    exit 1
fi

TOKEN=$1
REPO_URL="https://${TOKEN}@github.com/Kurtwojak/waxumlb.git"

echo "📤 Pushing to GitHub..."

git remote set-url origin $REPO_URL
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "📍 Repository: https://github.com/Kurtwojak/waxumlb"
    echo ""
    echo "Next: Deploy to Vercel at https://vercel.com"
else
    echo ""
    echo "❌ Push failed. Check your token and try again."
fi
