// Render dist/resume/ to static/resume.pdf using the Chrome already installed on
// this machine. No npm dependency, no bundled Chromium.
//
//   node tools/make-pdf.mjs        (npm run pdf runs build -> this -> build)
//
// The PDF is produced from the same print stylesheet as Ctrl+P, so it can never
// disagree with the page. If Chrome can't be found the script exits 0 with a
// warning: the print button on /resume/ remains the fallback and the site build
// is never blocked by this.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, stat, copyFile, rm, mkdtemp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, dirname, resolve, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = join(root, 'dist');
const outPdf = join(root, 'static', 'resume.pdf');
const PORT = 5195;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA || ''}/Google/Chrome/Application/chrome.exe`,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.warn('! No Chrome or Edge found — skipping resume.pdf.');
  console.warn('  The print button on /resume/ still works. Set CHROME_PATH to force one.');
  process.exit(0);
}
if (!existsSync(join(dist, 'resume', 'index.html'))) {
  console.error('! dist/resume/ missing — run `node build.mjs` first.');
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

const server = createServer(async (req, res) => {
  const p = new URL(req.url, 'http://x').pathname;
  let file = join(dist, normalize(decodeURIComponent(p)).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(dist)) return void res.writeHead(403).end();
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});

await new Promise((ok) => server.listen(PORT, '127.0.0.1', ok));

const profile = await mkdtemp(join(tmpdir(), 'portfolio-pdf-'));
const tmpPdf = join(profile, 'resume.pdf');

const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${profile}`,
  '--no-pdf-header-footer',            // no "about:blank" / page numbers / date
  '--virtual-time-budget=4000',        // let fonts and the stylesheet settle
  `--print-to-pdf=${tmpPdf}`,
  `http://127.0.0.1:${PORT}/resume/`,
];

const code = await new Promise((ok) => {
  const c = spawn(chrome, args, { stdio: 'ignore' });
  c.on('error', () => ok(-1));
  c.on('exit', ok);
});

server.close();

if (code !== 0 || !existsSync(tmpPdf)) {
  console.warn(`! Chrome exited ${code} without producing a PDF — skipping resume.pdf.`);
  console.warn('  The print button on /resume/ still works.');
  await rm(profile, { recursive: true, force: true });
  process.exit(0);
}

const { size } = await stat(tmpPdf);
if (size < 5000) {
  console.warn(`! resume.pdf came out at ${size} bytes, which looks empty — not using it.`);
  await rm(profile, { recursive: true, force: true });
  process.exit(0);
}

await copyFile(tmpPdf, outPdf);
await rm(profile, { recursive: true, force: true });
console.log(`wrote static/resume.pdf (${Math.round(size / 1024)} kB) — re-run the build to publish it`);
