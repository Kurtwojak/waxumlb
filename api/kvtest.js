// Support both Redis direct connection and REST API
// If REDIS_URL is provided, use direct Redis connection
// Otherwise, use REST API (KV_REST_API_URL)

let redisClient = null;

async function getRedisClient() {
  // Debug: Log available env vars (without exposing values)
  const envVars = {
    hasRedisUrl: !!process.env.REDIS_URL,
    hasRedisPassword: !!process.env.REDIS_PASSWORD,
    hasKvRestApiUrl: !!process.env.KV_REST_API_URL,
    hasKvRestApiToken: !!process.env.KV_REST_API_TOKEN,
    hasKvReadOnlyToken: !!process.env.KV_REST_API_READ_ONLY_TOKEN,
  };
  console.log('Redis connection env vars:', envVars);

  // Try direct Redis connection first (if REDIS_URL is provided)
  if (process.env.REDIS_URL && !redisClient) {
    try {
      const { createClient } = await import('redis');
      redisClient = createClient({
        url: process.env.REDIS_URL,
        password: process.env.REDIS_PASSWORD,
      });
      redisClient.on('error', (err) => console.error('Redis Client Error', err));
      await redisClient.connect();
      console.log('✅ Connected to Redis via direct connection');
      return { type: 'direct', client: redisClient };
    } catch (err) {
      console.warn('Direct Redis connection failed, falling back to REST API:', err.message);
      // Fall through to REST API
    }
  }

  // Use REST API (Vercel KV)
  const apiUrl = process.env.KV_REST_API_URL;
  const apiToken = process.env.KV_REST_API_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN;
  
  if (!apiUrl || !apiToken) {
    const missing = [];
    if (!apiUrl) missing.push('KV_REST_API_URL');
    if (!apiToken) missing.push('KV_REST_API_TOKEN (or KV_REST_API_READ_ONLY_TOKEN)');
    
    throw new Error(`No Redis connection available. Missing: ${missing.join(', ')}. Please create a KV database in your Vercel project dashboard and link it to your project.`);
  }

  console.log('✅ Using Vercel KV REST API');
  return { type: 'rest', url: apiUrl, token: apiToken };
}

export default async function handler(req, res) {
  try {
    const connection = await getRedisClient();

    if (req.method === 'GET') {
      const key = req.query.key || 'item';
      let result;

      if (connection.type === 'direct') {
        // Direct Redis connection
        result = await connection.client.get(key);
      } else {
        // REST API
        const response = await fetch(`${connection.url}/get/${key}`, {
          headers: {
            'Authorization': `Bearer ${connection.token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Redis API error: ${response.status}`);
        }
        
        const data = await response.json();
        result = data.result;
      }

      // Return result with helpful message if null
      return res.status(200).json({ 
        result,
        message: result === null ? `Key "${key}" does not exist. Use POST to store a value first.` : `Found value for key "${key}"`
      });
    }

    if (req.method === 'POST') {
      const { key, value } = req.body;
      if (!key || value === undefined) {
        return res.status(400).json({ error: 'key and value are required' });
      }

      if (connection.type === 'direct') {
        // Direct Redis connection
        await connection.client.set(key, String(value));
      } else {
        // REST API - Vercel KV REST API format
        // Try different possible endpoint formats
        let response;
        try {
          // Format 1: Standard REST API
          response = await fetch(`${connection.url}/set/${key}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${connection.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: String(value) }),
          });
          
          if (!response.ok && response.status === 404) {
            // Try alternative format
            response = await fetch(`${connection.url}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${connection.token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                command: 'SET',
                args: [key, String(value)]
              }),
            });
          }
        } catch (fetchError) {
          throw new Error(`Failed to connect to Redis REST API: ${fetchError.message}`);
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Redis API error: ${response.status} - ${errorText}. URL: ${connection.url}/set/${key}`);
        }
        
        // Verify the response
        const responseData = await response.json().catch(() => ({}));
        console.log('Redis SET response:', responseData);
      }

      // Verify it was stored by getting it back
      let storedValue;
      if (connection.type === 'direct') {
        storedValue = await connection.client.get(key);
      } else {
        const getResponse = await fetch(`${connection.url}/get/${key}`, {
          headers: {
            'Authorization': `Bearer ${connection.token}`,
          },
        });
        if (getResponse.ok) {
          const getData = await getResponse.json();
          storedValue = getData.result;
        }
      }

      return res.status(200).json({ 
        success: true, 
        message: `Stored "${key}" = "${value}"`,
        verified: storedValue !== null,
        stored_value: storedValue
      });
    }

    return res.status(405).json({ error: 'Method not allowed. Use GET or POST' });
  } catch (err) {
    console.error('Redis Error:', err);
    
    // Clean up connection on error
    if (redisClient) {
      try {
        await redisClient.quit();
      } catch (e) {
        // Ignore
      }
      redisClient = null;
    }
    
    return res.status(500).json({ 
      error: err.message,
      help: 'Make sure you have either REDIS_URL (with REDIS_PASSWORD) or KV_REST_API_URL (with KV_REST_API_TOKEN) set in your environment variables.'
    });
  }
}
