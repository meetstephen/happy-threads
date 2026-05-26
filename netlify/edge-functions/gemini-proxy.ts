/**
 * Netlify Edge Function: Gemini API Proxy
 *
 * Keeps the GEMINI_API_KEY server-side so it is never exposed in the
 * client bundle. The front-end POSTs the generateContent payload to
 * /api/gemini and this function forwards it to the Gemini API.
 */

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = Deno.env.get('GEMINI_API_KEY');

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Gemini API key is not configured on the server.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    const body = await request.text();
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    const responseBody = await geminiResponse.text();

    return new Response(responseBody, {
      status: geminiResponse.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: `Proxy error: ${message}` }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

export const config = { path: '/api/gemini' };
