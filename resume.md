# Jasman Tan — Software Engineer

Software engineer with 6+ years building and integrating business-critical systems: C#/.NET and T-SQL back ends, JavaScript/TypeScript front ends, REST and ERP integrations, and operator-facing dashboards used daily across five manufacturing sites in four countries. Recent independent work: full-stack TypeScript and Python apps on a self-run Linux server, built by directing AI coding agents with written briefs and test gates. Looking for a backend, full-stack or AI-workflow engineering role.

jasmantan@hotmail.com · linkedin.com/in/jasmantan · github.com/JasmanTan1 · Singapore (Sengkang)

## Skills
- **Languages**: C#, T-SQL/SQL, JavaScript, TypeScript, Python, Bash, PowerShell, C/C++, Java, Dart (Flutter), GDScript
- **Back end & data**: .NET, SQL Server (multi-database, stored procedures, performance fixes), PostgreSQL/Supabase (auth, row-level sync), SQLite, Node.js/Fastify, REST APIs, SAP ERP-to-application integration, ETL-style reporting, timezone-correct multi-site data handling
- **Front end**: HTML/CSS/JavaScript dashboards, React, installable web apps (offline, web push), Flutter mobile (Android/iOS), responsive multi-language UIs (6 locales)
- **Engineering practice**: Git/GitHub, GitHub Actions (CI/CD and Pages deploys), Playwright end-to-end tests, change-request to production deployment and post-deploy verification, L1/L2/L3 production support, technical and functional documentation
- **Operations**: Linux (Ubuntu Server), systemd services and timers, Docker Compose, Cloudflare Tunnel and Zero Trust Access, Tailscale, Caddy (HTTPS), backup and restore
- **AI tooling**: Claude Code multi-agent builds (written briefs, isolated git worktrees, integration branches gated by unit and Playwright suites), LLM tool use inside apps, LLM APIs with offline fallbacks

## Experience

### Software Engineer, Manufacturing Systems (MES) — Interplex Precision Technology, Singapore · Dec 2021 – present
- Own end-to-end delivery of production features across a 6-database SQL Server estate serving 5 plants (Singapore, Batam, Czech Republic, China, India): requirements, T-SQL and workflow-engine implementation, dashboard front end, deployment and post-deploy verification.
- Built and maintain the SAP ERP to MES integration layer: goods issue/receipt, handling units, time-ticket outbound and the production-order inbound lifecycle, running across four countries.
- Root-caused and fixed a production routing defect that sent operator scans to the wrong work order, replacing iframe-focus heuristics with active-step resolution.
- Built production reporting dashboards in HTML/JavaScript over SQL Server: serial-number genealogy and traceability, per-operator labour, time-ticket and machine-timeline views, with plant-local time handling.
- Designed a centralised 6-language (EN/ID/CZ/ES/TA/ZH) translation system spanning dashboards and workflows, with Python tooling to sync translation sources.
- Wrote Python and PowerShell tooling for installers, schema checks and release bundles; author change requests, patch notes and runbooks used by site engineers.
- Built a Flutter (Dart) mobile client for the MES on Android and iOS.
- L1/L2 support for HYDRA MES across China and USA regions.

### Software Engineer — NCS Pte Ltd (government-linked IT services), Singapore · Apr 2020 – Nov 2021
- Full-stack development, enhancement and maintenance of client applications in C#, HTML, JavaScript and SQL.
- Impact analysis, defect fixing and documentation (technical designs, functional specifications).

### Unity3D Developer (Intern) — Affinixy Pte Ltd · Apr 2019 – Dec 2019
- Shipped a mobile game to Android and iOS (cubemeltgame.com): core systems, AI, NavMesh pathfinding, gameplay and UI/UX direction.

## Independent projects (2026, github.com/JasmanTan1)
- **jhub** — private family media app over Jellyfin and Navidrome: one installable web app for the family's video and music library, with per-person libraries and quotas, offline downloads, and web-push actions that work away from home through a Cloudflare Worker relay. TypeScript (Fastify 5, React 19), SQLite with 80+ migrations, Docker Compose; ~2,400 unit and 330 Playwright tests gate every deploy. Built with AI coding agents working from written briefs on isolated branches.
- **Home server** — Ubuntu Server host for all of the above: systemd services, Docker Compose stacks (media, Immich family photos with GPU face search), public apps via Cloudflare Tunnel with no open ports, family apps on Tailscale with Caddy HTTPS, nightly backups mirrored to a second disk. Migrated from Windows from a written runbook.
- **Card Optimizer** — FastAPI/SQLite credit-card optimiser: statement ingest (incl. OCR), categorisation, spend-cap tracking, and an LLM assistant with tool use that confirms every write and supports undo.
- **Baby Roadmap** — single-page web app for new parents: development timeline, feed/sleep diary with pattern analysis, growth charts, knowledge base and family tree. Vanilla JavaScript front end; Supabase (PostgreSQL, auth) syncing two parents under a shared family code; Playwright end-to-end tests; deployed on GitHub Pages.
- **Mobile games (Godot 4, GDScript)** — several one-thumb Android prototypes with gesture recognition, procedural content and Python build tooling.

## Certifications
- **Arcstone System Assessment — Intermediate** — Arcstone Pte. Ltd., July 2025. arc.ops MES end-to-end configuration. Certificate ID ARC-SA-2025-002.
- **MPDV Certified HYDRA 8 Developer** — MPDV.

## Education
- BSc Computer Science & Game Design — DigiPen Institute of Technology, Singapore, 2015–2020. First Place — Claude Comair Grand Prize for Game of the Year, DigiPen Game Awards 2019 (Kubrix, gameplay programmer, custom ImGui editor).
- Diploma in Electronics, Computer & Communications — Nanyang Polytechnic, 2010–2013.

## Languages
English (primary), Chinese (conversational)
