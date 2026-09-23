/* Indrico Jowensen — portfolio interactions (no dependencies). */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Theme ---------- */
  var themeBtn = $('.theme-toggle');
  var themeMeta = $('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeBtn) themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#060a13' : '#f4f7fc');
  }
  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    });
  }

  // Follow the OS setting until the visitor picks a theme explicitly.
  var systemLight = window.matchMedia('(prefers-color-scheme: light)');
  var onSystemChange = function (e) {
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
    if (!stored) applyTheme(e.matches ? 'light' : 'dark');
  };
  if (systemLight.addEventListener) systemLight.addEventListener('change', onSystemChange);

  /* ---------- Header: scrolled state + mobile nav ---------- */
  var header = $('.site-header');
  var navToggle = $('.nav-toggle');

  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setNav(open) {
    header.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  navToggle.addEventListener('click', function () { setNav(!header.classList.contains('nav-open')); });
  $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) { setNav(false); navToggle.focus(); }
  });

  /* ---------- Scroll spy ---------- */
  var navLinks = $$('.nav a[href^="#"]');
  var sectionsById = {};
  navLinks.forEach(function (a) {
    var s = document.getElementById(a.getAttribute('href').slice(1));
    if (s) sectionsById[s.id] = a;
  });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        var link = sectionsById[entry.target.id];
        if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(sectionsById).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  /* ---------- Reveal on scroll + count-up ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (!target || reduceMotion.matches) return;
    var start = null;
    var duration = 1200;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        $$('[data-count]', entry.target).forEach(countUp);
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { revealer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Card spotlight ---------- */
  $$('.card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Contact form (Web3Forms) ---------- */
  var form = $('#contact-form');
  var topicSelect = $('#f-topic');

  if (form) {
    var statusEl = $('.form-status', form);
    var submitBtn = $('button[type="submit"]', form);
    var submitLabel = $('.btn-label', submitBtn);

    function setStatus(msg, kind) {
      statusEl.textContent = msg;
      statusEl.className = 'form-status' + (kind ? ' is-' + kind : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('was-validated');

      if (!form.checkValidity()) {
        var firstInvalid = $(':invalid:not(fieldset)', form);
        setStatus('Please fill in your name, a valid email and a short message.', 'error');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var data = new FormData(form);
      var accessKey = String(data.get('access_key') || '');
      if (!accessKey || accessKey.indexOf('YOUR_') === 0) {
        setStatus('The contact form is not configured yet. Please try again later.', 'error');
        return;
      }

      // Honeypot: bots tick the hidden checkbox; humans never see it.
      if (data.get('botcheck')) {
        form.reset();
        setStatus("Thanks! Your message is on its way.", 'success');
        return;
      }

      var topicLabel = topicSelect ? topicSelect.options[topicSelect.selectedIndex].text : 'Message';
      var payload = {
        access_key: accessKey,
        subject: 'Portfolio: ' + topicLabel + ' from ' + String(data.get('name')).trim(),
        from_name: String(data.get('from_name') || 'Portfolio contact form'),
        name: String(data.get('name')).trim(),
        email: String(data.get('email')).trim(),
        company: String(data.get('company') || '').trim() || '-',
        topic: topicLabel,
        message: String(data.get('message')).trim(),
        botcheck: false
      };

      form.classList.add('is-sending');
      submitBtn.disabled = true;
      submitLabel.textContent = 'Sending…';
      setStatus('', null);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json().catch(function () { return { success: false }; }); })
        .then(function (json) {
          if (json && json.success) {
            form.reset();
            form.classList.remove('was-validated');
            setStatus("Thanks! Your message is on its way. I'll get back to you soon.", 'success');
          } else {
            setStatus((json && json.message) || 'Something went wrong. Please try again in a moment.', 'error');
          }
        })
        .catch(function () {
          setStatus('Network error. Please check your connection and try again.', 'error');
        })
        .then(function () {
          form.classList.remove('is-sending');
          submitBtn.disabled = false;
          submitLabel.textContent = 'Send message';
        });
    });
  }

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Hero: delivery pipeline simulation ---------- */
  initPipeline();

  function initPipeline() {
    var card = $('.pipe-card');
    var svg = card && $('svg.pipe', card);
    var firstWire = svg && $('#w-in', svg);
    if (!firstWire || typeof firstWire.getTotalLength !== 'function') return;

    var SVGNS = 'http://www.w3.org/2000/svg';
    var SPEED = 0.17;           // px of path per ms
    var MAX_ACTIVE = 18;
    var FAIL_RATE = 0.16;       // share of WhatsApp sends that fail and fall back to SMS

    var dotsLayer = $('.pipe-dots', svg);
    var wire = function (id) { return $('#' + id, svg); };
    var paths = {
      ingress: wire('w-in'),
      toWorker: [wire('w-q0'), wire('w-q1'), wire('w-q2')],
      toChannel: [wire('w-c0'), wire('w-c1'), wire('w-c2')],
      fallback: wire('w-fb')
    };
    var lengths = new Map();
    [paths.ingress, paths.fallback].concat(paths.toWorker, paths.toChannel).forEach(function (p) {
      lengths.set(p, p.getTotalLength());
    });

    var ingressNode = $('.node-in', svg);
    var slots = $$('.q-slot', svg);           // bottom → top
    var workers = $$('.worker', svg);
    var channels = $$('.channel', svg);
    var busy = [0, 0, 0];
    var CH = ['wa', 'sms', 'mail'];

    var logEl = $('.pipe-log', card);
    var statEls = {
      delivered: $('[data-stat="delivered"]', card),
      fallback: $('[data-stat="fallback"]', card),
      queued: $('[data-stat="queued"]', card)
    };
    var stats = { delivered: 0, fallback: 0, queued: 0 };

    var messages = [];
    var running = false;
    var inView = false;
    var started = false;
    var lastTs = 0;
    var clock = 0;
    var spawnIn = 0;
    var seq = 0x7a10;

    function rand(min, max) { return min + Math.random() * (max - min); }

    function flash(node, cls, ms) {
      node.classList.add(cls);
      setTimeout(function () { node.classList.remove(cls); }, ms || 450);
    }

    function renderStats() {
      statEls.delivered.textContent = stats.delivered.toLocaleString('en-US');
      statEls.fallback.textContent = String(stats.fallback);
      statEls.queued.textContent = String(stats.queued);
      slots.forEach(function (s, i) { s.classList.toggle('on', i < stats.queued); });
    }

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function log(ch, id, text, kind) {
      var d = new Date();
      var li = document.createElement('li');
      li.className = 'is-new';
      [
        ['lg-t', pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())],
        ['lg-c', CH[ch]],
        ['lg-id', id],
        ['lg-s ' + kind, text]
      ].forEach(function (part) {
        var span = document.createElement('span');
        span.className = part[0];
        span.textContent = part[1];
        li.appendChild(span);
      });
      logEl.insertBefore(li, logEl.firstChild);
      while (logEl.children.length > 5) logEl.removeChild(logEl.lastChild);
    }

    function seconds(ms) { return (ms / 1000).toFixed(2) + 's'; }

    function spawn() {
      var r = Math.random();
      var ch = r < 0.55 ? 0 : r < 0.8 ? 1 : 2;
      var fails = ch === 0 && Math.random() < FAIL_RATE;
      var dot = document.createElementNS(SVGNS, 'circle');
      dot.setAttribute('r', '4');
      dot.setAttribute('class', 'dot');
      dot.style.opacity = '0';
      dotsLayer.appendChild(dot);

      var m = { id: 'msg_' + (seq++).toString(16), ch: ch, born: clock, dot: dot, i: 0, steps: [] };

      m.steps.push({ type: 'move', path: paths.ingress, enter: function () { flash(ingressNode, 'is-hit', 250); } });
      m.steps.push({
        type: 'wait', ms: rand(250, 1100),
        enter: function () { stats.queued++; renderStats(); },
        exit: function () { stats.queued--; renderStats(); }
      });
      m.steps.push({ type: 'move', path: paths.toWorker[ch] });
      m.steps.push({
        type: 'wait', ms: rand(140, 420),
        enter: function () { busy[ch]++; workers[ch].classList.add('is-busy'); },
        exit: function () { if (--busy[ch] <= 0) { busy[ch] = 0; workers[ch].classList.remove('is-busy'); } }
      });
      m.steps.push({ type: 'move', path: paths.toChannel[ch] });

      if (fails) {
        m.steps.push({
          type: 'wait', ms: 260,
          enter: function () {
            flash(channels[0], 'is-fail', 600);
            stats.fallback++; renderStats();
            log(0, m.id, 'failed → rerouting to sms', 'warn');
          }
        });
        m.steps.push({ type: 'move', path: paths.fallback, amber: true });
        m.steps.push({
          type: 'wait', ms: 0,
          enter: function () {
            flash(channels[1], 'is-hit');
            stats.delivered++; renderStats();
            log(1, m.id, 'delivered via fallback ' + seconds(clock - m.born), 'ok');
          }
        });
      } else {
        m.steps.push({
          type: 'wait', ms: 0,
          enter: function () {
            flash(channels[ch], 'is-hit');
            stats.delivered++; renderStats();
            log(ch, m.id, 'delivered ' + (ch === 0 ? '✓✓ ' : '✓ ') + seconds(clock - m.born), 'ok');
          }
        });
      }
      messages.push(m);
    }

    // Advance one message by dt ms; returns true once it has finished all steps.
    function advance(m, dt) {
      while (m.i < m.steps.length) {
        var s = m.steps[m.i];
        if (!s.started) {
          s.started = true;
          s.elapsed = 0;
          s.duration = s.type === 'move' ? lengths.get(s.path) / SPEED : s.ms;
          if (s.enter) s.enter();
          if (s.type === 'move') {
            m.dot.style.opacity = '1';
            m.dot.setAttribute('class', s.amber ? 'dot dot-amber' : 'dot');
          } else {
            m.dot.style.opacity = '0';
          }
        }
        var used = Math.min(dt, s.duration - s.elapsed);
        s.elapsed += used;
        dt -= used;
        if (s.type === 'move') {
          var len = lengths.get(s.path);
          var pt = s.path.getPointAtLength(len * Math.min(1, s.elapsed / s.duration));
          m.dot.setAttribute('cx', pt.x.toFixed(1));
          m.dot.setAttribute('cy', pt.y.toFixed(1));
        }
        if (s.elapsed >= s.duration) {
          if (s.exit) s.exit();
          m.i++;
        } else {
          return false;
        }
        if (dt <= 0 && m.i < m.steps.length && m.steps[m.i].type === 'move') return false;
      }
      return true;
    }

    function frame(ts) {
      if (!running) return;
      var dt = lastTs ? Math.min(64, ts - lastTs) : 16;
      lastTs = ts;
      clock += dt;

      spawnIn -= dt;
      if (spawnIn <= 0 && messages.length < MAX_ACTIVE) {
        spawn();
        spawnIn = rand(260, 620);
      }

      messages = messages.filter(function (m) {
        var done = advance(m, dt);
        if (done) m.dot.parentNode && m.dot.parentNode.removeChild(m.dot);
        return !done;
      });

      requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduceMotion.matches || document.hidden || !inView) return;
      if (!started) {
        started = true;
        // Replace the static preview dots with live ones.
        while (dotsLayer.firstChild) dotsLayer.removeChild(dotsLayer.firstChild);
        slots.forEach(function (s) { s.classList.remove('on'); });
        renderStats();
      }
      running = true;
      lastTs = 0;
      requestAnimationFrame(frame);
    }

    function stop() { running = false; }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) start(); else stop();
      }, { threshold: 0.15 }).observe(card);
    } else {
      inView = true;
      start();
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    var onMotionChange = function () { if (reduceMotion.matches) stop(); else start(); };
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', onMotionChange);
  }
})();
