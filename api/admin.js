// Serverless function to protect admin panel with IP whitelist and security checks
export default async function handler(req, res) {
  // Get IP whitelist from environment (optional)
  const ipWhitelist = (process.env.ALLOWED_IPS || '').split(',').map(ip => ip.trim()).filter(ip => ip);
  
  // Get client IP
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.headers['x-real-ip'] || 
                   req.connection?.remoteAddress || 
                   'unknown';
  
  // Check IP whitelist if configured
  if (ipWhitelist.length > 0 && !ipWhitelist.includes(clientIP)) {
    return res.status(403).send(`
<!DOCTYPE html>
<html>
<head>
  <title>Access Denied - WAXUM Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chivo+Mono:wght@400;600&family=Dela+Gothic+One&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Chivo Mono', monospace;
      background: #050301;
      color: #ff8f00;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .error-container {
      text-align: center;
      padding: 40px;
      border: 2px solid #ff8f00;
      background: rgba(5, 3, 1, 0.9);
      max-width: 600px;
    }
    h1 {
      font-family: 'Dela Gothic One', sans-serif;
      font-size: 48px;
      margin-bottom: 24px;
      color: #ff8f00;
    }
    p { font-size: 16px; line-height: 1.6; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="error-container">
    <h1>403 - ACCESS DENIED</h1>
    <p>Your IP address is not authorized to access the admin panel.</p>
  </div>
</body>
</html>
    `);
  }

  // Allow access - redirect to admin page
  // Password protection is handled in admin.html
  return res.redirect('/admin.html');
}
