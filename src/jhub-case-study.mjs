// Content for /jhub/ — the jhub case study. Public page: it describes the
// engineering only (see the owner's wording rule). No names, hosts, addresses or content sources.
// Every number below is traced to the project's own decision log, reports or git history (see CHANGES-case-study.md).
import { esc } from './markdown.mjs';

export const CASE_STUDY = {
  title: 'jhub — case study',
  description:
    'jhub: a self-hosted family media hub (React PWA, Fastify, SQLite) designed and directed by Jasman Tan and built with AI coding agents. Four engineering stories with real numbers.',
  summary:
    'A self-hosted family media hub: films, shows, music and videos for each person in the family, on every phone including iPhone, reachable only over a private network.',
  role: 'Designed and directed; built with AI coding agents (Claude Code). I wrote the specs, made the design decisions, debugged from logs, and reviewed and verified every change. I did not hand-write the TypeScript.',
  facts: [
    ['3,052', 'server unit tests'],
    ['708', 'web unit tests'],
    ['100', 'written decision records'],
    ['500+', 'commits since late Sept 2026'],
  ],
  stackChips: ['TypeScript', 'Fastify', 'React PWA', 'SQLite', 'Jellyfin', 'Navidrome', 'Tailscale', 'Playwright', 'Docker Compose', 'systemd'],
  why: [
    'A family wanted one private place for its films, shows, music and videos, working on every phone including iPhone, instead of a pile of apps and drives that each behave differently. Non-technical people had to be able to use it without asking me.',
    'The constraints shaped the design: one mini PC at home, no public endpoint, each person with their own library and their own storage limit, and a budget close to zero.',
  ],
  arch: [
    ['React PWA', 'An installable web app, so iPhone and Android get the same thing without an app store. A service worker caches the shell and lets people save titles for offline use.'],
    ['Fastify API (TypeScript)', 'One API for sign-in, libraries, playlists and settings. Fastify and React share types in one TypeScript monorepo.'],
    ['SQLite', 'One database file holds per-person accounts, playlists, progress and the storage quota. Changes are forward-only migrations applied at start.'],
    ['Worker', 'A separate process runs the long jobs (scans, syncs, conversions, the daily health check) with a queue, pacing and retries, so slow work never blocks a person who is waiting.'],
    ['Jellyfin and Navidrome', 'They do the actual playback. jhub talks to them through an adapter layer, so their API quirks stay in one place (story 1 is about one of them).'],
    ['Tailscale-only access', 'Nothing is exposed to the public internet. Only devices on the family’s private network can connect.'],
    ['Accounts and quota', 'Each person has their own account and library. A file several people keep is stored once and its size is split between them for the quota.'],
  ],
  stories: [
    {
      h: '1. A sync bug that burned a CPU core for six days',
      situation: 'On Jellyfin 12.1, the server sat at one full CPU core and the logs filled with errors (about 6,000 an hour). Nothing alerted anyone, so it ran for six days.',
      did: 'I read the logs and traced it. On 12.1, reading one playlist with an API key answers 400, so jhub’s fallback concluded that every playlist was shared, and then deleted and re-created 123 of 125 mapped playlists on every pass. Jellyfin appended a "1" to each re-created folder name until names hit 255 characters and creation failed. The fix took two passes: edit playlists in place and remake only when sharing is confirmed, at most once a day (D92), then handle the next quirks that showed in the live worker log (D92b). I also had the agents write a cleanup script that runs as a dry run first. Then I added a daily health check at 03:00 so a silent failure cannot run for days again (D93): Jellyfin error volume, CPU while idle, playlist count against what jhub maps, an API contract probe, repeated worker warnings.',
      result: 'The folders went from 377 to 130 (248 junk playlists removed), Jellyfin errors from about 6,000 an hour to 0, and idle CPU to about 0.1%. The health check’s first dry run over the old logs flagged 76,500 errors in 24 hours, so it would have caught this on day one.',
      lesson: 'The skill here is reading logs and finding the real trigger, not the first one that looks plausible.',
    },
    {
      h: '2. Casting to a speaker: it said "playing" and made no sound',
      situation: 'Casting a song or a film’s sound to a smart speaker showed "playing", but nothing came out.',
      did: 'I had it reproduced in real Chrome, because a Cast receiver is Chrome: playback never started and the browser reported media error 3. The speaker had asked for "Range: bytes=196608-", and the server answered 200 from byte 0, because the sound was a live fragmented-MP4 pipe with no length and no range support. The fix was to make a small seekable file (index at the front) when the link is created, and serve it with 200, 206 Partial Content and 416, plus a length and a duration. A flaky test then exposed a second bug, a race: a conversion could start after the server had shut down. I fixed the race rather than retrying the test.',
      result: 'The audio is now a seekable file with proper byte ranges, covered by new range tests and a steadier suite. Both fixes are separate commits in the project history.',
      lesson: 'A flaky test is a bug report. I treat it as one.',
    },
    {
      h: '3. Signed, expiring links for a speaker that cannot log in',
      situation: 'A speaker sits on the home Wi-Fi, not on the private network, and has no login. It still has to fetch exactly one song.',
      did: 'jhub creates a signed link per song: an HMAC token that binds the song, the person and an expiry (the length of the songs plus 30 minutes, between 1 and 6 hours). The reverse proxy exposes one narrow path on the home network and refuses everything else with a 404, so a token never opens another song or anything else. Queue casting hands the speaker a window of 20 songs, not the whole playlist, to cap how many live links exist. Minting is rate limited and every batch is audited.',
      result: 'The speaker plays a queue with the phone asleep, and the exposed surface is one path pattern. A film’s sound uses a separate signing domain, so a song token cannot open a film and the reverse.',
      lesson: 'This is a security design decision I made and explained to the agents; the agents wrote the code.',
    },
    {
      h: '4. Working with AI agents safely',
      situation: 'Most of the code is written by AI coding agents, and a bad merge would break something my family uses every day.',
      did: 'Each job starts as a written brief: numbered items, what the agent must not touch, how the result will be checked. Agents work on their own git branches and never merge or deploy; I do that. Every agent reports with test output, and I verify the claim (run the tests, open the screens at phone and desktop width, read the diff) instead of trusting it. The test gate is about 3,050 server and 700 web unit tests, plus Playwright end-to-end tests that run against a separate test instance with its own database, never the live one. Each non-trivial change gets a written decision record with a rollback note.',
      result: 'Over 500 commits in a few weeks with a working app in daily use. The log-reading in story 1 and the test discipline in story 2 are the parts of this work that were mine.',
      lesson: 'A green exit code is not evidence. I check the end state.',
    },
  ],
  next: [
    'An off-site backup. Two disks in one box do not survive a fire or a theft.',
    'Metrics (queue depth, job latency) on the health page, so a slow week is visible before it is a problem.',
    'A real-speaker test rig for casting, so the receiver behaviour is tested, not assumed from the docs.',
  ],
};

