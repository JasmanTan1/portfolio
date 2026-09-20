# jasmantan.com — portfolio & résumé

A static personal site. No framework, no dependencies, no server. `node build.mjs` reads the
content in `src/data.mjs` and `content/resume.md` and writes a complete site to `dist/`.

## Quick start

```sh
node build.mjs        # or: npm run build   -> writes dist/
node serve.mjs 5193   # or: npm run serve   -> http://127.0.0.1:5193
```

Node 18+. There is nothing to `npm install` — `package.json` has no dependencies and exists only
to hold the scripts.

## Layout

```
build.mjs            the whole build: templates + page assembly
serve.mjs            loopback static server, for checking dist/ locally
src/data.mjs         ALL site content — hero, projects, skills, experience, contact email
src/markdown.mjs     tiny Markdown renderer used for the résumé page
content/resume.md    the résumé, in Markdown (the source of truth for /resume/)
static/              copied verbatim into dist/: styles.css, main.js, favicon.svg, og.png
tools/og.html        canvas that draws the 1200x630 link-preview image
tools/make-og.mjs    one-off helper that renders tools/og.html and saves static/og.png
dist/                build output (gitignored — regenerate with `node build.mjs`)
```

### What the build produces

| Path | What |
|---|---|
| `index.html` | The portfolio: hero, selected work, home-server section, skills, experience, education |
| `resume/index.html` | The résumé, rendered from `content/resume.md`, with a print stylesheet |
| `resume.md` | The Markdown résumé, downloadable |
| `404.html` | Not-found page (GitHub Pages serves this automatically) |
| `og.png`, `favicon.svg` | Link preview image and icon |
| `sitemap.xml`, `robots.txt` | |
| `CNAME` | `jasmantan.com`, for GitHub Pages custom domains |
| `.nojekyll` | Stops GitHub Pages running Jekyll over the output |

## Editing content

Almost everything lives in **`src/data.mjs`** — projects, skills, experience, the hero copy.
Rebuild after any change.

**Contact email** is the constant `CONTACT_EMAIL` at the top of `src/data.mjs`. It feeds the hero
button, the footer, the résumé CTA *and* the rendered résumé page — the build rewrites whatever
address is in `content/resume.md` to match it, so the site can never show two different addresses.
When `hello@jasmantan.com` is routing, change that one line, rebuild, redeploy.

## The résumé PDF

There is no PDF checked in and no headless-browser step in the build. `/resume/` **is** the résumé,
and `static/styles.css` has an `@media print` block that turns it into a clean A4 document: the
navigation, footer, theme toggle and all colour are dropped, type drops to 10.5pt, headings are
kept with the content that follows them, and list items don't split across pages.

To produce the PDF: open `/resume/`, press the **Save as PDF / print** button (or Ctrl+P) and choose
"Save as PDF". In Chrome, turn *Headers and footers* **off** and leave *Background graphics* off.

This was a deliberate choice over generating a PDF at build time: it needs no Puppeteer/Chromium
dependency, it can never go stale relative to `content/resume.md`, and the page itself is the
thing most recruiters actually read. If a checked-in `resume.pdf` is wanted later, print once and
drop the file into `static/` — the résumé page's button row is where the download link belongs.

The Markdown source is also published at `/resume.md` for anyone (or any parser) that wants it raw.

## Regenerating the link-preview image

`static/og.png` is committed. To change it, edit the canvas drawing in `tools/og.html`, then:

```sh
node tools/make-og.mjs     # then open http://127.0.0.1:5194/ once
```

It renders the canvas in a real browser (for the font rasteriser), posts the PNG back, writes
`static/og.png` and exits. Nothing about this runs in production or during `npm run build`.
Keep it well under ~200 kB — flat shapes compress, gradients do not.

## Deploying

The output is plain static files with absolute root-relative paths (`/styles.css`, `/resume/`), so
it must be served from a **domain root**, not a sub-path.

### Option A — GitHub Pages

1. Push this repo to GitHub (e.g. `JasmanTan1/portfolio`).
2. Either commit `dist/` to a `gh-pages` branch, or add a workflow that runs `node build.mjs` and
   publishes `dist/` with `actions/deploy-pages`. There are no dependencies, so the workflow is
   just `actions/checkout` → `actions/setup-node` → `node build.mjs` → upload `dist/`.
3. Settings → Pages → custom domain `jasmantan.com`. `dist/CNAME` is already written for you.
4. In Cloudflare DNS, point `jasmantan.com` at GitHub Pages (`185.199.108–111.153`, four A records,
   proxied) and enable "Enforce HTTPS" on the Pages side.

Note that `jasmantan1.github.io` is a separate existing Pages site; decide which one owns the apex
domain before switching DNS.

### Option B — the existing Cloudflare Tunnel (mini PC)

Serve `dist/` the same way Kubrix is served — a static server on a loopback port, with an ingress
rule in `~/.cloudflared/config.yml` above the catch-all:

```yaml
  - hostname: jasmantan.com
    service: http://127.0.0.1:<port>
```

then `cloudflared tunnel route dns mini-pc jasmantan.com`, and register a logon scheduled task the
way the other `HomeServer-*` tasks are set up. Pick a port that isn't already taken
(8090/8091/8765–8768/3000 are in use).

Whichever option: `dist/404.html` needs the server to serve it on a miss. `serve.mjs` does;
GitHub Pages does; a bare `python -m http.server` does not.

## Notes on the content

- Every claim on the site traces back to a repo or the résumé. Nothing was invented to fill space.
- The private apps (Card Optimizer, Jobgrab, The Signal) are described but **not linked**, and carry
  no figures, no personal data and no host paths. Don't add links — they sit behind Cloudflare
  Access and a link would only ever produce a login wall for a recruiter.
- Kubrix is described as an unofficial fan remake by a member of the original team, with the award
  credited to Team Whiteboard & Markers rather than to one person. Keep that framing.
