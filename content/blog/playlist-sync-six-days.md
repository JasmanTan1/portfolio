---
title: The playlist sync that ran for six days
slug: playlist-sync-six-days
date: 2026-10-16
order: 3
summary: A media server API quirk made my sync delete and recreate playlists on every pass. Nothing alerted me for six days. How I found it, fixed it in two passes, and added a 03:00 health check.
---

jhub is the self-hosted family media hub I designed and direct. The code is written by AI coding agents (Claude Code); I write the specs, read the logs, make the decisions, and verify and deploy the changes. This post is about a bug in one of those agent-written pieces, and about the part that was my job: noticing it, finding the real cause, and making sure it could not hide again.

## What it looked like

The media server (Jellyfin 12.1) was sitting at one full CPU core, and its log was filling with errors, about 6,000 "Error processing request" lines an hour. By the time I looked it had been like that for six days. On the day I found it, the numbers were 377 playlist folders on disk, of which 248 were junk with names like `My music1111...` up to 255 characters, and 11,751 errors in two hours.

Nothing had told me. The family could still play music, so nobody complained. The server was just quietly burning a core and filling its log with errors.

## Reading the logs

jhub mirrors each person's playlists into Jellyfin. The first suspect was the obvious one: any song change was handled as "delete the playlist and create it again". That was real, but it only fires when songs change. It did not explain a loop that ran every pass.

The second trigger did. On Jellyfin 12.1, reading one playlist with an API key answers `400 "Guid can't be empty"`, because that call takes the user from the sign-in, and an API key has no user. The sync code had a fallback: if it could not read the sharing state, ask every other user whether they can see the playlist. On 12.1 every user can see every playlist, so 123 of 125 mapped playlists looked "shared". The planner then emitted "make it private", implemented as delete and create, on every pass.

Jellyfin names a playlist's folder after its name and, if the old folder is still there, appends a "1". Repeat for days and the names reach 255 characters, at which point creation fails with "path too long" and the errors begin.

Here is the shape of the mistake, simplified and illustrative (not the real code):

```ts
// What the fallback effectively did
const shared = (await readSharing(id)) ?? (await everyoneCanSee(id)); // 400 -> fallback -> always true
if (shared && wantPrivate) await recreate(id);                         // every pass, forever
```

What I took from it: a fallback that returns a confident answer when the real question failed is worse than an error.

## Fix, in two passes

**Pass one (D92).** Edit playlists in place instead of deleting them. Add and remove songs through the item endpoints, and treat "sharing unknown" as "private". Remake a playlist only when the server positively says it is shared, and at most once per playlist per 24 hours, with the timestamp written before the work starts. Also: an error is not "gone". Only a clean "no such item" leads to a create; a 500 or a failed read leaves that playlist alone for the pass and logs once.

I could not test the in-place calls against the live server first, because the investigation was read-only. The decision record says so in plain words: written from the API docs, tested against a fake, first live pass will show whether 12.1 accepts them.

**Pass two (D92b),** from the live worker log after deploy. The reorder call turned out to need a user that an API key does not have, so a wrong order is now fixed by removing the wrong tail and appending it again. And seven people each having a playlist called "My music" meant the "1" chain was still growing, so a create whose name would collide is now made under a unique temporary name and renamed at once.

Cleanup used a script the agents wrote, which is a dry run by default and opens the database read-only. The result: playlist folders went from 377 to 130, Jellyfin errors from about 6,000 an hour to zero, and idle CPU to about 0.1 percent on a 10-second sample.

## So it cannot hide again

The real failure was not the bug. It was six days of nobody knowing. So the next change was a daily health check (D93) that runs at 03:00 Singapore time inside the existing worker, with no new cron job and no new service:

- Jellyfin error lines in the last 24 hours (warn above 500)
- CPU averaged over 30 seconds while nobody is playing anything (warn above 80 percent of a core)
- Jellyfin playlist count against what jhub thinks it has mapped
- A contract probe: three read-only calls the mirror depends on, checked for status and response shape against the last good run
- Any worker warning repeated more than 50 times in a day

It pushes to the admins only when something warns, so green days are silent. The first dry run, over the old logs, reported 76,500 errors in 24 hours, 390 percent of a core used while idle, and 5,322 repeats of one worker warning. It would have flagged this on day one.

## What I'd tell another engineer

- Alert on symptoms you can measure from outside the feature: error volume, idle CPU, object counts. Those would have caught this bug and the next one.
- Be suspicious of any fallback that turns a failure into a confident answer.
- Your sync should be idempotent and bounded: edit in place, and put a rate limit on anything that deletes.
- When an agent writes the fix, still write down what was not tested live. The first deploy is part of the test.
