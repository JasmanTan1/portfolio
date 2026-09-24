// Progressive enhancement only. The site is fully readable with JS disabled.
(function () {
  'use strict';

  var root = document.documentElement;
  var KEY = 'jt-theme';

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* private mode, blocked storage */ }
  }
  // Dark is the default; only an explicit choice of light changes it.
  function current() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  var saved = stored();
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    var sync = function () { toggle.setAttribute('aria-pressed', String(current() === 'dark')); };
    sync();
    toggle.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      save(next);
      sync();
    });
  }

  var print = document.getElementById('print-resume');
  if (print) print.addEventListener('click', function () { window.print(); });


  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------------------------------------------- reveal on scroll */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window && !(reduce && reduce.matches)) {
    root.classList.add('js-reveal');
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ------------------------------------------------------------------
     Hero centrepiece: a drifting 3-D-ish network of services. Nodes have
     depth (near = bigger, brighter, faster parallax; far = small, faint),
     pulses travel along edges like requests, everything glows cyan.
     Cheap: node count capped by area (max 70, ~36 on phones), ~30 fps,
     paused when the tab is hidden or the hero is off screen, one static
     frame under prefers-reduced-motion. */
  var canvas = document.querySelector('.hero-net');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  var W = 0, H = 0, dpr = 1, nodes = [], pulses = [], LINK = 170, glow = null;
  var running = false, visible = true, raf = 0, last = 0;
  var mx = 0, my = 0, tx = 0, ty = 0; // parallax (-1..1)

  function rgb() {
    return getComputedStyle(root).getPropertyValue('--net-rgb').trim() || '34, 211, 238';
  }
  var color = rgb();

  function makeGlow() {
    // pre-rendered glow sprite — far cheaper than shadowBlur per node
    var g = document.createElement('canvas');
    g.width = g.height = 64;
    var c = g.getContext('2d');
    var grd = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(' + color + ',0.9)');
    grd.addColorStop(0.25, 'rgba(' + color + ',0.35)');
    grd.addColorStop(1, 'rgba(' + color + ',0)');
    c.fillStyle = grd; c.fillRect(0, 0, 64, 64);
    glow = g;
  }

  function seed() {
    var rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var small = W < 700;
    LINK = small ? 120 : 175;
    var n = Math.max(20, Math.min(small ? 36 : 70, Math.round((W * H) / 16000)));
    nodes = [];
    var cx = W / 2, cy = H / 2, R = Math.min(W, H) * (small ? 0.62 : 0.5);
    for (var i = 0; i < n; i++) {
      // clustered around the centre, looser toward the edges
      var ang = Math.random() * 6.2832, rad = R * Math.pow(Math.random(), 0.6);
      var z = Math.random(); // 0 far .. 1 near
      nodes.push({
        x: cx + Math.cos(ang) * rad * (W / Math.max(H, 1) > 1 ? 1.5 : 1),
        y: cy + Math.sin(ang) * rad,
        z: z,
        vx: (Math.random() - 0.5) * (0.08 + z * 0.14),
        vy: (Math.random() - 0.5) * (0.08 + z * 0.14),
        r: 1 + z * 2.6,
      });
    }
    pulses = [];
  }

  function pos(a) {
    var k = 8 + a.z * 26; // near nodes move more with the mouse
    return [a.x + mx * k, a.y + my * k];
  }

  function spawnPulse() {
    if (pulses.length > 10) return;
    var a = nodes[(Math.random() * nodes.length) | 0];
    var cand = [];
    for (var i = 0; i < nodes.length; i++) {
      var b = nodes[i];
      if (b !== a && Math.hypot(a.x - b.x, a.y - b.y) < LINK) cand.push(b);
    }
    if (cand.length) pulses.push({ a: a, b: cand[(Math.random() * cand.length) | 0], t: 0, speed: 0.008 + Math.random() * 0.008 });
  }

  function draw(step) {
    ctx.clearRect(0, 0, W, H);
    if (!glow) makeGlow();
    var i, j, a, b, d, pa, pb;
    if (step) {
      mx += (tx - mx) * 0.05 * step; my += (ty - my) * 0.05 * step;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        a.x += a.vx * step; a.y += a.vy * step;
        if (a.x < -40 || a.x > W + 40) a.vx *= -1;
        if (a.y < -40 || a.y > H + 40) a.vy *= -1;
      }
    }
    var P = nodes.map(pos);
    ctx.lineWidth = 1;
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i]; pa = P[i];
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j];
        d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          var depth = (a.z + b.z) / 2;
          pb = P[j];
          ctx.strokeStyle = 'rgba(' + color + ',' + ((0.08 + depth * 0.4) * (1 - d / LINK)).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
        }
      }
    }
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i]; pa = P[i];
      var gs = 8 + a.z * 22;
      ctx.globalAlpha = 0.25 + a.z * 0.6;
      ctx.drawImage(glow, pa[0] - gs / 2, pa[1] - gs / 2, gs, gs);
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(' + color + ',' + (0.35 + a.z * 0.65).toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(pa[0], pa[1], a.r, 0, 6.2832); ctx.fill();
    }
    for (i = pulses.length - 1; i >= 0; i--) {
      var p = pulses[i];
      if (step) p.t += p.speed * step;
      if (p.t >= 1) { pulses.splice(i, 1); continue; }
      pa = pos(p.a); pb = pos(p.b);
      var x = pa[0] + (pb[0] - pa[0]) * p.t, y = pa[1] + (pb[1] - pa[1]) * p.t;
      ctx.drawImage(glow, x - 14, y - 14, 28, 28);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath(); ctx.arc(x, y, 1.6, 0, 6.2832); ctx.fill();
    }
  }

  function frame(now) {
    raf = 0;
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (now - last < 33) return; // ~30 fps is plenty for a slow drift
    var step = last ? Math.min((now - last) / 16.7, 4) : 1;
    last = now;
    if (Math.random() < 0.12) spawnPulse();
    draw(step);
  }

  function update() {
    var should = visible && !document.hidden && !(reduce && reduce.matches);
    if (should && !running) { running = true; last = 0; raf = requestAnimationFrame(frame); }
    else if (!should && running) { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
    if (!should) draw(0); // static frame (reduced motion / paused)
  }

  seed();
  // a few pulses in the still frame so the reduced-motion picture still says "traffic"
  for (var s = 0; s < 6; s++) { spawnPulse(); if (pulses[s]) pulses[s].t = Math.random(); }
  draw(0);
  update();

  document.addEventListener('visibilitychange', update);
  if (reduce && reduce.addEventListener) reduce.addEventListener('change', update);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; update(); }).observe(canvas);
  }
  // subtle mouse parallax — desktop pointers only
  if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', function (e) {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }
  var rt = 0;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { seed(); if (!running) draw(0); }, 200);
  });
  if (toggle) toggle.addEventListener('click', function () { color = rgb(); glow = null; draw(0); });
})();
