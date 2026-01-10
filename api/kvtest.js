import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const value = await kv.get('test');
    return res.json({ value });
  }

  if (req.method === 'POST') {
    await kv.set('test', 'test2');
    return res.json({ message: 'test2 saved to test' });
  }
  
  res.status(405).json({ error: 'Use GET or POST' });
}