# Deployment Guide for WAXUM Leaderboard

## Deploying to Vercel

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub and create a new repository
   - Push your code:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/waxum.git
     git branch -M main
     git push -u origin main
     ```

### Step 2: Deploy to Vercel

1. **Sign up/Login to Vercel**: https://vercel.com
2. **Import Project**:
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings

3. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add the following:
     - `ADMIN_PASSWORD` = `your-secure-password-here`
     - `AUTHORIZED_EMAILS` = `your-email@example.com,team-member@example.com` (optional but recommended)
   
   **Important**: 
   - Add all email addresses that should have admin access (comma-separated)
   - Only users with these emails can access the admin panel
   - If left empty, anyone with the password can access

### Step 3: How Vercel Authentication Works

When deployed on Vercel:
- The `/api/auth` endpoint checks if the user is logged into Vercel
- It verifies the user's email against the `AUTHORIZED_EMAILS` list
- Only authorized emails can access the admin panel
- Password is still required (stored in environment variable, not in code)

### Step 4: Access Control Setup

**To restrict to specific Vercel accounts:**

1. In Vercel Dashboard → Settings → Environment Variables
2. Set `AUTHORIZED_EMAILS` = `your-email@example.com`
3. Add multiple emails: `email1@example.com,email2@example.com`
4. Only these emails can access admin panel (even with correct password)

**To allow any Vercel user:**
- Leave `AUTHORIZED_EMAILS` empty or don't set it
- Anyone with the password can access

## Security Features

✅ **Password stored in environment variable** (not in code)  
✅ **Email-based access control** (only authorized emails)  
✅ **Serverless function authentication** (password checked server-side)  
✅ **Session tokens** (24-hour expiration)  

## Changing the Admin Password

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `ADMIN_PASSWORD` value
3. Redeploy the project (or it will auto-redeploy on next push)

## Post-Deployment Checklist

- [ ] Set `ADMIN_PASSWORD` environment variable
- [ ] Set `AUTHORIZED_EMAILS` with your email(s)
- [ ] Test admin panel login
- [ ] Verify countdown timer works
- [ ] Test leaderboard updates
- [ ] Check mobile responsiveness
- [ ] Verify all modals work
- [ ] Test API JSON paste functionality

## Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

- **Password not working**: Check environment variable is set correctly
- **"Unauthorized email" error**: Add your email to `AUTHORIZED_EMAILS`
- **Countdown not updating**: Check browser console for errors
- **Leaderboard not loading**: Verify localStorage is working

## Local Development

For local development, the admin panel will fall back to local password check:
- Edit `admin.html` and change `ADMIN_PASSWORD` constant
- No email verification in local development
