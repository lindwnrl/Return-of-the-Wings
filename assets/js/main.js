/* The Return of the Wings — interactions
   Vanilla ES2020, no dependencies. Loaded with `defer`. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- nav ---- */
  var menuBtn = document.getElementById('menuBtn');
  var drawer = document.getElementById('drawer');

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', function () {
      var open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      drawer.hidden = open;
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menuBtn.setAttribute('aria-expanded', 'false');
        drawer.hidden = true;
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !drawer.hidden) {
        menuBtn.setAttribute('aria-expanded', 'false');
        drawer.hidden = true;
        menuBtn.focus();
      }
    });
  }

  /* --------------------------------------------------------- case lighting */
  var cases = Array.prototype.slice.call(document.querySelectorAll('.case'));
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  function light(el) {
    el.classList.add('is-lit');
    var inner = el.querySelectorAll('.reveal');
    for (var i = 0; i < inner.length; i++) inner[i].classList.add('is-lit');
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    cases.forEach(light);
  } else {
    var litObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          light(entry.target);
          litObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    cases.forEach(function (c) { litObserver.observe(c); });

    // Reveals that are not inside a case still need to appear.
    var soloReveals = reveals.filter(function (r) { return !r.closest('.case'); });
    if (soloReveals.length) {
      var soloObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-lit');
            soloObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
      soloReveals.forEach(function (r) { soloObserver.observe(r); });
    }
  }

  /* ------------------------------------------------- scroll spy + progress */
  var railLinks = Array.prototype.slice.call(document.querySelectorAll('.rail a'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var progressBar = document.getElementById('progressBar');

  var targets = railLinks.map(function (link) {
    var id = link.getAttribute('href').slice(1);
    return { id: id, el: document.getElementById(id), rail: link };
  }).filter(function (t) { return t.el; });

  function setActive(id) {
    railLinks.forEach(function (l) {
      l.setAttribute('aria-current', l.getAttribute('href') === '#' + id ? 'true' : 'false');
    });
    navLinks.forEach(function (l) {
      if (l.getAttribute('href') === '#' + id) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var mid = window.innerHeight * 0.34;
      var active = targets.length ? targets[0].id : '';
      for (var i = 0; i < targets.length; i++) {
        var box = targets[i].el.getBoundingClientRect();
        if (box.top <= mid) active = targets[i].id;
      }
      setActive(active);

      if (progressBar) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        progressBar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ------------------------------------------------------------ life cycle */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.cycle__tab'));

  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !selected;
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { selectTab(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(index + 1) % tabs.length];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(index - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* ------------------------------------------------------ habitat simulation */
  /* FR-08: four switches, all starting inactive. Each state carries a word,
     not just a colour, and the plan drawing only gains a layer when its
     element is on. Completing all four opens the dialog once. */
  var STORE = {
    read: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (err) { return fallback; }
    },
    write: function (key, value) {
      try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (err) { /* private mode */ }
    }
  };

  var HAB_KEY = 'rotw.habitat.v1';
  var REWARD_KEY = 'rotw.rewards.v1';

  var switches = Array.prototype.slice.call(document.querySelectorAll('.switch[data-target]'));
  var planLayers = Array.prototype.slice.call(document.querySelectorAll('.plan svg .layer'));
  var habProgress = document.getElementById('habProgress');
  var planHint = document.getElementById('planHint');
  var habitatDialog = document.getElementById('habitatDialog');

  var HAB_ON = {
    inang: 'Tanaman inang tersedia: daun untuk telur dan ulat.',
    nektar: 'Bunga nektar tersedia: bahan bakar untuk kupu-kupu dewasa.',
    perlindungan: 'Naungan dan semak tersedia: tempat berlindung dari angin dan hujan.',
    koridor: 'Koridor tersedia: petak-petak hijau kini saling terhubung.'
  };
  var HAB_OFF = {
    inang: 'Tanpa tanaman inang, tidak ada daun untuk telur dan ulat. Generasi berikutnya berhenti di sini.',
    nektar: 'Tanpa bunga penghasil nektar, kupu-kupu dewasa kehabisan bahan bakar untuk terbang dan kawin.',
    perlindungan: 'Tanpa vegetasi pelindung, kupu-kupu terbuka pada angin, hujan, dan pemangsa.',
    koridor: 'Ruang hijau yang terpisah membuat kupu-kupu sulit berpindah di antara petak-petak habitat.'
  };

  function habState() {
    var on = {};
    switches.forEach(function (sw) {
      on[sw.getAttribute('data-target')] = sw.getAttribute('aria-checked') === 'true';
    });
    return on;
  }

  function paintHabitat(announce) {
    var on = habState();
    var count = 0;

    switches.forEach(function (sw) {
      var name = sw.getAttribute('data-target');
      var isOn = on[name];
      if (isOn) count++;

      sw.setAttribute('aria-checked', String(isOn));
      var stateWord = sw.querySelector('.switch__state');
      if (stateWord) stateWord.textContent = isOn ? 'Aktif' : 'Nonaktif';

      var item = sw.closest('.hab__item');
      if (item) item.setAttribute('data-on', String(isOn));

      var note = document.querySelector('.hab__note[data-note="' + name + '"]');
      if (note) note.textContent = isOn ? HAB_ON[name] : HAB_OFF[name];

      planLayers.forEach(function (layer) {
        if (layer.getAttribute('data-layer') === name) {
          layer.classList.toggle('is-on', isOn);
          layer.classList.toggle('is-off', !isOn);
        }
      });
    });

    if (habProgress) {
      habProgress.innerHTML = '<b>' + count + '</b> dari ' + switches.length + ' elemen aktif' +
        (count === switches.length ? ' · simulasi lengkap' : '');
    }
    if (planHint) {
      planHint.textContent = count === 0
        ? 'Halaman ini masih kosong. Aktifkan elemen di samping untuk mengisinya.'
        : (count === switches.length
          ? 'Keempat elemen saling menopang. Inilah model halaman yang lebih ramah kupu-kupu.'
          : count + ' dari 4 elemen terisi. Halaman ini belum lengkap.');
    }

    if (count === switches.length) completeHabitat(announce);
    return count;
  }

  function completeHabitat(announce) {
    var rewards = STORE.read(REWARD_KEY, {});
    var firstTime = !rewards.habitat;
    if (firstTime) {
      rewards.habitat = true;
      STORE.write(REWARD_KEY, rewards);
      paintRewards();
    }
    STORE.write(HAB_KEY, habState());

    if (announce) {
      var rewardLine = document.getElementById('habitatReward');
      if (rewardLine) {
        rewardLine.hidden = !firstTime;
        if (firstTime) {
          rewardLine.innerHTML = '<b>Hadiah terbuka:</b> Rumah lengkap. Lihat daftar hadiah di bagian Aksi Nyata.';
        }
      }

      // The success message is content, not decoration: it appears every time
      // the habitat reaches completion, with or without motion.
      if (habitatDialog && !habitatDialog.open) {
        if (typeof habitatDialog.showModal === 'function') habitatDialog.showModal();
        else habitatDialog.setAttribute('open', '');
      }
      // The butterflies must stay visible above the dialog and its backdrop.
      raiseWings();
    }
  }

  if (switches.length) {
    var savedHab = STORE.read(HAB_KEY, {});
    switches.forEach(function (sw) {
      var name = sw.getAttribute('data-target');
      sw.setAttribute('aria-checked', savedHab[name] ? 'true' : 'false');
      sw.addEventListener('click', function () {
        var next = sw.getAttribute('aria-checked') !== 'true';
        sw.setAttribute('aria-checked', String(next));
        paintHabitat(true);
      });
    });
    paintHabitat(false);
  }

  if (habitatDialog) {
    var habitatClose = document.getElementById('habitatClose');
    if (habitatClose) habitatClose.addEventListener('click', function () { habitatDialog.close(); });
    habitatDialog.addEventListener('click', function (e) {
      if (e.target === habitatDialog) habitatDialog.close();
    });
    habitatDialog.addEventListener('close', function () {
      var trigger = document.querySelector('.switch[data-target="koridor"]');
      if (trigger) trigger.focus({ preventScroll: true });
    });
  }

  /* ------------------------------------------------------- reward animations */
  /* Both rewards are DOM-only, pointer-events:none, and skip entirely under
     prefers-reduced-motion. Nothing is fetched. */
  var wingsRoot = document.getElementById('wings');

  /* A four-wing silhouette with a body, drawn once and reused. Two tones read
     as a wing pattern at 24–48px where a single blob does not. */
  function wingSvg(size, ink, accent) {
    return '<svg viewBox="0 0 32 32" width="' + size + '" height="' + size + '" aria-hidden="true">' +
      '<g fill="' + accent + '">' +
      '<path d="M14.5 14C10 6 4 3.5 2.5 6.5 1 9.5 5 15 12 16.5Z"/>' +
      '<path d="M17.5 14C22 6 28 3.5 29.5 6.5 31 9.5 27 15 20 16.5Z"/>' +
      '</g>' +
      '<g fill="' + ink + '">' +
      '<path d="M14.5 17C10 20 5.5 25 4 28c3 .5 7.5-2 10.5-7Z"/>' +
      '<path d="M17.5 17C22 20 26.5 25 28 28c-3 .5-7.5-2-10.5-7Z"/>' +
      '</g>' +
      '<path d="M16 8v17" stroke="' + ink + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M15 8.5 12 4M17 8.5 20 4" stroke="' + ink + '" stroke-width="1.2" stroke-linecap="round" fill="none"/>' +
      '</svg>';
  }

  function flyAcross(kind) {
    if (!wingsRoot || reduceMotion) return;

    var count = kind === 'bloom' ? 18 : 3;
    var made = [];

    for (var i = 0; i < count; i++) {
      var el = document.createElement('div');
      el.innerHTML = wingSvg(
        kind === 'bloom' ? 30 + Math.random() * 30 : 34 + Math.random() * 16,
        '#183D2B',
        i % 3 === 0 ? '#B8D99A' : '#E9A94D'
      );
      var svg = el.firstChild;

      if (kind === 'cross') {
        svg.style.left = '-8%';
        svg.style.top = (18 + Math.random() * 62) + '%';
      } else {
        svg.style.left = (6 + Math.random() * 88) + '%';
        svg.style.top = '102%';
      }
      wingsRoot.appendChild(svg);
      made.push(svg);
    }

    made.forEach(function (svg, index) {
      var drift = (Math.random() - 0.5);
      var rise = kind === 'bloom' ? 70 + Math.random() * 40 : 6 + Math.random() * 8;
      var sway = drift * (kind === 'bloom' ? 26 : 10);
      var delay = index * (kind === 'bloom' ? 70 : 120);
      var duration = kind === 'bloom' ? 2600 + Math.random() * 1400 : 2400 + Math.random() * 700;

      var anim = svg.animate([
        { transform: 'translate3d(0,0,0) rotate(' + (drift * 22) + 'deg) scale(0.6)', opacity: 0 },
        { opacity: 1, offset: 0.12 },
        { transform: 'translate3d(' + sway + 'vw, ' + (-rise) + 'vh, 0) rotate(' + (drift * 40) + 'deg) scale(1)', opacity: 1, offset: 0.7 },
        { transform: 'translate3d(' + (sway * 1.5) + 'vw, ' + (-rise * 1.35) + 'vh, 0) rotate(' + (drift * 55) + 'deg) scale(0.9)', opacity: 0 }
      ], {
        duration: duration,
        delay: delay,
        easing: 'cubic-bezier(0.22, 0.7, 0.3, 1)',
        fill: 'both'
      });

      anim.onfinish = function () {
        if (svg.parentNode) svg.parentNode.removeChild(svg);
      };
    });
  }

  /* ------------------------------------------------- flapping butterflies */
  /* One small engine drives both the roaming butterflies (reward "Rumah
     lengkap") and the butterfly cursor. Each butterfly is a div holding the
     four-wing SVG; the wing beat is a scaleX on each wing pair around the
     body axis, set every frame, so the beat rate can change smoothly. */
  var wingsReady = false;
  var rafId = 0;
  var lastFrame = 0;
  var swarm = [];
  var lilyBf = [];
  var lilyShown = false;
  var lilyReleased = false;
  var cursorBf = null;
  var pointer = { x: 0, y: 0, px: 0, py: 0, seen: false, hover: false, down: false, tilt: 0, rate: 1.4, depth: 0.55, phase: 0 };
  var HOVERABLE = 'a, button, label, input, select, textarea, summary, [role="switch"], [role="tab"]';
  var SWARM_COLORS = [['#183D2B', '#E9A94D'], ['#183D2B', '#B8D99A'], ['#3C6A44', '#E9A94D']];

  // Moves #wings to the top of the top layer (above an open modal dialog).
  function raiseWings() {
    if (!wingsRoot || typeof wingsRoot.showPopover !== 'function') return;
    try {
      if (wingsRoot.matches(':popover-open')) wingsRoot.hidePopover();
      wingsRoot.showPopover();
    } catch (err) { /* unsupported: #wings stays a plain fixed layer */ }
  }
  raiseWings();

  function butterflyMarkup(ink, accent) {
    var edge = ' stroke="#F3F0DF" stroke-width="0.9" stroke-linejoin="round" paint-order="stroke"';
    return '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
      '<g class="bf__hind" fill="' + ink + '"' + edge + '>' +
      '<path d="M14.5 17C10 20 5.5 25 4 28c3 .5 7.5-2 10.5-7Z"/>' +
      '<path d="M17.5 17C22 20 26.5 25 28 28c-3 .5-7.5-2-10.5-7Z"/>' +
      '</g>' +
      '<g class="bf__fore" fill="' + accent + '"' + edge + '>' +
      '<path d="M14.5 14C10 6 4 3.5 2.5 6.5 1 9.5 5 15 12 16.5Z"/>' +
      '<path d="M17.5 14C22 6 28 3.5 29.5 6.5 31 9.5 27 15 20 16.5Z"/>' +
      '</g>' +
      '<path d="M16 8v17" stroke="#F3F0DF" stroke-width="3.6" stroke-linecap="round"/>' +
      '<path d="M16 8v17" stroke="' + ink + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M15 8.5 12 4M17 8.5 20 4" stroke="' + ink + '" stroke-width="1.2" stroke-linecap="round" fill="none"/>' +
      '</svg>';
  }

  /* The secret blue butterfly: a swallowtail with near-black forewings, iridescent
     blue hindwings edged with white spots, and two tails (after the reference
     photo). Drawn as the left half and mirrored; viewBox is 64 wide, body at x=32. */
  var blueUid = 0;
  function blueMarkup() {
    var id = 'bb' + (++blueUid);
    var edge = ' stroke="#dff1ff" stroke-opacity="0.5" stroke-width="0.5" stroke-linejoin="round"';
    function both(inner) { return inner + '<g transform="translate(64 0) scale(-1 1)">' + inner + '</g>'; }
    var fore = '<path d="M31 28C27 19 16 11 6 10C3 13 3 22 8 29C14 34 24 33 31 32Z" fill="url(#' + id + 'f)"' + edge + '/>' +
      '<path d="M31 29C24 24 15 19 7 14M31 30C23 28 14 26 8 25" stroke="#8fa4ff" stroke-opacity="0.28" stroke-width="0.5" fill="none"/>' +
      '<circle cx="6.6" cy="15.5" r="0.8" fill="#cfe9ff" opacity="0.8"/><circle cx="5.7" cy="20" r="0.8" fill="#cfe9ff" opacity="0.8"/><circle cx="7.2" cy="25.4" r="0.8" fill="#cfe9ff" opacity="0.8"/>';
    var hind = '<path d="M17 51C15 56 14 60 14 62C19 60 23 56 25 51Z" fill="#0d0f33"' + edge + '/>' +
      '<path d="M31 31C24 32 14 33 9 38C7 44 11 50 18 53C23 55 28 50 31 43Z" fill="url(#' + id + 'h)"' + edge + '/>' +
      '<path d="M31 33C23 37 15 41 10 43M31 36C25 42 20 47 16 51M31 40C28 45 25 49 22 53" stroke="#06265a" stroke-opacity="0.45" stroke-width="0.5" fill="none"/>' +
      '<g fill="#fff" opacity="0.95"><circle cx="11" cy="41" r="1.15"/><circle cx="11.4" cy="46" r="1.15"/><circle cx="14.6" cy="50" r="1.15"/><circle cx="19.6" cy="52" r="1.1"/></g>';
    return '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="' + id + 'f" gradientUnits="userSpaceOnUse" x1="31" y1="30" x2="6" y2="12"><stop offset="0" stop-color="#3b4296"/><stop offset="0.5" stop-color="#1d1b5c"/><stop offset="1" stop-color="#0f0e2f"/></linearGradient>' +
      '<linearGradient id="' + id + 'h" gradientUnits="userSpaceOnUse" x1="31" y1="34" x2="9" y2="50"><stop offset="0" stop-color="#52d0f5"/><stop offset="0.55" stop-color="#1f7ccc"/><stop offset="1" stop-color="#14307c"/></linearGradient></defs>' +
      '<g class="bf__hind">' + both(hind) + '</g><g class="bf__fore">' + both(fore) + '</g>' +
      '<path d="M31.2 22C29 17 26 13 22.5 10.5M32.8 22C35 17 38 13 41.5 10.5" stroke="#0a0a18" stroke-width="0.6" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="32" cy="34" rx="1.7" ry="10" fill="#0a0a18"/><circle cx="32" cy="23.5" r="2.1" fill="#0a0a18"/>' +
      '</svg>';
  }

  function makeButterfly(size, ink, accent, cls, kind) {
    var el = document.createElement('div');
    el.className = 'bf ' + cls;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.innerHTML = kind === 'blue' ? blueMarkup() : butterflyMarkup(ink, accent);
    wingsRoot.appendChild(el);
    return { el: el, size: size, cx: kind === 'blue' ? 32 : 16, kind: kind || 'classic',
      fore: el.querySelector('.bf__fore'), hind: el.querySelector('.bf__hind') };
  }

  // phase: wing-beat angle in radians. depth: 0 = wings held open, 1 = full beat.
  // The hind wings trail the fore wings a little, which reads as a real flap.
  function flapWings(b, phase, depth) {
    var fore = 0.5 + 0.5 * Math.cos(phase);
    var hind = 0.5 + 0.5 * Math.cos(phase - 0.8);
    var cx = b.cx || 16;
    b.fore.setAttribute('transform', 'translate(' + cx + ' 0) scale(' + (1 - 0.85 * depth * (1 - fore)).toFixed(3) + ' 1) translate(-' + cx + ' 0)');
    b.hind.setAttribute('transform', 'translate(' + cx + ' 0) scale(' + (1 - 0.8 * depth * (1 - hind)).toFixed(3) + ' 1) translate(-' + cx + ' 0)');
  }

  function angleDiff(a, b) {
    var d = a - b;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  }

  /* ---- roaming butterflies ---- */
  /* Positions are page coordinates (x across, y down the whole document), so
     scrolling moves the page past them instead of dragging them along with
     the screen. Each one patrols a band of the page around its own home
     height; the count scales with the page length so every stretch of the
     page has a few. */
  var mouse = { x: 0, y: 0, has: false };
  function onSwarmMouse(e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.has = true;
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function startSwarm() {
    if (!wingsRoot || reduceMotion || swarm.length) return;
    var w = window.innerWidth, vh = window.innerHeight;
    var docH = Math.max(document.documentElement.scrollHeight, vh);
    var sy = window.scrollY;
    var n = w < 700 ? clamp(Math.round(docH / 700), 5, 12) : clamp(Math.round(docH / 450), 8, 20);
    var entering = Math.min(n, w < 700 ? 3 : 5);

    for (var i = 0; i < n; i++) {
      var c = SWARM_COLORS[i % SWARM_COLORS.length];
      var b = makeButterfly(30 + Math.random() * 16, c[0], c[1], 'bf--swarm');
      if (i < entering) {
        // Fly in from the sides of the screen the person is looking at.
        var fromLeft = i % 2 === 0;
        b.x = fromLeft ? -50 : w + 50;
        b.y = sy + vh * (0.12 + Math.random() * 0.76);
        b.heading = fromLeft ? 0 : Math.PI;
      } else {
        // The rest are already out over the rest of the page.
        b.x = 60 + Math.random() * (w - 120);
        b.y = 120 + Math.random() * Math.max(1, docH - 240);
        b.heading = Math.random() * Math.PI * 2;
      }
      b.home = b.y;
      b.band = 380 + Math.random() * 260;
      b.rot = b.heading + Math.PI / 2;
      b.base = 60 + Math.random() * 40;
      b.v = b.base;
      b.t = Math.random() * 10;
      b.p1 = Math.random() * 6.28; b.p2 = Math.random() * 6.28;
      b.w1 = 0.7 + Math.random() * 0.6; b.w2 = 1.7 + Math.random() * 0.9;
      b.phase = Math.random() * 6.28;
      b.mode = 'cruise';
      b.modeLeft = 1 + Math.random() * 3;
      b.wait = i < entering ? i * 0.45 : 0;
      b.hidden = true;
      b.el.style.visibility = 'hidden';
      swarm.push(b);
    }
    if (!STORE.read(REWARD_KEY, {}).blue) {
      // The secret: slower, never shy of the pointer, somewhere along the page.
      var sb = makeButterfly(58, '', '', 'bf--swarm bf--secret', 'blue');
      sb.secret = true;
      sb.x = 80 + Math.random() * (w - 160);
      sb.y = 300 + Math.random() * Math.max(1, docH - 600);
      sb.heading = Math.random() * Math.PI * 2;
      sb.home = sb.y; sb.band = 800;
      sb.rot = sb.heading + Math.PI / 2;
      sb.base = 44; sb.v = 44;
      sb.t = Math.random() * 10;
      sb.p1 = Math.random() * 6.28; sb.p2 = Math.random() * 6.28;
      sb.w1 = 0.6; sb.w2 = 1.5;
      sb.phase = 0; sb.mode = 'cruise'; sb.modeLeft = 2; sb.wait = 0;
      sb.hidden = true; sb.el.style.visibility = 'hidden';
      sb.el.addEventListener('click', function () { catchSecret(sb); });
      swarm.push(sb);
    }
    document.addEventListener('pointermove', onSwarmMouse, { passive: true });
    ensureLoop();
  }

  function catchSecret(b) {
    var i = swarm.indexOf(b);
    if (i < 0) return;
    swarm.splice(i, 1);
    b.el.classList.add('is-leaving');
    window.setTimeout(function () { if (b.el.parentNode) b.el.parentNode.removeChild(b.el); }, 650);

    var rewards = STORE.read(REWARD_KEY, {});
    rewards.blue = true; rewards.cursor = true; rewards.cursorOn = true; rewards.cursorStyle = 'blue';
    STORE.write(REWARD_KEY, rewards);
    paintRewards();
    flyAcross('bloom');
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var note = document.getElementById('blueCursorNote');
    if (note) {
      note.innerHTML = fine
        ? '<b>Hadiah terbuka:</b> kursor kupu-kupu biru. Pilih Mati, Klasik, atau Biru di daftar Hadiah, bagian Aksi Nyata.'
        : '<b>Hadiah terbuka:</b> kursor kupu-kupu biru. Kursor ini bisa dipakai di perangkat dengan mouse.';
    }
    var dlg = document.getElementById('blueDialog');
    if (dlg && !dlg.open) {
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      raiseWings();
      if (wingsRoot) wingsRoot.classList.add('is-quiet');
    }
  }

  function stopSwarm() {
    document.removeEventListener('pointermove', onSwarmMouse);
    var gone = swarm;
    swarm = [];
    gone.forEach(function (b) {
      b.el.classList.add('is-leaving');
      window.setTimeout(function () { if (b.el.parentNode) b.el.parentNode.removeChild(b.el); }, 650);
    });
  }

  function stepSwarm(dt) {
    var all = swarm.concat(lilyBf);
    if (!all.length) return;
    var w = window.innerWidth, vh = window.innerHeight;
    var docH = Math.max(document.documentElement.scrollHeight, vh);
    var sy = window.scrollY;
    var m = 50;

    all.forEach(function (b) {
      if (b.wait > 0) { b.wait -= dt; return; }
      b.t += dt;

      // Behaviour: mostly cruising, with quick darts and slow glides.
      b.modeLeft -= dt;
      if (b.modeLeft <= 0) {
        var roll = Math.random();
        if (!b.secret && roll < 0.3) { b.mode = 'dart'; b.modeLeft = 0.5 + Math.random() * 0.5; b.heading += (Math.random() - 0.5) * 2.4; }
        else if (roll < 0.55) { b.mode = 'glide'; b.modeLeft = 1 + Math.random() * 1.2; }
        else { b.mode = 'cruise'; b.modeLeft = 2 + Math.random() * 3; }
      }

      var ymin = Math.max(m, b.home - b.band), ymax = Math.min(docH - m, b.home + b.band);
      var outside = b.x < m || b.x > w - m || b.y < ymin || b.y > ymax;
      var wander = Math.sin(b.t * b.w1 + b.p1) * 1.7 + Math.sin(b.t * b.w2 + b.p2) * 1.1;
      b.heading += wander * dt * (outside ? 0.25 : (b.mode === 'dart' ? 0.5 : 1));
      if (outside) {
        var want = Math.atan2(b.home - b.y, w / 2 - b.x);
        b.heading += angleDiff(want, b.heading) * Math.min(1, 2.4 * dt);
      }

      // Shy of the pointer: veer away and speed up when it comes close.
      var boost = 1;
      if (mouse.has && !b.secret) {
        var mx = b.x - mouse.x, my = (b.y - sy) - mouse.y;
        var dist = Math.sqrt(mx * mx + my * my);
        if (dist < 150) {
          b.heading += angleDiff(Math.atan2(my, mx), b.heading) * Math.min(1, 5 * dt);
          boost = 1.8;
        }
      }

      var target = b.base * (b.mode === 'dart' ? 2.6 : (b.mode === 'glide' ? 0.45 : 0.85 + 0.25 * Math.sin(b.t * 1.7 + b.p1))) * boost;
      b.v += (target - b.v) * Math.min(1, 4 * dt);
      b.x += Math.cos(b.heading) * b.v * dt;
      b.y += Math.sin(b.heading) * b.v * dt;

      b.rot += angleDiff(b.heading + Math.PI / 2, b.rot) * Math.min(1, 6 * dt);

      var rate = b.mode === 'dart' ? 7 : (b.mode === 'glide' ? 1.6 : 3.4 + 1.1 * Math.sin(b.t * 1.3 + b.p2));
      var depth = b.mode === 'glide' ? 0.35 : (b.mode === 'dart' ? 1 : 0.75 + 0.25 * Math.sin(b.t * 0.9 + b.p1));
      b.phase += Math.PI * 2 * rate * dt;

      // Only butterflies currently on screen cost any DOM work.
      var screenY = b.y - sy;
      var visible = b.x > -80 && b.x < w + 80 && screenY > -80 && screenY < vh + 80;
      if (!visible) {
        if (!b.hidden) { b.el.style.visibility = 'hidden'; b.hidden = true; }
        return;
      }
      if (b.hidden) { b.el.style.visibility = ''; b.hidden = false; }
      flapWings(b, b.phase, depth);
      var bob = Math.sin(b.t * 5.5 + b.p2) * 5;
      b.el.style.transform = 'translate(' + (b.x - b.size / 2).toFixed(1) + 'px,' +
        (screenY - b.size / 2 + bob).toFixed(1) + 'px) rotate(' + b.rot.toFixed(3) + 'rad)';
    });
  }

  /* ---- butterfly cursor ---- */
  function onPointerMove(e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    pointer.x = e.clientX; pointer.y = e.clientY;
    pointer.hover = !!(e.target && e.target.closest && e.target.closest(HOVERABLE));
    if (!pointer.seen) {
      pointer.seen = true;
      pointer.px = pointer.x; pointer.py = pointer.y;
      if (cursorBf) cursorBf.el.classList.add('is-visible');
    }
  }
  function onPointerDown() { pointer.down = true; }
  function onPointerUp() { pointer.down = false; }
  function onPointerLeave() {
    pointer.seen = false;
    if (cursorBf) cursorBf.el.classList.remove('is-visible');
  }

  function startCursor(style) {
    if (!wingsRoot || cursorBf) return;
    var blue = style === 'blue';
    cursorBf = makeButterfly(blue ? 44 : 34, '#183D2B', '#E9A94D', 'bf--cursor', blue ? 'blue' : 'classic');
    cursorBf.el.style.transform = 'translate(-200px,-200px)';
    flapWings(cursorBf, 0, 0);
    // Switching style mid-session: keep showing at the current pointer position.
    if (pointer.x > 0 || pointer.y > 0) {
      pointer.seen = true; pointer.px = pointer.x; pointer.py = pointer.y;
      cursorBf.el.classList.add('is-visible');
    }
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('pointerup', onPointerUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onPointerLeave);
    ensureLoop();
  }

  function stopCursor() {
    if (!cursorBf) return;
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('pointerup', onPointerUp);
    document.documentElement.removeEventListener('mouseleave', onPointerLeave);
    if (cursorBf.el.parentNode) cursorBf.el.parentNode.removeChild(cursorBf.el);
    cursorBf = null;
    pointer.seen = false;
  }

  function stepCursor(dt) {
    if (!cursorBf) return;
    var dx = pointer.x - pointer.px;
    var speed = Math.sqrt(dx * dx + Math.pow(pointer.y - pointer.py, 2)) / Math.max(dt, 0.001);
    var vx = dx / Math.max(dt, 0.001);
    pointer.px = pointer.x; pointer.py = pointer.y;

    // Idle: slow, gentle beat. Moving: quick. Over something clickable: quickest.
    var rate = pointer.hover ? 6 : (speed > 60 ? 3.8 : 1.4);
    var depth = pointer.hover || speed > 60 ? 1 : 0.55;
    if (pointer.down) { rate = 0.4; depth = 1; }
    pointer.rate += (rate - pointer.rate) * Math.min(1, 8 * dt);
    pointer.depth += (depth - pointer.depth) * Math.min(1, 8 * dt);
    pointer.phase += Math.PI * 2 * pointer.rate * dt;

    // Without motion the wings stay open and still; the cursor still follows.
    if (reduceMotion) flapWings(cursorBf, 0, 0);
    else flapWings(cursorBf, pointer.down ? Math.PI : pointer.phase, pointer.down ? 1 : pointer.depth);

    var lean = Math.max(-26, Math.min(26, vx * 0.025));
    pointer.tilt += (lean - pointer.tilt) * Math.min(1, 10 * dt);
    var scale = pointer.hover ? 1.18 : 1;
    cursorBf.el.style.transform = 'translate(' + (pointer.x - cursorBf.size / 2).toFixed(1) + 'px,' +
      (pointer.y - cursorBf.size / 2).toFixed(1) + 'px) rotate(' + pointer.tilt.toFixed(1) + 'deg) scale(' + scale + ')';
  }

  /* ---- shared frame loop ---- */
  function frame(now) {
    var dt = Math.min(0.05, (now - lastFrame) / 1000 || 0.016);
    lastFrame = now;
    stepSwarm(dt);
    stepCursor(dt);
    rafId = (swarm.length || lilyBf.length || cursorBf) ? window.requestAnimationFrame(frame) : 0;
  }
  function ensureLoop() {
    if (rafId) return;
    lastFrame = window.performance.now();
    rafId = window.requestAnimationFrame(frame);
  }

  function applySwarm() {
    if (!wingsReady) return;
    var rewards = STORE.read(REWARD_KEY, {});
    // On by default once "Rumah lengkap" is unlocked; the switch turns it off.
    if (rewards.habitat && rewards.swarmOn !== false && !reduceMotion) startSwarm();
    else stopSwarm();
  }


  /* ---- Spider lily reward ---- */
  /* The switch grows a flower in the Hadiah block. Pressing it releases two
     red butterflies from the flower; they use the same page-anchored flight
     as the swarm but live in their own list, so the swarm switch never
     removes them. Released butterflies last for the visit only. */
  var LILY_COLORS = [['#5B0E16', '#C8102E'], ['#7A1420', '#E0343F']];

  function lilyEls() {
    return { spot: document.getElementById('lilySpot'), btn: document.getElementById('lilyBtn'),
      hint: document.getElementById('lilyHint') };
  }

  function showLily() {
    var l = lilyEls();
    if (!l.spot || lilyShown) return;
    lilyShown = true;
    lilyReleased = false;
    l.btn.classList.remove('is-open');
    l.btn.removeAttribute('aria-disabled');
    l.hint.textContent = 'Bunga spider lily tumbuh. Tekan bunganya.';
    l.spot.hidden = false;
    l.spot.classList.remove('is-grown');
    void l.spot.offsetWidth;
    l.spot.classList.add('is-grown');
  }

  function removeLilyButterflies() {
    var gone = lilyBf;
    lilyBf = [];
    gone.forEach(function (b) {
      b.el.classList.add('is-leaving');
      window.setTimeout(function () { if (b.el.parentNode) b.el.parentNode.removeChild(b.el); }, 650);
    });
  }

  function hideLily() {
    var l = lilyEls();
    removeLilyButterflies();
    lilyReleased = false;
    if (!lilyShown) return;
    lilyShown = false;
    if (l.spot) l.spot.hidden = true;
    if (l.hint) l.hint.textContent = '';
  }

  function releaseLily() {
    var l = lilyEls();
    if (!lilyShown || lilyReleased || reduceMotion || !wingsRoot || !l.btn) return;
    lilyReleased = true;
    var r = l.btn.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + window.scrollY + r.height * 0.3;
    for (var i = 0; i < 2; i++) {
      var c = LILY_COLORS[i];
      var b = makeButterfly(40 + Math.random() * 8, c[0], c[1], 'bf--swarm bf--lily');
      b.lily = true;
      b.x = cx + (i ? 16 : -16); b.y = cy;
      b.heading = -Math.PI / 2 + (i ? 0.7 : -0.7);
      b.home = cy; b.band = 900;
      b.rot = b.heading + Math.PI / 2;
      b.base = 70 + Math.random() * 20; b.v = b.base;
      b.t = Math.random() * 10;
      b.p1 = Math.random() * 6.28; b.p2 = Math.random() * 6.28;
      b.w1 = 0.7 + Math.random() * 0.6; b.w2 = 1.7 + Math.random() * 0.9;
      b.phase = Math.random() * 6.28;
      b.mode = 'cruise'; b.modeLeft = 2 + Math.random() * 2;
      b.wait = i * 0.25;
      b.hidden = true; b.el.style.visibility = 'hidden';
      lilyBf.push(b);
    }
    l.btn.classList.add('is-open');
    l.btn.setAttribute('aria-disabled', 'true');
    l.hint.textContent = 'Dua kupu-kupu spider lily terbang. Matikan sakelar untuk menyimpan bunganya.';
    ensureLoop();
  }

  function applyLily(on) {
    if (!wingsReady) return;
    if (on) showLily(); else hideLily();
  }

  /* ------------------------------------------------------------- rewards UI */
  function paintRewards() {
    var rewards = STORE.read(REWARD_KEY, {});
    var rows = Array.prototype.slice.call(document.querySelectorAll('.reward'));

    rows.forEach(function (row) {
      var key = row.getAttribute('data-reward');
      var unlocked = !!rewards[key];
      row.setAttribute('data-unlocked', String(unlocked));
      var state = row.querySelector('[data-state]');
      if (state) state.textContent = unlocked ? 'Terbuka' : 'Terkunci';
    });

    var toggle = document.getElementById('cursorToggle');
    var touchBtn = document.getElementById('touchWings');
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (toggle) {
      toggle.hidden = !(rewards.cursor && finePointer);
      toggle.setAttribute('aria-checked', String(!!rewards.cursorOn && finePointer));
      var word = toggle.querySelector('.switch__state');
      if (word) word.textContent = toggle.getAttribute('aria-checked') === 'true' ? 'Nyala' : 'Mati';
    }
    if (touchBtn) touchBtn.hidden = !(rewards.cursor && !finePointer);

    var seg = document.getElementById('cursorSeg');
    if (seg) {
      var showSeg = !!rewards.blue && finePointer;
      seg.hidden = !showSeg;
      if (toggle && showSeg) toggle.hidden = true;
      var chosen = !rewards.cursorOn ? 'off' : (rewards.cursorStyle === 'blue' ? 'blue' : 'classic');
      Array.prototype.forEach.call(seg.querySelectorAll('[data-cursor]'), function (btn) {
        var isOn = btn.getAttribute('data-cursor') === chosen;
        btn.setAttribute('aria-checked', String(isOn));
        btn.tabIndex = isOn ? 0 : -1;
      });
    }

    var swarmBtn = document.getElementById('swarmToggle');
    if (swarmBtn) {
      var canFly = !!rewards.habitat && !reduceMotion;
      var flyOn = canFly && rewards.swarmOn !== false;
      swarmBtn.hidden = !canFly;
      swarmBtn.setAttribute('aria-checked', String(flyOn));
      var flyWord = swarmBtn.querySelector('.switch__state');
      if (flyWord) flyWord.textContent = flyOn ? 'Nyala' : 'Mati';
    }

    var lilyTgl = document.getElementById('lilyToggle');
    var lilyNote = document.getElementById('lilyReduced');
    var lilyCan = !!rewards.perfect && !reduceMotion;
    var lilyOn = lilyCan && rewards.lilyOn === true;
    if (lilyTgl) {
      lilyTgl.hidden = !lilyCan;
      lilyTgl.setAttribute('aria-checked', String(lilyOn));
      var lilyWord = lilyTgl.querySelector('.switch__state');
      if (lilyWord) lilyWord.textContent = lilyOn ? 'Nyala' : 'Mati';
    }
    if (lilyNote) lilyNote.hidden = !(rewards.perfect && reduceMotion);
    applyLily(lilyOn);

    applyCursor();
    applySwarm();
  }

  function applyCursor() {
    var rewards = STORE.read(REWARD_KEY, {});
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var on = !!(rewards.cursor && rewards.cursorOn && finePointer);
    document.documentElement.classList.toggle('cursor-wing', on);
    if (!wingsReady) return;
    var style = rewards.blue && rewards.cursorStyle === 'blue' ? 'blue' : 'classic';
    if (on && cursorBf && cursorBf.kind !== style) stopCursor();
    if (on) startCursor(style); else stopCursor();
  }

  var cursorToggle = document.getElementById('cursorToggle');
  if (cursorToggle) {
    cursorToggle.addEventListener('click', function () {
      var rewards = STORE.read(REWARD_KEY, {});
      rewards.cursorOn = cursorToggle.getAttribute('aria-checked') !== 'true';
      STORE.write(REWARD_KEY, rewards);
      paintRewards();
    });
  }

  var blueDialog = document.getElementById('blueDialog');
  if (blueDialog) {
    var blueClose = document.getElementById('blueClose');
    var blueAction = document.getElementById('blueAction');
    if (blueClose) blueClose.addEventListener('click', function () { blueDialog.close(); });
    if (blueAction) blueAction.addEventListener('click', function () { blueDialog.close(); });
    blueDialog.addEventListener('click', function (e) { if (e.target === blueDialog) blueDialog.close(); });
    blueDialog.addEventListener('close', function () { if (wingsRoot) wingsRoot.classList.remove('is-quiet'); });
  }

  var cursorSeg = document.getElementById('cursorSeg');
  if (cursorSeg) {
    var segBtns = Array.prototype.slice.call(cursorSeg.querySelectorAll('[data-cursor]'));
    function pickCursor(btn) {
      var value = btn.getAttribute('data-cursor');
      var rewards = STORE.read(REWARD_KEY, {});
      rewards.cursorOn = value !== 'off';
      if (value !== 'off') rewards.cursorStyle = value;
      STORE.write(REWARD_KEY, rewards);
      paintRewards();
    }
    segBtns.forEach(function (btn, i) {
      btn.addEventListener('click', function () { pickCursor(btn); });
      btn.addEventListener('keydown', function (e) {
        var step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0);
        if (!step) return;
        e.preventDefault();
        var next = segBtns[(i + step + segBtns.length) % segBtns.length];
        pickCursor(next);
        next.focus();
      });
    });
  }

  var swarmToggle = document.getElementById('swarmToggle');
  if (swarmToggle) {
    swarmToggle.addEventListener('click', function () {
      var rewards = STORE.read(REWARD_KEY, {});
      rewards.swarmOn = swarmToggle.getAttribute('aria-checked') !== 'true';
      STORE.write(REWARD_KEY, rewards);
      paintRewards();
    });
  }

  var lilyToggle = document.getElementById('lilyToggle');
  if (lilyToggle) {
    lilyToggle.addEventListener('click', function () {
      var rewards = STORE.read(REWARD_KEY, {});
      rewards.lilyOn = lilyToggle.getAttribute('aria-checked') !== 'true';
      STORE.write(REWARD_KEY, rewards);
      paintRewards();
    });
  }
  var lilyBtnEl = document.getElementById('lilyBtn');
  if (lilyBtnEl) lilyBtnEl.addEventListener('click', releaseLily);

  var touchWings = document.getElementById('touchWings');
  if (touchWings) {
    touchWings.addEventListener('click', function () { flyAcross('bloom'); });
  }

  wingsReady = true;
  paintRewards();

  /* ----------------------------------------------------------------- quiz */
  /* FR-09: answers are collected without revealing the verdict. The submit
     button unlocks only when all five are answered, swaps its label to
     "Kirim Jawaban", and submission reveals score, explanations, and the
     cursor reward. */
  var form = document.getElementById('quiz');
  if (form) {
    var questions = Array.prototype.slice.call(form.querySelectorAll('.q'));
    var scoreEl = document.getElementById('quizScore');
    var resultEl = document.getElementById('quizResult');
    var resultTitle = document.getElementById('resultTitle');
    var resultText = document.getElementById('resultText');
    var resultReward = document.getElementById('quizReward');
    var submitBtn = document.getElementById('quizSubmit');
    var resetBtn = document.getElementById('quizReset');

    var COPY = {
      '1': {
        correct: 'Tepat. Tanaman inang adalah makanan larva sekaligus tempat bertelur, dua fungsi yang tidak digantikan bunga.',
        wrong: 'Belum. Tanaman inang berfungsi sebagai makanan ulat dan tempat betina meletakkan telur; nektar adalah urusan imago.'
      },
      '2': {
        correct: 'Tepat. Larva adalah tahap paling rakus; telur belum makan dan pupa berhenti makan sama sekali.',
        wrong: 'Belum. Yang paling banyak makan adalah larva (ulat). Telur belum makan, dan pupa justru tidak makan.'
      },
      '3': {
        correct: 'Tepat. Tanpa daun inang, betina tidak punya tempat bertelur, sehingga tidak ada generasi berikutnya.',
        wrong: 'Belum. Masalahnya bukan pada nektar, melainkan pada tidak adanya daun inang untuk larva.'
      },
      '4': {
        correct: 'Tepat. Fragmentasi memisahkan populasi, sehingga pertukaran individu dan gen menjadi sulit.',
        wrong: 'Belum. Fragmentasi memisahkan populasi menjadi kantong-kantong kecil yang sulit bertukar gen.'
      },
      '5': {
        correct: 'Tepat. Kelangkaan yang terlihat bisa disebabkan musim, cuaca, tanaman berbunga, atau jam pengamatan. Itu hipotesis, bukan kesimpulan.',
        wrong: 'Belum. Menghilangnya kupu-kupu dari satu pengamatan tidak membuktikan pencemaran atau kepunahan; perlu pengamatan yang lebih teliti.'
      }
    };

    function answeredCount() {
      var n = 0;
      questions.forEach(function (q) {
        if (q.querySelector('input:checked')) n++;
      });
      return n;
    }

    function updateScoreLabel() {
      var n = answeredCount();
      var total = questions.length;
      if (scoreEl.getAttribute('data-mode') === 'result') return;
      scoreEl.innerHTML = n + ' dari ' + total + ' terjawab';
      var ready = n === total;
      submitBtn.disabled = !ready;
      submitBtn.textContent = ready ? 'Kirim Jawaban' : 'Periksa Jawaban';
    }

    function lockQuestions(locked) {
      questions.forEach(function (q) {
        q.setAttribute('data-locked', String(locked));
        q.querySelectorAll('input').forEach(function (input) { input.disabled = locked; });
      });
    }

    function reveal(q) {
      var answer = q.getAttribute('data-answer');
      var checked = q.querySelector('input:checked');
      var isRight = checked && checked.value === answer;
      var fb = q.querySelector('.feedback');

      q.setAttribute('data-state', isRight ? 'correct' : 'wrong');
      q.querySelectorAll('.opt').forEach(function (opt) {
        var input = opt.querySelector('input');
        opt.removeAttribute('data-verdict');
        if (input.value === answer) opt.setAttribute('data-verdict', 'correct');
        else if (input.checked) opt.setAttribute('data-verdict', 'wrong');
      });

      fb.hidden = false;
      fb.classList.toggle('feedback--wrong', !isRight);
      fb.querySelector('b').textContent = isRight ? 'Benar' : 'Belum tepat';
      fb.querySelector('.feedback__text').textContent = COPY[q.getAttribute('data-q')][isRight ? 'correct' : 'wrong'];
      return isRight;
    }

    function hideExplanations() {
      questions.forEach(function (q) {
        q.removeAttribute('data-state');
        var fb = q.querySelector('.feedback');
        fb.hidden = true;
        fb.classList.remove('feedback--wrong');
        q.querySelectorAll('.opt').forEach(function (opt) { opt.removeAttribute('data-verdict'); });
      });
    }

    function resetResult() {
      resultEl.hidden = true;
      resetBtn.hidden = true;
      submitBtn.hidden = false;
      scoreEl.removeAttribute('data-mode');
      updateScoreLabel();
    }

    // Answering only updates progress; the verdict stays hidden until submit.
    questions.forEach(function (q) {
      q.addEventListener('change', function (e) {
        if (e.target.matches('input[type="radio"]')) updateScoreLabel();
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (answeredCount() !== questions.length) return;

      var correct = 0;
      questions.forEach(function (q) {
        if (reveal(q)) correct++;
      });
      lockQuestions(true);

      var total = questions.length;
      resultEl.hidden = false;
      resultTitle.textContent = correct + ' dari ' + total + ' benar';

      if (correct === total) {
        resultText.textContent = 'Semua benar. Yang paling penting bukan skornya, melainkan bahwa urutan kebutuhannya sudah jelas: inang untuk larva, nektar untuk imago, naungan, dan jalur di antaranya.';
      } else if (correct >= total - 2) {
        resultText.textContent = 'Hampir semua tepat. Baca ulang penjelasan di bawah jawaban yang masih tertukar, biasanya antara kebutuhan larva dan kebutuhan kupu-kupu dewasa.';
      } else {
        resultText.textContent = 'Cukup. Kembali ke Vitrin 03 dan 04 sebentar; dua bagian itu memuat hampir semua jawaban.';
      }

      var rewards = STORE.read(REWARD_KEY, {});
      var firstUnlock = !rewards.cursor;
      rewards.cursor = true;
      if (correct === total) rewards.perfect = true;
      STORE.write(REWARD_KEY, rewards);
      paintRewards();

      if (resultReward) {
        resultReward.hidden = false;
        resultReward.innerHTML = '<b>Hadiah terbuka:</b> Kursor kupu-kupu' +
          (correct === total ? ' dan Spider lily (skor penuh).' : '.') +
          (firstUnlock ? ' Aktifkan di daftar hadiah, bagian Aksi Nyata.' : '');
      }

      scoreEl.innerHTML = '<b>' + correct + '</b> dari ' + total + ' benar';
      scoreEl.setAttribute('data-mode', 'result');
      // Answers are locked, so there is nothing left to submit; only retry applies.
      resetBtn.hidden = false;
      submitBtn.hidden = true;
      submitBtn.disabled = true;
      resultEl.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    resetBtn.addEventListener('click', function () {
      form.reset();
      hideExplanations();
      lockQuestions(false);
      resetResult();
      if (resultReward) resultReward.hidden = true;
      questions[0].scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      questions[0].querySelector('input').focus({ preventScroll: true });
    });

    updateScoreLabel();
  }

  /* ------------------------------------------------------ action commitments */
  /* FR-10: the checklist is a commitment, not a to-do list. Submitting needs at
     least one selection, confirms locally, and triggers the bloom. Nothing is
     sent anywhere and no impact is claimed. */
  var list = document.getElementById('checklist');
  if (list) {
    var KEY = 'rotw.checklist.v1';
    var boxes = Array.prototype.slice.call(list.querySelectorAll('input[type="checkbox"]'));
    var fill = document.getElementById('meterFill');
    var label = document.getElementById('meterLabel');
    var clearBtn = document.getElementById('clearTasks');
    var commitBtn = document.getElementById('commitSubmit');
    var commitDone = document.getElementById('commitDone');
    var commitTitle = document.getElementById('commitTitle');
    var commitText = document.getElementById('commitText');

    var saved = STORE.read(KEY, {}) || {};
    boxes.forEach(function (box) {
      if (saved[box.getAttribute('data-task')]) box.checked = true;
    });

    function chosen() {
      return boxes.filter(function (b) { return b.checked; });
    }

    function paint() {
      var done = chosen().length;
      var total = boxes.length;

      if (fill) fill.style.width = (done / total * 100) + '%';
      if (label) {
        label.innerHTML = '<b>' + done + ' dari ' + total + '</b> langkah dipilih · tersimpan di peramban ini saja';
      }
      if (commitBtn) commitBtn.disabled = done === 0;
      if (clearBtn) clearBtn.hidden = done === 0;
      // A new selection makes a previous confirmation stale.
      if (commitDone && !commitDone.hidden) {
        commitDone.hidden = true;
        if (commitBtn) commitBtn.textContent = 'Kirim komitmen';
      }
    }

    function persist() {
      var state = {};
      chosen().forEach(function (b) { state[b.getAttribute('data-task')] = true; });
      STORE.write(KEY, state);
    }

    boxes.forEach(function (box) {
      box.addEventListener('change', function () { persist(); paint(); });
    });

    if (commitBtn) {
      commitBtn.addEventListener('click', function () {
        var picked = chosen();
        if (!picked.length) return;

        var titles = picked.map(function (b) {
          var t = b.parentNode.querySelector('.task__title');
          return t ? t.textContent.trim() : '';
        }).filter(Boolean);

        commitDone.hidden = false;
        commitTitle.textContent = 'Komitmen tercatat di peramban ini.';
        commitText.textContent = picked.length + ' dari ' + boxes.length + ' langkah dipilih: ' +
          titles.join('; ') + '.';
        commitBtn.textContent = 'Perbarui komitmen';

        STORE.write('rotw.commit.v1', { at: new Date().toISOString(), tasks: titles });

        if (picked.length === boxes.length) {
          var rewards = STORE.read(REWARD_KEY, {});
          if (!rewards.bloomAll) { rewards.bloomAll = true; STORE.write(REWARD_KEY, rewards); }
        }
        flyAcross('bloom');
        commitDone.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        boxes.forEach(function (b) { b.checked = false; });
        persist();
        paint();
        if (commitDone) commitDone.hidden = true;
        if (commitBtn) commitBtn.textContent = 'Kirim komitmen';
        boxes[0].focus();
      });
    }

    paint();
  }
})();