---
title: Building with AI agents without losing control
slug: ai-agents-without-losing-control
date: 2026-10-16
order: 1
summary: The rules I use so AI coding agents can move fast on a family app without me trusting their reports: branch-only agents, owner-run merges, a separate test instance, and verifying claims instead of believing them.
---

Most of the code in my projects is written by AI coding agents (Claude Code). I come from C and C++ and from MES and SQL work, and I did not hand-write the TypeScript in jhub, my family's self-hosted media hub. What I do is write the briefs, make the design decisions, read the logs, check the agents' claims, and own the merges and deploys. Here is the process, and the specific times it caught something.

## The rules

**Agents work on branches and never merge or deploy.** An agent gets a worktree and a branch. It can commit there. It cannot touch the main branch and it does not deploy. I run the one command that does, so there is always a human decision between "the agent says it works" and "my family's app changes".

**A brief is a contract.** Numbered items, what must not be touched, and how the result will be checked. If I cannot write down how I will check it, I do not understand the task well enough to hand it off.

**Tests run on a separate instance.** End-to-end tests start their own server with their own database. Never the live one. (More on that below, because I broke this rule by accident.)

**I verify claims instead of reading reports.** "Tests pass" is a sentence. I re-run the suite, check the branch is really built on what is live (`git merge-base`, or a fast-forward check before merging), open the screenshots at phone and desktop width, and read the diff. The gate for jhub is about 3,050 server and 700 web unit tests (3,052 and 708 on the last full run I recorded) plus Playwright end-to-end suites.

**Every non-trivial change gets a written decision record**, with a rollback note. There are about a hundred of them, and they are how I find out later why something is the way it is.

## Catches

**A flaky test that was a real race.** A new test failed one run in a while. Re-running would have made it go away. Instead the cause was chased down, and it was a conversion that could start after the server had begun shutting down. The fix was a `closed` flag and a refusal to spawn. A retry loop would have hidden a real bug.

**A silent merge failure.** In an earlier project, a fast-forward merge run by one of my coordinating agents aborted without anyone noticing: untracked generated files in the working tree blocked it, and the command's output had been piped through `tail -1`, which kept only the last line and discarded the exit code. The branch I thought was merged was not. I caught it because I checked the end state (does the branch contain the commits?) rather than trusting that the command had run. The rule that came out of it is now written down: never pipe a merge through `tail`; check the exit code.

**Files that would have broken a deploy.** In a game project, stray untracked engine metadata files (`.uid` and `.import` files) sat in the deploy worktrees. They blocked a release until they were removed. I caught them before the deploy, because "the build passed" says nothing about the state of the checkout.

**A test run that touched the live database.** An agent ran the default Playwright configuration for jhub, which starts the app against the real database. At 08:09 UTC on 15 October it applied a new migration there: a new, empty table and an index. I checked the live app (unaffected, HTTP 200), and checked that the table matched what the pending deploy would create anyway, so the later deploy would skip it cleanly. No data rows changed. So the damage was nil, but the process was wrong: my own rule had a hole, because the default config pointed at the live path. I logged it as an incident in my decision log, and the follow-up is on my to-do list: make the end-to-end config refuse to start on the live database path. I have not done that yet, and I would rather say so than imply it is fixed.

## What this costs

It is slower than "let the agent push". Briefs take time to write, and verification takes time to do. But the family uses the app daily, and the point of the process is that I can say what each deploy contained and why I believed it was safe.

The part I find most useful as an engineer is that these are normal software-engineering habits (code review, CI gates, separate environments, rollback plans) applied to an unusual team member. The agent is fast, tireless and confident, and confidence is the thing to verify.

## What I'd tell another engineer

- Give agents branches, not main. Keep merge and deploy as your own explicit act.
- Write the check into the brief before the work starts.
- Never accept "it ran" or a zero exit code as evidence. Look at the end state.
- A flaky test is a bug report. Do not retry it away.
- When your safety rule has a hole, write the incident down plainly and fix the rule, not just the instance.
