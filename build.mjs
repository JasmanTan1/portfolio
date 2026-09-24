// Static site build. No dependencies — `node build.mjs` writes dist/.
import { mkdirSync, readFileSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

// Browsers keep old copies of styles.css/main.js; a content hash in the URL forces a refetch.
const ver = (f) => createHash('sha1').update(readFileSync(new URL('./static/' + f, import.meta.url))).digest('hex').slice(0, 8);

import { renderMarkdown, esc } from './src/markdown.mjs';
import {
  CONTACT_EMAIL, SITE, HERO, PROJECTS, INFRA, SKILLS, EXPERIENCE, CERTIFICATIONS, EDUCATION, DOING,
} from './src/data.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// The PDF is optional: if tools/make-pdf.mjs hasn't run (or found no Chrome),
// the pages offer printing instead of a link that would 404.
const hasPdf = existsSync(join(root, 'static', 'resume.pdf'));

/* ---------------------------------------------------------------- helpers */

// schema.org Person, built only from data.mjs — for HR portals and crawlers.
const current = EXPERIENCE[0];
const personLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  jobTitle: SITE.role,
  url: SITE.origin + '/',
  email: 'mailto:' + CONTACT_EMAIL,
  address: { '@type': 'PostalAddress', addressLocality: SITE.location, addressCountry: 'SG' },
  worksFor: { '@type': 'Organization', name: current.org },
  alumniOf: EDUCATION.map((e) => ({ '@type': 'EducationalOrganization', name: e.where.split(',')[0] })),
  hasCredential: CERTIFICATIONS.map((c) => ({
    '@type': 'EducationalOccupationalCredential',
    name: c.what,
    recognizedBy: { '@type': 'Organization', name: c.where },
  })),
  knowsAbout: [...new Set(SKILLS.flatMap((g) => g.items))],
  sameAs: SITE.links.map((l) => l.href),
}).replace(/</g, '\\u003c');

