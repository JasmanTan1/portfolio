# CHANGES: workflow angle (site)

Angle: defensible hands-on skills (T-SQL, C#/.NET, workflow design, MES+SAP, C++) vs AI-directed (JS, TS, HTML/CSS, Python, PowerShell, Dart); .NET (Orchard Core) workflow-engine work added; no company internals. Every changed line, before (-) to after (+). static/resume.pdf regenerated from content/resume.md (2 pages).

```diff
--- a/content/resume.md
+++ b/content/resume.md
-Software engineer with 6+ years building and integrating business-critical systems: C#/.NET and T-SQL back ends, JavaScript front ends, REST and ERP integrations, and operator-facing dashboards used daily across six manufacturing plants in Asia, Europe and the US. Recent independent work: full-stack TypeScript and Python apps on a self-run Linux server, built by directing AI coding agents: I write the specs, review every change and verify behaviour with tests. Looking for a backend, full-stack or AI-workflow engineering role.
+Backend, integration and workflow-automation developer with 6+ years building production business systems in manufacturing: C#/.NET and T-SQL, SAP ERP integration, and business workflows on a .NET (Orchard Core) workflow engine, used daily across six plants in Asia, Europe and the US. On my own time I do AI-workflow engineering: I direct coding agents with written specs, review every change and verify with tests. Looking for a backend, integration, workflow-automation or AI-workflow role.
-- **Languages (hands-on)**: C#, T-SQL/SQL, JavaScript/HTML, C/C++, PowerShell
-- **Built by directing AI agents**: TypeScript (Fastify, React), Python (FastAPI), Dart (Flutter), GDScript
-- **Back end & data**: .NET, SQL Server (multi-database, stored procedures, performance fixes), PostgreSQL/Supabase (auth, row-level sync), SQLite, Node.js/Fastify, REST APIs, SAP ERP-to-application integration, ETL-style reporting, timezone-correct multi-site data handling
-- **Front end**: HTML/CSS/JavaScript dashboards, React, installable web apps (offline, web push), Flutter mobile (Android/iOS), responsive multi-language UIs (6 locales)
-- **Engineering practice**: Git/GitHub, GitHub Actions (CI/CD and Pages deploys), Playwright end-to-end tests, change-request to production deployment and post-deploy verification, L1/L2/L3 production support, technical and functional documentation
+- **Hands-on (written by me, can go deep)**: T-SQL / SQL Server (queries, deploy scripts, SAP outbound queues), C# / .NET, workflow design (JSON workflow definitions, Liquid templates), MES and SAP integration, C / C++ (DigiPen, games)
+- **AI-directed (I specify, review and test; I can read and discuss the code)**: JavaScript, TypeScript (Fastify, React), HTML/CSS, Python (build tooling and my own apps, FastAPI), PowerShell, Dart (Flutter), GDScript
+- **Back end & data**: .NET workflow engine (Orchard Core based), SQL Server (multi-database, stored procedures, performance fixes), PostgreSQL/Supabase, SQLite, REST APIs, SAP ERP integration, ETL-style reporting, timezone-correct multi-site data
+- **Front end (AI-directed)**: dashboards, React, installable web apps (offline, web push), Flutter mobile, 6-locale UIs
+- **Engineering practice**: Git/GitHub, GitHub Actions (CI/CD), Playwright end-to-end tests, change-request to production deployment and verification, L1/L2/L3 production support, technical and functional documentation
-- **AI tooling**: Claude Code multi-agent builds (written briefs, isolated git worktrees, integration branches gated by unit and Playwright suites), LLM tool use inside apps, LLM APIs with offline fallbacks
+- **AI-workflow engineering**: Claude Code multi-agent builds (written briefs, isolated git worktrees, branches gated by unit and Playwright suites), LLM tool use in apps, LLM APIs with offline fallbacks
-- Own end-to-end delivery of production features across a 6-database SQL Server estate serving six plants (Singapore, Batam, Czech Republic, China, India, USA): requirements, T-SQL and workflow-engine implementation, dashboard front end, deployment and post-deploy verification.
+- Design and build production workflows on a .NET (Orchard Core) workflow engine: SQL Server tasks, JSON workflow definitions, Liquid templates for HTTP payloads and HTML pages, and dashboards served by the workflows.
+- Own end-to-end delivery of production features across a 6-database SQL Server estate serving six plants (Singapore, Batam, Czech Republic, China, India, USA): requirements, T-SQL and workflow implementation, dashboards, deployment and post-deploy verification.
-- Built production reporting dashboards in HTML/JavaScript over SQL Server: serial-number genealogy and traceability, per-operator labour, time-ticket and machine-timeline views, with plant-local time handling.
-- Designed a centralised 6-language (EN/ID/CZ/ES/TA/ZH) translation system spanning dashboards and workflows, with Python tooling to sync translation sources.
-- Wrote Python and PowerShell tooling for installers, schema checks and release bundles; author change requests, patch notes and runbooks used by site engineers.
-- Built a Flutter (Dart) mobile client for the MES on Android and iOS.
+- Delivered reporting dashboards over SQL Server, served by the workflows: serial-number genealogy and traceability, per-operator labour, time-ticket and machine-timeline views, with plant-local time handling.
+- Designed a centralised 6-language (EN/ID/CZ/ES/TA/ZH) translation system spanning dashboards and workflows, with Python tooling (AI-directed) to sync translation sources.
+- Specified and tested Python and PowerShell tooling (AI-built) for installers, schema checks and release bundles; author change requests, patch notes and runbooks for site engineers.
+- Directed AI coding agents to build a Flutter (Dart) MES mobile client (Android, iOS).
-- **jhub** — private family media app over Jellyfin and Navidrome: one installable web app for the family's video and music library, with per-person libraries and quotas, offline downloads, and web-push actions that work away from home through a Cloudflare Worker relay. TypeScript (Fastify 5, React 19), SQLite with 80+ migrations, Docker Compose; ~3,500 unit tests plus Playwright end-to-end suites gate every deploy. Built with AI coding agents working from written briefs on isolated branches.
-- **Home server** — Ubuntu Server host for all of the above: systemd services, Docker Compose stacks (media, Immich family photos with GPU face search), public apps via Cloudflare Tunnel with no open ports, family apps on Tailscale with Caddy HTTPS, nightly backups mirrored to a second disk. Migrated from Windows from a written runbook.
-- **Card Optimizer** — FastAPI/SQLite credit-card optimiser: statement ingest (incl. OCR), categorisation, spend-cap tracking, and an LLM assistant with tool use that confirms every write and supports undo.
-- **Baby Roadmap** — single-page web app for new parents: development timeline, feed/sleep diary with pattern analysis, growth charts, knowledge base and family tree. Vanilla JavaScript front end; Supabase (PostgreSQL, auth) syncing two parents under a shared family code; Playwright end-to-end tests; deployed on GitHub Pages.
-- **Mobile games (Godot 4, GDScript)** — several one-thumb Android prototypes with gesture recognition, procedural content and Python build tooling.
+- **jhub** — private family media app over Jellyfin and Navidrome: one installable web app for the family's video and music library, with per-person libraries and quotas, offline downloads, and web-push actions that work away from home through a Cloudflare Worker relay. TypeScript (Fastify 5, React 19), SQLite with 80+ migrations, Docker Compose; ~3,500 unit tests plus Playwright end-to-end suites gate every deploy. Built with AI coding agents from written briefs.
+- **Home server** — Ubuntu Server host for all of the above: systemd services, Docker Compose stacks (media, Immich photos), public apps via Cloudflare Tunnel with no open ports, family apps on Tailscale with Caddy HTTPS, nightly backups mirrored to a second disk. Migrated from Windows from a written runbook.
+- **Card Optimizer** — FastAPI/SQLite credit-card optimiser: statement ingest (incl. OCR), categorisation, spend caps, and an LLM assistant with tool use that confirms every write and supports undo.
+- **Baby Roadmap** — single-page web app for new parents: development timeline, feed/sleep diary with pattern analysis, growth charts, knowledge base, family tree. Vanilla JavaScript; Supabase (PostgreSQL, auth) syncing two parents; Playwright tests.
+- **Mobile games (Godot 4, GDScript)** — one-thumb Android prototypes with gesture recognition and procedural content.
--- a/src/data.mjs
+++ b/src/data.mjs
-    'Software engineer in Singapore with 6+ years on business-critical systems: C#/.NET and T-SQL back ends, REST and SAP ERP integrations, and operator dashboards running across six manufacturing plants. On my own time I ship full-stack apps by directing AI coding agents, with tests as the gate. Looking for a backend, full-stack or AI-workflow role.',
+    'Backend, integration and workflow-automation developer in Singapore with 6+ years on production systems in manufacturing: C#/.NET, T-SQL, SAP ERP integration, and business workflows on a .NET workflow engine across six plants. On my own time I build apps by directing AI coding agents, with specs, review and tests as the gate. Looking for a backend, integration, workflow-automation or AI-workflow role.',
-  headline: 'Software Engineer — backend, integrations & AI-assisted delivery.',
+  headline: 'Software Engineer — backend, integrations, workflows & AI-directed delivery.',
-    'Six years of that at an electronics manufacturer and a government-linked IT services firm — C#/.NET, T-SQL across a six-database SQL Server estate, and the SAP ERP integration that keeps six plants in sync. On my own time I ship smaller things end to end: a browser game, a party game with an AI referee, a credit-card optimiser, a family media hub, and the Linux server that hosts all of it. More and more of that is built by AI coding agents that I brief, review and gate with tests.',
+    'Six years of that at an electronics manufacturer and a government-linked IT services firm — C#/.NET, T-SQL across a six-database SQL Server estate, production workflows on a .NET (Orchard Core) workflow engine, and the SAP ERP integration that keeps six plants in sync. On my own time I ship smaller things end to end: a browser game, a party game with an AI referee, a credit-card optimiser, a family media hub, and the Linux server that hosts all of it. Those are built by AI coding agents that I brief, review and gate with tests; the code I write by hand is the SQL, C# and workflow work above.',
-    p: 'T-SQL across a six-database SQL Server estate at work; Python, FastAPI and SQLite in my own apps.',
-    tags: ['SQL Server', 'Python', 'FastAPI'],
+    p: 'Hand-written T-SQL across a six-database SQL Server estate at work, including deploy scripts and SAP outbound queues; Python, FastAPI and SQLite in my own apps, built with AI agents.',
+    tags: ['SQL Server', 'T-SQL', 'C# / .NET'],
-    h: 'Systems Integration',
-    p: 'I built and maintain the SAP ERP ⇄ MES integration layer that keeps six plants in sync.',
-    tags: ['SAP ERP', 'MES', 'REST'],
+    h: 'Workflows & Integration',
+    p: 'I design and build production workflows on a .NET (Orchard Core) workflow engine: SQL Server tasks, JSON definitions, Liquid templates. I also built and maintain the SAP ERP ⇄ MES integration layer that keeps six plants in sync.',
+    tags: ['.NET', 'Liquid', 'SAP ERP', 'MES'],
-    h: 'Languages (hands-on)',
-    items: ['C#', 'T-SQL / SQL', 'JavaScript', 'C / C++', 'PowerShell', 'Bash'],
+    h: 'Hands-on (written by me)',
+    items: ['T-SQL / SQL Server (queries, deploy scripts, SAP outbound queues)', 'C# / .NET', 'Workflow design (JSON definitions, Liquid templates)', 'MES + SAP integration', 'C / C++ (DigiPen, games)'],
-    h: 'Built by directing AI agents',
-    items: ['TypeScript', 'Python', 'Dart', 'GDScript'],
+    h: 'AI-directed (I specify, review, test)',
+    items: ['JavaScript', 'TypeScript', 'HTML / CSS', 'Python (build tooling and my own apps)', 'PowerShell', 'Dart', 'GDScript'],
-    items: ['.NET', 'SQL Server', 'Stored procedures & performance fixes', 'PostgreSQL / Supabase', 'SQLite', 'Node.js / Fastify', 'REST APIs', 'SAP ERP integration', 'ETL-style reporting', 'Timezone-correct multi-site data'],
+    items: ['.NET', 'Workflow engine (Orchard Core based)', 'SQL Server', 'Stored procedures & performance fixes', 'PostgreSQL / Supabase', 'SQLite', 'REST APIs', 'SAP ERP integration', 'ETL-style reporting', 'Timezone-correct multi-site data'],
-    h: 'Front end',
-    items: ['HTML / CSS / JavaScript dashboards', 'React', 'Installable web apps (offline, web push)', 'Flutter (Android & iOS)', 'Responsive multi-language UIs (6 locales)', 'Three.js'],
+    h: 'Front end (AI-directed)',
+    items: ['Dashboards', 'React', 'Installable web apps (offline, web push)', 'Flutter (Android & iOS)', 'Responsive multi-language UIs (6 locales)', 'Three.js'],
-    h: 'AI tooling',
+    h: 'AI-workflow engineering',
-    summary: 'End-to-end delivery across a six-database SQL Server estate serving six plants, plus the SAP ERP ↔ MES integration layer that runs across them.',
-    tags: ['T-SQL', 'SQL Server', 'SAP ERP integration', 'HTML / JavaScript', 'Python', 'PowerShell', 'Flutter', 'HYDRA MES'],
+    summary: 'Production workflows on a .NET workflow engine and end-to-end delivery across a six-database SQL Server estate serving six plants, plus the SAP ERP ↔ MES integration layer that runs across them.',
+    tags: ['T-SQL', 'SQL Server', '.NET workflows', 'Liquid', 'SAP ERP integration', 'HYDRA MES'],
-      'End-to-end delivery across a six-database SQL Server estate serving six plants in Singapore, Batam, the Czech Republic, China, India and the USA — requirements, T-SQL and workflow-engine implementation, dashboard front end, deployment and post-deploy verification.',
+      'Design and build production workflows on a .NET (Orchard Core) workflow engine: SQL Server tasks, JSON workflow definitions, Liquid templates for HTTP payloads and HTML pages, and dashboards served by the workflows.',
+      'End-to-end delivery across a six-database SQL Server estate serving six plants in Singapore, Batam, the Czech Republic, China, India and the USA — requirements, T-SQL and workflow implementation, dashboards, deployment and post-deploy verification.',
-      'Built reporting dashboards over SQL Server — serial-number genealogy and traceability, per-operator labour, time-ticket and machine-timeline views — with plant-local time handling.',
-      'Designed a centralised six-language (EN/ID/CZ/ES/TA/ZH) translation system spanning dashboards and workflows, with Python tooling to sync translation sources.',
-      'Built a Flutter (Dart) mobile client for the MES on Android and iOS.',
+      'Delivered reporting dashboards over SQL Server, served by the workflows — serial-number genealogy and traceability, per-operator labour, time-ticket and machine-timeline views — with plant-local time handling.',
+      'Designed a centralised six-language (EN/ID/CZ/ES/TA/ZH) translation system spanning dashboards and workflows, with Python tooling (AI-directed) to sync translation sources.',
+      'Directed AI coding agents to build a Flutter (Dart) mobile client for the MES on Android and iOS.',
+      'Specified, reviewed and tested Python and PowerShell tooling (built with AI coding agents) for installers, schema checks and release bundles.',
```
