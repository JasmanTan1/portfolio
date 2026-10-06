// One-off helper: regenerate static/og.png (the 1200x630 link-preview image).
//
//   node tools/make-og.mjs      then open http://127.0.0.1:5194/ in a browser
//
// The canvas in tools/og.html draws the card and POSTs the PNG back here, which
// writes static/og.png and exits. A browser is used because it has the font
// rasteriser; nothing about this runs in production or at build time, and the
// server only listens on loopback while you have it open.
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '..', 'static', 'og.png');
const port = 5194;

const server = createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/save') {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const dataUrl = Buffer.concat(chunks).toString('utf8');
    const b64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    await writeFile(out, Buffer.from(b64, 'base64'));
    res.writeHead(200, { 'content-type': 'text/plain' }).end('saved');
    console.log(`wrote ${out}`);
    setTimeout(() => server.close(), 200);
    return;
  }
  const html = await readFile(join(here, 'og.html'), 'utf8');
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(
    html.replace(
      '</body>',
      `<script>fetch('/save',{method:'POST',body:document.getElementById('c').toDataURL('image/png')})
         .then(function(){document.title='saved'});</script></body>`
    )
  );
}).listen(port, '127.0.0.1', () => console.log(`open http://127.0.0.1:${port}/`));
