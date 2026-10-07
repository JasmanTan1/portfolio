// Content for /jhub/ — the jhub case study. Public page: it describes the
// engineering only (see the owner's wording rule). No real titles, hosts or names.
import { esc } from './markdown.mjs';

export const CASE_STUDY = {
  title: 'jhub — case study',
  description:
    'A private family media app, built end to end: TypeScript monorepo, Fastify and SQLite, a React PWA with offline downloads, and a serverless relay on the free tier.',
  lede:
    'One self-hosted app for our own video and music library, on every phone, laptop and TV in the family, offline included. This page is how it is built, what went wrong on the way, and how I worked with AI agents to build it.',
  facts: [
    ['85', 'forward-only database migrations'],
    ['2,200+', 'server unit tests'],
    ['80+', 'written decision records'],
    ['300+', 'commits, in a few weeks'],
  ],
  why: [
    'Family videos and music end up scattered across phones, old drives and several apps that each work differently. I wanted one private place for our own library that replaces those apps, keeps working on a plane, and that family members who are not technical can use without asking me.',
    'The constraints shaped everything: one mini PC at home, family members on iPhone and Android, reachable only over a private network, and a budget close to zero. That ruled out anything that needs a cloud bill or a public endpoint.',
  ],
  arch: [
    ['TypeScript monorepo', 'One repository with a server package and a web package that share types. Fastify 5 serves the API; SQLite holds the data, with 85 forward-only migrations that run at start.'],
    ['A separate worker process', 'Long jobs (library scans, file moves, background analysis) run in their own process with a queue, pacing, retries and a hard rule that background work never competes with something a person is waiting for. Background analysis runs under nice 19.'],
    ['Installable web app', 'React 19 as a PWA. A service worker caches the shell, and videos and songs can be saved to the phone through a paced download queue (Background Fetch where the browser has it) that resumes after a dropped connection.'],
    ['An integration layer', 'The app talks to open-source media servers (Jellyfin for video, Navidrome for music) through one layer of adapters, so the rest of the code never sees their API quirks and a server can be replaced without touching the UI.'],
    ['A serverless relay', 'Phone notifications carry action buttons. Away from home the home server cannot be reached, so the choice goes to a small Cloudflare Worker with KV storage, signed with HMAC and expiring after 14 days. The home server pulls decisions from it; it never accepts a connection from the internet.'],
    ['Hardened services', 'Each process is a systemd unit running as an unprivileged user, with a read-only view of the system and only the folders it needs writable.'],
  ],
  kv: {
    problem:
      'The relay is designed for the free tier, and a free tier is a budget. The first version listed the KV keys on every poll, once a minute: 1,440 list operations a day, which blew the daily cap.',
    did: 'A decision now also sets a single "pending" flag. A poll reads that one key (a cheap read) and only lists when it is set, plus one safety sweep every 30 minutes in case an eventually consistent delete loses a flag.',
    result: 'List operations dropped by roughly 95 percent, and the relay is far below every free-tier limit. The lesson I kept: when a cloud service has a quota, design for the quota on day one.',
  },
  problems: [
    {
      h: 'Offline downloads on flaky mobile networks',
      problem: 'A phone on a train drops its connection mid-file, the browser kills background tabs, and storage numbers differ between browsers. A naive download button fails silently and leaves half-files.',
      did: 'Downloads go through a paced queue that resumes by byte offset, uses Background Fetch where available, and only treats a real quota error as "out of space", because some browsers report a capped placeholder figure. The player prefers the local copy when a complete one exists.',
      result: 'A film saved at home plays on a plane. Interrupted downloads continue instead of restarting, and the space warning no longer cries wolf.',
    },
    {
      h: 'Matching songs across scripts',
      problem: 'The same song can be titled in kanji in one place and in romaji in another, so matching on title text alone fails exactly where the library is most interesting.',
      did: 'The matcher treats track length as a first-class signal (within 2 seconds, 3 over six minutes), compares artists across kana and romaji, case and simplified or traditional Chinese, and uses standard recording identifiers when they are available. Anything uncertain goes to a review panel where a person hears a 15-second preview and decides.',
      result: 'Songs whose titles are in another script now match automatically when length and artist agree. The uncertain ones are a short review list instead of a wrong guess.',
    },
    {
      h: 'Analysis that never competes with foreground work',
      problem: 'Detecting a song’s tempo, feel and language (to build smart playlists) is CPU-heavy, and the server is a small desktop that is also streaming video.',
      did: 'Analysis lives in the worker on its own timer, handles one song per turn under nice 19 with a timeout, and waits while any job is queued, due or running. A missing analyser only leaves the fields empty and retries; it never marks a song as failed. A person’s manual correction always wins over the machine’s guess.',
      result: 'The whole library is analysed over time with no visible effect on playback, and smart playlists (by tempo, feel, language) fill themselves.',
    },
    {
      h: 'Deduplicating by stable identifiers',
      problem: 'Several family members keep the same file, and the same song or film can arrive twice under slightly different names.',
      did: 'Identity is decided by stable identifiers (ids, recording identifiers, and length as a tie-breaker), never by display names alone. A shared file is stored once, counted once, and its size is split between the people who keep it for their storage quota.',
      result: 'No duplicate copies on disk, and each person’s quota reflects what they really use.',
    },
  ],
  smaller: [
    ['A timezone bug hiding in the tests.', 'The server clock is UTC and the family lives in Singapore, so quiet hours and the daily digest were evaluated eight hours off. Tests passed because they ran in the wrong zone too. Fix: one shared time helper with an explicit household zone, and tests written with real local instants, including an evening that is still "yesterday" in UTC.'],
    ['A deploy that left new pages on an old server.', 'The deploy script built the web app first; when the server step then failed, new pages were live against old API code. Fix: install and type-check the server before building the web app, so a failed deploy changes nothing.'],
  ],
  quality: [
    'Unit tests cover the logic (2,200+ on the server, 300+ on the web side). End-to-end tests drive a real browser with Playwright, and layout checks run at phone width (390 px) and desktop width (1440 px) so a page that overflows on a phone fails the suite.',
    'Every non-trivial change is behind a written decision record (80+ so far): the choice, the trade-offs, what was not done and how to roll it back. Each deploy follows a checklist, and I verify the end state afterwards, not just that a command exited cleanly.',
  ],
  built: [
    'Most of the code was written by AI coding agents. My part was the part that decides whether it is right: the written brief, the boundaries, the review and the merge.',
    'Each feature starts as a brief with numbered items, a list of what the agent must not touch, and how the result will be checked. Agents work in isolated git worktrees so parallel jobs cannot collide, with reserved migration and decision numbers. They report with test output and screenshots; I read the diff, look at the screens at phone and desktop size, run the full test gate, and only then merge.',
    'I designed the system, reviewed the work and made the decisions; the agents wrote a lot of the code. Two things it taught me: a good spec beats a clever prompt, and a green exit code is not evidence, so check the end state yourself.',
  ],
  stack: ['TypeScript', 'Node.js', 'Fastify', 'SQLite', 'React 19', 'Vite', 'PWA', 'Service Worker', 'Background Fetch', 'Web Push', 'Cloudflare Workers', 'Cloudflare KV', 'Vitest', 'Playwright', 'systemd', 'Docker Compose', 'Linux'],
  next: [
    'An off-site backup. Two disks in one box do not survive a fire or a theft.',
    'Replace polling with push where it is cheap, and add metrics (queue depth, job latency) to the health page so a slow week is visible before it is a problem.',
    'Per-device tips and settings that sync between a person’s devices, which needs a small server table.',
  ],
};

