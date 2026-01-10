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

## Setting Up KV Database in Vercel

1. Go to your Vercel project dashboard
2. Navigate to the "Storage" tab
3. Click "Create Database" → "KV"
4. Follow the prompts to create your KV database
5. The environment variables will be automatically added to your project
