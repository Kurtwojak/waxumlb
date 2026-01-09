# GitHub & Vercel Deployment Guide

## Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com
2. **Click the "+" icon** in the top right → "New repository"
3. **Repository name**: `waxum` (or any name you prefer)
4. **Visibility**: 
   - Choose **Private** (recommended for security - password won't be visible)
   - Or **Public** if you want it open source
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. **Click "Create repository"**

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
cd /Users/kurt/Desktop/waxum

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/waxum.git

# Rename branch to main (if needed)
git branch -M main

# Push your code
git push -u origin main
```

## Step 3: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** (you can use your GitHub account)
3. **Click "Add New Project"**
4. **Import your GitHub repository**:
   - Find your `waxum` repository
   - Click "Import"
5. **Configure Project**:
   - Framework Preset: "Other" (it's a static site)
   - Root Directory: `./` (leave as is)
   - Build Command: (leave empty - no build needed)
   - Output Directory: (leave empty)
6. **Environment Variables** (IMPORTANT):
   - Click "Environment Variables"
   - Add:
     - Name: `ADMIN_PASSWORD`
     - Value: `your-secure-password-here` (change this!)
     - Add to: Production, Preview, Development
   - Add (optional but recommended):
     - Name: `AUTHORIZED_EMAILS`
     - Value: `your-email@example.com` (your Vercel account email)
     - Add to: Production, Preview, Development
7. **Click "Deploy"**

## Step 4: Your Website is Live!

After deployment, Vercel will give you:
- **Production URL**: `https://waxum.vercel.app` (or your custom domain)
- **Admin Panel**: `https://waxum.vercel.app/admin.html`

## Quick Command Reference

```bash
# Navigate to project
cd /Users/kurt/Desktop/waxum

# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Vercel will auto-deploy on every push!
```

## Important Security Reminders

⚠️ **Before pushing to GitHub:**
- Change the password in `admin.html` if you want a different default
- Remember: Password should be set in Vercel Environment Variables for production
- Consider making the repository **Private** on GitHub

## Troubleshooting

**"Repository not found"**: 
- Check the repository name matches
- Verify you have access to the repository

**"Permission denied"**:
- You may need to authenticate with GitHub
- Use: `gh auth login` or set up SSH keys

**Vercel deployment fails**:
- Check that all files are committed
- Verify `vercel.json` is in the root
- Check Vercel build logs for errors
