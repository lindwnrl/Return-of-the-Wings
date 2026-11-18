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
      flyAcross('cross');

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

    applyCursor();
  }

  function applyCursor() {
    var rewards = STORE.read(REWARD_KEY, {});
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var on = !!(rewards.cursor && rewards.cursorOn && finePointer);
    document.documentElement.classList.toggle('cursor-wing', on);
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

  var touchWings = document.getElementById('touchWings');
  if (touchWings) {
    touchWings.addEventListener('click', function () { flyAcross('bloom'); });
  }

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
          (correct === total ? ' dan Sayap sempurna (skor penuh).' : '.') +
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
