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

  /* --------------------------------------------------------- garden layers */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var layers = Array.prototype.slice.call(document.querySelectorAll('.plan svg .layer'));
  var planNote = document.getElementById('planNote');
  var layerNames = {
    inang: 'tanaman inang',
    nektar: 'bunga nektar',
    istirahat: 'naungan dan air',
    koridor: 'koridor'
  };
  var layerLoss = {
    inang: 'Tanpa tanaman inang, tidak ada daun untuk telur — generasi berikutnya berhenti di sini.',
    nektar: 'Tanpa bunga nektar, kupu-kupu dewasa kehabisan bahan bakar dan tidak sempat kawin.',
    istirahat: 'Tanpa naungan, kupu-kupu terbuka pada angin, hujan, dan pemangsa.',
    koridor: 'Tanpa koridor, ketiga kebutuhan ini terpisah dan tidak pernah bertemu.'
  };

  function updatePlan() {
    var off = [];
    chips.forEach(function (chip) {
      var name = chip.getAttribute('data-target');
      var on = chip.getAttribute('aria-pressed') === 'true';
      layers.forEach(function (layer) {
        if (layer.getAttribute('data-layer') === name) {
          layer.classList.toggle('is-dim', !on);
          layer.classList.toggle('is-on', on);
        }
      });
      if (!on) off.push(name);
    });
    if (!planNote) return;
    if (!off.length) {
      planNote.innerHTML = '<strong>Semua lapisan aktif.</strong> Matikan satu lapisan untuk melihat apa yang hilang dari halaman ini.';
    } else {
      planNote.innerHTML = '<strong>' + layerNames[off[0]] + ' dimatikan.</strong> ' + layerLoss[off[0]] +
        (off.length > 1 ? ' Lapisan lain juga dimatikan.' : '');
    }
  }
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      updatePlan();
    });
  });

  /* ----------------------------------------------------------------- quiz */
  var form = document.getElementById('quiz');
  if (form) {
    var questions = Array.prototype.slice.call(form.querySelectorAll('.q'));
    var scoreEl = document.getElementById('quizScore');
    var resultEl = document.getElementById('quizResult');
    var resultTitle = document.getElementById('resultTitle');
    var resultText = document.getElementById('resultText');
    var submitBtn = document.getElementById('quizSubmit');
    var resetBtn = document.getElementById('quizReset');

    var COPY = {
      '1': {
        correct: 'Tepat. Tanaman inang adalah makanan larva sekaligus tempat bertelur — dua fungsi yang tidak digantikan bunga.',
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
      if (scoreEl.getAttribute('data-mode') === 'result') return;
      var n = answeredCount();
      scoreEl.innerHTML = n + ' dari ' + questions.length + ' terjawab';
    }

    function mark(q, checked) {
      var answer = q.getAttribute('data-answer');
      var value = checked.value;
      var isRight = value === answer;
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
      fb.querySelector('.feedback__text').textContent =
        (isRight ? COPY[q.getAttribute('data-q')].correct : COPY[q.getAttribute('data-q')].wrong);
      return isRight;
    }

    function resetResult() {
      resultEl.hidden = true;
      resetBtn.hidden = true;
      submitBtn.textContent = 'Periksa jawaban';
      scoreEl.removeAttribute('data-mode');
      updateScoreLabel();
    }

    questions.forEach(function (q) {
      q.addEventListener('change', function (e) {
        if (e.target.matches('input[type="radio"]')) {
          mark(q, e.target);
          updateScoreLabel();
          // A submitted score no longer describes the current answers.
          if (!resultEl.hidden) resetResult();
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var correct = 0;
      var unanswered = 0;
      questions.forEach(function (q) {
        var checked = q.querySelector('input:checked');
        if (!checked) { unanswered++; return; }
        if (mark(q, checked)) correct++;
      });

      var total = questions.length;
      resultEl.hidden = false;
      resultTitle.textContent = correct + ' dari ' + total + ' benar';
      if (unanswered) {
        resultText.textContent = 'Masih ada ' + unanswered + ' pertanyaan yang belum dijawab. ' +
          'Jawaban yang sudah dipilih tetap diperiksa, dan penjelasannya ada di bawah setiap pertanyaan.';
      } else if (correct === total) {
        resultText.textContent = 'Semua benar. Yang paling penting bukan skornya, melainkan bahwa urutan kebutuhannya sudah jelas: inang untuk larva, nektar untuk imago, naungan, dan jalur di antaranya.';
      } else if (correct >= total - 2) {
        resultText.textContent = 'Hampir semua tepat. Baca ulang bagian yang masih tertukar — biasanya antara kebutuhan larva dan kebutuhan kupu-kupu dewasa.';
      } else {
        resultText.textContent = 'Cukup. Kembali ke Vitrin 03 dan 04 sebentar; dua bagian itu memuat hampir semua jawaban.';
      }
      scoreEl.innerHTML = '<b>' + correct + '</b> dari ' + total + ' benar';
      scoreEl.setAttribute('data-mode', 'result');
      resetBtn.hidden = false;
      submitBtn.textContent = 'Periksa lagi';
      resultEl.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    resetBtn.addEventListener('click', function () {
      form.reset();
      questions.forEach(function (q) {
        q.removeAttribute('data-state');
        q.querySelectorAll('.opt').forEach(function (opt) {
          var answer = q.getAttribute('data-answer');
          var value = opt.querySelector('input').value;
          if (value === answer) opt.setAttribute('data-verdict', 'correct');
          else opt.removeAttribute('data-verdict');
        });
        var fb = q.querySelector('.feedback');
        fb.hidden = true;
        fb.classList.remove('feedback--wrong');
      });
      resetResult();
      questions[0].scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      questions[0].querySelector('input').focus({ preventScroll: true });
    });

    updateScoreLabel();
  }

  /* ------------------------------------------------------------- checklist */
  var list = document.getElementById('checklist');
  if (list) {
    var KEY = 'rotw.checklist.v1';
    var boxes = Array.prototype.slice.call(list.querySelectorAll('input[type="checkbox"]'));
    var fill = document.getElementById('meterFill');
    var label = document.getElementById('meterLabel');
    var clearBtn = document.getElementById('clearTasks');

    var saved = {};
    try { saved = JSON.parse(window.localStorage.getItem(KEY) || '{}') || {}; } catch (err) { saved = {}; }

    boxes.forEach(function (box) {
      if (saved[box.getAttribute('data-task')]) box.checked = true;
    });

    function paint() {
      var done = boxes.filter(function (b) { return b.checked; }).length;
      var total = boxes.length;
      if (fill) fill.style.width = (done / total * 100) + '%';
      if (label) {
        label.innerHTML = '<b>' + done + ' dari ' + total + '</b> langkah dipilih · tersimpan di peramban ini saja';
      }
      if (clearBtn) clearBtn.hidden = done === 0;
    }

    function persist() {
      var state = {};
      boxes.forEach(function (b) {
        if (b.checked) state[b.getAttribute('data-task')] = true;
      });
      try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (err) { /* private mode */ }
    }

    boxes.forEach(function (box) {
      box.addEventListener('change', function () { persist(); paint(); });
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        boxes.forEach(function (b) { b.checked = false; });
        persist();
        paint();
        boxes[0].focus();
      });
    }

    paint();
  }
})();
