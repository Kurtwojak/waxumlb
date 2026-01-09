// Verify session token
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  
  // In production, verify token against a session store
  // For now, simple validation
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Basic token validation (in production, use JWT or session store)
  return res.status(200).json({ valid: true });
}