const tags = (list, label) => `<ul class="stack" aria-label="${esc(label)}">${list.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

// Components and data flow. Vertical so it stays readable at 390 px; colours come from CSS variables.
export const DIAGRAM = `<svg class="cs-diagram" viewBox="0 0 360 500" role="img" aria-labelledby="cs-dia-t cs-dia-d">
  <title id="cs-dia-t">jhub components and data flow</title>
  <desc id="cs-dia-d">Phones and laptops running the web app talk to a Fastify API on a home server. The API and a worker process share a SQLite database, and reach the video and music servers through an integration layer. A Cloudflare Worker relay holds signed notification decisions until the worker pulls them.</desc>
  <defs>
    <marker id="cs-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" class="cs-head"/></marker>
  </defs>
  <rect x="8" y="152" width="344" height="340" rx="14" class="cs-zone"/>
  <text x="20" y="171" class="cs-zone-t">HOME SERVER · PRIVATE NETWORK ONLY</text>

  <rect x="20" y="8" width="320" height="50" rx="10" class="cs-box"/>
  <text x="180" y="30" text-anchor="middle" class="cs-t">Phones, laptops, TV</text>
  <text x="180" y="47" text-anchor="middle" class="cs-s">React 19 PWA · offline downloads</text>

  <rect x="190" y="84" width="150" height="46" rx="10" class="cs-box cs-out"/>
  <text x="265" y="104" text-anchor="middle" class="cs-t">Cloudflare relay</text>
  <text x="265" y="120" text-anchor="middle" class="cs-s">Worker + KV · free tier</text>

  <path d="M95 58V186" class="cs-arrow" marker-end="url(#cs-arrow)"/>
  <text x="103" y="100" class="cs-s">over the</text><text x="103" y="114" class="cs-s">private network</text>
  <path d="M300 58V84" class="cs-arrow" marker-end="url(#cs-arrow)"/>
  <text x="250" y="76" text-anchor="end" class="cs-s">signed choice</text>
  <path d="M265 190V130" class="cs-arrow cs-dash" marker-end="url(#cs-arrow)"/>
  <text x="258" y="152" text-anchor="end" class="cs-s">pulled</text>

  <rect x="20" y="186" width="150" height="56" rx="10" class="cs-box"/>
  <text x="95" y="210" text-anchor="middle" class="cs-t">Fastify API</text>
  <text x="95" y="227" text-anchor="middle" class="cs-s">auth · routes</text>
  <rect x="190" y="186" width="150" height="56" rx="10" class="cs-box"/>
  <text x="265" y="210" text-anchor="middle" class="cs-t">Worker</text>
  <text x="265" y="227" text-anchor="middle" class="cs-s">queue · pacing · retries</text>

  <path d="M95 242V274" class="cs-arrow" marker-end="url(#cs-arrow)"/><path d="M265 242V274" class="cs-arrow" marker-end="url(#cs-arrow)"/>
  <rect x="20" y="274" width="320" height="44" rx="10" class="cs-box cs-key"/>
  <text x="180" y="294" text-anchor="middle" class="cs-t">SQLite</text>
  <text x="180" y="310" text-anchor="middle" class="cs-s">85 migrations · shared by API and worker</text>

  <path d="M180 318V350" class="cs-arrow" marker-end="url(#cs-arrow)"/>
  <rect x="20" y="350" width="320" height="44" rx="10" class="cs-box"/>
  <text x="180" y="370" text-anchor="middle" class="cs-t">Integration layer</text>
  <text x="180" y="386" text-anchor="middle" class="cs-s">adapters hide each server’s quirks</text>

  <path d="M95 394V420" class="cs-arrow" marker-end="url(#cs-arrow)"/><path d="M265 394V420" class="cs-arrow" marker-end="url(#cs-arrow)"/>
  <rect x="20" y="420" width="150" height="56" rx="10" class="cs-box"/>
  <text x="95" y="444" text-anchor="middle" class="cs-t">Video server</text>
  <text x="95" y="461" text-anchor="middle" class="cs-s">Jellyfin</text>
  <rect x="190" y="420" width="150" height="56" rx="10" class="cs-box"/>
  <text x="265" y="444" text-anchor="middle" class="cs-t">Music server</text>
  <text x="265" y="461" text-anchor="middle" class="cs-s">Navidrome</text>
