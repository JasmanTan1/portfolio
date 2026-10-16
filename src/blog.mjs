// Blog: posts live in content/blog/*.md (small front matter + Markdown subset).
// Same rules as the rest of the site: everything is escaped, no HTML passthrough, no scripts.
// Public wording rule: engineering only, honest about AI-agent authorship (see the owner's wording rule).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { esc, inline } from './markdown.mjs';

const WPM = 200;

function parse(file, raw) {
  const m = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing front matter`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const k of ['title', 'slug', 'date', 'summary']) if (!meta[k]) throw new Error(`${file}: missing ${k}`);
  if (!/^[a-z0-9-]+$/.test(meta.slug)) throw new Error(`${file}: bad slug`);
  const body = m[2].trim();
  const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return { ...meta, order: Number(meta.order || 0), body, words, minutes: Math.max(1, Math.round(words / WPM)) };
}

export function loadPosts(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parse(f, readFileSync(join(dir, f), 'utf8')))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.order - b.order));
}

export function renderBody(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++]);
      i++;
      const lang = fence[1];
      out.push(`<pre class="bp-code" tabindex="0"${lang ? ` data-lang="${esc(lang)}"` : ''}><code>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }
    const h = line.match(/^(#{2,3})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const text = h[2];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      i++;
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^[-*]\s+/, ''));
      out.push(`<ul>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>`);
      continue;
    }
    if (line.startsWith('> ')) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith('> ')) buf.push(lines[i++].slice(2));
      out.push(`<blockquote><p>${inline(buf.join(' '))}</p></blockquote>`);
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(```|#{2,3}\s|[-*]\s|> )/.test(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return out.join('\n');
}

export const fmtDate = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const BLOG = {
  title: 'Build notes',
  description: 'Build notes by Jasman Tan: engineering stories from jhub, a self-hosted family media hub built with AI coding agents. Debugging, testing, operations and working with agents.',
  honesty: 'I design, direct and verify the projects I write about. The code is written by AI coding agents (Claude Code). These posts are about what I diagnosed, decided and checked.',
};

export function blogIndexMain(posts) {
  return `
<main id="main" class="blog">
  <header class="blog-hero">
    <div class="blog-wrap">
      <p class="kicker">// blog</p>
      <h1>Build notes</h1>
      <p class="blog-lede">${esc(BLOG.honesty)}</p>
      <p class="small muted"><a href="/blog/feed.xml">RSS feed</a> · <a href="/jhub/">jhub case study</a></p>
    </div>
  </header>
  <section class="blog-sec" aria-label="Posts">
    <div class="blog-wrap">
      <ol class="blog-list">
        ${posts.map((p) => `
        <li class="blog-item">
          <p class="blog-meta"><time datetime="${p.date}">${fmtDate(p.date)}</time> · ${p.minutes} min read</p>
          <h2><a href="/blog/${p.slug}/">${esc(p.title)}</a></h2>
          <p>${esc(p.summary)}</p>
        </li>`).join('')}
      </ol>
    </div>
  </section>
</main>`;
}

export function postMain(p, posts) {
  const others = posts.filter((x) => x.slug !== p.slug);
  return `
<main id="main" class="blog">
  <article class="blog-post">
    <header class="blog-hero">
      <div class="blog-wrap">
        <p class="kicker"><a href="/blog/">// blog</a></p>
        <h1>${esc(p.title)}</h1>
        <p class="blog-lede">${esc(p.summary)}</p>
        <p class="blog-meta"><time datetime="${p.date}">${fmtDate(p.date)}</time> · ${p.minutes} min read · by Jasman Tan</p>
      </div>
    </header>
    <div class="blog-wrap blog-body">
${renderBody(p.body)}
      <p class="small muted blog-note">${esc(BLOG.honesty)} More on the project: <a href="/jhub/">the jhub case study</a>.</p>
    </div>
  </article>
  <section class="blog-sec blog-more" aria-labelledby="more-h">
    <div class="blog-wrap">
      <h2 id="more-h">More build notes</h2>
      <ul class="blog-more-list">
        ${others.map((o) => `<li><a href="/blog/${o.slug}/">${esc(o.title)}</a> <span class="muted small">· ${o.minutes} min</span></li>`).join('\n        ')}
      </ul>
      <p class="cs-cta"><a class="btn" href="/blog/">All posts</a> <a class="btn" href="/#work">Back to projects</a></p>
    </div>
  </section>
</main>`;
}

const x = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function feedXml(posts, origin, siteName) {
  const rfc = (d) => new Date(d + 'T08:00:00Z').toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${x(siteName)} — Build notes</title>
    <link>${origin}/blog/</link>
    <description>${x(BLOG.description)}</description>
    <language>en</language>
    <atom:link href="${origin}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${rfc(posts[0].date)}</lastBuildDate>
${posts.map((p) => `    <item>
      <title>${x(p.title)}</title>
      <link>${origin}/blog/${p.slug}/</link>
      <guid isPermaLink="true">${origin}/blog/${p.slug}/</guid>
      <pubDate>${rfc(p.date)}</pubDate>
      <description>${x(p.summary)}</description>
    </item>`).join('\n')}
  </channel>
</rss>
`;
}
