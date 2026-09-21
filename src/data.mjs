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
    'Software engineer in Singapore with 6+ years on business-critical systems: C#/.NET and T-SQL back ends, REST and SAP ERP integrations, and operator dashboards running across five manufacturing sites. Looking for a backend or full-stack role.',
  links: [
    { label: 'GitHub', href: 'https://github.com/JasmanTan1' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/jasmantan' },
  ],
};

export const HERO = {
  lede:
    'I build the unglamorous systems other people depend on: integration layers, databases that have to stay correct across time zones, and dashboards that factory operators use every shift.',
  body:
    'Six years of that at an electronics manufacturer and a government-linked IT services firm — C#/.NET, T-SQL across a six-database SQL Server estate, and the SAP ERP integration that keeps five plants in four countries in sync. On my own time I ship smaller things end to end: a browser game, a party game with an AI referee, a credit-card optimiser, a home server that hosts all of it.',
  seeking: 'Full-time · Hybrid or on-site · Singapore',
  seekingLabel: 'Open to backend or full-stack engineering roles.',
};

// Selected projects. `problem` / `built` / `outcome` are deliberately concrete —
// every claim traces back to the repo it describes.
export const PROJECTS = [
  {
    id: 'kubrix',
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
    id: 'jobgrab',
    name: 'Jobgrab',
    tagline: 'A job aggregator and matcher for the Singapore software market.',
    private: true,
    problem:
      'Job boards optimise for volume. Looking for a specific kind of role means re-reading the same postings across four sites every day.',
    built:
      'A Python tool — standard library only, no dependencies — that pulls postings from four sources (the MyCareersFuture API, LinkedIn, Careers@Gov and employer feeds), deduplicates them, and scores each one against a structured profile with an explicit weighted formula over scope, salary, location and employer type. Salary resolves in a defined order: an officially posted range first, then a researched multi-source company band, then an assumption by employer type — and an estimate is never allowed to exclude a job on its own. Results are served as one interactive page from a local HTTP server, with application tracking and LLM-drafted cover letters.',
    outcome:
      'Around 7,700 postings ingested and scored. Private by necessity — the generated page embeds a full resume and personal application notes.',
    stack: ['Python (stdlib only)', 'HTTP scraping / APIs', 'Scoring model', 'LLM CLI'],
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

export const INFRA = {
  title: 'The home server',
  lede:
    'Everything above that is self-hosted runs on one Windows mini PC in my flat. It is a small operations problem, and I treat it like one.',
  points: [
    {
      h: 'Public without opening a port',
      p: 'All traffic arrives through a Cloudflare Tunnel, so the router has no inbound ports open and origin services bind to 127.0.0.1 only. Each hostname is an explicit ingress rule; the catch-all returns 404.',
    },
    {
      h: 'Private by default',
      p: 'The personal apps sit behind Cloudflare Zero Trust Access with a one-person allow-list and email one-time codes — so a guest needs no account to be let in, and no hostname is ever exposed through the tunnel before its Access application exists.',
    },
    {
      h: 'Comes back by itself',
      p: 'Each service is a logon-triggered scheduled task with its own start script. The machine signs in automatically on boot, so a power cut or a Windows update restores every site without me touching it.',
    },
    {
      h: 'Backed up, and honest about it',
      p: 'A nightly PowerShell job archives every app\'s data folder, the environment files and the tunnel config, keeps 14 days and writes a log. It lives on the same drive, which protects against my mistakes and not against a dead disk — an off-machine copy is the next job on the list.',
    },
  ],
};

export const SKILLS = [
  {
    h: 'Languages',
    items: ['C#', 'T-SQL / SQL', 'JavaScript', 'TypeScript', 'Python', 'PowerShell', 'C / C++', 'Java', 'Dart', 'GDScript'],
  },
  {
    h: 'Back end & data',
    items: ['.NET', 'SQL Server', 'Stored procedures & performance fixes', 'PostgreSQL / Supabase', 'REST APIs', 'SAP ERP integration', 'ETL-style reporting', 'Timezone-correct multi-site data'],
  },
  {
    h: 'Front end',
    items: ['HTML / CSS / JavaScript dashboards', 'React', 'Flutter (Android & iOS)', 'Responsive multi-language UIs (6 locales)', 'Three.js'],
  },
  {
    h: 'Practice',
    items: ['Git & GitHub', 'GitHub Actions (CI/CD, Pages)', 'Playwright end-to-end tests', 'Change request → production → verification', 'L1/L2/L3 production support', 'Technical & functional documentation'],
  },
  {
    h: 'Operations',
    items: ['Cloudflare Tunnel & Zero Trust Access', 'Scheduled services on Windows', 'Backup & restore', 'Docker / Compose (in progress)'],
  },
  {
    h: 'AI tooling',
    items: ['LLM-assisted development workflows', 'Agentic scripts & tool use', 'LLM API integration with offline fallbacks'],
  },
];

export const EXPERIENCE = [
  {
    role: 'Software Engineer, Manufacturing Systems',
    org: 'Interplex Precision Technology',
    place: 'Singapore',
    period: 'Dec 2021 – present',
    points: [
      'End-to-end delivery across a six-database SQL Server estate serving five plants in Singapore, Batam, the Czech Republic, China and India — requirements, T-SQL and workflow-engine implementation, dashboard front end, deployment and post-deploy verification.',
      'Built and maintain the SAP ERP ↔ MES integration layer: goods issue and receipt, handling units, time-ticket outbound and the production-order inbound lifecycle, running across four countries.',
      'Root-caused and fixed a production routing defect that was sending operator scans to the wrong work order, replacing iframe-focus heuristics with active-step resolution.',
      'Built reporting dashboards over SQL Server — serial-number genealogy and traceability, per-operator labour, time-ticket and machine-timeline views — with plant-local time handling.',
      'Designed a centralised six-language (EN/ID/CZ/ES/TA/ZH) translation system spanning dashboards and workflows, with Python tooling to sync translation sources.',
      'L1/L2 support for HYDRA MES across the China and USA regions.',
    ],
  },
  {
    role: 'Software Engineer',
    org: 'NCS Pte Ltd',
    place: 'Singapore',
    period: 'Apr 2020 – Nov 2021',
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
