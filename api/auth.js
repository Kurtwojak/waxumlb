// Vercel Serverless Function for Admin Authentication
// This checks if the user is part of the authorized Vercel team

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  // Get admin password from environment variable
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'waxum2025';
  
  // Get authorized emails from environment (comma-separated)
  const AUTHORIZED_EMAILS = (process.env.AUTHORIZED_EMAILS || '').split(',').map(e => e.trim()).filter(e => e);
  
  // Check password first
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Check if email verification is required
  if (AUTHORIZED_EMAILS.length > 0) {
    // Get user email from Vercel headers
    // When deployed on Vercel, these headers are available if user is logged in
    const userEmail = req.headers['x-vercel-user-email'] || 
                     req.headers['x-forwarded-user-email'] ||
                     req.headers['x-vercel-email'];
    
    if (!userEmail) {
      return res.status(403).json({ 
        error: 'Email verification required. Please ensure you are logged into Vercel and accessing from an authorized account.' 
      });
    }

    // Check if email is authorized
    if (!AUTHORIZED_EMAILS.includes(userEmail)) {
      return res.status(403).json({ 
        error: `Unauthorized. Email ${userEmail} is not in the authorized list.` 
      });
    }
  }

  // Generate a session token
  const sessionToken = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
  
  return res.status(200).json({ 
    success: true,
    token: sessionToken,
    expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    email: req.headers['x-vercel-user-email'] || 'unknown'
  });
}
