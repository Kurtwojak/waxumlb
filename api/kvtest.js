import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    // Check if KV is properly configured
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return res.status(500).json({ 
        error: 'KV not configured',
        message: 'Missing required environment variables KV_REST_API_URL and KV_REST_API_TOKEN. Please create a KV database in your Vercel project dashboard and link it to this project.',
        help: 'See VERCEL_KV_SETUP.md for instructions'
      });
    }

    if (req.method === 'GET') {
      // Fetch data from KV
      const result = await kv.get('item');
      
      // Return the result in the response
      return res.status(200).json({ result });
    }

    if (req.method === 'POST') {
      // Store data in KV
      const { key, value } = req.body;
      if (!key || value === undefined) {
        return res.status(400).json({ error: 'key and value are required' });
      }
      
      await kv.set(key, value);
      return res.status(200).json({ success: true, message: `Stored ${key}` });
    }

    return res.status(405).json({ error: 'Method not allowed. Use GET or POST' });
  } catch (err) {
    console.error('KV Error:', err);
    
    // Provide helpful error message for missing env vars
    if (err.message && err.message.includes('Missing required environment variables')) {
      return res.status(500).json({ 
        error: 'KV Configuration Error',
        message: err.message,
        help: 'Create a KV database in your Vercel dashboard (Storage tab) and link it to your project. See VERCEL_KV_SETUP.md for detailed instructions.'
      });
    }
    
    return res.status(500).json({ error: err.message });
  }
}