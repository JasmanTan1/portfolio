// Static site build. No dependencies — `node build.mjs` writes dist/.
import { mkdirSync, readFileSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderMarkdown, esc } from './src/markdown.mjs';
import {
  CONTACT_EMAIL, SITE, HERO, PROJECTS, INFRA, SKILLS, EXPERIENCE, CERTIFICATIONS, EDUCATION,
} from './src/data.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// The PDF is optional: if tools/make-pdf.mjs hasn't run (or found no Chrome),
// the pages offer printing instead of a link that would 404.
const hasPdf = existsSync(join(root, 'static', 'resume.pdf'));

/* ---------------------------------------------------------------- helpers */

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
<link rel="stylesheet" href="/styles.css">
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
<script src="/main.js" defer></script>
</body>
</html>`;

/* ------------------------------------------------------------------ index */

function projectCard(p, i) {
  const badges = [];
  if (p.private) badges.push('<span class="badge badge-private">Private — self-hosted</span>');
  if (p.link?.pending) badges.push('<span class="badge">Going live</span>');

  const action = p.link && !p.link.pending
    ? `<a class="btn ${p.featured ? 'btn-primary' : ''}" href="${p.link.href}" rel="noopener">${esc(p.link.label)} <span aria-hidden="true">→</span></a>`
    : p.link?.pending
      ? `<span class="btn btn-disabled" aria-disabled="true">${esc(p.link.label)}</span>`
      : '';

  const awards = p.awards
    ? `
    <aside class="awards" aria-label="Awards for ${esc(p.name)}">
      <h4>${esc(p.awards.heading)}</h4>
      <p class="award-main">${esc(p.awards.main)}</p>
      <ul>${p.awards.others.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
    </aside>`
    : '';

  const credits = p.credits
    ? `
    <details class="credits">
      <summary>Original team credits</summary>
      <ul>${p.credits.map(([n, r]) => `<li><span class="c-name">${esc(n)}</span> <span class="c-role">${esc(r)}</span></li>`).join('')}</ul>
      <p class="note">${esc(p.creditsNote)}</p>
    </details>`
    : '';

  return `
<article class="project${p.featured ? ' project-featured' : ''}" id="project-${p.id}">
  <header class="project-head">
    <h3>${esc(p.name)}</h3>
    <p class="tagline">${esc(p.tagline)}</p>
    ${badges.length ? `<p class="badges">${badges.join(' ')}</p>` : ''}
    ${p.blurb ? `<blockquote class="blurb"><p>${esc(p.blurb)}</p><cite>The original DigiPen game gallery</cite></blockquote>` : ''}
  </header>
  ${awards}
  <div class="project-body">
    <div class="pb"><h4>The problem</h4><p>${esc(p.problem)}</p></div>
    <div class="pb"><h4>What I built</h4><p>${esc(p.built)}</p></div>
    <div class="pb"><h4>Where it stands</h4><p>${esc(p.outcome)}</p></div>
    ${p.note ? `<p class="note">${esc(p.note)}</p>` : ''}
    ${credits}
  </div>
  <footer class="project-foot">
    <ul class="stack" aria-label="${esc(p.name)} stack">
      ${p.stack.map((s) => `<li>${esc(s)}</li>`).join('\n      ')}
    </ul>
    ${action}
  </footer>
</article>`;
}

// Big two-line section title: small first word, huge second line.
const sectionTitle = (id, top, bottom, num) => `
      <header class="section-head">
        <p class="section-num" aria-hidden="true">${num}</p>
        <h2 id="${id}"><span class="st-top">${esc(top)}</span> <span class="st-bottom">${esc(bottom)}</span></h2>
      </header>`;

const tagList = (tags, label) => `<ul class="stack" aria-label="${esc(label)}">${tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

const visible = PROJECTS.filter((p) => !p.hidden);
const engProjects = visible.filter((p) => p.group !== 'games');
const games = visible.filter((p) => p.group === 'games');

const indexHtml = `${head({
  title: `${SITE.name} — Software Engineer, Singapore`,
  description: SITE.description,
  path: '/',
})}
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="topbar">
  <div class="wrap topbar-inner">
    ${wordmark}
    <nav aria-label="Sections">
      <a href="#experience"><span class="nav-slash" aria-hidden="true">//</span> experience</a>
      <a href="#work"><span class="nav-slash" aria-hidden="true">//</span> projects</a>
      <a href="#skills"><span class="nav-slash" aria-hidden="true">//</span> skills</a>
      <a href="#also"><span class="nav-slash" aria-hidden="true">//</span> also built</a>
      <a class="nav-keep" href="/resume/"><span class="nav-slash" aria-hidden="true">//</span> résumé</a>
    </nav>
    ${themeToggle}
  </div>
</header>

<main id="main">
  <section class="hero">
    <canvas class="hero-net" aria-hidden="true"></canvas>
    <div class="wrap hero-inner">
      <p class="eyebrow"><span class="prompt" aria-hidden="true">&gt;</span> ${esc(SITE.role.toLowerCase())} · ${esc(SITE.location.toLowerCase())}</p>
      <h1 class="hero-name">${esc(SITE.name)}<span class="accent" aria-hidden="true">.</span></h1>
      <p class="headline">${esc(HERO.headline)}</p>
      <p class="lede">${esc(HERO.lede)}</p>
      <p class="hero-body">${esc(HERO.body)}</p>
      <p class="seeking"><code>status: open</code> <strong>${esc(HERO.seeking)}</strong><br>${esc(HERO.seekingLabel)}</p>
      <p class="hero-actions">
        <a class="btn btn-primary" href="#experience">See my experience <span aria-hidden="true">↓</span></a>
        <a class="btn" href="/resume/">Résumé</a>
        <a class="btn" href="mailto:${CONTACT_EMAIL}">Email me</a>
      </p>
    </div>
  </section>

  <section id="experience" class="section" aria-labelledby="exp-h">
    <div class="wrap">
      ${sectionTitle('exp-h', 'My', 'Experience', '01')}
      <ol class="timeline">
        ${EXPERIENCE.map((e) => `
        <li class="job">
          <div class="job-head">
            <p class="period">${esc(e.period)}</p>
            <h3>${esc(e.role)}</h3>
            <p class="org">${esc(e.org)} · ${esc(e.place)}</p>
          </div>
          <div class="job-body">
            <ul class="job-points">${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
            ${e.tags ? tagList(e.tags, `${e.org} technologies`) : ''}
          </div>
        </li>`).join('\n')}
      </ol>

      <div class="creds">
        <div>
          <h3 class="sub-h"><span aria-hidden="true">// </span>Certifications</h3>
          <ul class="education">
            ${CERTIFICATIONS.map((c) => `<li><h4 class="ed-what">${esc(c.what)}</h4><p class="org">${esc(c.where)}</p>${c.period ? `<p class="period">${esc(c.period)}</p>` : ''}${c.note ? `<p class="note">${esc(c.note)}</p>` : ''}</li>`).join('\n            ')}
          </ul>
        </div>
        <div>
          <h3 class="sub-h"><span aria-hidden="true">// </span>Education</h3>
          <ul class="education">
            ${EDUCATION.map((e) => `<li><h4 class="ed-what">${esc(e.what)}</h4><p class="org">${esc(e.where)}</p><p class="period">${esc(e.period)}</p>${e.note ? `<p class="note">${esc(e.note)}</p>` : ''}</li>`).join('\n            ')}
          </ul>
        </div>
      </div>

      <p class="cta">
        <a class="btn btn-primary" href="/resume/">Full résumé</a>
        ${hasPdf ? `<a class="btn" href="/resume.pdf" download="Jasman-Tan-Resume.pdf">Download PDF</a>` : ''}
        <a class="btn" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
      </p>
    </div>
  </section>

  <section id="work" class="section section-alt" aria-labelledby="work-h">
    <div class="wrap">
      ${sectionTitle('work-h', 'Engineering', 'Projects', '02')}
      <p class="section-lede">Side projects, all of them running rather than half-finished. Several are private because they hold personal data; those are described, not linked.</p>
      <div class="projects">
        ${engProjects.map(projectCard).join('\n')}
      </div>

      <div id="infra" class="infra" aria-labelledby="infra-h">
        <h3 id="infra-h" class="infra-title">${esc(INFRA.title)}</h3>
        <p class="section-lede">${esc(INFRA.lede)}</p>
        <ul class="infra-grid">
          ${INFRA.points.map((pt) => `<li><h4 class="infra-h">${esc(pt.h)}</h4><p>${esc(pt.p)}</p></li>`).join('\n          ')}
        </ul>
      </div>
    </div>
  </section>

  <section id="skills" class="section" aria-labelledby="skills-h">
    <div class="wrap">
      ${sectionTitle('skills-h', 'My', 'Stack', '03')}
      <p class="section-lede">Things I have shipped with, not things I have read about.</p>
      <div class="skills">
        ${SKILLS.map((g) => `<div class="skill-group"><h3>${esc(g.h)}</h3><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section id="also" class="section section-alt" aria-labelledby="also-h">
    <div class="wrap">
      ${sectionTitle('also-h', 'Also', 'Built', '04')}
      <p class="section-lede">Games I have built or rebuilt, outside the day job.</p>
      <div class="projects">
        ${games.map(projectCard).join('\n')}
      </div>
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
