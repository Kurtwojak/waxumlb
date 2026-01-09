# Security Guide

## ⚠️ IMPORTANT: Password Security

### Current Setup
The admin password is stored **in plain text** in `admin.html`. This means:

1. **If you push to GitHub**: Anyone with access to your repository can see the password
2. **If deployed to Vercel**: The password is visible in the deployed HTML file
3. **Anyone viewing source**: Can see the password in browser dev tools

### Is it secure on GitHub/Vercel?

**Short answer: NO** - If the password is in your code and you push to GitHub, it's visible.

### Solutions

#### Option 1: Use a Strong Password (Quick Fix)
- Change the password to something long and random
- Example: `Waxum2025!@#$SecurePass123`
- Still visible in code, but harder to guess

#### Option 2: Don't Commit Password (Better)
1. Keep password in a local file (not in git)
2. Use a build script to inject it
3. Add password file to `.gitignore`

#### Option 3: Server-Side Authentication (Best)
- Use Vercel Serverless Functions
- Implement proper authentication
- Password never reaches the client

### Recommended Approach for Now

1. **Change the password** to something strong before deploying
2. **Don't make the repo public** if possible
3. **Use GitHub private repository**
4. **Consider implementing server-side auth** for production

### How to Change Password

1. Open `admin.html`
2. Find: `const ADMIN_PASSWORD = 'waxum2025';`
3. Change `'waxum2025'` to your new password
4. Save and redeploy

### For Production

Consider implementing:
- OAuth authentication (Google, GitHub, etc.)
- JWT tokens
- Serverless function authentication
- Rate limiting on login attempts
