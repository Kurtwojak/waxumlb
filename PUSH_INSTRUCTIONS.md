# Push to GitHub - Quick Instructions

Your repository is set up at: **https://github.com/Kurtwojak/waxumlb.git**

## Option 1: Using Personal Access Token (Easiest)

1. **Create a GitHub Token**:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Name: `waxum-deploy`
   - Select scope: **`repo`** (check the box)
   - Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)

2. **Push using the token**:
   ```bash
   cd /Users/kurt/Desktop/waxum
   ./push-with-token.sh YOUR_TOKEN_HERE
   ```

## Option 2: Using GitHub CLI (if installed)

```bash
gh auth login
git push -u origin main
```

## Option 3: Manual Push (Browser will prompt)

```bash
cd /Users/kurt/Desktop/waxum
git push -u origin main
```
Then authenticate in the browser when prompted.

## After Pushing

Once pushed, deploy to Vercel:
1. Go to https://vercel.com
2. Import repository: `Kurtwojak/waxumlb`
3. Set environment variables
4. Deploy!
