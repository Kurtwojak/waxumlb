import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    // Store current time in KV
    const now = new Date().toISOString();
    await kv.set('last_ping', now);

    // Retrieve it back
    const value = await kv.get('last_ping');

    res.status(200).json({
      success: true,
      stored_value: value,
    });
  } catch (err) {
    console.error('KV Error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}