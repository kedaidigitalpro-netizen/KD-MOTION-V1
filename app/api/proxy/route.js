export async function GET(req) {
  return handle(req);
}

export async function POST(req) {
  return handle(req);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: cors(),
  });
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, x-freepik-api-key',
  };
}

async function handle(req) {
  const url = new URL(req.url);
  const route = url.searchParams.get('route');
  const path = url.searchParams.get('path');

  if (route === 'api') {
    if (!path) {
      return new Response(JSON.stringify({ error: 'Missing path' }), {
        status: 400,
        headers: cors(),
      });
    }

    const targetUrl = `https://api.freepik.com${path}`;
    const apiKey = req.headers.get('x-freepik-api-key') || '';

    let body = null;
    if (req.method !== 'GET') {
      body = await req.text();
    }

    try {
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(apiKey && { 'x-freepik-api-key': apiKey }),
        },
        body: body || undefined,
      });

      const data = await response.text();

      return new Response(data, {
        status: response.status,
        headers: cors(),
      });

    } catch (err) {
      return new Response(JSON.stringify({
        error: 'Proxy error',
        details: err.message
      }), {
        status: 500,
        headers: cors(),
      });
    }
  }

  return new Response(JSON.stringify({
    error: 'Invalid route'
  }), {
    status: 404,
    headers: cors(),
  });
}