const tags = (list, label) => `<ul class="stack" aria-label="${esc(label)}">${list.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

// Components and data flow. Vertical so it stays readable at 390 px; colours come from CSS variables.
export const DIAGRAM = `<svg class="cs-diagram" viewBox="0 0 360 456" role="img" aria-labelledby="cs-dia-t cs-dia-d">
  <title id="cs-dia-t">jhub architecture</title>
  <desc id="cs-dia-d">Phones and laptops running a React web app reach a Fastify API over a Tailscale-only private network. The API and a worker process share a SQLite database that holds per-person accounts and storage quotas, and reach Jellyfin and Navidrome, which play the media, through an adapter layer.</desc>
  <defs>
    <marker id="cs-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" class="cs-head"/></marker>
  </defs>
  <rect x="8" y="88" width="344" height="360" rx="14" class="cs-zone"/>
  <text x="20" y="107" class="cs-zone-t">HOME SERVER · TAILSCALE-ONLY ACCESS</text>

  <rect x="20" y="8" width="320" height="50" rx="10" class="cs-box"/>
  <text x="180" y="30" text-anchor="middle" class="cs-t">React PWA</text>
  <text x="180" y="47" text-anchor="middle" class="cs-s">iPhone, Android, laptop · one account each</text>

  <path d="M95 58V132" class="cs-arrow" marker-end="url(#cs-arrow)"/>
  <text x="103" y="82" class="cs-s">private network</text><text x="103" y="96" class="cs-s">only</text>

  <rect x="20" y="132" width="150" height="56" rx="10" class="cs-box"/>
  <text x="95" y="156" text-anchor="middle" class="cs-t">Fastify API</text>
  <text x="95" y="173" text-anchor="middle" class="cs-s">TypeScript · auth · routes</text>
  <rect x="190" y="132" width="150" height="56" rx="10" class="cs-box"/>
  <text x="265" y="156" text-anchor="middle" class="cs-t">Worker</text>
  <text x="265" y="173" text-anchor="middle" class="cs-s">queue · retries · health check</text>

  <path d="M95 188V222" class="cs-arrow" marker-end="url(#cs-arrow)"/><path d="M265 188V222" class="cs-arrow" marker-end="url(#cs-arrow)"/>
  <rect x="20" y="222" width="320" height="52" rx="10" class="cs-box cs-key"/>
  <text x="180" y="244" text-anchor="middle" class="cs-t">SQLite</text>
  <text x="180" y="262" text-anchor="middle" class="cs-s">accounts · storage quota per person · playlists</text>

  <path d="M180 274V306" class="cs-arrow" marker-end="url(#cs-arrow)"/>
  <rect x="20" y="306" width="320" height="44" rx="10" class="cs-box"/>
  <text x="180" y="326" text-anchor="middle" class="cs-t">Adapter layer</text>
  <text x="180" y="342" text-anchor="middle" class="cs-s">hides each backend’s API quirks</text>

  <path d="M95 350V378" class="cs-arrow" marker-end="url(#cs-arrow)"/><path d="M265 350V378" class="cs-arrow" marker-end="url(#cs-arrow)"/>
  <rect x="20" y="378" width="150" height="56" rx="10" class="cs-box"/>
  <text x="95" y="402" text-anchor="middle" class="cs-t">Jellyfin</text>
  <text x="95" y="419" text-anchor="middle" class="cs-s">video playback</text>
  <rect x="190" y="378" width="150" height="56" rx="10" class="cs-box"/>
  <text x="265" y="402" text-anchor="middle" class="cs-t">Navidrome</text>
  <text x="265" y="419" text-anchor="middle" class="cs-s">music playback</text>
