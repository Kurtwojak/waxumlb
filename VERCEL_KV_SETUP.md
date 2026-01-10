# Vercel KV Setup Guide

Follow these steps to set up Vercel KV for local development:

## 1. Connect to a project

Install Vercel CLI and link your project:
```bash
npm install -g vercel
vercel link
```

This will prompt you to:
- Select or create a Vercel project
- Link it to your local directory

## 2. Pull your latest environment variables

Pull environment variables from Vercel:
```bash
vercel env pull .env.development.local
```

This creates a `.env.development.local` file with your KV connection credentials.

## 3. Install @vercel/kv

Already installed! The `@vercel/kv` package is in `package.json`.

If you need to reinstall:
```bash
npm install @vercel/kv
```

## 4. Import and Initialize the SDK

The `api/kvtest.js` file is already set up with the proper imports and initialization.

**Note:** `@vercel/kv` automatically uses environment variables when deployed on Vercel. For local development, you need the `.env.development.local` file from step 2.

## Environment Variables Needed

After pulling env vars, you should have:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

These are automatically provided by Vercel when you create a KV database in your project dashboard.

## Setting Up KV Database in Vercel (REQUIRED - Fixes the Error)

### Step-by-Step Instructions:

1. **Go to your Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Navigate to your project (`waxumlb` or whatever you named it)

2. **Create a KV Database**
   - Click on the **"Storage"** tab (in the top navigation)
   - Click **"Create Database"**
   - Select **"KV"** (Redis-compatible)
   - Give it a name (e.g., `waxum-kv` or `leaderboard-kv`)
   - Select a region (choose the one closest to your users)
   - Click **"Create"**

3. **Link the Database to Your Project**
   - After creating the database, you'll see an option to **"Link to Project"**
   - Select your project from the dropdown
   - Click **"Link"**
   - The environment variables will be **automatically added** to your project

4. **Verify Environment Variables**
   - Go to your project's **Settings** → **Environment Variables**
   - You should see these variables automatically added:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
     - `KV_REST_API_READ_ONLY_TOKEN`

5. **Redeploy Your Project**
   - After linking, Vercel should automatically redeploy
   - If not, go to the **Deployments** tab and click **"Redeploy"** on the latest deployment
   - Or push a new commit to trigger a redeploy

### Alternative: Manual Environment Variable Setup

If the variables weren't automatically added:

1. Go to your KV database dashboard
2. Click on **"Connect"** or **".env.local"** tab
3. Copy the values for:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
4. Go to your project → **Settings** → **Environment Variables**
5. Add each variable:
   - **Key:** `KV_REST_API_URL` → **Value:** (paste the URL)
   - **Key:** `KV_REST_API_TOKEN` → **Value:** (paste the token)
6. Make sure to select **all environments** (Production, Preview, Development)
7. Click **"Save"**
8. Redeploy your project

### For Local Development:

After setting up in Vercel, pull the environment variables:
```bash
vercel env pull .env.development.local
```

This creates a local `.env.development.local` file with the KV credentials for testing locally.
