---
title: Why my speaker played nothing
slug: speaker-played-nothing
date: 2026-10-16
order: 2
summary: Casting a video's sound to a smart speaker showed "playing" and made no noise. Reproducing it in real Chrome, a range request answered wrongly, a flaky test that was a real race, and a sandbox bug the tests could not see.
---

jhub, my self-hosted family media hub, can cast a video's sound to a Google speaker. I designed the feature and directed the work; the code was written by AI coding agents. Getting it to actually make sound took three separate bugs, and each one taught me something different.

## The symptom

I cast a video's sound to a speaker. The speaker's state said "playing". The speaker said nothing. No error anywhere, which is the worst kind of bug report.

The key fact is that a Cast receiver is Chrome. So the question became "what would Chrome do with this URL?", and the way to answer is to ask real Chrome, not read the protocol docs.

## Hypothesis, then reproduction

The server made the sound on the fly: ffmpeg converted the audio and piped it straight out as a fragmented MP4. That stream has no length, and the response said `Accept-Ranges: none`. My hypothesis was that Chrome needed to seek in the file, and a pipe cannot be seeked.

I had the agent reproduce it in real Chrome rather than assume. The result matched: `play()` never started and the media element reported error 3 (decode). In the reproduction, Chrome asked for `Range: bytes=196608-`, a point in the middle of the file, and the server answered `200` with the body from byte 0. A client that asks for the middle and gets the beginning has nothing sensible left to do but fail.

## The fix: a seekable file, and honest HTTP

Instead of a live pipe, the sound is now converted once, when the cast address is created, into a small file with its index at the front. It is kept until the address expires and served the way a file should be:

- `200` with a full body and a length
- `206 Partial Content` for a valid `Range`
- `416` for a range past the end

The range parser is small and has its own unit test. This is a real extract from the test:

```ts
expect(parseRange('bytes=0-', 100)).toEqual({ start: 0, end: 99 });
expect(parseRange('bytes=-10', 100)).toEqual({ start: 90, end: 99 });
expect(parseRange('bytes=100-', 100)).toBe('bad');   // -> 416
expect(parseRange('bytes=0-1,5-6', 100)).toBeNull(); // multi-range: ignore
```

A second test checks the file itself: the `moov` box (the index) comes before `mdat` (the data), and there are no `moof` fragments. That is the regression test for the exact thing that made Chrome fail.

## The flaky test that was a real bug

After the change, one of the new tests failed now and then. The easy move is to re-run until green. I had it treated as a bug report, and it was one.

The server could start a conversion after it had already been told to shut down. A conversion waiting on the media server could finish waiting, then launch ffmpeg during or after teardown. In a test that shows up as a random failure in the next test. In production it could be a stray process after a restart. The fix is two lines: set a `closed` flag when the server closes, and refuse to spawn once it is set.

```ts
app.addHook('onClose', async () => { this.closed = true; /* then stop our own children */ });
// ...
if (this.closed) return reject(new ApiFail(503, 'shutting_down', 'jhub is shutting down.'));
```

The same commit made one assertion find its own conversion instead of grabbing "the first ffmpeg call", which could be left over from a previous test.

## The bug the tests could not see

The cache of converted files was first placed in the system temp folder. All tests passed. But jhub runs as a systemd service with `ProtectSystem=strict`, which makes almost the whole filesystem read-only for that process. Under the real unit, creating the cache folder fails on every sound cast.

Tests passed because tests do not run inside the unit's sandbox. That is the lesson, not the typo: the environment the tests run in was different from the environment production runs in in exactly the way that mattered.

The fix, which is in progress on a branch and not yet merged or deployed as I write this, puts the cache under the app's own data directory (next to the database, which the unit is allowed to write), with an environment override for tests. And a test asserts the path, so nobody moves it back:

```ts
expect(castCacheDir('/data/jhub')).toBe('/data/jhub/cast-sound');
expect(castCacheDir('/data/jhub').startsWith(os.tmpdir())).toBe(false);
```

It is a unit test standing in for a sandbox test, which is a weaker thing than running the suite under the unit. I would like to close that gap.

## What I'd tell another engineer

- When a client is a known piece of software (here, Chrome), reproduce with that software before theorising.
- "Playing" is a claim by a state machine, not evidence of sound. Verify the end state.
- Treat a flaky test as a bug report until proven otherwise. This one was a real shutdown race.
- Match the test environment to the production sandbox for anything that touches the filesystem, network or user. Where you cannot, add a test that pins the assumption.
