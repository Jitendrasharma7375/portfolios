// Local preview server for the portfolios: node serve.js  ->  http://localhost:5180/kinetic/
// Each index.html is written without <!doctype>/<html>/<body> (the artifact host adds them),
// so this server wraps it in the same skeleton to render it the way the published page does.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 5180;
const TYPES = { '.html': 'text/html; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const HEAD = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>';

http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(path.basename(file) === 'index.html' ? HEAD + buf + '</body></html>' : buf);
  });
}).listen(PORT, () => console.log('Portfolios at http://localhost:' + PORT + '/  (kinetic/, sketchbook/, bughunt/, levelup/)'));
