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

  /* ------------------------------------------------------------------
     Hero background: a slow drifting network of nodes, with small pulses
     travelling along edges like requests between services.
     Cheap by design: node count capped by area (max 42, fewer on phones),
     ~30 fps, paused when the tab is hidden or the hero is off screen, and
     drawn once, static, under prefers-reduced-motion. */
  var canvas = document.querySelector('.hero-net');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  var W = 0, H = 0, dpr = 1, nodes = [], pulses = [], LINK = 150;
  var running = false, visible = true, raf = 0, last = 0;

  function rgb() {
    return getComputedStyle(root).getPropertyValue('--net-rgb').trim() || '34, 211, 238';
  }
  var color = rgb();

  function seed() {
    var rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    LINK = W < 600 ? 110 : 150;
    var n = Math.max(12, Math.min(42, Math.round((W * H) / 22000)));
    nodes = [];
    for (var i = 0; i < n; i++) {
      // bias nodes to the right so the copy on the left stays clean
      var x = W * (0.25 + 0.75 * Math.pow(Math.random(), 0.7));
      nodes.push({
        x: x, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12,
        r: 1.2 + Math.random() * 1.6,
      });
    }
    pulses = [];
  }

  function spawnPulse() {
    if (pulses.length > 6) return;
    var a = nodes[(Math.random() * nodes.length) | 0];
    var best = null, bd = LINK;
    for (var i = 0; i < nodes.length; i++) {
      var b = nodes[i];
      if (b === a) continue;
      var d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < bd && Math.random() < 0.6) { bd = d; best = b; }
    }
    if (best) pulses.push({ a: a, b: best, t: 0, speed: 0.006 + Math.random() * 0.006 });
  }

  function draw(step) {
    ctx.clearRect(0, 0, W, H);
    var i, j, a, b, d;
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      if (step) {
        a.x += a.vx * step; a.y += a.vy * step;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
      }
    }
    ctx.lineWidth = 1;
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j];
        d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = 'rgba(' + color + ',' + (0.22 * (1 - d / LINK)).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    ctx.fillStyle = 'rgba(' + color + ',0.55)';
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
    }
    for (i = pulses.length - 1; i >= 0; i--) {
      var p = pulses[i];
      if (step) p.t += p.speed * step;
      if (p.t >= 1 || Math.hypot(p.a.x - p.b.x, p.a.y - p.b.y) > LINK) { pulses.splice(i, 1); continue; }
      var x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
      ctx.fillStyle = 'rgba(' + color + ',0.95)';
      ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 6.2832); ctx.fill();
      ctx.fillStyle = 'rgba(' + color + ',0.18)';
      ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.2832); ctx.fill();
    }
  }

  function frame(now) {
    raf = 0;
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (now - last < 33) return; // ~30 fps is plenty for a slow drift
    var step = last ? Math.min((now - last) / 16.7, 4) : 1;
    last = now;
    if (Math.random() < 0.05) spawnPulse();
    draw(step);
  }

  function update() {
    var should = visible && !document.hidden && !(reduce && reduce.matches);
    if (should && !running) { running = true; last = 0; raf = requestAnimationFrame(frame); }
    else if (!should && running) { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
    if (!should) draw(0); // static frame (reduced motion / paused)
  }

  seed();
  draw(0);
  update();

  document.addEventListener('visibilitychange', update);
  if (reduce && reduce.addEventListener) reduce.addEventListener('change', update);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; update(); }).observe(canvas);
  }
  var rt = 0;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { var w = W; seed(); if (Math.abs(w - W) > 1 || !running) draw(0); }, 200);
  });
  if (toggle) toggle.addEventListener('click', function () { color = rgb(); draw(0); });
})();
