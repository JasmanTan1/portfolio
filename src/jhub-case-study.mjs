// Content for /jhub/ — the jhub case study. Public page: it describes the
// engineering only (see the owner's wording rule). No names, hosts, addresses or content sources.
// Every number below is traced to the project's own decision log, reports or git history (see CHANGES-case-study.md).
import { esc } from './markdown.mjs';

export const CASE_STUDY = {
  title: 'jhub — case study',
  description:
    'jhub: a self-hosted family media hub (React PWA, Fastify, SQLite) designed and directed by Jasman Tan and built with AI coding agents. Measured performance work, incident stories, security and test scale, with real numbers.',
  summary:
    'A self-hosted family media hub: films, shows, music and videos for each person in the family, on every phone including iPhone, reachable only over a private network.',
  role: 'Designed and directed; built with AI coding agents (Claude Code). I wrote the specs, made the design decisions, debugged from logs, and reviewed and verified every change. I did not hand-write the TypeScript.',
  facts: [
    ['5,000+', 'server tests'],
    ['2,000+', 'web tests'],
    ['100', 'written decision records'],
    ['1,100+', 'commits since late Sept 2026'],
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
    ['Caddy behind Tailscale', 'Caddy is the only front door and it listens on the private network only. It checks sign-in before anything reaches the API, and serves versioned pictures with a one-year immutable cache.'],
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
      did: 'Each job starts as a written brief: numbered items, what the agent must not touch, how the result will be checked. Agents work on their own git branches and never merge or deploy; I do that. Every agent reports with test output, and I verify the claim (run the tests, open the screens at phone and desktop width, read the diff) instead of trusting it. The test gate is about 5,000 server and 2,000 web tests, plus Playwright end-to-end tests that run against a separate test instance with its own database, never the live one. Each non-trivial change gets a written decision record with a rollback note.',
      result: 'Over 1,100 commits in about six weeks with a working app in daily use. The log-reading in story 1 and the test discipline in story 2 are the parts of this work that were mine.',
      lesson: 'A green exit code is not evidence. I check the end state.',
    },

    {
      h: '5. Making it feel instant: a measured performance round',
      situation: 'The app worked, but on a phone every screen waited for the home server, which was busy: opening a show took 2.8 s and tapping Play 2.6 to 4.4 s.',
      did: 'I set the rule that nothing ships without a before and after, measured on a rig that never touches the live system: a mocked stack, a Pixel 5 profile in Chromium with the CPU 4x slower, and the old and new builds run side by side, five runs each, medians. Then the agents built it in ranked order of measured win: one read of the item for a whole start of playback (14-16 server calls down to 9-11); the playback worked out ahead of the tap, 0.6 s after a title page opens; direct play for what the phone can already play (Matroska with H.264 and AAC plays as it is, no conversion); the last answer of each screen drawn in the first frame and refreshed behind it (stale-while-revalidate, per person, wiped on sign-out); a short server memory of the media server’s answers (a repeat inside 20 s costs it no call at all); and prefetch when a card has been on screen for 300 ms.',
      result: 'See the table. Where the gain was zero I wrote that down too: Home with a quick media server got 5 to 15 % slower, because that screen waits for the phone’s own code, not for data.',
      lesson: 'Honest numbers are part of the work: the table includes the row that did not improve.',
    },
    {
      h: '6. First paint: a cache-first, versioned service worker',
      situation: 'Even with fast data, the installed app opened slowly because the service worker asked the network for the page first (up to 3.5 s) and used its kept copy only as a fallback.',
      did: 'I flipped the order: the page is answered at once from the kept copy of this build, and the browser checks for a newer build in the background. The risk of cache-first is a half-updated app (new page, old files), so the cache is named after the build and the install is all-or-nothing: if any file is missing or the list is for another build, the install fails and the working build keeps serving. API and streaming calls never go through the worker. A tiny script in the page head reads the last-seen mode from storage so the placeholder tab bar is right on the first frame. The agents wrote a test that runs the real worker file against a fake cache and a swappable server.',
      result: 'Repeat visit on Fast 3G with 4x slower CPU: first paint 756 ms to 208 ms (-72 %), Home interactive 1401 ms to 892 ms (-36 %). First-ever visit is unchanged and I said so. Known trade-off, written down: after a deploy, the first open still shows the old build, and the next shows the new one.',
      lesson: 'Cache-first is easy; cache-first without ever serving a mixed version is the real work.',
    },
    {
      h: '7. Two incidents where the cause was not where the symptom was',
      situation: 'First: the media server sat at 60 % CPU with bursts above 300 % while my worker ran, and at about 0 % without it, with nothing changing. Second: on Android, music went silent after a track change with the screen locked, while the app’s own level meter showed signal.',
      did: 'For the first I made the worker the suspect and inventoried every job that calls the media server. The heavy ones asked library-wide questions (every song’s play data joined whatever the limit) for every person every hour, and re-listed the whole music library every 2 minutes whenever the library changed, which looked like a rescan loop. I had the agents build a fake media server and a simulated clock to measure calls before and after. For the second I added a meter that sampled the audio graph every 2 s and proved the sound was being produced; the browser was muting the page’s output after a hidden track change. I compared browsers: Firefox on Android plays fine, Chrome and Brave do not.',
      result: 'First: at least 80 % fewer calls and no library-wide query for an unchanged hour; an unchanged library now costs one cheap call per hour and the media server idles near 0 %. Second: proved to be a Chromium behaviour that no page code can get past, so I stopped trying to patch it, documented the workaround, and parked a native player as the real fix.',
      lesson: 'Knowing when to stop: instrumentation told me the bug was outside my code, which saved days of guessing.',
    },
    {
      h: '8. A test-suite time bomb, found by luck',
      situation: 'On 2026-10-20 a test that had passed for days started failing without any code change.',
      did: 'The digest job lists items from a rolling 14-day window, and the test fixtures used fixed October dates. The clock moved on, the fixtures aged out of the window, and the assertions began to fail. The code was right; the test depended on the real clock. I had the service take an injectable clock and pinned it in the affected tests, instead of moving the dates forward, which would only have postponed the failure by two weeks.',
      result: 'The suite is deterministic again, and the fix is one small commit.',
      lesson: 'Any test that reads the current time is a time bomb with a delay. Inject the clock.',
    },
  ],

  perf: [
    ['Open a show’s page, busy media server', '2.8 s', '0.54 s', 'ROUND2-AFTER'],
    ['Open the video tab, busy media server', '2.2 s', '0.57 s', 'ROUND2-AFTER'],
    ['Search results, busy media server', '1.6 s', '0.56 s', 'ROUND2-AFTER'],
    ['Tap a seen tab (show), busy media server', '2.4 s', '0.36 s', 'ROUND2-AFTER'],
    ['Tap Play, episode (mkv), busy media server', '4.4 s', '1.0 s', 'ROUND2-AFTER'],
    ['Tap Play, film (mp4), busy media server', '2.6 s', '1.1 s', 'ROUND2-AFTER'],
    ['Short video, first frame playing', '2.7 s', '1.5 s', 'AFTER (round 1)'],
    ['Repeat visit, first paint (Fast 3G, 4x CPU)', '756 ms', '208 ms', 'INSTANT-SHELL'],
    ['Repeat visit, Home interactive', '1401 ms', '892 ms', 'INSTANT-SHELL'],
    ['Media server CPU while worker ran', 'bursts to 300 %', '~0 %', 'WORKER-JF-LOAD'],
  ],
  security: [
    'Nothing is on the public internet. Caddy listens on the private network only, and checks sign-in before a call reaches the API.',
    'The TV site is LAN-only: it answers only to devices on an allow-list, and everything else gets a 404.',
    'Cookies are SameSite=Strict, and state-changing calls must also come from the app’s own origin (a CSRF check as a second layer).',
    'The speaker links are signed and expire (story 3), with a separate signing domain for film sound.',
    'Nobody can delete media through the media server: its permissions are rewritten every 5 minutes for every account, administrators included.',
    'Decision records name what was rejected and why, so a security choice can be re-read later.',
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

const perfTable = () => `
      <div class="cs-tablewrap"><table class="cs-table">
        <caption class="small muted">Medians of side-by-side runs on a mocked stack, Pixel 5 profile, CPU 4x slower. Never the live system.</caption>
        <thead><tr><th scope="col">Measure</th><th scope="col">Before</th><th scope="col">After</th><th scope="col">Source</th></tr></thead>
        <tbody>${CASE_STUDY.perf.map(([m, b, a, src]) => `<tr><th scope="row">${esc(m)}</th><td>${esc(b)}</td><td>${esc(a)}</td><td class="muted">${esc(src)}</td></tr>`).join('')}</tbody>
      </table></div>`;

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
      <h2 id="cs-prob"><span class="cs-n">03</span> Engineering stories</h2>
      ${c.stories.map(story).join('')}
      <h3 class="cs-h3">The numbers behind stories 5 to 7</h3>${perfTable()}
    </div>
  </section>

  <section class="cs-sec cs-alt" aria-labelledby="cs-sec">
    <div class="cs-wrap">
      <h2 id="cs-sec"><span class="cs-n">04</span> Security</h2>
      <ul class="cs-list">
        ${c.security.map((p) => `<li>${esc(p)}</li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  <section class="cs-sec" aria-labelledby="cs-next">
    <div class="cs-wrap">
      <h2 id="cs-next"><span class="cs-n">05</span> What I would do next</h2>
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
