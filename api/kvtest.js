import { createClient } from 'redis';

let redisClient = null;

// Initialize Redis once per serverless function instance
async function getRedisClient() {
  if (!redisClient) {
    if (!process.env.REDIS_URL) {
      throw new Error('Missing REDIS_URL environment variable. Set it in your Vercel project.');
    }

    const config = {
      url: process.env.REDIS_URL,
    };
    if (process.env.REDIS_PASSWORD) {
      config.password = process.env.REDIS_PASSWORD;
    }

    redisClient = createClient(config);

    redisClient.on('error', (err) => console.error('Redis Client Error', err));

    await redisClient.connect();
    console.log('✅ Connected to Redis');
  }

  return redisClient;
}

export default async function handler(req, res) {
  try {
    const client = await getRedisClient();

    if (req.method === 'GET') {
      const key = req.query.key || 'item';
      const value = await client.get(key);

      return res.status(200).json({
        result: value,
        message: value === null
          ? `Key "${key}" does not exist. Use POST to store a value first.`
          : `Found value for key "${key}"`,
      });
    }

    if (req.method === 'POST') {
      const { key, value } = req.body;
      if (!key || value === undefined) {
        return res.status(400).json({ error: 'key and value are required' });
      }

      await client.set(key, String(value));

      return res.status(200).json({
        success: true,
        message: `Stored "${key}" = "${value}"`,
      });
    }

    return res.status(405).json({ error: 'Method not allowed. Use GET or POST' });
  } catch (err) {
    console.error('Redis Error:', err);
    return res.status(500).json({
      error: err.message,
      help: 'Make sure REDIS_URL (and optionally REDIS_PASSWORD) are set in your environment variables.',
    });
  }
}