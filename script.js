/* ============================================================
   retr1kze.dev v2 — console edition
   boot · терминал · matrix · GitHub live data
   ============================================================ */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SESSION_START = Date.now();
  const GITHUB_USER = "Error8089";

  /* ============ TOAST ============ */
  const toastEl = $("#toast");
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  };

  /* ============ BOOT SEQUENCE ============ */
  const boot = $("#boot");
  const bootLog = $("#boot-log");
  const BOOT_LINES = [
    "retrBIOS v2.6 — retr1kze industries",
    "Copyright (C) 2026 — все комментарии защищены",
    "",
    ["> инициализация cpu .......... ", "OK"],
    ["> проверка памяти ............. ", "OK"],
    ["> монтирование /dev/ideas ..... ", "OK"],
    ["> загрузка портфолио v2 ....... ", "OK"],
    ["> запуск сессии для guest ..... ", "OK"],
    "",
    "добро пожаловать, guest_",
  ];

  function endBoot() {
    if (!boot || boot.classList.contains("done")) return;
    boot.classList.add("done");
    setTimeout(() => boot.remove(), 600);
    removeEventListener("keydown", endBoot);
    boot.removeEventListener("click", endBoot);
  }

  if (boot && !reducedMotion) {
    let i = 0;
    let cancelled = false;
    const typeNext = () => {
      if (cancelled) return;
      if (i >= BOOT_LINES.length) {
        setTimeout(endBoot, 450);
        return;
      }
      const line = BOOT_LINES[i++];
      if (Array.isArray(line)) {
        bootLog.append(document.createTextNode(line[0]));
        const ok = document.createElement("span");
        ok.className = "ok";
        ok.textContent = line[1];
        bootLog.appendChild(ok);
        bootLog.appendChild(document.createTextNode("\n"));
        setTimeout(typeNext, 140 + Math.random() * 160);
      } else {
        bootLog.appendChild(document.createTextNode(line + "\n"));
        setTimeout(typeNext, line === "" ? 120 : 90);
      }
    };
    setTimeout(typeNext, 250);
    addEventListener("keydown", endBoot, { once: false });
    boot.addEventListener("click", endBoot);
    setTimeout(endBoot, 4500); // hard cap
  } else if (boot) {
    endBoot();
  }

  /* ============ HERO TYPED ============ */
  const typedEl = $("#typed");
  const ROLES = ["веб-интерфейсы", "python-скрипты", "ctf-таски", "arch linux, btw", "чистый код"];
  if (typedEl) {
    if (reducedMotion) {
      typedEl.textContent = ROLES[0];
    } else {
      let ri = 0, ci = 0, deleting = false;
      const tick = () => {
        const word = ROLES[ri];
        ci += deleting ? -1 : 1;
        typedEl.textContent = word.slice(0, ci);
        let delay = deleting ? 38 : 75;
        if (!deleting && ci === word.length) { delay = 1900; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % ROLES.length; delay = 350; }
        setTimeout(tick, delay);
      };
      setTimeout(tick, 900);
    }
  }

  /* ============ REVEAL ON SCROLL ============ */
  const revealObs = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealObs.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => revealObs.observe(el));

  /* ============ NAV ACTIVE + HEADER SHADOW ============ */
  const header = $("#topbar");
  addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", scrollY > 10);
  }, { passive: true });

  const navLinks = $$("[data-nav]");
  const sectionObs = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        navLinks.forEach((a) => a.classList.toggle("active", a.hash === "#" + e.target.id));
      }
    }
  }, { rootMargin: "-40% 0px -55% 0px" });
  ["terminal", "about", "skills", "projects", "contact"].forEach((id) => {
    const s = document.getElementById(id);
    if (s) sectionObs.observe(s);
  });

  /* ============ MOBILE MENU ============ */
  const menuToggle = $("#menu-toggle");
  const mobileMenu = $("#mobile-menu");
  const closeMenu = () => {
    mobileMenu?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    mobileMenu?.setAttribute("aria-hidden", "true");
  };
  menuToggle?.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
  });
  $$("#mobile-menu a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ============ MATRIX RAIN ============ */
  const matrixCanvas = $("#matrix");
  let matrixOn = false, matrixRAF = 0, matrixCols = [];
  const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>/\\[]{}$#*+=";

  function matrixResize() {
    if (!matrixCanvas) return;
    matrixCanvas.width = innerWidth;
    matrixCanvas.height = innerHeight;
    const colW = 16;
    matrixCols = Array(Math.ceil(innerWidth / colW)).fill(0).map(() => Math.random() * -50);
  }

  function matrixDraw() {
    if (!matrixOn) return;
    const ctx = matrixCanvas.getContext("2d");
    const ph = getComputedStyle(document.documentElement).getPropertyValue("--ph").trim() || "#3dfa9e";
    ctx.fillStyle = "rgba(7, 9, 13, 0.09)";
    ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    ctx.font = "15px 'JetBrains Mono', monospace";
    matrixCols.forEach((y, x) => {
      const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      const px = x * 16;
      ctx.fillStyle = Math.random() > 0.975 ? "#eafff4" : ph;
      ctx.fillText(ch, px, y * 16);
      matrixCols[x] = y * 16 > matrixCanvas.height && Math.random() > 0.98 ? 0 : y + 1;
    });
    matrixRAF = requestAnimationFrame(matrixDraw);
  }

  function toggleMatrix(force) {
    if (!matrixCanvas || reducedMotion) {
      termPrint("matrix: отключено (reduced-motion включён — пожалей глаза)", "out");
      return;
    }
    matrixOn = force !== undefined ? force : !matrixOn;
    matrixCanvas.hidden = !matrixOn;
    if (matrixOn) {
      matrixResize();
      matrixDraw();
      termPrint("добро пожаловать в пустыню реального. esc — выход", "ok");
    } else {
      cancelAnimationFrame(matrixRAF);
    }
  }
  addEventListener("resize", () => matrixOn && matrixResize(), { passive: true });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && matrixOn) toggleMatrix(false); });

  /* ============ THEME ============ */
  function setTheme(name) {
    if (name !== "green" && name !== "amber") return false;
    document.documentElement.dataset.theme = name;
    return true;
  }

  /* ============ TERMINAL ============ */
  const termOut = $("#term-out");
  const termInput = $("#term-input");
  const termBody = $("#term-body");
  const history = [];
  let histIdx = -1;

  function termPrint(text = "", cls = "out") {
    const div = document.createElement("div");
    div.className = cls;
    div.textContent = text;
    termOut.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
    return div;
  }

  function termPrintHTML(html, cls = "out") {
    const div = document.createElement("div");
    div.className = cls;
    div.innerHTML = html; // только доверенный html из кода ниже
    termOut.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
    return div;
  }

  function termPrintPre(text, cls = "out") {
    const pre = document.createElement("pre");
    pre.className = cls;
    pre.textContent = text;
    termOut.appendChild(pre);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function echoCommand(cmd) {
    const line = document.createElement("div");
    line.className = "cmd-line";
    const p = document.createElement("span");
    p.className = "p";
    p.textContent = "guest@retr1kze:~$ ";
    line.appendChild(p);
    line.appendChild(document.createTextNode(cmd));
    termOut.appendChild(line);
  }

  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const link = (href, label, external = true) =>
    `<a class="link" href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>`;

  const NEOFETCH_ASCII = [
    "       /\\",
    "      /  \\",
    "     /\\   \\",
    "    /      \\",
    "   /   ,,   \\",
    "  /   |  |  -\\",
    " /_-''    ''-_\\",
    "",
  ];
  const fmtUptime = () => {
    const s = Math.floor((Date.now() - SESSION_START) / 1000);
    return `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };
  const pad = (s, n) => (s + " ".repeat(n)).slice(0, Math.max(n, s.length));

  /* --- данные для fallback --- */
  const FALLBACK_REPOS = [
    { name: "krasctf-platform", description: "Платформа для проведения CTF-соревнований: таски, скорборд, флаги.", language: "Python", stargazers_count: 0, forks_count: 0, pushed_at: new Date().toISOString(), fork: false, html_url: "https://github.com/Error8089/krasctf-platform" },
    { name: "retr1kze-support-bot", description: "Telegram-бот поддержки: тикеты, автоответы, модерация.", language: "Python", stargazers_count: 0, forks_count: 0, pushed_at: new Date().toISOString(), fork: false, html_url: "https://github.com/Error8089/retr1kze-support-bot" },
    { name: "Error8089.github.io", description: "Этот сайт — портфолио v2 «console edition».", language: "HTML", stargazers_count: 0, forks_count: 0, pushed_at: new Date().toISOString(), fork: false, html_url: "https://github.com/Error8089/Error8089.github.io" },
  ];
  const DESC_OVERRIDE = {
    "krasctf-platform": "Платформа для проведения CTF-соревнований: таски, скорборд, флаги.",
    "retr1kze-support-bot": "Telegram-бот поддержки: тикеты, автоответы, модерация.",
    "Error8089.github.io": "Этот сайт — портфолио v2 «console edition».",
  };

  const relTime = (iso) => {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return "только что";
    if (diff < 3600) return `${Math.floor(diff / 60)} мин. назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч. назад`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} дн. назад`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} мес. назад`;
    return new Date(iso).toLocaleDateString("ru-RU");
  };

  const COMMANDS = {
    help() {
      termPrint(
`доступные команды:
  ${pad("help", 11)}этот список
  ${pad("whoami", 11)}кто здесь
  ${pad("neofetch", 11)}инфа о системе
  ${pad("skills", 11)}навыки (как pacman -Qs)
  ${pad("projects", 11)}живые репозитории с GitHub
  ${pad("contact", 11)}как связаться
  ${pad("theme", 11)}фосфор: theme green | theme amber
  ${pad("matrix", 11)}ты знаешь, что делать
  ${pad("echo", 11)}echo <текст>
  ${pad("date", 11)}дата и время
  ${pad("ls / cat", 11)}файлы
  ${pad("history", 11)}история команд
  ${pad("clear", 11)}очистить экран (или Ctrl+L)
подсказки: ↑↓ — история · Tab — автодополнение · попробуй sudo`, "out-strong");
    },

    whoami() {
      termPrint("retr1kze — разработчик, CTF-энтузиаст, убеждённый архарист.", "out-strong");
      termPrint("стек: python · js · html/css · linux · git", "out");
      termPrint("статус: открыт к идеям и коллаборациям", "ok");
    },

    neofetch() {
      const theme = document.documentElement.dataset.theme === "amber" ? "phosphor-amber" : "phosphor-green";
      const info = [
        "guest@retr1kze",
        "─────────────────",
        "OS:       Arch Linux x86_64 (btw)",
        "Host:     error8089.github.io",
        "Shell:    bash 5.2 (эмуляция)",
        "WM:       Hyprland",
        "Editor:   neovim",
        `Theme:    ${theme}`,
        `Uptime:   ${fmtUptime()}`,
        "Packages: 16 (pacman)",
        "",
        "«Talk is cheap. Show me the code.»",
      ];
      const lines = NEOFETCH_ASCII.map((a, i) => pad(a, 24) + (info[i] ?? ""));
      termPrintPre(lines.join("\n"), "ok");
    },

    skills() {
      termPrintPre(
`[frontend]  html5 5.0-1 · css3 3.0-2 · javascript ES2026-1 · responsive
[python]    python 3.13-1 · flask 3.0* · sqlite* · rest*
[tools]     git 2.56-1 · linux 6.x-1 · arch btw-1 · hyprland · neovim
[security]  ctf 2026-1 · websec owasp-1 · crypto* · stego*
* — собирается из AUR (в процессе освоения)`, "out-strong");
    },

    async projects() {
      const loading = termPrint("fetching repos…", "out");
      let repos = null;
      try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=10`);
        if (res.ok) repos = await res.json();
      } catch { /* сеть */ }
      loading.remove();
      if (!repos || !repos.length) {
        repos = FALLBACK_REPOS;
        termPrint("github api молчит — показываю локальный кэш", "err");
      }
      termPrint("репозитории Error8089:", "out-strong");
      repos.slice(0, 6).forEach((r) => {
        termPrintHTML(
          `  ${link(r.html_url, pad(r.name, 24))}<span class="dim">★ ${r.stargazers_count} · ⑂ ${r.forks_count} · ${esc(r.language || "—")} · ${relTime(r.pushed_at)}</span>`
        );
      });
    },

    contact() {
      termPrintHTML(`email:   ${link("mailto:rootk1tretr0@gmail.com", "rootk1tretr0@gmail.com", false)}`);
      termPrintHTML(`github:  ${link("https://github.com/Error8089", "github.com/Error8089")}`);
      termPrint("пиши — отвечу. честное пингующее слово.", "ok");
    },

    socials() { COMMANDS.contact(); },

    clear() {
      termOut.innerHTML = "";
    },

    echo(args) {
      termPrint(args.join(" ") || "", "out-strong");
    },

    date() {
      termPrint(new Date().toLocaleString("ru-RU", { dateStyle: "full", timeStyle: "medium" }), "out-strong");
    },

    history() {
      history.forEach((h, i) => termPrintPre(`${String(i + 1).padStart(3)}  ${h}`));
      if (!history.length) termPrint("история пуста — ты ещё ничего не натворил", "out");
    },

    ls() {
      termPrint("about.txt   skills.txt   contacts.txt   README.md   secret/", "out-strong");
    },

    cat(args) {
      const file = (args[0] || "").toLowerCase();
      if (file === "about.txt") {
        termPrint("разработчик, который любит доводить вещи от идеи до результата.", "out-strong");
        termPrint("python, веб, ctf, arch + hyprland. подробнее — в секции «обо мне» выше.", "out");
      } else if (file === "skills.txt") {
        COMMANDS.skills();
      } else if (file === "contacts.txt") {
        COMMANDS.contact();
      } else if (file === "readme.md") {
        termPrint("# привет — это портфолио v2 «console edition»", "out-strong");
        termPrint("сделано на чистом html/css/js. без фреймворков, как и учил линус.", "out");
      } else if (file.startsWith("secret")) {
        termPrint("cat: secret/: это директория. попробуй ls secret/", "err");
      } else {
        termPrint(`cat: ${file || "?"}: нет такого файла`, "err");
      }
    },

    theme(args) {
      const t = (args[0] || "").toLowerCase();
      if (setTheme(t)) {
        termPrint(`фосфор переключён: ${t}. красота.`, "ok");
      } else {
        termPrint("usage: theme green | theme amber", "err");
      }
    },

    matrix() { toggleMatrix(); },

    pacman(args) {
      if (args.join(" ").includes("-Syu")) {
        termPrint("warning: обновлять систему во время собеседования — дурной тон", "err");
        termPrint(":: Но ладно: core · extra · aur — всё уже latest. btw.", "ok");
      } else {
        termPrint("error: для этой операции нужны права root. и настоящий терминал.", "err");
      }
    },

    sudo(args) {
      const cmd = args.join(" ");
      if (cmd.includes("rm -rf")) {
        termPrint("[sudo] пароль для guest: *******", "out");
        setTimeout(() => {
          termPrint("обнаружена совесть. операция отменена.", "err");
          termPrint("сайт спасён. спасибо, что не настоящий rm 😅", "ok");
        }, 700);
      } else if (cmd === "make me a sandwich") {
        termPrint("ok. 🥪", "ok");
      } else {
        termPrint("guest отсутствует в файле sudoers. об инциденте уже доложили.", "err");
      }
    },

    exit() {
      termPrint("logout", "out-strong");
      setTimeout(() => termPrint("…шучу. это твой браузер, а не ssh. останься 🙃", "ok"), 500);
    },
  };

  function exec(raw) {
    const cmd = raw.trim();
    echoCommand(cmd);
    if (!cmd) return;
    history.push(cmd);
    histIdx = history.length;

    const parts = cmd.split(/\s+/);
    const name = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (name === "sudo") return COMMANDS.sudo(args);
    if (name === "pacman") return COMMANDS.pacman(args);
    const fn = COMMANDS[name];
    if (fn) return fn(args);
    termPrint(`bash: ${name}: команда не найдена (подсказка: help)`, "err");
  }

  if (termInput && termBody) {
    termBody.addEventListener("click", () => termInput.focus());
    termInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        exec(termInput.value);
        termInput.value = "";
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (histIdx > 0) termInput.value = history[--histIdx] ?? "";
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (histIdx < history.length - 1) termInput.value = history[++histIdx];
        else { histIdx = history.length; termInput.value = ""; }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const val = termInput.value.trim();
        if (val && !val.includes(" ")) {
          const match = Object.keys(COMMANDS).filter((c) => c.startsWith(val.toLowerCase()));
          if (match.length === 1) termInput.value = match[0] + " ";
          else if (match.length > 1) { echoCommand(val); termPrint(match.join("  "), "out"); }
        }
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        COMMANDS.clear();
      } else if (e.key === "c" && e.ctrlKey) {
        echoCommand(termInput.value + "^C");
        termInput.value = "";
      }
    });

    // быстрые команды-чипы
    $$(".chip-cmd").forEach((chip) => {
      chip.addEventListener("click", () => {
        const cmd = chip.dataset.cmd;
        termInput.focus();
        exec(cmd);
        termBody.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
      });
    });

    // приветствие
    termPrint("последний вход: сегодня, из браузера guest", "out");
    const greet = document.createElement("div");
    greet.className = "out";
    const greetCode = document.createElement("code");
    greetCode.textContent = "help";
    greet.append("введи ", greetCode, " и жми Enter — тут всё живое");
    termOut.appendChild(greet);
  }

  /* ============ GITHUB LIVE DATA ============ */
  async function loadUser() {
    try {
      const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
      if (!res.ok) return;
      const u = await res.json();
      $$('[data-stat="followers"]').forEach((el) => (el.textContent = u.followers));
      $$('[data-stat="repos"]').forEach((el) => (el.textContent = u.public_repos));
      $$('[data-stat="since"]').forEach((el) => (el.textContent = new Date(u.created_at).getFullYear()));
    } catch { /* тихо */ }
  }

  const LANG_COLORS = {
    Python: "#3572A5", JavaScript: "#f1e05a", HTML: "#e34c26", CSS: "#563d7c",
    TypeScript: "#3178c6", Shell: "#89e051", C: "#555555", "C++": "#f34b7d",
    Java: "#b07219", "Vim Script": "#199f4b", Dockerfile: "#384d54", Rust: "#dea584",
  };

  async function loadRepos() {
    const grid = $("#projects-grid");
    if (!grid) return;
    let repos = null;
    try {
      const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=10`);
      if (res.ok) repos = await res.json();
    } catch { /* сеть */ }
    if (!repos || !repos.length) {
      repos = FALLBACK_REPOS;
      toast("GitHub API недоступен — показываю кэш");
    }

    grid.innerHTML = "";
    repos.slice(0, 6).forEach((r, i) => {
      const card = document.createElement("article");
      card.className = "project-card reveal in" + (r.fork ? " is-fork" : "");
      card.style.setProperty("--delay", `${i * 0.06}s`);

      const name = document.createElement("h3");
      name.className = "project-name";
      const dot = document.createElement("span");
      dot.className = "project-lang-dot";
      dot.style.background = LANG_COLORS[r.language] || "#7f9099";
      dot.title = r.language || "—";
      name.append(dot, r.name);

      const desc = document.createElement("p");
      desc.className = "project-desc";
      desc.textContent = DESC_OVERRIDE[r.name] || r.description || "без описания — код говорит сам за себя";

      const meta = document.createElement("div");
      meta.className = "project-meta";
      meta.innerHTML =
        `<span class="stat"><svg class="icon"><use href="#i-star"/></svg>${r.stargazers_count}</span>` +
        `<span class="stat"><svg class="icon"><use href="#i-fork"/></svg>${r.forks_count}</span>` +
        `<span class="stat project-updated">${relTime(r.pushed_at)}</span>`;

      card.append(name, desc, meta);
      card.addEventListener("click", () => open(r.html_url, "_blank", "noopener"));
      grid.appendChild(card);
    });
  }

  loadUser();
  loadRepos();

  /* ============ FOOTER: год + uptime ============ */
  $("#year") && ($("#year").textContent = new Date().getFullYear());
  const uptimeEl = $("#uptime");
  uptimeEl && setInterval(() => (uptimeEl.textContent = fmtUptime()), 1000);

  /* ============ COPY EMAIL ============ */
  const EMAIL = "rootk1tretr0@gmail.com";
  const copyBtn = $("#copy-email");
  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      toast("email скопирован — жду письмо ✉");
    } catch {
      toast(EMAIL);
    }
  });

  /* ============ KONAMI ============ */
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let ki = 0;
  addEventListener("keydown", (e) => {
    ki = e.key === KONAMI[ki] ? ki + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (ki === KONAMI.length) {
      ki = 0;
      toast("↑↑↓↓←→←→BA — чит-код принят: +30 к хакерскому навыку");
      if (termOut) { echoCommand(" achievement unlock"); termPrint("HACKER_MINDSET +30 exp", "ok"); }
    }
  });
})();