const head = ({ title, description, path = '/' }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${esc(SITE.name)}">
<link rel="canonical" href="${SITE.origin}${path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE.origin}${path}">
<meta property="og:image" content="${SITE.origin}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(SITE.name)} — ${esc(SITE.role)}, Singapore">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0B0D10">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap">
<link rel="stylesheet" href="/styles.css?v=${ver('styles.css')}">
<link rel="alternate" type="text/markdown" href="/resume.md" title="Résumé (Markdown)">
${path === '/' || path === '/resume/' ? `<link rel="alternate" type="application/pdf" href="/resume.pdf" title="Résumé (PDF)">
<script type="application/ld+json">${personLd}</script>` : ''}
<script>/* applied before first paint so a chosen theme never flashes */try{var t=localStorage.getItem('jt-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
</head>`;

const themeToggle = `
<button id="theme-toggle" class="theme-toggle" type="button" aria-pressed="false">
  <span class="visually-hidden">Switch between light and dark theme</span>
  <svg class="icon-sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.2"/><g class="rays"><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></g></svg>
  <svg class="icon-moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M20 14.5A8.2 8.2 0 0 1 9.5 4a8.3 8.3 0 1 0 10.5 10.5z"/></svg>
</button>`;

const wordmark = `<a class="wordmark" href="/" aria-label="${esc(SITE.name)} — home">JasmanTan<span class="accent">._</span></a>`;

const footer = (extra = '') => `
<footer class="footer">
  <div class="wrap">
    <p class="footer-contact">
      <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
      ${SITE.links.map((l) => `<a href="${l.href}" rel="me noopener">${l.label}</a>`).join('\n      ')}
      ${extra}
    </p>
    <p class="muted small">${esc(SITE.name)} · ${esc(SITE.location)} · Built as a static site; the source is on GitHub.</p>
  </div>
</footer>
<script src="/main.js?v=${ver('main.js')}" defer></script>
</body>
</html>`;

/* ------------------------------------------------------------------ index */

const ICONS = {
  db: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v6.5c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8V5.5"/><path d="M4.5 12v6.5c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8V12"/></svg>',
  link: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4" width="7" height="6" rx="1.5"/><rect x="14.5" y="14" width="7" height="6" rx="1.5"/><path d="M9.5 7h4a3 3 0 0 1 3 3v4M14.5 17h-4a3 3 0 0 1-3-3v-4"/><path d="M14.8 12.2 16.5 14l1.7-1.8M9.2 11.8 7.5 10l-1.7 1.8"/></svg>',
  server: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3.5" width="18" height="7" rx="1.8"/><rect x="3" y="13.5" width="18" height="7" rx="1.8"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/></svg>',
};

// Decorative art for project cards that have no screenshot (hue per project).
const art = (seed, hue) => {
  const pts = [];
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 11; i++) pts.push([Math.round(20 + rnd() * 360), Math.round(20 + rnd() * 180)]);
  const lines = [];
  pts.forEach((a, i) => pts.slice(i + 1).forEach((b) => {
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 120) lines.push(`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`);
  }));
  return `<svg class="card-art" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><radialGradient id="g${seed}" cx="70%" cy="30%" r="80%"><stop offset="0" stop-color="hsl(${hue} 80% 55% / .45)"/><stop offset="1" stop-color="hsl(${hue} 80% 30% / 0)"/></radialGradient></defs>
    <rect width="400" height="220" fill="url(#g${seed})"/>
    <g stroke="hsl(${hue} 85% 65% / .35)" stroke-width="1">${lines.join('')}</g>
    <g fill="hsl(${hue} 90% 70%)">${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 2 : 3.5}"/>`).join('')}</g>
  </svg>`;
};

// Stylised mock of the Card Optimizer UI. Deliberately abstract: bars and
// blocks, no amounts, no merchants — the real app holds private data.
const cardOptimizerMock = `<svg class="mock" viewBox="0 0 640 400" role="img" aria-label="Illustration of the Card Optimizer dashboard layout (not real data)">
  <rect x="0.5" y="0.5" width="639" height="399" rx="14" class="m-frame"/>
  <rect x="0.5" y="0.5" width="639" height="34" rx="14" class="m-bar"/>
  <circle cx="22" cy="18" r="5" class="m-dot"/><circle cx="40" cy="18" r="5" class="m-dot"/><circle cx="58" cy="18" r="5" class="m-dot"/>
  <rect x="16" y="52" width="130" height="332" rx="10" class="m-panel"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="30" y="${70 + i * 34}" width="${i === 1 ? 100 : 80 + (i * 7) % 24}" height="12" rx="6" class="${i === 1 ? 'm-accent' : 'm-line'}"/>`).join('')}
  ${[0, 1, 2].map((i) => `<rect x="${162 + i * 156}" y="52" width="142" height="84" rx="10" class="m-panel"/><rect x="${176 + i * 156}" y="68" width="60" height="9" rx="4.5" class="m-line"/><rect x="${176 + i * 156}" y="88" width="${90 - i * 14}" height="18" rx="6" class="${i === 0 ? 'm-accent' : 'm-strong'}"/><rect x="${176 + i * 156}" y="116" width="112" height="6" rx="3" class="m-track"/><rect x="${176 + i * 156}" y="116" width="${[84, 46, 98][i]}" height="6" rx="3" class="m-accent"/>`).join('')}
  <rect x="162" y="150" width="298" height="234" rx="10" class="m-panel"/>
  <rect x="178" y="166" width="90" height="9" rx="4.5" class="m-line"/>
  ${[62, 110, 84, 146, 96, 128, 70, 156, 118, 92].map((h, i) => `<rect x="${184 + i * 27}" y="${366 - h}" width="15" height="${h}" rx="3" class="${i === 7 ? 'm-accent' : 'm-col'}"/>`).join('')}
  <rect x="474" y="150" width="150" height="234" rx="10" class="m-panel"/>
  ${[0, 1, 2, 3, 4].map((i) => `<rect x="488" y="${168 + i * 42}" width="26" height="26" rx="7" class="${i === 0 ? 'm-accent' : 'm-strong'}"/><rect x="522" y="${172 + i * 42}" width="${70 - (i * 11) % 30}" height="8" rx="4" class="m-line"/><rect x="522" y="${185 + i * 42}" width="44" height="6" rx="3" class="m-track"/>`).join('')}
</svg>`;

const tags = (list, label) => `<ul class="stack" aria-label="${esc(label)}">${list.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

const sectionHead = (id, top, bottom, lede = '') => `
      <header class="section-head reveal">
        <h2 id="${id}"><span class="st-top">${esc(top)}</span> <span class="st-bottom">${esc(bottom)}</span></h2>
        ${lede ? `<p class="section-lede">${esc(lede)}</p>` : ''}
      </header>`;

const details = (p) => `
      <details class="more">
        <summary>How it works</summary>
        <div class="more-body">
          <p><strong>The problem.</strong> ${esc(p.problem)}</p>
          <p><strong>What I built.</strong> ${esc(p.built)}</p>
          <p><strong>Where it stands.</strong> ${esc(p.outcome)}</p>
          ${p.note ? `<p class="note">${esc(p.note)}</p>` : ''}
          ${p.credits ? `<p class="small muted">Original team: ${p.credits.map(([n, r]) => `${esc(n)} (${esc(r)})`).join(', ')}. ${esc(p.creditsNote)}</p>` : ''}
        </div>
      </details>`;

const ARTS = { 'camp-nightfall': [7, 265], 'the-signal': [23, 190], 'baby-roadmap': [41, 330] };

function smallCard(p) {
  const media = p.id === 'kubrix'
    ? `<img class="card-img" src="/img/kubrix.png" alt="Kubrix in the browser: a voxel waterfall level called Lunor Falls" loading="lazy" width="1264" height="625">`
    : art(...(ARTS[p.id] || [3, 187]));
  const action = p.link && !p.link.pending
    ? `<a class="card-link" href="${p.link.href}" rel="noopener">${esc(p.link.label)} <span aria-hidden="true">↗</span></a>`
    : p.private ? '<span class="badge">Private · self-hosted</span>' : '';
  return `
    <article class="card pcard reveal" id="project-${p.id}">
      <div class="card-media">${media}</div>
      <div class="card-body">
        <h3>${esc(p.name)}</h3>
        <p class="tagline">${esc(p.tagline)}</p>
        ${p.awards ? `<p class="award-line"><span aria-hidden="true">★</span> ${esc(p.awards.main)} · ${esc(p.awards.heading)}</p>` : ''}
        ${tags(p.stack, `${p.name} stack`)}
        <div class="card-foot">${action}</div>
        ${details(p)}
      </div>
    </article>`;
}

const visible = PROJECTS.filter((p) => !p.hidden);
const featured = visible.find((p) => p.id === 'card-optimizer');
const engProjects = visible.filter((p) => p.group !== 'games' && p !== featured);
const games = visible.filter((p) => p.group === 'games');

const indexHtml = `${head({
  title: `${SITE.name} — Software Engineer, Singapore`,
  description: SITE.description,
  path: '/',
})}
<body class="home">
<a class="skip-link" href="#main">Skip to content</a>
<header class="topbar">
  <div class="wrap topbar-inner">
    ${wordmark}
    <nav aria-label="Sections">
      <a href="#do"><span class="nav-slash" aria-hidden="true">//</span> what i do</a>
      <a href="#work"><span class="nav-slash" aria-hidden="true">//</span> projects</a>
      <a href="#stack"><span class="nav-slash" aria-hidden="true">//</span> stack</a>
      <a href="#experience"><span class="nav-slash" aria-hidden="true">//</span> experience</a>
      <a class="nav-keep" href="/resume/"><span class="nav-slash" aria-hidden="true">//</span> résumé</a>
    </nav>
    ${themeToggle}
  </div>
</header>

<main id="main">
  <section class="hero" aria-labelledby="hero-name">
    <canvas class="hero-net" aria-hidden="true"></canvas>
    <div class="hero-inner">
      <p class="chip"><span class="chip-dot" aria-hidden="true"></span>// status: open to roles</p>
      <h1 id="hero-name" class="hero-name">${esc(SITE.name)}</h1>
      <p class="headline">${esc(HERO.headline)}</p>
      <p class="hero-actions">
        <a class="btn btn-primary" href="#work">See my work</a>
        <a class="btn" href="/resume/">Résumé</a>
      </p>
    </div>
    <a class="scroll-cue" href="#do"><span class="visually-hidden">Scroll to what I do</span><span class="mouse" aria-hidden="true"></span></a>
  </section>

  <section id="do" class="section" aria-labelledby="do-h">
    <div class="wrap">
      ${sectionHead('do-h', 'What I', 'Do', HERO.lede)}
      <div class="do-grid">
        ${DOING.map((d) => `
        <article class="card do-card reveal">
          <div class="do-icon">${ICONS[d.icon]}</div>
          <h3>${esc(d.h)}</h3>
          <p>${esc(d.p)}</p>
          ${tags(d.tags, d.h)}
        </article>`).join('')}
      </div>
    </div>
  </section>

  <section id="work" class="section section-alt" aria-labelledby="work-h">
    <div class="wrap">
      ${sectionHead('work-h', 'Selected', 'Projects', 'Side projects, all of them running rather than half-finished. The private ones hold personal data, so they are described, not linked.')}

      <article class="card featured reveal" id="project-${featured.id}">
        <div class="featured-media">${cardOptimizerMock}<p class="mock-note">Illustration — the real app holds private data.</p></div>
        <div class="featured-body">
          <p class="kicker">// featured</p>
          <h3>${esc(featured.name)}</h3>
          <p class="tagline">${esc(featured.tagline)}</p>
          <p class="featured-built">${esc(featured.problem)}</p>
          ${tags(featured.stack, `${featured.name} stack`)}
          <p class="card-foot"><span class="badge">Private · self-hosted</span></p>
          ${details(featured)}
        </div>
      </article>

      <div class="pgrid">
        ${engProjects.map(smallCard).join('')}
        <article class="card pcard reveal" id="infra">
          <div class="card-media">${art(59, 200)}</div>
          <div class="card-body">
            <h3>${esc(INFRA.title)}</h3>
            <p class="tagline">${esc(INFRA.lede)}</p>
            ${tags(['Cloudflare Tunnel', 'Zero Trust Access', 'Windows', 'PowerShell'], 'Home server stack')}
            <details class="more">
              <summary>How it works</summary>
              <div class="more-body">${INFRA.points.map((pt) => `<p><strong>${esc(pt.h)}.</strong> ${esc(pt.p)}</p>`).join('')}</div>
            </details>
          </div>
        </article>
      </div>

      <h3 class="also-h reveal"><span aria-hidden="true">// </span>Also built — games</h3>
      <div class="pgrid pgrid-2">
        ${games.map(smallCard).join('')}
      </div>
    </div>
  </section>

  <section id="stack" class="stack-strip" aria-labelledby="stack-h">
    <div class="wrap">
      <h2 id="stack-h" class="stack-h reveal">// stack</h2>
      <dl class="stack-groups reveal">
        ${SKILLS.map((g) => `<div class="sg"><dt>${esc(g.h)}</dt><dd><ul class="stack">${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></dd></div>`).join('\n        ')}
      </dl>
    </div>
  </section>

  <section id="experience" class="section" aria-labelledby="exp-h">
    <div class="wrap">
      ${sectionHead('exp-h', 'My', 'Experience')}
      <ol class="tl">
        ${EXPERIENCE.map((e) => `
        <li class="tl-item reveal">
          <p class="period">${esc(e.period)}</p>
          <h3>${esc(e.role)}</h3>
          <p class="org">${esc(e.org)} · ${esc(e.place)}</p>
          <p class="tl-sum">${esc(e.summary)}</p>
          ${tags(e.tags, `${e.org} technologies`)}
        </li>`).join('')}
      </ol>

      <div class="creds reveal">
        <div>
          <h3 class="sub-h">// certifications</h3>
          <ul class="education">
            ${CERTIFICATIONS.map((c) => `<li><strong>${esc(c.what)}</strong><span class="muted"> · ${esc(c.where)}${c.period ? ` · ${esc(c.period)}` : ''}</span></li>`).join('')}
          </ul>
        </div>
        <div>
          <h3 class="sub-h">// education</h3>
          <ul class="education">
            ${EDUCATION.map((e) => `<li><strong>${esc(e.what)}</strong><span class="muted"> · ${esc(e.where)} · ${esc(e.period)}</span></li>`).join('')}
          </ul>
        </div>
      </div>

      <p class="cta reveal">
        <a class="btn btn-primary" href="/resume/">Full résumé</a>
        ${hasPdf ? `<a class="btn" href="/resume.pdf" download="Jasman-Tan-Resume.pdf">Download PDF</a>` : ''}
        <a class="btn" href="mailto:${CONTACT_EMAIL}">Email me</a>
      </p>
    </div>
  </section>
</main>
${footer()}`;

writeFileSync(join(dist, 'index.html'), indexHtml);

/* ----------------------------------------------------------------- résumé */

const resumeMd = readFileSync(join(root, 'content', 'resume.md'), 'utf8');
// Keep the published email in sync with CONTACT_EMAIL, whatever resume.md says.
const resumeSynced = resumeMd.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, CONTACT_EMAIL);

const resumeHtml = `${head({
  title: `Résumé — ${SITE.name}`,
  description: `Résumé of ${SITE.name}, software engineer in Singapore. ${SITE.description}`,
  path: '/resume/',
})}
<body class="resume-page">
<a class="skip-link" href="#main">Skip to content</a>
<header class="topbar no-print">
  <div class="wrap topbar-inner">
    ${wordmark}
    <nav aria-label="Sections"><a href="/">Back to portfolio</a></nav>
    ${themeToggle}
  </div>
</header>
<div class="resume-bar no-print">
  <div class="wrap">
    <p>This page is the résumé.${hasPdf ? ' The PDF is printed from this very page, so the two can never disagree.' : ' <strong>Print it, or save it as PDF</strong> — the print stylesheet lays it out for A4 with no navigation or colour.'}</p>
    <p class="resume-bar-actions">
      ${hasPdf ? `<a class="btn btn-primary" href="/resume.pdf" download="Jasman-Tan-Resume.pdf">Download PDF</a>` : ''}
      <button class="btn${hasPdf ? '' : ' btn-primary'}" type="button" id="print-resume">${hasPdf ? 'Print' : 'Save as PDF / print'}</button>
      <a class="btn" href="/resume.md" download="jasman-tan-resume.md">Markdown source</a>
    </p>
  </div>
</div>
<main id="main" class="wrap resume">
${renderMarkdown(resumeSynced)}
</main>
${footer()}`;

mkdirSync(join(dist, 'resume'), { recursive: true });
writeFileSync(join(dist, 'resume', 'index.html'), resumeHtml);
writeFileSync(join(dist, 'resume.md'), resumeSynced);

/* ------------------------------------------------------- static + plumbing */

cpSync(join(root, 'static'), dist, { recursive: true });

// GitHub Pages: don't run Jekyll over the output.
writeFileSync(join(dist, '.nojekyll'), '');
writeFileSync(join(dist, 'CNAME'), 'jasmantan.com\n');
writeFileSync(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${SITE.origin}/sitemap.xml\n`
);
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE.origin}/</loc><lastmod>${today}</lastmod></url>
  <url><loc>${SITE.origin}/resume/</loc><lastmod>${today}</lastmod></url>
</urlset>
`
);

// 404 that works on GitHub Pages and on a plain static server.
writeFileSync(
  join(dist, '404.html'),
  `${head({ title: `Not found — ${SITE.name}`, description: 'Page not found.', path: '/404.html' })}
<body>
<main id="main" class="wrap notfound">
  <h1>404</h1>
  <p class="lede">That page isn't here.</p>
  <p><a class="btn btn-primary" href="/">Go to the portfolio</a></p>
</main>
${footer()}`
);

if (!existsSync(join(dist, 'og.png'))) {
  console.warn('! og.png missing from static/ — link previews will have no image. See tools/og.html');
}

console.log('Built dist/ — index.html, resume/, 404.html, sitemap.xml, robots.txt');
