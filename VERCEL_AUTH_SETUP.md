# Vercel Authentication Setup for Admin Panel

## How It Works

The admin panel is now protected by Vercel authentication. When someone tries to access `/admin`, the system:

1. Checks if they're logged into Vercel
2. Verifies their email is in the `AUTHORIZED_EMAILS` list
3. Only allows access if both conditions are met

## Setup Instructions

### Step 1: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add/Update:
   - `AUTHORIZED_EMAILS` = `your-email@example.com,another@example.com`
   - Add all email addresses that should have admin access (comma-separated)

### Step 2: How Access Works

**With `AUTHORIZED_EMAILS` set:**
- User must be logged into Vercel
- User's email must be in the authorized list
- Password is still required (from `ADMIN_PASSWORD`)

**Without `AUTHORIZED_EMAILS` set:**
- Falls back to password-only authentication
- Anyone with the password can access

### Step 3: Testing

1. Visit: `https://your-site.vercel.app/admin`
2. If not logged into Vercel, you'll see a 403 error
3. If logged in but email not authorized, you'll see a 403 error
4. If authorized, you'll see the admin login page (password still required)

## Alternative: Vercel Password Protection

You can also use Vercel's built-in Password Protection:

1. Go to Vercel Dashboard → Your Project → Settings
2. Scroll to **Password Protection**
3. Enable it and set a password
4. This protects the entire site or specific routes

**Note:** This is separate from the admin panel password and protects at the Vercel level.

## Security Notes

- ✅ Email verification happens server-side
- ✅ Password is still required (stored in environment variable)
- ✅ Unauthorized users get a 403 error
- ✅ Authorized emails are checked on every request

## Troubleshooting

**"Access Denied" even when logged in:**
- Check that your email is in `AUTHORIZED_EMAILS`
- Verify the email matches exactly (case-sensitive)
- Check Vercel headers are being passed correctly

**Can't access admin panel:**
- Make sure you're logged into Vercel
- Check environment variables are set correctly
- Try accessing `/admin.html` directly (bypasses Vercel auth check)
