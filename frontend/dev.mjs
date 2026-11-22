// TEKS local dev server. No dependencies; needs Node 20+.
//   node frontend/dev.mjs        (or, from frontend/: node dev.mjs)
// Serves frontend/public on http://localhost:5173 and forwards /api/* to the FastAPI backend
// (http://localhost:8000), so the browser uses same-origin /api exactly like the deployed site,
// where frontend/vercel.json rewrites /api/* to teks-api.
// Options: PORT=5174, API=http://localhost:8001
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.PORT) || 5173;
const API = new URL(process.env.API || 'http://localhost:8000');
const PUBLIC = path.join(import.meta.dirname, 'public');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp4': 'video/mp4',
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}

function proxy(req, res) {
  const client = req.socket.remoteAddress || '';
  const headers = { ...req.headers, host: API.host, 'x-forwarded-for': client, 'x-real-ip': client };
  const upstream = http.request(
    { protocol: API.protocol, hostname: API.hostname, port: API.port, method: req.method, path: req.url, headers },
    up => { res.writeHead(up.statusCode || 502, up.headers); up.pipe(res); },
  );
  upstream.on('error', () => {
    if (res.headersSent) return res.destroy();
    send(res, 502, JSON.stringify({ error: `The API is not running at ${API.origin}. In backend/, run: uvicorn app.main:app --reload` }), 'application/json');
  });
  req.pipe(upstream);
}

function serveStatic(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
  let rel;
  try { rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { return send(res, 400, 'Bad request'); }
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(PUBLIC, path.normalize(rel));
  if (!file.startsWith(PUBLIC + path.sep)) return send(res, 403, 'Forbidden');
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, 'Not found');
    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    // Byte ranges, which browsers use to seek and loop <video> (the hero clips), as Vercel does.
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (range && (range[1] || range[2])) {
      const start = range[1] ? Number(range[1]) : Math.max(0, buf.length - Number(range[2]));
      const end = range[1] && range[2] ? Math.min(Number(range[2]), buf.length - 1) : buf.length - 1;
      if (start > end || start >= buf.length) { res.writeHead(416, { 'Content-Range': `bytes */${buf.length}` }); return res.end(); }
      res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${buf.length}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, 'Cache-Control': 'no-cache' });
      return res.end(req.method === 'HEAD' ? undefined : buf.subarray(start, end + 1));
    }
    res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' });
    res.end(req.method === 'HEAD' ? undefined : buf);
  });
}

http.createServer((req, res) => (req.url.startsWith('/api/') ? proxy(req, res) : serveStatic(req, res)))
  .on('error', err => {
    if (err.code !== 'EADDRINUSE') throw err;
    console.error(`Port ${PORT} is already in use, often by an old "npm run dev" (Vite). Stop it (Ctrl+C in its terminal),\n` +
      `or use another port. PowerShell: $env:PORT=5174; node frontend/dev.mjs`);
    process.exit(1);
  })
  .listen(PORT, 'localhost', () => console.log(`TEKS frontend: http://localhost:${PORT}  (/api -> ${API.origin})`));
