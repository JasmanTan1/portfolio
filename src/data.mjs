// Single source of truth for site content.
// Change CONTACT_EMAIL here and it updates every page (hero, footer, resume page, mailto links).

export const CONTACT_EMAIL = 'jasmantan@hotmail.com';
// When Cloudflare Email Routing for hello@jasmantan.com is live, change the line
// above to 'hello@jasmantan.com', re-run `npm run build`, and redeploy. Nothing else to edit.

export const SITE = {
  name: 'Jasman Tan',
  role: 'Software Engineer',
  origin: 'https://jasmantan.com',
  location: 'Singapore',
  description:
    'Software engineer in Singapore with 6+ years on business-critical systems: C#/.NET and T-SQL back ends, REST and SAP ERP integrations, and operator dashboards running across five manufacturing sites. On my own time I ship full-stack apps by directing AI coding agents, with tests as the gate. Looking for a backend, full-stack or AI-workflow role.',
  links: [
    { label: 'GitHub', href: 'https://github.com/JasmanTan1' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/jasmantan' },
  ],
};

export const HERO = {
  headline: 'Software Engineer — backend, integrations & AI-assisted delivery.',
  lede:
    'I build the unglamorous systems other people depend on: integration layers, databases that have to stay correct across time zones, and dashboards that factory operators use every shift.',
  body:
    'Six years of that at an electronics manufacturer and a government-linked IT services firm — C#/.NET, T-SQL across a six-database SQL Server estate, and the SAP ERP integration that keeps five plants in four countries in sync. On my own time I ship smaller things end to end: a browser game, a party game with an AI referee, a credit-card optimiser, a family media hub, and the Linux server that hosts all of it. More and more of that is built by AI coding agents that I brief, review and gate with tests.',
  seeking: 'Full-time · Hybrid or on-site · Singapore',
  seekingLabel: 'Open to backend, full-stack or AI-workflow engineering roles.',
};

// Selected projects. `problem` / `built` / `outcome` are deliberately concrete —
// every claim traces back to the repo it describes.
export const PROJECTS = [
  {
    id: 'kubrix',
    group: 'games', // listed under "Also built", below the engineering work
    name: 'Kubrix',
    tagline: 'A browser remake of a Game-of-the-Year student title — playable in one click.',
    featured: true,
    link: { href: 'https://kubrix.jasmantan.com', label: 'Play it' },
    problem:
      'Kubrix was built in 2019 by a nine-person DigiPen Singapore team on a custom C++ engine, and took First Place — the Claude Comair Grand Prize for Game of the Year — at the DigiPen Game Awards. I was one of its four programmers. It then became unrunnable: a Windows build, a 27 GB SVN repository and an engine nobody has compiled since.',
    blurb:
      "Save the broken lands by restoring the shattered Kubrix. Play as the Witch Of The Forest as you go around the land, helping villagers reunite with their loved ones, interact with the environment and maybe ride on sheeps. All in the name of obtaining the shards of Kubrix to restore the land's stability.",
    awards: {
      heading: 'DigiPen Game Awards 2019',
      main: 'First Place — Claude Comair Grand Prize for Game of the Year',
      others: [
        'Koei Tecmo Singapore Most Innovative Design',
        'Finalist — Best Junior Game',
        'Finalist — Acronis Best Team Spirit',
        'Finalist — Acronis Best User Interface',
      ],
    },
    // Credited as the official DigiPen game gallery lists them.
    credits: [
      ['Peng Sng', 'Producer'],
      ['Wei Chin', 'Technical Lead'],
      ['Yong Lie', 'Design Lead'],
      ['Khet Sim', 'Programmer'],
      ['Zhanhao Leong', 'Programmer'],
      ['Sing Tan', 'Programmer'],
      ['Sian Cheong', 'Programmer'],
      ['Zheng Ong', 'Designer'],
      ['Dun Ong', 'Designer'],
    ],
    creditsNote: 'Team Whiteboard & Markers · DigiPen Institute of Technology Singapore · GAM 352 · released 4 December 2019. “Sing Tan” is me.',
    built:
      'I rebuilt the game for the browser in Three.js from the original models, UI art, music and sound: the platforming and build-mode mechanics, a level pipeline that converts the original XML level and gameplay data to JSON, an OBJ/MTL-to-GLB model converter, checkpoints and localStorage saves, touch controls that switch on automatically on phones, and a quality toggle for weak GPUs. A dependency-free Node WebSocket relay lets you pair a phone by QR code and use it as a gamepad; the relay validates and rebuilds every message so a paired phone can only send controller input. A separate tool does an automated playthrough — walking, jumping and spending stars on bridges — to prove all five shards are still reachable after a level change.',
    outcome:
      'Runs as a fully static build with relative asset paths, self-hosted through Cloudflare Tunnel at kubrix.jasmantan.com. Loads on desktop, phone and TV.',
    stack: ['Three.js', 'Vite', 'JavaScript', 'Node (WebSocket relay)', 'GLB / asset pipeline'],
    note:
      'An unofficial fan remake by a member of the original team. Not affiliated with or endorsed by DigiPen; all art, audio and design belong to Team Whiteboard & Markers.',
  },
  {
    id: 'camp-nightfall',
    group: 'games',
    name: 'Camp Nightfall',
    tagline: 'A phone-and-TV social deduction game refereed by an AI host instead of a person.',
    // /host is host-only and is going behind Cloudflare Access — never link it.
    link: { href: 'https://nightfall.jasmantan.com', label: 'Open the game' },
    problem:
      'Social deduction games like Blood on the Clocktower need one person to run them, and that person never gets to play. I wanted a version where the referee is software.',
    built:
      'A TypeScript monorepo serving three surfaces from one process: a private phone view, a shared TV view, and a PIN-gated host panel. Fastify 5 and Socket.IO for transport, React 19 on the client. The rules engine is a pure, deterministic package: game state is never stored, only an append-only action log plus the seed and settings, so the server replays a game from its log on boot and re-arms the phase timer — a mid-game crash or restart is survivable. Up to six seats can be AI players. Narration goes through an LLM with a 4-second timeout that falls back to offline templates, so the whole game still works with no internet at all.',
    outcome:
      'Live from the home server through Cloudflare Tunnel: phones open /play, the TV opens /screen. One server process hosts one game at a time — it is an evening with friends, not a public multiplayer service.',
    stack: ['TypeScript', 'Fastify', 'Socket.IO', 'React', 'SQLite', 'Vite'],
  },
  {
    id: 'jhub',
    name: 'jhub',
    tagline: 'A private family media app: our own video and music library in one place, on phone, desktop and TV, offline included.',
    private: true,
    caseStudy: '/jhub/',
    problem:
      'Family videos and music end up scattered across phones, old drives and apps that each work differently. I wanted one private place for our library that keeps working on a plane, and that family members who are not technical can use without asking me.',
    built:
      "A TypeScript monorepo — a Fastify 5 API and a background worker, a React 19 installable web app, SQLite with 80+ forward-only migrations — in front of a Jellyfin video server and a Navidrome music server, all in Docker Compose. Each person has their own library, playlists and storage quota, and a file several people keep is counted once and split between them. Videos remember where each person stopped and show chapters; anything can be saved to the phone for offline use, with a service worker and resumable downloads. Notifications are web push, and their action buttons still work away from home through a Cloudflare Worker relay that holds HMAC-signed decisions until the server pulls them (sized to stay inside the free tier). An Ops page shows every moving part as green, amber or red with a one-line fix, and admins get a weekly summary.",
    outcome:
      'In use by my family since October 2026, reachable only over Tailscale, never the public internet. Built in a few weeks of evenings with AI coding agents (see How I build): 280+ commits, a log of 75+ architecture decisions with rollback notes, and about 2,400 unit tests plus 330 Playwright browser tests at phone and desktop sizes that every deploy must pass.',
    stack: ['TypeScript', 'Fastify', 'React', 'SQLite', 'Docker Compose', 'Playwright', 'Cloudflare Workers', 'PWA · web push'],
  },
  {
    id: 'card-optimizer',
    name: 'Card Optimizer',
    tagline: 'Singapore credit-card optimiser: statement ingest, categorisation, and an assistant that can actually change things.',
    private: true,
    problem:
      'Singapore reward cards have overlapping bonus categories and monthly spend caps, and the only honest way to know which card to use is to look at what you actually spent.',
    built:
      'A FastAPI and SQLite app that ingests bank and card statement exports — including scanned PDFs, via Tesseract OCR — categorises transactions, tracks spend caps and bonus thresholds, runs budgets and reports, and recommends which cards to keep, cancel or apply for against a curated catalogue. Telegram and Discord bots for on-the-go queries. On top of that, an LLM assistant with tool use over the app\'s own functions: it reads and writes through the same code paths the UI uses, confirms before every write, supports undo, and keeps an editable memory file of the owner\'s rulings. It runs against either an API key or a signed-in Claude Code CLI.',
    outcome:
      'In daily personal use. Self-hosted and private — it sits behind Cloudflare Access with an allow-list of one.',
    stack: ['Python', 'FastAPI', 'SQLite', 'Tesseract OCR', 'LLM tool use'],
  },
  {
    id: 'the-signal',
    name: 'The Signal',
    tagline: 'A self-hosted AI-news dashboard that reads ~37 feeds so I do not have to.',
    private: true,
    problem:
      'AI news is spread across vendor blogs, arXiv, Hacker News, Reddit and a dozen outlets that all cover the same story within an hour of each other.',
    built:
      'A Flask server that keeps ~37 feeds pre-fetched in a background loop and persists the cache to disk, so the page opens instantly and a restart resumes from the last known items instead of hammering every source at once. A curator loop scores items through an LLM, pre-writes summaries, and rewrites a plain-text "taste" file that the scoring reads back — so rating things nudges future picks. The same story from several outlets collapses into one card naming the others, and a deduplicated Top 10 is the default view on phones. A morning push sends the day\'s picks over ntfy.',
    outcome:
      'Runs continuously on the home server behind Cloudflare Access. No database — all state is JSON files next to the app.',
    stack: ['Python', 'Flask', 'Feed parsing', 'LLM curation', 'ntfy'],
  },
  {
    id: 'baby-roadmap',
    name: 'Baby Roadmap',
    tagline: 'A pregnancy and baby tracker for two parents to keep in sync.',
    link: { href: 'https://baby.jasmantan.com', label: 'baby.jasmantan.com' },
    problem:
      'New parents in Singapore keep the same information in three places: a development timeline, a feed and sleep diary, and a pile of half-remembered advice.',
    built:
      'A single-page vanilla-JavaScript app — no framework, no build step — with a development timeline, a feed and sleep diary with pattern analysis, growth charts, a knowledge base and a family tree. Supabase provides Postgres and auth, with two parents syncing under a shared family code. Playwright end-to-end tests run over the real UI, and it deploys automatically on push to Cloudflare Pages.',
    outcome: 'In daily use by two people. Installable as a PWA.',
    stack: ['Vanilla JS', 'Supabase (Postgres, auth)', 'Playwright', 'Cloudflare Pages'],
  },
];

// "What I do" cards on the home page. Each line restates something already
// said in EXPERIENCE, PROJECTS or INFRA — nothing new.
export const DOING = [
  {
    icon: 'db',
    h: 'Backend & Data',
    p: 'T-SQL across a six-database SQL Server estate at work; Python, FastAPI and SQLite in my own apps.',
    tags: ['SQL Server', 'Python', 'FastAPI'],
  },
  {
    icon: 'link',
    h: 'Systems Integration',
    p: 'I built and maintain the SAP ERP ⇄ MES integration layer that keeps five plants in four countries in sync.',
    tags: ['SAP ERP', 'MES', 'REST'],
  },
  {
    icon: 'server',
    h: 'Self-hosted Infra',
    p: 'An Ubuntu home server: systemd services, Docker Compose stacks, public apps through Cloudflare Tunnel with no open ports, private ones on Tailscale, nightly backups to a second disk.',
    tags: ['Linux', 'Docker', 'Cloudflare', 'Tailscale'],
  },
  {
    icon: 'spark',
    h: 'AI-Assisted Delivery',
    p: 'I run AI coding agents like a small team: a written brief per job, one branch each, and a full test suite that has to pass before anything merges.',
    tags: ['Claude Code', 'Agent workflows', 'Playwright'],
  },
];

export const INFRA = {
  title: 'The home server',
  lede:
    'Everything above that is self-hosted runs on one Ubuntu Server box in my flat (i5-9400, 32 GB, a GTX 1060 for video). It is a small operations problem, and I treat it like one.',
  tags: ['Ubuntu', 'systemd', 'Docker Compose', 'Cloudflare Tunnel', 'Tailscale'],
  points: [
    {
      h: 'Public without opening a port',
      p: 'Public sites arrive through a Cloudflare Tunnel, so the router has no inbound ports open and origin services bind to 127.0.0.1 only. Each hostname is an explicit ingress rule; the catch-all returns 404. Personal apps sit behind Cloudflare Zero Trust Access with a one-person allow-list.',
    },
    {
      h: 'Family apps stay off the internet',
      p: 'The media hub and the family photo library (Immich, with face search on the GPU) are reachable only over Tailscale. Caddy serves them with real HTTPS certificates through a DNS challenge, bound to the tailnet address, and the tailnet policy gives family members those ports and nothing else.',
    },
    {
      h: 'Comes back by itself',
      p: 'Each app is a systemd service that restarts on failure and runs as an unprivileged user, the jhub API with a read-only view of the system; the media stack and Immich are Docker Compose projects. In September 2026 I moved the whole server from Windows to Ubuntu on a new SSD, from a written runbook.',
    },
    {
      h: 'Backed up, and honest about it',
      p: 'Nightly timers archive every app\'s data, the environment files and the tunnel config, and a second job mirrors the backups and the photo library to a separate disk without ever deleting. Two disks in one box still do not survive a fire or a theft, so an off-site copy is the next job.',
    },
    {
      h: 'Lessons written down',
      p: 'A sandboxed service kept a disk "busy" through its private mount namespace long after everything else let go of it, and a systemd reload quietly cut the media container off the GPU. Both are in the runbook now, and the second one is a health check.',
    },
  ],
};

// "How I build" on the home page: the working method behind the projects above.
export const WORKFLOW = {
  lede:
    'Most of my recent code is written by AI coding agents. My job is the part that decides whether it is right: the brief, the boundaries, the tests and the merge.',
  points: [
    {
      icon: 'doc',
      h: 'Brief first',
      p: 'Every job starts as a written brief: the problem, numbered items, what the agent must never touch, how the result will be checked, and reserved IDs for database migrations and decisions so agents working in parallel never collide.',
    },
    {
      icon: 'branch',
      h: 'Parallel, isolated',
      p: 'Each agent works in its own git worktree and branch, with its own test ports and a throwaway copy of the app. No agent touches live data, live services or a deploy.',
    },
    {
      icon: 'check',
      h: 'Gates, not trust',
      p: 'Agent branches meet in an integration branch, and the whole suite runs there: type checks, about 2,400 unit tests and 330 browser tests at phone and desktop sizes. Master only fast-forwards to a green build, so rolling back is one command.',
    },
    {
      icon: 'person',
      h: 'I own the decisions',
      p: 'Architecture decisions go in a log with rollback notes. When an agent\'s fix is a guess, it goes back with one rule: write a test that fails before the fix. Anything that touches live data or production stays with me.',
    },
  ],
};

export const SKILLS = [
  {
    h: 'Languages',
    items: ['C#', 'T-SQL / SQL', 'JavaScript', 'TypeScript', 'Python', 'Bash', 'PowerShell', 'C / C++', 'Java', 'Dart', 'GDScript'],
  },
  {
    h: 'Back end & data',
    items: ['.NET', 'SQL Server', 'Stored procedures & performance fixes', 'PostgreSQL / Supabase', 'SQLite', 'Node.js / Fastify', 'REST APIs', 'SAP ERP integration', 'ETL-style reporting', 'Timezone-correct multi-site data'],
  },
  {
    h: 'Front end',
    items: ['HTML / CSS / JavaScript dashboards', 'React', 'Installable web apps (offline, web push)', 'Flutter (Android & iOS)', 'Responsive multi-language UIs (6 locales)', 'Three.js'],
  },
  {
    h: 'Practice',
    items: ['Git & GitHub', 'GitHub Actions (CI/CD, Pages)', 'Playwright end-to-end tests', 'Change request → production → verification', 'L1/L2/L3 production support', 'Technical & functional documentation'],
  },
  {
    h: 'Operations',
    items: ['Linux (Ubuntu Server)', 'systemd services & timers', 'Docker & Compose', 'Cloudflare Tunnel & Zero Trust Access', 'Tailscale & Caddy (HTTPS)', 'Backup & restore'],
  },
  {
    h: 'AI tooling',
    items: ['Claude Code', 'Multi-agent builds: briefs, worktrees, test gates', 'LLM tool use in apps', 'LLM API integration with offline fallbacks'],
  },
];

export const EXPERIENCE = [
  {
    role: 'Software Engineer, Manufacturing Systems',
    org: 'Interplex Precision Technology',
    place: 'Singapore',
    period: 'Dec 2021 – present',
    summary: 'End-to-end delivery across a six-database SQL Server estate serving five plants, plus the SAP ERP ↔ MES integration layer that runs across four countries.',
    tags: ['T-SQL', 'SQL Server', 'SAP ERP integration', 'HTML / JavaScript', 'Python', 'PowerShell', 'Flutter', 'HYDRA MES'],
    points: [
      'End-to-end delivery across a six-database SQL Server estate serving five plants in Singapore, Batam, the Czech Republic, China and India — requirements, T-SQL and workflow-engine implementation, dashboard front end, deployment and post-deploy verification.',
      'Built and maintain the SAP ERP ↔ MES integration layer: goods issue and receipt, handling units, time-ticket outbound and the production-order inbound lifecycle, running across four countries.',
      'Root-caused and fixed a production routing defect that was sending operator scans to the wrong work order, replacing iframe-focus heuristics with active-step resolution.',
      'Built reporting dashboards over SQL Server — serial-number genealogy and traceability, per-operator labour, time-ticket and machine-timeline views — with plant-local time handling.',
      'Designed a centralised six-language (EN/ID/CZ/ES/TA/ZH) translation system spanning dashboards and workflows, with Python tooling to sync translation sources.',
      'Built a Flutter (Dart) mobile client for the MES on Android and iOS.',
      'L1/L2 support for HYDRA MES across the China and USA regions.',
    ],
  },
  {
    role: 'Software Engineer',
    org: 'NCS Pte Ltd',
    place: 'Singapore',
    period: 'Apr 2020 – Nov 2021',
    summary: 'Full-stack development, enhancement and maintenance of client applications at a government-linked IT services firm.',
    tags: ['C#', 'SQL', 'HTML', 'JavaScript'],
    points: [
      'Full-stack development, enhancement and maintenance of client applications in C#, HTML, JavaScript and SQL at a government-linked IT services firm.',
      'Impact analysis, defect fixing, and technical design and functional specification documents.',
    ],
  },
  {
    role: 'Unity3D Developer (Intern)',
    org: 'Affinixy Pte Ltd',
    place: 'Singapore',
    period: 'Apr 2019 – Dec 2019',
    summary: 'Shipped a mobile game to Android and iOS: core systems, AI, NavMesh pathfinding, gameplay and UI/UX direction.',
    tags: ['Unity3D', 'Android', 'iOS'],
    points: ['Shipped a mobile game to Android and iOS: core systems, AI, NavMesh pathfinding, gameplay and UI/UX direction.'],
  },
];

// Vendor certifications sit in their own block rather than buried in a job's
// bullets, because a recruiter scanning for "MES" wants to find them at a
// glance.
export const CERTIFICATIONS = [
  {
    what: 'Arcstone System Assessment — Intermediate',
    where: 'Arcstone Pte. Ltd.',
    period: 'July 2025',
    note: 'arc.ops MES end-to-end configuration. Certificate ID ARC-SA-2025-002.',
  },
  {
    what: 'Certified HYDRA 8 Developer',
    where: 'MPDV',
  },
];

export const EDUCATION = [
  {
    what: 'BSc Computer Science & Game Design',
    where: 'DigiPen Institute of Technology, Singapore',
    period: '2015 – 2020',
    note: 'First Place — Claude Comair Grand Prize for Game of the Year, DigiPen Game Awards 2019, for Kubrix, as a gameplay programmer (custom ImGui editor).',
  },
  {
    what: 'Diploma in Electronics, Computer & Communications',
    where: 'Nanyang Polytechnic',
    period: '2010 – 2013',
  },
];
