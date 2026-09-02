import { getStore } from '@netlify/blobs';

// Un único registro compartido por todo el sitio: el catálogo de Lincoln Records.
// GET  -> devuelve el catálogo actual (o [] si todavía no se guardó nada)
// POST -> reemplaza el catálogo con el array recibido en el body

export default async (req) => {
  const store = getStore('lincoln-records');

  if (req.method === 'GET') {
    const data = await store.get('catalog', { type: 'json' });
    return new Response(JSON.stringify(data || []), {
      headers: { 'content-type': 'application/json' }
    });
  }

  if (req.method === 'POST') {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: 'JSON inválido' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }
    if (!Array.isArray(body)) {
      return new Response(JSON.stringify({ error: 'Se esperaba un array' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }
    await store.setJSON('catalog', body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'content-type': 'application/json' }
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
};

