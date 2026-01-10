// Support both Redis direct connection and REST API
// If REDIS_URL is provided, use direct Redis connection
// Otherwise, use REST API (KV_REST_API_URL)

let redisClient = null;

async function getRedisClient() {
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
      return { type: 'direct', client: redisClient };
    } catch (err) {
      console.warn('Direct Redis connection failed, falling back to REST API:', err.message);
      // Fall through to REST API
    }
  }

  // Use REST API
  const apiUrl = process.env.KV_REST_API_URL;
  const apiToken = process.env.KV_REST_API_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN;
  
  if (!apiUrl || !apiToken) {
    throw new Error('No Redis connection available. Set either REDIS_URL or KV_REST_API_URL with KV_REST_API_TOKEN.');
  }

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

      return res.status(200).json({ result });
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
        // REST API - note: Vercel KV REST API format may vary
        const response = await fetch(`${connection.url}/set/${key}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${connection.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value: String(value) }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Redis API error: ${response.status} - ${errorText}`);
        }
      }

      return res.status(200).json({ success: true, message: `Stored ${key}` });
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
