import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
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
    return res.status(500).json({ error: err.message });
  }
}