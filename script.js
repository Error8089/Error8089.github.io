/* =========================================================
   retr1kze.dev — interactions & GitHub API
   ========================================================= */

(() => {
  'use strict';

  const CONFIG = {
    username: 'Error8089',
    name: 'retr1kze',
    email: 'rootk1tretr0@gmail.com',
    typed: ['веб-интерфейсы', 'Python-код', 'CTF-челленджи', 'что-то новое']
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);

  const LANG_COLORS = {
    Python: '#3572A5', JavaScript: '#f1e05a', TypeScript: '#3178c6',
    HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', Go: '#00ADD8',
    Rust: '#dea584', C: '#555555', 'C++': '#f34b7d', PHP: '#4F5D95',
    Ruby: '#701516', Java: '#b07219', Dockerfile: '#384d54'
  };

  /* ---------- reveal on scroll ---------- */
  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    : null;

  function observeReveals(root = document) {
    $$('.reveal:not(.is-visible)', root).forEach((el) => {
      if (revealObserver) revealObserver.observe(el);
      else el.classList.add('is-visible');
    });
  }

  /* ---------- header, progress, to-top ---------- */
  function initScrollUI() {
    const header = $('#site-header');
    const bar = $('#scroll-progress-bar');
    const toTop = $('#to-top');
    let ticking = false;

    const update = () => {
      const y = window.scrollY || window.pageYOffset;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      header.classList.toggle('scrolled', y > 18);
      bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      toTop.classList.toggle('visible', y > 600);
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();

    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- active nav link ---------- */
  function initActiveNav() {
    const links = $$('.nav-link');
    const map = new Map(links.map((link) => [link.getAttribute('href').slice(1), link]));
    if (!('IntersectionObserver' in window) || !map.size) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.remove('active'));
        const link = map.get(entry.target.id);
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });

    map.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* ---------- mobile menu ---------- */
  function initMobileMenu() {
    const toggle = $('#menu-toggle');
    const menu = $('#mobile-menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      menu.setAttribute('aria-hidden', String(!open));
    };

    toggle.addEventListener('click', () => setOpen(!document.body.classList.contains('menu-open')));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setOpen(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && document.body.classList.contains('menu-open')) setOpen(false);
    }, { passive: true });
  }

  /* ---------- custom cursor ---------- */
  function initCursor() {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || reduced) return;

    const dot = $('#cursor-dot');
    const ring = $('#cursor-ring');
    document.documentElement.classList.add('has-cursor');

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    }, { passive: true });

    document.addEventListener('pointerover', (e) => {
      const interactive = e.target.closest('a, button, .project-card, .skill-card');
      document.documentElement.classList.toggle('cursor-hover', Boolean(interactive));
    });
    document.addEventListener('pointerout', (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest) return;
      const interactive = e.target.closest('a, button, .project-card, .skill-card');
      if (interactive && !e.relatedTarget.closest('a, button, .project-card, .skill-card')) {
        document.documentElement.classList.remove('cursor-hover');
      }
    });

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ---------- hero spotlight ---------- */
  function initSpotlight() {
    const hero = $('.hero');
    if (!hero) return;
    let ticking = false, x = 0, y = 0;

    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      if (!ticking) {
        requestAnimationFrame(() => {
          hero.style.setProperty('--mx', `${x}px`);
          hero.style.setProperty('--my', `${y}px`);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    $$('.project-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      }, { passive: true });
    });
  }

  /* ---------- typed text ---------- */
  function initTyped() {
    const el = $('#typed-text');
    if (!el || !CONFIG.typed.length) return;
    const words = CONFIG.typed;

    if (reduced) { el.textContent = words[0]; return; }

    let wordIndex = 0, charIndex = 0, deleting = false;
    const tick = () => {
      const word = words[wordIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          setTimeout(tick, 1700);
          return;
        }
        setTimeout(tick, 65 + Math.random() * 55);
      } else {
        charIndex--;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(tick, 350);
          return;
        }
        setTimeout(tick, 35);
      }
    };
    setTimeout(tick, 1400);
  }

  /* ---------- accent switcher ---------- */
  function initAccent() {
    const btn = $('#accent-toggle');
    if (!btn) return;
    const accents = ['cyan', 'violet', 'lime'];
    const meta = $('meta[name="theme-color"]');
    const colors = { cyan: '#07070c', violet: '#0c0712', lime: '#080c07' };

    const apply = (accent) => {
      document.documentElement.dataset.accent = accent;
      if (meta) meta.setAttribute('content', colors[accent]);
      try { localStorage.setItem('portfolio-accent', accent); } catch (_) {}
    };

    let saved = null;
    try { saved = localStorage.getItem('portfolio-accent'); } catch (_) {}
    if (accents.includes(saved)) apply(saved);

    btn.addEventListener('click', () => {
      const current = accents.indexOf(document.documentElement.dataset.accent);
      apply(accents[(current + 1) % accents.length]);
      btn.classList.remove('spin');
      void btn.offsetWidth;
      btn.classList.add('spin');
      showToast('Цвет изменён ✦');
    });
  }

  /* ---------- toast & copy ---------- */
  let toastTimer;
  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
  }

  async function copyText(text) {
    let copied = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch (_) { /* пробуем запасной способ */ }
    }

    if (!copied) {
      try {
        const area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        copied = document.execCommand('copy');
        area.remove();
      } catch (_) { /* не получилось */ }
    }

    showToast(copied ? 'Email скопирован ✓' : 'Не получилось скопировать :(');
  }

  /* ---------- counters ---------- */
  function animateCount(el, target) {
    const format = new Intl.NumberFormat('ru-RU').format;
    if (reduced || target === 0) { el.textContent = format(target); return; }
    const duration = 1000;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function setStat(name, value) {
    $$(`[data-stat="${name}"]`).forEach((el) => {
      if (name === 'since') el.textContent = value;
      else animateCount(el, Number(value) || 0);
    });
  }

  /* ---------- GitHub data ---------- */
  const FALLBACK = {
    profile: {
      login: 'Error8089',
      name: 'retr1kze',
      avatar_url: 'https://avatars.githubusercontent.com/u/90235870?v=4',
      bio: 'Разработчик и CTF-энтузиаст.',
      followers: 0,
      public_repos: 1,
      created_at: '2021-09-07T04:55:12Z',
      html_url: 'https://github.com/Error8089'
    },
    repos: [{
      name: 'krasctf-platform',
      html_url: 'https://github.com/Error8089/krasctf-platform',
      description: 'CTF платформа для обучения кибербезопасности ( для новичков )',
      language: 'Python',
      stargazers_count: 0,
      forks_count: 0,
      license: { spdx_id: 'MIT' },
      topics: ['ctf', 'security'],
      updated_at: '2026-02-04T18:47:39Z',
      homepage: null
    }]
  };

  const fetchJSON = async (url) => {
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
    return res.json();
  };

  function relativeDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    const days = Math.round((date.getTime() - Date.now()) / 86400000);
    const rtf = new Intl.RelativeTimeFormat('ru-RU', { numeric: 'auto' });
    if (Math.abs(days) < 30) return rtf.format(days, 'day');
    if (Math.abs(days) < 365) return rtf.format(Math.round(days / 30), 'month');
    return rtf.format(Math.round(days / 365), 'year');
  }

  function repoCard(repo, index) {
    const lang = repo.language || '';
    const dot = lang
      ? `<span class="chip-dot" style="background:${LANG_COLORS[lang] || '#8b8b9f'}"></span>`
      : '';
    const chips = [
      lang ? `<li>${dot}${esc(lang)}</li>` : '',
      repo.license ? `<li>${esc(repo.license.spdx_id)}</li>` : '',
      ...(repo.topics || []).slice(0, 2).map((t) => `<li>#${esc(t)}</li>`)
    ].filter(Boolean).join('');

    const home = repo.homepage
      ? `<a href="${esc(repo.homepage)}" target="_blank" rel="noopener noreferrer" aria-label="Сайт проекта ${esc(repo.name)}"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-external"/></svg></a>`
      : '';

    return `
      <article class="project-card reveal" style="--delay:${(index * 0.07).toFixed(2)}s">
        <div class="project-top">
          <span class="project-icon"><svg class="icon" aria-hidden="true"><use href="#i-code"/></svg></span>
          <div class="project-links">
            <a href="${esc(repo.html_url)}" target="_blank" rel="noopener noreferrer" aria-label="Открыть репозиторий ${esc(repo.name)}"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-github"/></svg></a>
            ${home}
          </div>
        </div>
        <h3>${esc(repo.name)}</h3>
        <p>${esc(repo.description || 'Описание пока не добавлено — следи за обновлениями.')}</p>
        <ul class="chips">${chips}</ul>
        <div class="project-meta">
          <span><svg class="icon" aria-hidden="true"><use href="#i-star"/></svg> ${repo.stargazers_count || 0}</span>
          <span><svg class="icon" aria-hidden="true"><use href="#i-fork"/></svg> ${repo.forks_count || 0}</span>
          <span>обновлён ${esc(relativeDate(repo.updated_at))}</span>
        </div>
      </article>`;
  }

  function profileCard(profile, delay) {
    return `
      <article class="project-card profile-card reveal" style="--delay:${delay}s">
        <div class="profile-head">
          <img src="${esc(profile.avatar_url)}" alt="Аватар ${esc(profile.login)}" width="54" height="54" loading="lazy">
          <div><h3>${esc(profile.name || profile.login)}</h3><span>@${esc(profile.login)}</span></div>
        </div>
        <p>${esc(profile.bio || 'Разрабатываю, учусь и делаю интересные проекты.')}</p>
        <div class="project-meta">
          <span>${profile.followers || 0} подписчиков</span>
          <span>${profile.public_repos || 0} репозиториев</span>
        </div>
        <a class="btn btn-outline" href="${esc(profile.html_url)}" target="_blank" rel="noopener noreferrer">
          Профиль на GitHub <svg class="icon icon-sm" aria-hidden="true"><use href="#i-arrow-up-right"/></svg>
        </a>
      </article>`;
  }

  function renderGitHub(profile, repos) {
    const grid = $('#projects-grid');
    if (!grid) return;

    const sorted = [...repos]
      .filter((r) => !r.fork)
      .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
      .slice(0, 6);

    grid.innerHTML = sorted.map(repoCard).join('') + profileCard(profile, (sorted.length * 0.07).toFixed(2));

    setStat('followers', profile.followers || 0);
    setStat('repos', profile.public_repos ?? sorted.length);
    setStat('since', profile.created_at ? new Date(profile.created_at).getFullYear() : '—');

    const contactEmail = $('#contact-email');
    if (contactEmail) contactEmail.textContent = CONFIG.email;

    $$('[data-name]').forEach((el) => { el.textContent = CONFIG.name; });

    // повторно вешаем spotlight и reveal на свежие карточки
    $$('.project-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      }, { passive: true });
    });
    observeReveals(grid);
  }

  async function loadGitHub() {
    try {
      const [user, repos] = await Promise.all([
        fetchJSON(`https://api.github.com/users/${CONFIG.username}`),
        fetchJSON(`https://api.github.com/users/${CONFIG.username}/repos?per_page=100&sort=updated`)
      ]);
      renderGitHub(user, repos);
    } catch (error) {
      console.warn('Не удалось получить данные GitHub, показываю сохранённую копию.', error);
      renderGitHub(FALLBACK.profile, FALLBACK.repos);
      const sub = $('#projects .section-sub');
      if (sub) sub.textContent = 'Сохранённая копия проектов — GitHub API временно недоступен.';
    }
  }

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();

    observeReveals();
    initScrollUI();
    initActiveNav();
    initMobileMenu();
    initCursor();
    initSpotlight();
    initTyped();
    initAccent();

    $('#copy-email')?.addEventListener('click', () => copyText(CONFIG.email));
    $('#copy-email-small')?.addEventListener('click', () => copyText(CONFIG.email));

    loadGitHub();
  });
})();