</svg>`;

const story = (p) => `
      <article class="cs-prob">
        <h3 class="cs-h3">${esc(p.h)}</h3>
        <dl class="cs-trio">
          <div><dt>Situation</dt><dd>${esc(p.situation)}</dd></div>
          <div><dt>What I did</dt><dd>${esc(p.did)}</dd></div>
          <div><dt>Result</dt><dd>${esc(p.result)}</dd></div>
        </dl>
        <p class="small muted cs-lesson">${esc(p.lesson)}</p>
      </article>`;

export function caseStudyMain() {
  const c = CASE_STUDY;
  return `
<main id="main" class="cs">
  <header class="cs-hero">
    <div class="cs-wrap">
      <p class="kicker">// case study</p>
      <h1>jhub</h1>
      <p class="cs-lede">${esc(c.summary)}</p>
      <p class="cs-role"><strong>My role.</strong> ${esc(c.role)}</p>
      <ul class="cs-facts" aria-label="jhub in numbers">
        ${c.facts.map(([n, l]) => `<li><strong>${esc(n)}</strong><span>${esc(l)}</span></li>`).join('\n        ')}
      </ul>
      ${tags(c.stackChips, 'jhub stack')}
    </div>
  </header>

  <section class="cs-sec" aria-labelledby="cs-why">
    <div class="cs-wrap">
      <h2 id="cs-why"><span class="cs-n">01</span> The problem</h2>
      ${c.why.map((p) => `<p>${esc(p)}</p>`).join('\n      ')}
    </div>
  </section>

  <section class="cs-sec cs-alt" aria-labelledby="cs-arch">
    <div class="cs-wrap">
      <h2 id="cs-arch"><span class="cs-n">02</span> Architecture</h2>
      <div class="cs-arch-grid">
        <figure class="cs-fig">
          ${DIAGRAM}
          <figcaption class="small muted">Everything runs on one home server. Nothing is reachable from the public internet.</figcaption>
        </figure>
        <dl class="cs-defs">
          ${c.arch.map(([h, p]) => `<div><dt>${esc(h)}</dt><dd>${esc(p)}</dd></div>`).join('\n          ')}
        </dl>
      </div>
    </div>
  </section>

  <section class="cs-sec" aria-labelledby="cs-prob">
    <div class="cs-wrap">
      <h2 id="cs-prob"><span class="cs-n">03</span> Four engineering stories</h2>
      ${c.stories.map(story).join('')}
    </div>
  </section>

  <section class="cs-sec cs-alt" aria-labelledby="cs-next">
    <div class="cs-wrap">
      <h2 id="cs-next"><span class="cs-n">04</span> What I would do next</h2>
      <ul class="cs-list">
        ${c.next.map((p) => `<li>${esc(p)}</li>`).join('\n        ')}
      </ul>
      <p class="cs-cta">
        <a class="btn btn-primary" href="/#work">Back to all projects</a>
        <a class="btn" href="/blog/">Read the build notes</a>
        <a class="btn" href="/resume/">Résumé</a>
      </p>
      <p class="small muted">jhub is a private family app, so there is no public demo or repository. Happy to walk through the architecture and the trade-offs on a call.</p>
    </div>
  </section>
</main>`;
}
