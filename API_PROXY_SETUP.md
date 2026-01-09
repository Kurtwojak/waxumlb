# Duel.com API Proxy Setup

Due to CORS restrictions and authentication requirements, you need a backend proxy to fetch data from Duel.com's API.

## Option 1: Node.js Proxy Server

Create a file `proxy-server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/duel-leaderboard', async (req, res) => {
  try {
    // Forward the user's cookies/authentication
    const response = await fetch(
      'https://duel.com/api/v2/referrals/referred-users?per_page=100&page=1&sort=total_wagered_coins&order=desc',
      {
        headers: {
          'Cookie': req.headers.cookie || '',
          'User-Agent': req.headers['user-agent'] || '',
          'Accept': 'application/json'
        }
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Proxy server running on port 3000');
});
```

Then update the fetch URL in `index.html` and `admin.html` to:
```javascript
fetch('http://localhost:3000/api/duel-leaderboard')
```

## Option 2: Serverless Function (Vercel)

Create `api/duel-leaderboard.js`:

```javascript
export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://duel.com/api/v2/referrals/referred-users?per_page=100&page=1&sort=total_wagered_coins&order=desc',
      {
        headers: {
          'Cookie': req.headers.cookie || '',
          'User-Agent': req.headers['user-agent'] || '',
          'Accept': 'application/json'
        }
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Option 3: Python Flask Proxy

Create `proxy.py`:

```python
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/api/duel-leaderboard')
def get_leaderboard():
    try:
        response = requests.get(
            'https://duel.com/api/v2/referrals/referred-users?per_page=100&page=1&sort=total_wagered_coins&order=desc',
            headers={
                'Cookie': request.headers.get('Cookie', ''),
                'User-Agent': request.headers.get('User-Agent', ''),
                'Accept': 'application/json'
            }
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000)
```

## Important Notes

1. **Authentication**: The proxy needs to forward the user's authentication cookies from Duel.com
2. **CORS**: The proxy must set proper CORS headers
3. **Security**: Add rate limiting and authentication to your proxy endpoint
4. **Captcha**: If Duel.com requires captcha, you may need to use a service like 2captcha or handle it manually

## Alternative: Manual Entry

If setting up a proxy is not feasible, you can continue using the admin panel to manually enter leaderboard data.
