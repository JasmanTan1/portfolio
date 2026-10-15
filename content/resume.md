# Jasman Tan — Software Engineer

Backend, integration and workflow-automation developer with 6+ years building production business systems in manufacturing: C#/.NET and T-SQL, SAP ERP integration, and business workflows on a .NET (Orchard Core) workflow engine, used daily across six plants in Asia, Europe and the US. On my own time I do AI-workflow engineering: I direct coding agents with written specs, review every change and verify with tests. Looking for a backend, integration, workflow-automation or AI-workflow role.

jasmantan@hotmail.com · jasmantan.com · linkedin.com/in/jasmantan · github.com/JasmanTan1 · Singapore (Sengkang)

## Skills
- **Hands-on (written by me, can go deep)**: T-SQL / SQL Server (queries, deploy scripts, SAP outbound queues), C# / .NET, workflow design (JSON workflow definitions, Liquid templates), MES and SAP integration, C / C++ (DigiPen, games)
- **AI-directed (I specify, review and test; I can read and discuss the code)**: JavaScript, TypeScript (Fastify, React), HTML/CSS, Python (build tooling and my own apps, FastAPI), PowerShell, Dart (Flutter), GDScript
- **Back end & data**: .NET workflow engine (Orchard Core based), SQL Server (multi-database, stored procedures, performance fixes), PostgreSQL/Supabase, SQLite, REST APIs, SAP ERP integration, ETL-style reporting, timezone-correct multi-site data
- **Front end (AI-directed)**: dashboards, React, installable web apps (offline, web push), Flutter mobile, 6-locale UIs
- **Engineering practice**: Git/GitHub, GitHub Actions (CI/CD), Playwright end-to-end tests, change-request to production deployment and verification, L1/L2/L3 production support, technical and functional documentation
- **Operations**: Linux (Ubuntu Server), systemd services and timers, Docker Compose, Cloudflare Tunnel and Zero Trust Access, Tailscale, Caddy (HTTPS), backup and restore
- **AI-workflow engineering**: Claude Code multi-agent builds (written briefs, isolated git worktrees, branches gated by unit and Playwright suites), LLM tool use in apps, LLM APIs with offline fallbacks

## Experience

### Software Engineer, Manufacturing Systems (MES) — ENNOVI (formerly Interplex), Singapore · Dec 2021 – present
- Design and build production workflows on a .NET (Orchard Core) workflow engine: SQL Server tasks, JSON workflow definitions, Liquid templates for HTTP payloads and HTML pages, and dashboards served by the workflows.
- Own end-to-end delivery of production features across a 6-database SQL Server estate serving six plants (Singapore, Batam, Czech Republic, China, India, USA): requirements, T-SQL and workflow implementation, dashboards, deployment and post-deploy verification.
- Built and maintain the SAP ERP to MES integration layer: goods issue/receipt, handling units, time-ticket outbound and the production-order inbound lifecycle, running across the plants.
- Root-caused and fixed a production routing defect that sent operator scans to the wrong work order, replacing iframe-focus heuristics with active-step resolution.
- Delivered reporting dashboards over SQL Server, served by the workflows: serial-number genealogy and traceability, per-operator labour, time-ticket and machine-timeline views, with plant-local time handling.
- Designed a centralised 6-language (EN/ID/CZ/ES/TA/ZH) translation system spanning dashboards and workflows, with Python tooling (AI-directed) to sync translation sources.
- Specified and tested Python and PowerShell tooling (AI-built) for installers, schema checks and release bundles; author change requests, patch notes and runbooks for site engineers.
- Directed AI coding agents to build a Flutter (Dart) MES mobile client (Android, iOS).
- L1/L2 support for HYDRA MES across China and USA regions.

### Software Engineer — NCS Pte Ltd (government-linked IT services), Singapore · Apr 2020 – Nov 2021
- Full-stack development, enhancement and maintenance of client applications in C#, HTML, JavaScript and SQL.
- Impact analysis, defect fixing and documentation (technical designs, functional specifications).

### Unity3D Developer (Intern) — Affinixy Pte Ltd · Apr 2019 – Dec 2019
- Shipped a mobile game to Android and iOS (cubemeltgame.com): core systems, AI, NavMesh pathfinding, gameplay and UI/UX direction.

## Independent projects (2026, github.com/JasmanTan1)
- **jhub** — private family media app over Jellyfin and Navidrome: one installable web app for the family's video and music library, with per-person libraries and quotas, offline downloads, and web-push actions that work away from home through a Cloudflare Worker relay. TypeScript (Fastify 5, React 19), SQLite with 80+ migrations, Docker Compose; ~3,500 unit tests plus Playwright end-to-end suites gate every deploy. Built with AI coding agents from written briefs.
- **Home server** — Ubuntu Server host for all of the above: systemd services, Docker Compose stacks (media, Immich photos), public apps via Cloudflare Tunnel with no open ports, family apps on Tailscale with Caddy HTTPS, nightly backups mirrored to a second disk. Migrated from Windows from a written runbook.
- **Card Optimizer** — FastAPI/SQLite credit-card optimiser: statement ingest (incl. OCR), categorisation, spend caps, and an LLM assistant with tool use that confirms every write and supports undo.
- **Baby Roadmap** — single-page web app for new parents: development timeline, feed/sleep diary with pattern analysis, growth charts, knowledge base, family tree. Vanilla JavaScript; Supabase (PostgreSQL, auth) syncing two parents; Playwright tests.
- **Mobile games (Godot 4, GDScript)** — one-thumb Android prototypes with gesture recognition and procedural content.

## Certifications
- **Arcstone System Assessment — Intermediate** — Arcstone Pte. Ltd., July 2025. arc.ops MES end-to-end configuration. Certificate ID ARC-SA-2025-002.
- **MPDV Certified HYDRA 8 Developer** — MPDV.

## Education
- BSc Computer Science & Game Design — DigiPen Institute of Technology, Singapore, 2015–2020. First Place — Claude Comair Grand Prize for Game of the Year, DigiPen Game Awards 2019 (Kubrix, gameplay programmer, custom ImGui editor).
- Diploma in Electronics, Computer & Communications — Nanyang Polytechnic, 2010–2013.

## Languages
English (primary), Chinese (conversational)
