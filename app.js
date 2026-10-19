/**
 * Nelson — taipei49314.github.io
 *
 * Plain script, no modules and no dependencies, so index.html also works
 * when opened straight from disk (file://).
 *
 * What lives here:
 *   1. SITE and EN: contact details and every English string. The Chinese
 *      text is the HTML itself; it is captured at load and restored on toggle.
 *   2. Mode: "is-scrub" (scroll-driven hero) or "is-static" (reduced motion,
 *      no IntersectionObserver or no sticky). Without JS the page is static.
 *   3. createAnamorph(): cuts a PUNCTUM CI screenshot into tiles, places each
 *      tile on the ray from the painter's eye E at its own depth, and projects
 *      them with a real perspective camera. At E the tiles land exactly on the
 *      painting; anywhere else it opens up in depth. Renders on demand only.
 *   4. The hero (scroll), the PUNCTUM stage (slider), the three tool demos,
 *      the header and the copy buttons.
 */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   * 1. Content
   * ------------------------------------------------------------------ */

  const SITE = {
    email: "taipei840428@gmail.com",
    github: "https://github.com/taipei49314",
  };

  // English for every data-i18n / data-i18n-html key and every
  // data-i18n-attr key. Strings are authored here, never user input, so
  // they may carry <br>, <sup> and <a> markup.
  const EN = {
    "meta.title": "Nelson — Every stroke has to line up",
    "meta.desc":
      "Nelson (@taipei49314), an independent developer in Taipei. Tools that check what AI coding agents hand in: checkwash (code changes), pinwash (agent sessions), ledgerwash (work ledgers). And a Starry Night you can walk into: PUNCTUM.",

    "nav.skip": "Skip to the tools",
    "nav.label": "Primary",
    "nav.tools": "Tools",
    "nav.contact": "Contact",
    "nav.lang": "中文",
    "nav.langLabel": "切換成中文",
    "nav.langCode": "zh-Hant",

    "hero.alt":
      "The Starry Night as PUNCTUM renders it from point E: swirling sky, moon, cypress and village.",
    "hero.canvasLabel":
      "Pieces of the painting sit at different depths; as you scroll, the camera walks to point E, where they form The Starry Night.",
    "hero.eyebrow": "Nelson · independent developer in Taipei",
    "hero.title": "Every stroke<br />has to line up.",
    "hero.sub":
      "I write tools that check what AI coding agents hand in, and I built a Starry Night you can walk into.",
    "hero.ctaTools": "See the tools ›",
    "hero.cue": "Scroll to stand where the painter stood",
    "hero.moving":
      "Keep going. Each piece stays on its own ray; you are the one moving, and the closer you get to E, the closer they come to their places in the painting.",
    "hero.locked":
      'Right here: point E. Only from this one point do the pieces form The Starry Night.<sup><a href="#fn-1" id="ref-1a">1</a></sup>',
    "hero.bridgeTitle": "So does<br />every “pass.”",
    "hero.bridgeSub":
      "A passing test, an agent saying “done,” a closed task: each one should line up with evidence.",
    "hero.mapCw": "A passing test",
    "hero.mapPw": "An agent saying “done”",
    "hero.mapLw": "A closed task",

    "demo.steps": "Example steps",
    "facts.version": "Version",
    "facts.status": "Status",
    "facts.license": "License",
    "facts.needs": "Needs",
    "links.github": "View on GitHub ↗",
    "ui.copy": "Copy",
    "ui.replay": "Replay",
    "ui.spec": "Version, license and requirements",

    "cw.kicker": "reads one code change",
    "cw.title": "Green doesn't<br />mean checked.",
    "cw.lead":
      "Sometimes an AI agent gets a test to pass by loosening the test. checkwash reads your git diff, compares the test's syntax tree before and after, and flags that kind of change. It never runs your code, stays offline while it analyzes, and uses no LLM.",
    "cw.btnBefore": "Before",
    "cw.btnAfter": "After",
    "cw.btnFlagged": "What checkwash sees",
    "cw.flagText": "this line: an exact equality loosened to a range",
    "cw.capBefore": "Before: only 105.3 passes. Any other answer fails the test.",
    "cw.capAfter": "After: 3, 42, 160 and 999.9 pass too. The test is still green.",
    "cw.capFlagged":
      'checkwash flags the line as ASSERT_WEAKENED: an exact equality loosened to a range.<sup><a href="#fn-2" id="ref-2a">2</a></sup>',
    "cw.body":
      'It also flags deleted asserts, new skips, looser tolerances, and CI steps that can no longer fail. Python comes first; JS/TS covers a limited set of patterns, and legitimate refactors can get flagged too.<sup><a href="#fn-3" id="ref-3a">3</a></sup>',
    "cw.limits": "When nothing fires, it says “no known tampering pattern detected.” Not “no cheating.”",
    "cw.status": "alpha, pre-1.0",
    "cw.try":
      "Try it: download checkwash.pyz from the v0.8.0 release, then check your last commit from the repo root.",
    "cw.linkRelease": "Download v0.8.0 ↗",
    "cw.linkLimits": "Known limits ↗",
    "cw.pipx": "You can also install it with pipx install checkwash==0.8.0 and run checkwash check HEAD~1..HEAD.",
    "cw.buildersTitle": "Building a PR-review or CI tool?",
    "cw.buildersBody":
      "checkwash is designed to be embedded in tools like yours. Run it once and read the JSON; there is SARIF output and a GitHub Action too. To actually block merges, make the checkwash status check required. Formats may still change before 1.0, so pin the exact version in CI, and tell me what you'd need.",
    "cw.integrate": "Exit codes and docs",
    "cw.exitCaption": "Exit codes (--format json)",
    "cw.exit0": "Pass: no finding that has to block",
    "cw.exit1": "Block: an unexempted finding at or above the threshold (high by default)",
    "cw.exit2": "Error: couldn't analyze. Never means “no findings.”",
    "cw.linkEmbed": "Embedding guide ↗",
    "cw.linkSchema": "Findings JSON schema ↗",
    "cw.linkStability": "Compatibility notes ↗",
    "cw.mainNote": "The embedding guide and the findings schema live only on main; they are not in the v0.8.0 tag.",

    "pw.kicker": "reads one agent session",
    "pw.title": "Pin where<br />it started.",
    "pw.lead":
      "Before the agent starts, pinwash records the current commit as BASE. When it's done, everything it changed, committed or not, is compared against BASE.",
    "pw.btnEvents": "What happened",
    "pw.btnPlain": "Last step only",
    "pw.btnPinned": "From BASE",
    "pw.ev1": "adds an exemption (.pinwash/allow.toml)",
    "pw.ev2": "uncommitted: the Stop hook that guards the work now runs exit 0",
    "pw.missed": "last step only: not flagged",
    "pw.capEvents":
      "The agent commits an exemption, then, without committing, rewrites the Stop hook that guards its work to exit 0.",
    "pw.capPlain":
      "Compare only HEAD with the worktree and exemptions are read from HEAD: the agent's own new exemption is trusted, and the hook change gets through. Check only the last commit and you never see the uncommitted edit.",
    "pw.capPinned":
      'pinwash runs three comparisons: BASE..HEAD, BASE..WORKTREE and HEAD..WORKTREE. The two that start at BASE read exemptions only from the pinned BASE, so the hook rewritten to exit 0 is flagged in BASE..WORKTREE, and the new exemption is listed too, waiting for a human to review it.<sup><a href="#fn-2" id="ref-2b">2</a></sup>',
    "pw.body":
      'It watches the things that decide whether “done” can be trusted: CI workflows, agent hooks, exemption rules, required status checks. pinwash gives a verdict, but it doesn\'t block anything for you.<sup><a href="#fn-4" id="ref-4a">4</a></sup>',
    "pw.status": "Alpha (pre-release), accepted on Linux only so far",
    "pw.try":
      "Try it: install it where the agent can't reach. Run pinwash session start before the agent begins, and pinwash session review once the agent and everything it launched have stopped.",
    "pw.linkQuickstart": "Quickstart ↗",

    "lw.kicker": "reads a work ledger",
    "lw.title": "Done?<br />Show the receipts.",
    "lw.lead":
      "An agent hands off a task marked done. ledgerwash reads the work ledger and handoff receipts at a pinned commit, read-only, and flags closures the evidence can't support.",
    "lw.earliest": "earliest operation receipt in the ledger: 2026-04-01",
    "lw.r1closed": "closed 2026-10-17",
    "lw.r1receipts": "0 operation receipts",
    "lw.r1why": "Marked done, without a single operation receipt.",
    "lw.r2closed": "closed 2026-03-02",
    "lw.r2receipts": "0 operation receipts",
    "lw.r2born": "task file created 2026-10-12",
    "lw.r2why":
      "The closing date is earlier than the receipt system itself, but the task file's own git history says it was created later.",
    "lw.cap":
      'Both are marked DONE and neither has a receipt; ledgerwash tells the two cases apart by the closing time. Task IDs and dates are illustrative.<sup><a href="#fn-2" id="ref-2c">2</a></sup>',
    "lw.body":
      '“checkwash guards the diff; ledgerwash guards the ledger.” For now it reads one ledger layout (the ec-ledger adapter); a repo with no ledger is reported as not covered, never as clean.<sup><a href="#fn-5" id="ref-5a">5</a></sup>',
    "lw.status": "pre-1.0",
    "lw.try": "Try it: once it's installed, write down the commit SHA you want to judge and scan pinned to that commit.",
    "lw.source": "From a source checkout, the README uses uv: uv run ledgerwash scan <repo> --at <pinned-sha>.",

    "fam.title": "Three tools,<br />each on its own.",
    "fam.lead": "They are not a pipeline; each one watches one place. They share only a few rules:",
    "fam.p1": "They run on your machine. Analysis uses no network and sends your code nowhere.",
    "fam.p2": "Same input, same answer. No language model guessing.",
    "fam.p3": "They never run the code they check.",
    "fam.p4": "They never claim more than they do. A pass isn't proof, and pre-1.0 says pre-1.0.",
    "fam.colTool": "Tool",
    "fam.colReads": "Reads",
    "fam.colFlags": "Flags",
    "fam.colStatus": "Status",
    "fam.asOf": "Versions and status as of 2026-10-19.",
    "fam.cwReads": "the git diff of one code change",
    "fam.cwFlags": "weakened tests and CI checks",
    "fam.cwStatus": "v0.8.0 · alpha",
    "fam.pwReads": "one agent session (BASE, HEAD, worktree)",
    "fam.pwFlags": "weakened gates (CI, hooks, required checks), new exemptions",
    "fam.pwStatus": "v0.1.1 · Alpha",
    "fam.lwReads": "the work ledger and handoff receipts",
    "fam.lwFlags": "closures the evidence can't support",
    "fam.lwStatus": "v0.5.0 · pre-1.0",

    "pn.title": "About 181,000 strokes.<br />One place to stand.",
    "pn.lead":
      "Thirty Van Gogh paintings, made into thirty 3D worlds you can walk into. Every stroke sits on a ray from point E and is painted bigger the farther away it is, so from E each one looks exactly the right size and the painting comes back together. Step away from E and the painting opens into a world.",
    "pn.stageAlt": "Road with Cypress and Star as PUNCTUM renders it from point E.",
    "pn.canvasLabel":
      "Road with Cypress and Star, cut into small pieces at different depths. Move the camera to see the painting open up in space as it leaves E.",
    "pn.viewLabel": "Preset viewpoints",
    "pn.poseE": "From E",
    "pn.poseLift": "Lift the camera",
    "pn.poseWalk": "Walk in",
    "pn.slider": "Camera position",
    "pn.stageCaption":
      'A 2D sketch made by cutting a PUNCTUM CI screenshot into many small pieces; the real work renders live with three.js.<sup><a href="#fn-1" id="ref-1b">1</a></sup>',
    "pn.cmpEAlt": "Road with Cypress and Star seen from point E: the strokes form the whole painting.",
    "pn.cmpE": "From E",
    "pn.cmpECap": "XXIV Road with Cypress and Star, 57,450 strokes",
    "pn.cmpOffAlt":
      "The same painting with the camera away from point E: the strokes of sky, cypress and ground scatter and show the space behind the painting.",
    "pn.cmpOff": "Away from E",
    "pn.cmpOffCap": "the same painting, seen from the side",
    "pn.galleryTitle": "Six of the thirty worlds",
    "pn.g1": "Starry Night Over the Rhône",
    "pn.g2": "Sunflowers",
    "pn.g3": "Wheatfield with Crows",
    "pn.g4": "Café Terrace at Night",
    "pn.g5": "Wheat Field with Cypresses",
    "pn.g6": "The Bedroom in Arles, away from E",
    "pn.g6alt": "The Bedroom in Arles, with the camera away from point E",
    "pn.galleryNote":
      "Numbers are the stroke count of each world. Images and numbers come from the starry-night-3d CI screenshots and verification report (main 015d0fb, 2026-10-19).",
    "pn.open": "Open the live demo ↗",
    "pn.single": "Single-file version ↗",
    "pn.facts":
      "TypeScript · three.js r186 (WebGL 2) · MIT. No textures, models or audio files; even the sound is synthesized live. Needs a browser with WebGL 2.",

    "ct.title": "Write to me.",
    "ct.lead":
      "Building a PR-review or CI tool and want to plug checkwash in? Hit a false positive or a miss on your own repo? Or just want to talk about procedural painting? All welcome, in English or 中文.",
    "ct.mail": "Email me",
    "ct.copy": "Copy address",
    "ct.issues": "Report a problem:",
    "ct.about": "I'm Nelson, an independent developer. Taipei · UTC+8",

    "fn.title": "Notes",
    "fn.1":
      "The two moving pictures on this page are 2D sketches: CI screenshots of PUNCTUM cut into many small pieces and put back into 3D space. PUNCTUM itself renders live with three.js (WebGL 2): about 181,000 strokes in The Starry Night, roughly 47,000 to 130,000 in the other worlds.",
    "fn.2":
      "The diffs, task IDs and dates on this page are illustrative. Rule names come from each project's SPEC; see each project's README for the real output.",
    "fn.3":
      "checkwash flags known patterns of weakened tests. No findings doesn't mean the code is correct, and exit 2 is an analysis error, not a pass.",
    "fn.4":
      "pinwash is Alpha (v0.1.1 pre-release). It gives a verdict but doesn't block anything for you, and no findings doesn't mean your checks actually ran. Package acceptance so far covers Linux only; Windows and macOS are not yet validated.",
    "fn.5":
      "ledgerwash checks only evidence that can be verified mechanically. It compares the dates the ledger claims, not trusted timestamps, and exit 0 doesn't mean a ledger is honest.",
    "fn.back": "Back to text",
    "fn.backPn": "Back to the PUNCTUM sketch",
    "fn.backCw": "a, back to the checkwash example",
    "fn.backPw": "b, back to the pinwash example",
    "fn.backLw": "c, back to the ledgerwash example",
    "fn.colophon":
      "© 2026 Nelson (@taipei49314) · Plain HTML, CSS and JavaScript, no dependencies. The original Starry Night was painted by Vincent van Gogh in 1889.",
    "fn.top": "Back to top ↑",
  };

  // Strings that only JavaScript shows.
  const UI = {
    zh: {
      copy: "複製",
      copied: "已複製",
      selectedShort: "已選取",
      emailCopied: "信箱已複製。",
      selected: "已選取，請按 Ctrl+C（Mac 是 ⌘C）複製。",
      poseE: "從 E 看",
      lifting: "抬起鏡頭",
      walking: "走進去",
    },
    en: {
      copy: "Copy",
      copied: "Copied",
      selectedShort: "Selected",
      emailCopied: "Address copied.",
      selected: "Selected. Press Ctrl+C (⌘C on a Mac) to copy.",
      poseE: "From E",
      lifting: "Lifting the camera",
      walking: "Walking in",
    },
  };

  /* ------------------------------------------------------------------ *
   * 2. Small helpers
   * ------------------------------------------------------------------ */

  const root = document.documentElement;
  const reduceMQ = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  let lang = "zh";

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const clamp01 = (v) => clamp(v, 0, 1);
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function motionOK() {
    return !(reduceMQ && reduceMQ.matches);
  }

  function canScrub() {
    return (
      motionOK() &&
      "IntersectionObserver" in window &&
      !!(window.CSS && CSS.supports && CSS.supports("position", "sticky")) &&
      !!document.createElement("canvas").getContext
    );
  }

  // Seeded PRNG so the tile layout is the same on every visit.
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      /* private mode or blocked storage: the choice just isn't remembered */
    }
  }

  /* ------------------------------------------------------------------ *
   * 3. Language
   * ------------------------------------------------------------------ */

  const zhText = new Map(); // element -> original (zh) innerHTML
  const zhAttr = new Map(); // element -> [{ name, key, value }]
  let zhTitle = "";
  let zhDesc = "";

  function parseAttrSpec(spec) {
    return spec
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const i = part.indexOf(":");
        return { name: part.slice(0, i).trim(), key: part.slice(i + 1).trim() };
      });
  }

  function captureChinese() {
    document.querySelectorAll("[data-i18n], [data-i18n-html]").forEach((el) => {
      zhText.set(el, el.innerHTML);
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const list = parseAttrSpec(el.getAttribute("data-i18n-attr")).map((item) => ({
        name: item.name,
        key: item.key,
        value: el.getAttribute(item.name),
      }));
      zhAttr.set(el, list);
    });
    zhTitle = document.title;
    const desc = document.querySelector('meta[name="description"]');
    zhDesc = desc ? desc.getAttribute("content") : "";
  }

  function applyLanguage(next) {
    lang = next === "en" ? "en" : "zh";
    root.lang = lang === "en" ? "en" : "zh-Hant";

    zhText.forEach((zh, el) => {
      const key = el.getAttribute("data-i18n") || el.getAttribute("data-i18n-html");
      if (lang === "en" && !(key in EN)) console.warn("[i18n] missing EN string:", key);
      el.innerHTML = lang === "en" && key in EN ? EN[key] : zh;
    });

    zhAttr.forEach((list, el) => {
      list.forEach((item) => {
        if (lang === "en" && !(item.key in EN)) console.warn("[i18n] missing EN string:", item.key);
        const value = lang === "en" && item.key in EN ? EN[item.key] : item.value;
        if (value === null) el.removeAttribute(item.name);
        else el.setAttribute(item.name, value);
      });
    });

    document.title = lang === "en" ? EN["meta.title"] : zhTitle;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", lang === "en" ? EN["meta.desc"] : zhDesc);
    document.dispatchEvent(new Event("langchange"));
  }

  // One visually hidden polite live region for feedback that has no visible
  // text of its own (demo step changes, command copy).
  function announce(text) {
    const live = document.getElementById("sr-live");
    if (!live) return;
    live.textContent = "";
    setTimeout(() => {
      live.textContent = text;
    }, 30);
  }

  function initLanguage() {
    captureChinese();
    let initial = storageGet("lang");
    const params = new URLSearchParams(window.location.search);
    if (params.get("lang") === "en" || params.get("lang") === "zh") initial = params.get("lang");
    if (initial === "en") applyLanguage("en");

    const toggle = document.getElementById("lang-toggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        applyLanguage(lang === "en" ? "zh" : "en");
        storageSet("lang", lang);
        // A ?lang= in the address would override this choice on reload.
        try {
          const url = new URL(window.location.href);
          if (url.searchParams.has("lang")) {
            url.searchParams.delete("lang");
            window.history.replaceState(null, "", url.toString());
          }
        } catch (e) {
          /* file:// or an old browser: the stored choice still applies */
        }
      });
    }
  }

  /* ------------------------------------------------------------------ *
   * 4. Anamorphic tile engine
   * ------------------------------------------------------------------ */

  // Camera on a sphere around a pivot on the axis of E. yaw = pitch = 0 puts
  // the camera exactly at E (the origin), looking down +z. Screen y points
  // down, and so does world y; a negative pitch lifts the camera.
  function makeCamera(yaw, pitch, pivotZ) {
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const dx = -Math.sin(yaw) * cp;
    const dy = sp;
    const dz = -Math.cos(yaw) * cp;
    const C = [dx * pivotZ, dy * pivotZ, pivotZ + dz * pivotZ];
    const f = [-dx, -dy, -dz];
    let rx = f[2];
    let rz = -f[0];
    const rl = Math.hypot(rx, rz) || 1;
    rx /= rl;
    rz /= rl;
    const d = [f[1] * rz, f[2] * rx - f[0] * rz, -f[1] * rx];
    return { C, f, r: [rx, 0, rz], d };
  }

  function createAnamorph(canvas, cfg) {
    const ctx = canvas.getContext("2d");
    const crop = cfg.crop;
    const A = crop.w / crop.h; // painting aspect; painting space is [0, A] x [0, 1]
    const unitPx = crop.h; // image pixels per painting unit

    const state = {
      img: null,
      ready: false,
      failed: false,
      W: 0,
      H: 0,
      dpr: 1,
      cols: 0,
      tiles: [],
      order: [],
      qz: null,
      sx: null,
      sy: null,
      sc: null,
      yaw: 0,
      pitch: 0,
      lockedAt: 0,
      fewerCols: 0,
      tileFrames: 0,
      dtSum: 0,
      dtCount: 0,
      minDt: Infinity,
      slowWindows: 0,
      rebuildPending: false,
    };

    const MIN_COLS = 14;

    function chooseCols(W) {
      const base = W < 600 ? 24 : W < 1000 ? 34 : 44;
      return Math.max(MIN_COLS, Math.round(base * (cfg.densityScale || 1)));
    }

    function buildTiles() {
      const cols = Math.max(MIN_COLS, chooseCols(state.W) - state.fewerCols);
      if (cols === state.cols && state.tiles.length) return;
      state.cols = cols;
      const rows = Math.max(8, Math.round((cols * 2) / A));
      const tw = A / cols;
      const th = 1 / rows;
      const rnd = mulberry32(cfg.seed || 49314);
      const k = 1.16; // overlap, so no seams appear while tiles move
      const tiles = [];
      for (let r = 0; r < rows; r++) {
        const shift = r % 2 ? tw * 0.5 : 0;
        for (let c = -1; c <= cols; c++) {
          let x0 = c * tw + shift;
          let x1 = x0 + tw;
          let y0 = r * th;
          let y1 = y0 + th;
          x0 = Math.max(0, x0);
          x1 = Math.min(A, x1);
          if (x1 - x0 < tw * 0.15) continue;
          const mx = (x0 + x1) / 2;
          const my = (y0 + y1) / 2;
          const hw = ((x1 - x0) * k) / 2;
          const hh = ((y1 - y0) * k) / 2;
          x0 = Math.max(0, mx - hw);
          x1 = Math.min(A, mx + hw);
          y0 = Math.max(0, my - hh);
          y1 = Math.min(1, my + hh);
          const cx = (x0 + x1) / 2;
          const cy = (y0 + y1) / 2;
          const z = cfg.depth(cx / A, cy, rnd);
          tiles.push({ x0, y0, x1, y1, cx, cy, z, roll: (rnd() - 0.5) * 0.9 });
        }
      }
      state.tiles = tiles;
      state.order = tiles.map((_, i) => i);
      state.qz = new Float32Array(tiles.length);
      state.sx = new Float32Array(tiles.length);
      state.sy = new Float32Array(tiles.length);
      state.sc = new Float32Array(tiles.length);
    }

    function resize() {
      // Layout size, not getBoundingClientRect: CSS transforms (the hero's
      // bridge step scales the canvas) must not shrink the bitmap.
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (W < 10 || H < 10) return false;
      const deviceDpr = window.devicePixelRatio || 1;
      let dpr = Math.min(deviceDpr, W * H > 1.2e6 ? 1.5 : 2);
      // No point in more backing pixels than the source image can fill, but
      // keep at least 1.5x (or the device ratio) so lines stay crisp.
      const lockedH = lockedRect(cfg.fitBox(W, H)).h;
      const useful = (1.15 * crop.h) / Math.max(1, lockedH);
      dpr = Math.min(dpr, Math.max(Math.min(deviceDpr, 1.5), useful));
      if (W === state.W && H === state.H && dpr === state.dpr) return false;
      state.W = W;
      state.H = H;
      state.dpr = dpr;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      buildTiles();
      return true;
    }

    // The painting rectangle when the camera is at E (contain-fit in the box).
    function lockedRect(box) {
      const F = Math.min(box.w / A, box.h);
      const w = F * A;
      const h = F;
      return { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h, F };
    }

    function project(cam, X, Y, Z, out) {
      const vx = X - cam.C[0];
      const vy = Y - cam.C[1];
      const vz = Z - cam.C[2];
      out[0] = vx * cam.r[0] + vz * cam.r[2];
      out[1] = vx * cam.d[0] + vy * cam.d[1] + vz * cam.d[2];
      out[2] = vx * cam.f[0] + vy * cam.f[1] + vz * cam.f[2];
      return out;
    }

    const tmp = [0, 0, 0];

    // Fit the painting's depth cone (corners at a near and a far depth, plus
    // E when asked) into the box. At E every corner projects onto the painting
    // rectangle, so this reduces exactly to lockedRect().
    function fitView(cam, box, withE) {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      const add = (X, Y, Z) => {
        project(cam, X, Y, Z, tmp);
        if (tmp[2] <= 0.05) return;
        const u = tmp[0] / tmp[2];
        const v = tmp[1] / tmp[2];
        if (u < minX) minX = u;
        if (u > maxX) maxX = u;
        if (v < minY) minY = v;
        if (v > maxY) maxY = v;
      };
      const depths = [cfg.fitNear || 1, cfg.fitFar || 5.5];
      for (let i = 0; i < depths.length; i++) {
        const z = depths[i];
        add((-A / 2) * z, -0.5 * z, z);
        add((A / 2) * z, -0.5 * z, z);
        add((-A / 2) * z, 0.5 * z, z);
        add((A / 2) * z, 0.5 * z, z);
      }
      if (withE) add(0, 0, 0);
      if (!isFinite(minX) || maxX - minX < 1e-6 || maxY - minY < 1e-6) return null;
      const F = Math.min(box.w / (maxX - minX), box.h / (maxY - minY));
      return {
        F,
        ox: box.x + box.w / 2 - (F * (minX + maxX)) / 2,
        oy: box.y + box.h / 2 - (F * (minY + maxY)) / 2,
      };
    }

    function drawBrackets(rect, alpha) {
      const m = 10;
      const len = clamp(Math.min(rect.w, rect.h) * 0.06, 14, 30);
      const x0 = rect.x - m;
      const y0 = rect.y - m;
      const x1 = rect.x + rect.w + m;
      const y1 = rect.y + rect.h + m;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "#E9B949";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x0, y0 + len);
      ctx.lineTo(x0, y0);
      ctx.lineTo(x0 + len, y0);
      ctx.moveTo(x1 - len, y0);
      ctx.lineTo(x1, y0);
      ctx.lineTo(x1, y0 + len);
      ctx.moveTo(x0, y1 - len);
      ctx.lineTo(x0, y1);
      ctx.lineTo(x0 + len, y1);
      ctx.moveTo(x1 - len, y1);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x1, y1 - len);
      ctx.stroke();
      ctx.restore();
    }

    function drawEyeMarker(cam, view, alpha) {
      project(cam, 0, 0, 0, tmp);
      if (tmp[2] <= 0.05) return;
      const ex = view.ox + (view.F * tmp[0]) / tmp[2];
      const ey = view.oy + (view.F * tmp[1]) / tmp[2];
      const far = cfg.fitFar || 5.5;
      ctx.save();
      ctx.globalAlpha = alpha * 0.45;
      ctx.strokeStyle = "#E9B949";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const corners = [
        [-A / 2, -0.5],
        [A / 2, -0.5],
        [-A / 2, 0.5],
        [A / 2, 0.5],
      ];
      for (let i = 0; i < corners.length; i++) {
        project(cam, corners[i][0] * far, corners[i][1] * far, far, tmp);
        if (tmp[2] <= 0.05) continue;
        ctx.moveTo(ex, ey);
        ctx.lineTo(view.ox + (view.F * tmp[0]) / tmp[2], view.oy + (view.F * tmp[1]) / tmp[2]);
      }
      ctx.stroke();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#E9B949";
      ctx.beginPath();
      ctx.arc(ex, ey, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "700 15px ui-monospace, Consolas, monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("E", ex + 10, ey);
      ctx.restore();
    }

    // dt is the time since the previous animation frame (0 if unknown).
    // Returns true while something is still animating (bracket fade-in).
    function draw(now, dt) {
      if (!state.ready || state.failed) return false;
      if (!state.W) resize();
      if (!state.W) return false;
      const W = state.W;
      const H = state.H;
      const dpr = state.dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, H);
      const box = cfg.fitBox(W, H);
      const img = state.img;

      const atE = Math.abs(state.yaw) < 1e-4 && Math.abs(state.pitch) < 1e-4;
      if (atE) {
        // A pending quality step-down is applied here, where the whole image
        // is drawn instead of tiles, so the new tile layout is never seen.
        if (state.rebuildPending) {
          state.rebuildPending = false;
          buildTiles();
          // The new layout gets its own warm-up before it is judged.
          state.tileFrames = 0;
          state.dtSum = 0;
          state.dtCount = 0;
          state.slowWindows = 0;
        }
        const rect = lockedRect(box);
        ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, rect.x, rect.y, rect.w, rect.h);
        if (!cfg.brackets) return false;
        if (!state.lockedAt) state.lockedAt = now;
        const a = motionOK() ? clamp01((now - state.lockedAt) / 450) : 1;
        drawBrackets(rect, a);
        return a < 1;
      }
      state.lockedAt = 0;

      const cam = makeCamera(state.yaw, state.pitch, cfg.pivotZ || 4);
      // E only enters the framing gradually: just after it comes in front of
      // the camera it projects very far away, and fitting it at once would
      // make the whole view jump.
      const eyeWeight = cfg.eyeMarker ? clamp01((-state.pitch - 0.3) / 0.4) : 0;
      let view = fitView(cam, box, false);
      if (!view) return false;
      if (eyeWeight > 0) {
        const withE = fitView(cam, box, true);
        if (withE) {
          view = {
            F: lerp(view.F, withE.F, eyeWeight),
            ox: lerp(view.ox, withE.ox, eyeWeight),
            oy: lerp(view.oy, withE.oy, eyeWeight),
          };
        }
      }

      const tiles = state.tiles;
      const n = tiles.length;
      const qz = state.qz;
      const sx = state.sx;
      const sy = state.sy;
      const sc = state.sc;
      for (let i = 0; i < n; i++) {
        const t = tiles[i];
        project(cam, (t.cx - A / 2) * t.z, (t.cy - 0.5) * t.z, t.z, tmp);
        qz[i] = tmp[2];
        if (tmp[2] > 0.2) {
          sx[i] = view.ox + (view.F * tmp[0]) / tmp[2];
          sy[i] = view.oy + (view.F * tmp[1]) / tmp[2];
          sc[i] = (view.F * t.z) / tmp[2];
        }
      }
      const order = state.order;
      order.sort((a, b) => qz[b] - qz[a]);

      const off = clamp01((Math.abs(state.yaw) + Math.abs(state.pitch)) / 0.5);
      const maxSize = 0.5 * Math.min(W, H);
      for (let j = 0; j < n; j++) {
        const i = order[j];
        const q = qz[i];
        if (q <= 0.2) continue;
        const t = tiles[i];
        const s = sc[i];
        const w = (t.x1 - t.x0) * s;
        const h = (t.y1 - t.y0) * s;
        if (w > maxSize || w < 0.25) continue;
        const x = sx[i];
        const y = sy[i];
        if (x + w < 0 || x - w > W || y + h < 0 || y - h > H) continue;
        ctx.globalAlpha = clamp01((q - 0.2) / 0.6);
        const a = t.roll * off;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        ctx.setTransform(dpr * ca, dpr * sa, -dpr * sa, dpr * ca, dpr * x, dpr * y);
        ctx.drawImage(
          img,
          crop.x + t.x0 * unitPx,
          crop.y + t.y0 * unitPx,
          (t.x1 - t.x0) * unitPx,
          (t.y1 - t.y0) * unitPx,
          -w / 2,
          -h / 2,
          w,
          h
        );
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;

      if (eyeWeight > 0) drawEyeMarker(cam, view, eyeWeight);

      // Adaptive quality, measured on real frame intervals: after a warm-up
      // (page load, image decode, intro), two slow windows in a row ask for
      // fewer, larger tiles. "Slow" is relative to the shortest interval seen,
      // so a browser that caps frames at 30 Hz to save power is not mistaken
      // for a slow device. Nothing is sampled while a step-down is pending.
      if (dt > 0 && !state.rebuildPending) {
        if (dt < state.minDt) state.minDt = dt;
        state.tileFrames++;
        if (state.tileFrames > 40) {
          state.dtSum += dt;
          state.dtCount++;
          if (state.dtCount === 24) {
            const slow = state.dtSum / 24 > Math.max(24, 1.4 * state.minDt);
            state.slowWindows = slow ? state.slowWindows + 1 : 0;
            if (state.slowWindows >= 2 && state.cols - 8 >= MIN_COLS) {
              state.fewerCols += 8;
              state.rebuildPending = true;
              state.slowWindows = 0;
            }
            state.dtSum = 0;
            state.dtCount = 0;
          }
        }
      }
      return false;
    }

    // Layout can change size without a window resize (fonts, scrollbars).
    if ("ResizeObserver" in window) {
      new ResizeObserver(() => {
        if (resize() && cfg.onResize) cfg.onResize();
      }).observe(canvas);
    }

    function load(onReady, onError) {
      state.failed = false;
      state.ready = false;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        state.img = img;
        state.ready = true;
        resize();
        onReady();
      };
      img.onerror = () => {
        state.failed = true;
        onError();
      };
      img.src = cfg.src;
    }

    return {
      load,
      resize,
      draw,
      setPose(yaw, pitch) {
        state.yaw = yaw;
        state.pitch = pitch;
      },
      fail() {
        state.failed = true;
      },
      get ready() {
        return state.ready && !state.failed;
      },
    };
  }

  // Depth (z, in units where the painting plane at E is z = 1) for each part
  // of the two paintings. Near things (cypress, village) sit close to E, the
  // sky far away. log-uniform within each band.
  function logUniform(a, b, rnd) {
    return a * Math.pow(b / a, rnd());
  }

  function starryDepth(u, v, rnd) {
    const cypressCenter = 0.21 - 0.035 * v;
    if (Math.abs(u - cypressCenter) < 0.02 + 0.115 * v) return logUniform(1.08, 1.7, rnd);
    if (v > 0.8) return logUniform(1.7, 3.2, rnd);
    if (v > 0.6) return logUniform(2.6, 4.8, rnd);
    const dx = (u - 0.5) / 0.22;
    const dy = (v - 0.33) / 0.13;
    if (dx * dx + dy * dy < 1) return logUniform(5, 9, rnd);
    return logUniform(3.4, 11, rnd);
  }

  function roadCypressDepth(u, v, rnd) {
    if (Math.abs(u - 0.48) < 0.03 + 0.09 * v) return logUniform(1.08, 1.6, rnd);
    if (v > 0.68) return logUniform(1.4, 3, rnd);
    if (v > 0.55) return logUniform(2.6, 4.5, rnd);
    const s1x = (u - 0.21) / 0.13;
    const s1y = (v - 0.26) / 0.1;
    const s2x = (u - 0.77) / 0.15;
    const s2y = (v - 0.22) / 0.12;
    if (s1x * s1x + s1y * s1y < 1 || s2x * s2x + s2y * s2y < 1) return logUniform(6, 10, rnd);
    return logUniform(3.4, 11, rnd);
  }

  /* ------------------------------------------------------------------ *
   * 5. Hero: the scroll walks the visitor to E
   * ------------------------------------------------------------------ */

  function initHero() {
    const hero = document.getElementById("hero");
    const canvas = document.getElementById("hero-canvas");
    if (!hero || !canvas) return;
    const fallback = hero.querySelector(".hero-fallback");
    const lockCaption = hero.querySelector(".step-lock");
    const steps = Array.prototype.slice.call(hero.querySelectorAll(".step"));
    const STEP_AT = [0, 0.22, 0.55, 0.82]; // scroll progress where steps 0..3 begin
    const LOCK_AT = 0.55;

    let currentStep = -1;
    function setStep(i) {
      if (i === currentStep) return;
      currentStep = i;
      hero.dataset.step = String(i);
      steps.forEach((el) => el.classList.toggle("is-on", Number(el.dataset.step) === i));
    }

    if (!root.classList.contains("is-scrub")) {
      setStep(0);
      return;
    }

    const engine = createAnamorph(canvas, {
      src: "assets/worlds/starry-night-e.png",
      crop: { x: 200, y: 2, w: 880, h: 716 },
      depth: starryDepth,
      seed: 49314,
      pivotZ: 4,
      fitNear: 1,
      fitFar: 5.5,
      brackets: true,
      onResize: () => request(),
      fitBox(W, H) {
        const top = 56 + H * 0.04;
        let bottom = H * 0.07;
        // On landscape screens, keep the finished painting clear of the
        // caption that appears under it at E.
        if (W > H && lockCaption) bottom = Math.max(bottom, lockCaption.offsetHeight + Math.max(28, H * 0.05) + 16);
        const x = Math.max(16, W * 0.06);
        return { x, y: top, w: W - 2 * x, h: Math.max(40, H - top - bottom) };
      },
    });

    let inView = true;
    let raf = 0;
    let introStart = 0;
    let pTarget = 0;
    let pSmooth = 0;
    let lastNow = 0;
    const INTRO_MS = 1800;

    function progress() {
      const rect = hero.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      return span > 0 ? clamp01(-rect.top / span) : 0;
    }

    function request() {
      if (raf) return;
      if (inView && !document.hidden) raf = requestAnimationFrame(frame);
      else lastNow = 0; // a pause must never be measured as one long frame
    }

    function failToPoster() {
      engine.fail();
      hero.classList.add("is-fallback");
      hero.classList.remove("is-ready");
      canvas.setAttribute("aria-hidden", "true");
      if (fallback) fallback.removeAttribute("aria-hidden");
    }

    function frame(now) {
      raf = 0;
      const dt = lastNow ? Math.min(100, now - lastNow) : 0;
      lastNow = now;

      pTarget = progress();
      const k = 1 - Math.pow(0.8, (dt || 16.7) / 16.7);
      pSmooth += (pTarget - pSmooth) * k;
      if (Math.abs(pTarget - pSmooth) < 0.0005) pSmooth = pTarget;

      const stepIndex = STEP_AT.reduce((acc, at, i) => (pSmooth >= at ? i : acc), 0);
      setStep(stepIndex);

      let animating = pSmooth !== pTarget;
      if (engine.ready) {
        let introT = 1;
        if (introStart) {
          introT = clamp01((now - introStart) / INTRO_MS);
          if (introT < 1) animating = true;
        }
        const ei = easeOut(introT);
        const baseYaw = lerp(0.85, 0.42, ei);
        const basePitch = lerp(-0.22, -0.1, ei);
        const t = pSmooth >= LOCK_AT ? 1 : easeInOut(clamp01((pSmooth - 0.04) / (LOCK_AT - 0.04)));
        engine.setPose(baseYaw * (1 - t), basePitch * (1 - t));
        try {
          if (engine.draw(now, dt)) animating = true;
        } catch (err) {
          console.error(err);
          failToPoster();
          return;
        }
      }
      if (animating) request();
      else lastNow = 0;
    }

    engine.load(
      () => {
        if (!root.classList.contains("js")) return; // fell back to the static page
        introStart = motionOK() ? performance.now() : 0;
        hero.classList.add("is-ready");
        // The canvas now carries the picture; don't announce it twice.
        if (fallback) fallback.setAttribute("aria-hidden", "true");
        request();
      },
      failToPoster
    );

    // Keyboard users: tabbing to a link in a step that is not showing yet
    // scrolls to the point where that step is on screen. Only right after a
    // Tab key: focus also comes back when the window regains focus, and that
    // must not move the page.
    let lastTab = -1;
    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Tab") lastTab = performance.now();
      },
      true
    );
    hero.addEventListener("focusin", (e) => {
      if (performance.now() - lastTab > 300) return;
      const step = e.target.closest ? e.target.closest(".step") : null;
      if (!step || step.classList.contains("is-on")) return;
      const i = Number(step.dataset.step);
      const span = hero.offsetHeight - window.innerHeight;
      if (!(span > 0) || !(i >= 0)) return;
      const top = window.scrollY + hero.getBoundingClientRect().top;
      window.scrollTo(0, top + (STEP_AT[i] + 0.03) * span);
    });

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[entries.length - 1].isIntersecting;
        if (inView) request();
      },
      { rootMargin: "100px 0px" }
    );
    io.observe(hero);

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", () => {
      engine.resize();
      request();
    });
    document.addEventListener("langchange", () => {
      // The lock caption's height (and so the painting's frame) may change.
      engine.resize();
      request();
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) request();
    });
    setStep(0);
    request();
  }

  /* ------------------------------------------------------------------ *
   * 6. PUNCTUM stage: the camera leaves E
   * ------------------------------------------------------------------ */

  function punctumPose(s) {
    const t = clamp01(s / 100);
    if (t <= 0.5) return { yaw: 0, pitch: -0.95 * easeInOut(t / 0.5) };
    const k = easeInOut((t - 0.5) / 0.5);
    return { yaw: 0.62 * k, pitch: lerp(-0.95, -0.3, k) };
  }

  function initPunctum() {
    const stage = document.getElementById("punctum-stage");
    const canvas = document.getElementById("punctum-canvas");
    const range = document.getElementById("punctum-range");
    if (!stage || !canvas || !range || !canvas.getContext) return;
    const fallback = stage.querySelector(".stage-fallback");
    const buttons = Array.prototype.slice.call(document.querySelectorAll("[data-pose]"));

    const engine = createAnamorph(canvas, {
      src: "assets/worlds/road-cypress-e.png",
      crop: { x: 362, y: 2, w: 556, h: 716 },
      depth: roadCypressDepth,
      seed: 1890,
      pivotZ: 3.5,
      fitNear: 1,
      fitFar: 6,
      brackets: true,
      eyeMarker: true,
      densityScale: 0.8,
      onResize: () => request(),
      fitBox(W, H) {
        const m = Math.max(14, Math.min(W, H) * 0.06);
        return { x: m, y: m, w: W - 2 * m, h: H - 2 * m };
      },
    });

    let started = false;
    let inView = false;
    let raf = 0;
    let target = Number(range.value) || 0;
    let current = target;
    let lastNow = 0;
    let touched = false;
    let played = false;
    let onScreen = false;
    let visible = null;

    function valueText(v) {
      const ui = UI[lang];
      if (v <= 1) return ui.poseE;
      return (v <= 50 ? ui.lifting : ui.walking) + " " + Math.round(v) + "%";
    }

    function syncControls() {
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.pose) === Math.round(target))));
      range.setAttribute("aria-valuetext", valueText(target));
    }

    function request() {
      if (raf) return;
      if (started && inView && !document.hidden) raf = requestAnimationFrame(frame);
      else lastNow = 0;
    }

    function failToPoster() {
      engine.fail();
      stage.classList.remove("is-ready");
      canvas.setAttribute("aria-hidden", "true");
      if (fallback) fallback.removeAttribute("aria-hidden");
    }

    function frame(now) {
      raf = 0;
      const dt = lastNow ? Math.min(100, now - lastNow) : 0;
      lastNow = now;
      if (motionOK()) {
        current += (target - current) * (1 - Math.pow(0.9, (dt || 16.7) / 16.7));
        if (Math.abs(target - current) < 0.05) current = target;
      } else {
        current = target;
      }
      const pose = punctumPose(current);
      engine.setPose(pose.yaw, pose.pitch);
      let animating = current !== target;
      try {
        if (engine.draw(now, dt)) animating = true;
      } catch (err) {
        console.error(err);
        failToPoster();
        return;
      }
      if (animating) request();
      else lastNow = 0;
    }

    function setTarget(v) {
      target = clamp(v, 0, 100);
      range.value = String(Math.round(target));
      syncControls();
      request();
    }

    // Play the idea once, the first time the stage is ready and mostly on
    // screen, unless the visitor has already taken the controls.
    function maybePlay() {
      if (played || touched || !onScreen || !engine.ready || !motionOK()) return;
      if (!root.classList.contains("js")) return;
      played = true;
      if (visible) {
        visible.disconnect();
        visible = null;
      }
      setTimeout(() => !touched && setTarget(50), 700);
      setTimeout(() => !touched && setTarget(100), 3400);
      setTimeout(() => !touched && setTarget(50), 6400);
    }

    range.addEventListener("input", () => {
      touched = true;
      setTarget(Number(range.value));
    });
    buttons.forEach((b) =>
      b.addEventListener("click", () => {
        touched = true;
        setTarget(Number(b.dataset.pose));
      })
    );

    function start() {
      if (started) return;
      started = true;
      engine.load(
        () => {
          if (!root.classList.contains("js")) return; // fell back to the static page
          stage.classList.add("is-ready");
          if (fallback) fallback.setAttribute("aria-hidden", "true");
          canvas.removeAttribute("aria-hidden");
          request();
          maybePlay();
        },
        () => {
          started = false; // try again the next time the stage comes near
          failToPoster();
        }
      );
    }

    if ("IntersectionObserver" in window) {
      const near = new IntersectionObserver(
        (entries) => {
          inView = entries[entries.length - 1].isIntersecting;
          if (inView) {
            start();
            request();
          }
        },
        { rootMargin: "600px 0px" }
      );
      near.observe(stage);
      visible = new IntersectionObserver(
        (entries) => {
          const e = entries[entries.length - 1];
          onScreen = e.isIntersecting && e.intersectionRatio >= 0.59;
          maybePlay();
        },
        { threshold: [0, 0.6] }
      );
      visible.observe(stage);
    } else {
      inView = true;
      start();
    }

    window.addEventListener("resize", () => {
      engine.resize();
      request();
    });
    document.addEventListener("langchange", syncControls);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) request();
    });
    syncControls();
  }

  /* ------------------------------------------------------------------ *
   * 7. Tool demos: each plays its story once when it scrolls into view,
   *    then rests on the final state. Buttons jump to any state.
   * ------------------------------------------------------------------ */

  function initDemo(id, sequence) {
    const fig = document.getElementById(id);
    if (!fig) return;
    const finalState = sequence[sequence.length - 1][0];
    const buttons = Array.prototype.slice.call(fig.querySelectorAll(".seg-btn[data-to]"));
    let timers = [];

    function set(s) {
      fig.dataset.state = s;
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.to === s)));
    }

    function cancel() {
      timers.forEach(clearTimeout);
      timers = [];
    }

    function play() {
      cancel();
      set(sequence[0][0]);
      // Force a style flush so the first state is painted before the next one.
      void fig.offsetWidth;
      sequence.slice(1).forEach(([s, at]) => {
        timers.push(setTimeout(() => set(s), at));
      });
    }

    // The caption for a state, read aloud without its footnote numbers.
    function captionText(s) {
      const cap = fig.querySelector(".cap-" + s);
      if (!cap) return "";
      const copy = cap.cloneNode(true);
      copy.querySelectorAll("sup").forEach((el) => el.remove());
      return copy.textContent.trim();
    }

    let io = null;
    function stopAutoplay() {
      if (io) {
        io.disconnect();
        io = null;
      }
    }

    buttons.forEach((b) =>
      b.addEventListener("click", () => {
        stopAutoplay();
        cancel();
        set(b.dataset.to);
        announce(captionText(b.dataset.to));
      })
    );

    const replay = fig.querySelector(".replay");
    if (replay) {
      replay.addEventListener("click", () => {
        stopAutoplay();
        if (motionOK()) play();
        else set(finalState);
      });
    }

    if (!motionOK() || !("IntersectionObserver" in window)) {
      set(finalState);
      return;
    }

    set(sequence[0][0]);
    io = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1];
        if (e.isIntersecting && e.intersectionRatio >= 0.34) {
          stopAutoplay();
          play();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(fig);
  }

  /* ------------------------------------------------------------------ *
   * 8. Header: transparent over the top of the hero; colours follow the
   *    surface underneath (night or gesso).
   * ------------------------------------------------------------------ */

  function initHeader() {
    const bar = document.getElementById("bar");
    if (!bar) return;

    let ticking = false;
    function updateTop() {
      ticking = false;
      bar.classList.toggle("is-top", window.scrollY < 24);
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateTop);
        }
      },
      { passive: true }
    );
    updateTop();

    if (!("IntersectionObserver" in window)) return;
    const surfaces = document.querySelectorAll("main [data-surface], footer[data-surface]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) bar.dataset.surface = entry.target.dataset.surface;
        });
      },
      { rootMargin: "0px 0px -92% 0px" }
    );
    surfaces.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------ *
   * 9. Copy buttons
   * ------------------------------------------------------------------ */

  function selectText(node) {
    try {
      const range = document.createRange();
      range.selectNodeContents(node);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      return true;
    } catch (e) {
      return false;
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return Promise.reject(new Error("clipboard unavailable"));
  }

  function initCopy() {
    document.querySelectorAll(".cmd-copy[data-copy]").forEach((btn) => {
      let timer = 0;
      function flash(label, message) {
        btn.textContent = label;
        announce(message);
        clearTimeout(timer);
        timer = setTimeout(() => {
          btn.textContent = UI[lang].copy;
        }, 1600);
      }
      btn.addEventListener("click", () => {
        const code = btn.parentElement ? btn.parentElement.querySelector("code") : null;
        copyText(btn.getAttribute("data-copy")).then(
          () => flash(UI[lang].copied, UI[lang].copied),
          () => {
            if (code && selectText(code)) flash(UI[lang].selectedShort, UI[lang].selected);
          }
        );
      });
    });

    const copyEmail = document.getElementById("copy-email");
    const status = document.getElementById("copy-status");
    const link = document.getElementById("email-link");
    if (copyEmail) {
      copyEmail.addEventListener("click", () => {
        copyText(SITE.email).then(
          () => {
            if (status) status.textContent = UI[lang].emailCopied;
          },
          () => {
            if (link && selectText(link) && status) status.textContent = UI[lang].selected;
          }
        );
      });
    }
  }

  /* ------------------------------------------------------------------ *
   * 10. Start
   * ------------------------------------------------------------------ */

  function applyContact() {
    document.querySelectorAll("#email-link, #email-btn").forEach((a) => {
      a.setAttribute("href", "mailto:" + SITE.email);
    });
    const link = document.getElementById("email-link");
    if (link) link.textContent = SITE.email;
    const gh = document.getElementById("github-link");
    if (gh) gh.setAttribute("href", SITE.github);
  }

  function start() {
    // Read by the head script on "load": if this never ran (for example a
    // syntax error), the page falls back to the static version.
    window.__portfolioStarted = true;
    // The head script normally picks the mode before first paint; only
    // decide here if it didn't run.
    if (!root.classList.contains("is-scrub") && !root.classList.contains("is-static")) {
      root.classList.remove("no-js");
      root.classList.add("js", canScrub() ? "is-scrub" : "is-static");
    }

    try {
      applyContact();
      initLanguage();
      initHeader();
      initHero();
      initPunctum();
      initDemo("demo-cw", [
        ["before", 0],
        ["after", 1400],
        ["flagged", 3400],
      ]);
      initDemo("demo-pw", [
        ["events", 0],
        ["plain", 3000],
        ["pinned", 8000],
      ]);
      initDemo("demo-lw", [
        ["idle", 0],
        ["flagged", 250],
      ]);
      initCopy();
    } catch (err) {
      // Anything unexpected: fall back to the static page, which shows the
      // final state of everything and hides the controls that need JS.
      console.error(err);
      root.className = "no-js";
      [
        ["demo-cw", "flagged"],
        ["demo-pw", "pinned"],
        ["demo-lw", "flagged"],
      ].forEach(([id, s]) => {
        const fig = document.getElementById(id);
        if (fig) fig.dataset.state = s;
      });
      document.querySelectorAll(".hero-fallback, .stage-fallback").forEach((img) => img.removeAttribute("aria-hidden"));
    }

    // Switching reduced motion on or off mid-visit: the simplest correct
    // response is to rebuild the page in the other mode.
    if (reduceMQ) {
      const onChange = () => window.location.reload();
      if (reduceMQ.addEventListener) reduceMQ.addEventListener("change", onChange);
      else if (reduceMQ.addListener) reduceMQ.addListener(onChange);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
