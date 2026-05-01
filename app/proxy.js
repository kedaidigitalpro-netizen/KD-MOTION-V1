export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, x-freepik-api-key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { route, path } = req.query;

  if (route === 'api') {
    if (!path) {
      return res.status(400).json({ error: 'Missing path' });
    }

    const targetUrl = `https://api.freepik.com${path}`;
    const apiKey = req.headers['x-freepik-api-key'] || '';

    try {
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(apiKey && { 'x-freepik-api-key': apiKey }),
        },
        body:
          req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
      });

      const data = await response.text();

      return res.status(response.status).send(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(404).json({ error: 'Invalid route' });
}