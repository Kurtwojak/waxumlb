import { createClient } from 'redis';

// Initialize Redis client - connect once per serverless function instance
let redis = null;

async function getRedisClient() {
  if (redis) return redis;
  
  redis = createClient({
    url: process.env.REDIS_URL || process.env.KV_REST_API_URL,
    password: process.env.REDIS_PASSWORD || process.env.KV_REST_API_TOKEN,
  });
  
  redis.on('error', (err) => console.error('Redis Client Error', err));
  
  await redis.connect();
  return redis;
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get Redis client
      const client = await getRedisClient();
      
      // Fetch data from Redis
      const result = await client.get('item');
      
      // Return the result in the response
      return res.status(200).json({ result });
    }

    if (req.method === 'POST') {
      // Get Redis client
      const client = await getRedisClient();
      
      // Store data in Redis
      const { key, value } = req.body;
      if (!key || value === undefined) {
        return res.status(400).json({ error: 'key and value are required' });
      }
      
      await client.set(key, value);
      return res.status(200).json({ success: true, message: `Stored ${key}` });
    }

    return res.status(405).json({ error: 'Method not allowed. Use GET or POST' });
  } catch (err) {
    console.error('Redis Error:', err);
    
    // Reset connection on error
    if (redis) {
      try {
        await redis.quit();
      } catch (e) {
        // Ignore quit errors
      }
      redis = null;
    }
    
    return res.status(500).json({ 
      error: err.message,
      help: 'Make sure REDIS_URL and REDIS_PASSWORD (or KV_REST_API_URL and KV_REST_API_TOKEN) are set in your environment variables.'
    });
  }
}
