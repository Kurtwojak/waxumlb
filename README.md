# WAXUM x DUEL.COM Leaderboard

A leaderboard website for tracking viewer wagers under the WAXUM referral code on Duel.com.

## Features

- Real-time leaderboard with monthly and daily views
- Admin panel for managing leaderboard data
- Countdown timer for leaderboard periods
- Final standings capture and history
- API integration with Duel.com
- Responsive design with retro arcade aesthetic

## Quick Start

### Local Development

```bash
# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000/index.html
open http://localhost:8000/admin.html
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set `ADMIN_PASSWORD` environment variable
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Admin Access

- Default password: `waxum2025`
- **IMPORTANT**: Change this before deploying to production!

## File Structure

```
waxum/
├── index.html          # Main leaderboard page
├── admin.html         # Admin panel
├── assets/            # Images, fonts, icons
├── vercel.json        # Vercel configuration
└── DEPLOYMENT.md      # Deployment guide
```

## Security Notes

⚠️ **The admin password is currently in plain text in the code.**
- For production, use Vercel Environment Variables
- Never commit passwords to GitHub
- See DEPLOYMENT.md for security best practices
