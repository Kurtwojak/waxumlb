#!/bin/bash

# Script to push to GitHub
# Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME

if [ -z "$1" ]; then
    echo "Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME"
    echo ""
    echo "First, create a repository on GitHub:"
    echo "1. Go to https://github.com/new"
    echo "2. Name it 'waxum' (or any name)"
    echo "3. Choose Private or Public"
    echo "4. DO NOT initialize with README"
    echo "5. Click 'Create repository'"
    echo ""
    echo "Then run this script with your username"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="waxum"

echo "🚀 Setting up GitHub repository..."

# Check if remote already exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  Remote 'origin' already exists"
    read -p "Do you want to update it? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote set-url origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
    else
        echo "Keeping existing remote"
    fi
else
    git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
fi

# Ensure we're on main branch
git branch -M main

echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "📍 Repository: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Import your GitHub repository"
    echo "3. Set environment variables (ADMIN_PASSWORD, AUTHORIZED_EMAILS)"
    echo "4. Deploy!"
else
    echo ""
    echo "❌ Push failed. You may need to:"
    echo "1. Authenticate with GitHub"
    echo "2. Check if the repository exists"
    echo "3. Verify your username is correct"
fi