</svg>`;

const triple = (p) => `
          <dl class="cs-trio">
            <div><dt>Problem</dt><dd>${esc(p.problem)}</dd></div>
            <div><dt>What I did</dt><dd>${esc(p.did)}</dd></div>
            <div><dt>Result</dt><dd>${esc(p.result)}</dd></div>
          </dl>`;

export function caseStudyMain() {
  const c = CASE_STUDY;
  return `
<main id="main" class="cs">
  <header class="cs-hero">
    <div class="cs-wrap">
      <p class="kicker">// case study</p>
      <h1>jhub</h1>
      <p class="cs-lede">${esc(c.lede)}</p>
      <ul class="cs-facts" aria-label="jhub in numbers">
        ${c.facts.map(([n, l]) => `<li><strong>${esc(n)}</strong><span>${esc(l)}</span></li>`).join('\n        ')}
      </ul>
      ${tags(['TypeScript', 'Fastify', 'SQLite', 'React 19', 'Cloudflare Workers', 'Playwright'], 'Headline stack')}
    </div>
  </header>

  <section class="cs-sec" aria-labelledby="cs-why">
    <div class="cs-wrap">
      <h2 id="cs-why"><span class="cs-n">01</span> What it is, and why</h2>
      ${c.why.map((p) => `<p>${esc(p)}</p>`).join('\n      ')}
    </div>
  </section>

  <section class="cs-sec cs-alt" aria-labelledby="cs-arch">
    <div class="cs-wrap">
      <h2 id="cs-arch"><span class="cs-n">02</span> Architecture</h2>
      <div class="cs-arch-grid">
        <figure class="cs-fig">
          ${DIAGRAM}
          <figcaption class="small muted">Components and data flow. The only thing outside the home network is the relay, and it is pulled from, never pushed to.</figcaption>
        </figure>
        <dl class="cs-defs">
          ${c.arch.map(([h, p]) => `<div><dt>${esc(h)}</dt><dd>${esc(p)}</dd></div>`).join('\n          ')}
        </dl>
      </div>
      <h3 class="cs-h3">Designing to the free tier: the KV budget</h3>
      ${triple(c.kv)}
    </div>
  </section>

  <section class="cs-sec" aria-labelledby="cs-prob">
    <div class="cs-wrap">
      <h2 id="cs-prob"><span class="cs-n">03</span> Interesting problems</h2>
      ${c.problems.map((p) => `
      <article class="cs-prob">
        <h3 class="cs-h3">${esc(p.h)}</h3>${triple(p)}
      </article>`).join('')}
      <h3 class="cs-h3">Two smaller ones worth telling</h3>
      <ul class="cs-list">
        ${c.smaller.map(([h, p]) => `<li><strong>${esc(h)}</strong> ${esc(p)}</li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  <section class="cs-sec cs-alt" aria-labelledby="cs-qual">
    <div class="cs-wrap">
      <h2 id="cs-qual"><span class="cs-n">04</span> Quality</h2>
      ${c.quality.map((p) => `<p>${esc(p)}</p>`).join('\n      ')}
    </div>
  </section>

  <section class="cs-sec" aria-labelledby="cs-built">
    <div class="cs-wrap">
      <h2 id="cs-built"><span class="cs-n">05</span> How I built it</h2>
      ${c.built.map((p) => `<p>${esc(p)}</p>`).join('\n      ')}
    </div>
  </section>

  <section class="cs-sec cs-alt" aria-labelledby="cs-stack">
    <div class="cs-wrap">
      <h2 id="cs-stack"><span class="cs-n">06</span> Stack, and what I would do next</h2>
      ${tags(c.stack, 'jhub stack')}
      <h3 class="cs-h3">Next</h3>
      <ul class="cs-list">
        ${c.next.map((p) => `<li>${esc(p)}</li>`).join('\n        ')}
      </ul>
      <p class="cs-cta">
        <a class="btn btn-primary" href="/#project-jhub">Back to the project</a>
        <a class="btn" href="/resume/">Résumé</a>
      </p>
      <p class="small muted">jhub is a private family app, so there is no public demo or repository. Happy to talk through the architecture and the trade-offs on a call.</p>
    </div>
  </section>
</main>`;
}
