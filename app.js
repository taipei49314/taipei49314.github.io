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
 *   3. createAnamorph(): cuts a starry-night-3d CI screenshot into tiles,
 *      places each tile on the ray from the painter's eye E at its own depth,
 *      and projects them with a real perspective camera. At E the tiles land
 *      exactly on the painting; anywhere else it opens up in depth. Renders on
 *      demand only.
 *   4. The hero (scroll), the checkwash demo, the Returning Passage light
 *      sweep, the header and the copy buttons.
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
      "Nelson (@taipei49314), an independent developer in Taipei. checkwash flags code changes that weaken tests; The Starry Night from One Viewpoint is a painting you can walk into; Editorial Doll is a digital styling atelier; The Returning Passage is a journey through a stone chamber, still in progress.",

    "nav.skip": "Skip to the works",
    "nav.label": "Primary",
    "nav.works": "Works",
    "nav.contact": "Contact",
    "nav.lang": "中文",
    "nav.langLabel": "切換成中文",
    "nav.langCode": "zh-Hant",

    "name.sn": "The Starry Night from One Viewpoint",
    "name.snShort": "The Starry Night",
    "name.ps": "The Returning Passage",

    "hero.alt":
      "The Starry Night as starry-night-3d renders it from point E: swirling sky, moon, cypress and village.",
    "hero.canvasLabel":
      "Pieces of the painting sit at different depths; as you scroll, the camera walks to point E, where they form The Starry Night.",
    "hero.eyebrow": "Nelson · independent developer in Taipei",
    "hero.title": "Every stroke<br />has to line up.",
    "hero.sub":
      "I write a tool that checks code changes, and I made a Starry Night you can walk into, a digital styling atelier, and a journey through a stone chamber that is still in progress.",
    "hero.ctaWorks": "See the work ›",
    "hero.cue": "Scroll to stand where the painter stood",
    "hero.moving":
      "Keep going. Each piece stays on its own ray; you are the one moving, and the closer you get to E, the closer they come to their places in the painting.",
    "hero.locked":
      'Right here: point E. Only from this one point do the pieces form The Starry Night.<sup><a href="#fn-1" id="ref-1a">1</a></sup>',
    "hero.bridgeTitle": "So does<br />everything I make.",
    "hero.bridgeSub": "Four works, each one lining up with one thing.",
    "hero.mapCw": "A pass, with its evidence",
    "hero.mapSn": "Strokes, with one viewpoint",
    "hero.mapEd": "A look, with the person wearing it",
    "hero.mapPs": "Inscriptions, with the light",

    "works.title": "Four works.",
    "works.lead": "A tool, a painting, an atelier, and a journey still being built.",
    "works.cwType": "Tool",
    "works.cwLine": "Catches tests that were quietly loosened.",
    "works.snType": "Interactive work",
    "works.snStatus": "Live online",
    "works.snLine": "About 181,000 strokes that form Van Gogh's painting from exactly one point.",
    "works.edType": "Styling atelier",
    "works.edStatus": "Showcase",
    "works.edLine": "Turns outfit ideas into a styling proposal.",
    "works.psType": "Interactive narrative",
    "works.psStatus": "In progress",
    "works.psLine": "A sweep of light wakes the inscriptions on a stone wall, one by one.",

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
      "Try it: download checkwash.pyz from the v0.10.0 release, run the built-in offline examples, then check your last commit from the root of your repo.",
    "cw.linkRelease": "Download v0.10.0 ↗",
    "cw.linkLimits": "Known limits ↗",
    "cw.pipx": "You can also install it with pipx install checkwash==0.10.0 and run checkwash check HEAD~1..HEAD.",
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

    "sn.kicker": "a painting you can walk into",
    "sn.title": "About 181,000 strokes.<br />One place to stand.",
    "sn.lead":
      "About 181,000 brushstrokes are scattered through 3D space, up to 250 km deep. Only from the painter's eye, point E, do they line up into Van Gogh's The Starry Night; step aside and the painting comes apart into a world.",
    "sn.eye": "From E",
    "sn.eyeCap": "the strokes form the painting",
    "sn.eyeAlt": "From the painter's eye E: the strokes form the whole Starry Night.",
    "sn.aside": "Step aside",
    "sn.asideCap": "the cypress slides in front of the sky and hides a swirl",
    "sn.asideAlt":
      "Some tens of metres away from E: the cypress moves in front of the sky and hides one of the swirls, and the village shifts.",
    "sn.sky": "Inside the sky",
    "sn.skyCap": "the swirl is a funnel of brushstrokes",
    "sn.skyAlt": "Inside the sky: the swirl is a funnel of brushstrokes pointing at the eye.",
    "sn.shotsNote":
      "All three were rendered from the starry-night-3d code in headless Chrome on an NVIDIA laptop GPU, with the UI hidden (main 278293e).",
    "sn.body":
      "Each stroke has one free value: its distance from E. The farther away it is, the bigger it is drawn, so from E it covers exactly its place in the painting. Paint order becomes depth: the last touches, the cypress and the village, are nearest, and the underpainting is 250 km away. The opening is a 96-second, 10-shot camera loop: the canvas paints itself in, the frame slides away, the camera climbs the cypress, passes through Venus, falls into a swirl and flies back to E.",
    "sn.open": "Open it ↗",
    "sn.single": "Single-file version ↗",
    "sn.facts":
      "Drag to look, W A S D to fly, Space to return to E. TypeScript · three.js (WebGL 2) · MIT. No textures, models or audio files; everything is generated in code. Needs a browser with WebGL 2.",
    "sn.galleryTitle": "The same engine paints 29 more",
    "sn.galleryLead":
      'Reach them from the bar at the top of the work or by URL: <a class="text-link" href="https://taipei49314.github.io/starry-night-3d/?mode=witness" target="_blank" rel="noopener noreferrer">witness</a> walks through five chapters of his life, <a class="text-link" href="https://taipei49314.github.io/starry-night-3d/?mode=odyssey" target="_blank" rel="noopener noreferrer">odyssey</a> flies through all 30 paintings in one 900-second flight, and <a class="text-link" href="https://taipei49314.github.io/starry-night-3d/?mode=atlas" target="_blank" rel="noopener noreferrer">atlas</a> maps the 30 worlds.',
    "sn.g1": "Starry Night Over the Rhône",
    "sn.g2": "Sunflowers",
    "sn.g3": "Wheatfield with Crows",
    "sn.g4": "Café Terrace at Night",
    "sn.g5": "Wheat Field with Cypresses",
    "sn.g6": "The Bedroom in Arles, away from E",
    "sn.g6alt": "The Bedroom in Arles, with the camera away from point E",
    "sn.galleryNote":
      "Numbers are the stroke count of each world. Images and numbers come from the starry-night-3d CI screenshots and verification report (main 015d0fb, 2026-10-19), rendered in software.",

    "ed.kicker": "a digital styling atelier",
    "ed.ver": "Showcase · iPad version in preparation",
    "ed.title": "Turn outfit ideas<br />into a proposal.",
    "ed.lead":
      "Clothes, hair and accessories, tried on one fictional muse until the look works. Every step can be undone; a look can be named and saved, then exported as an image to talk about.",
    "ed.l1": "Daylight Tailoring",
    "ed.l1Alt": "Daylight Tailoring: a full-length look with a camel double-breasted jacket, charcoal trousers and an oxblood bag.",
    "ed.l2": "Evening Silhouette",
    "ed.l2Alt": "Evening Silhouette: a sienna bias-cut midi dress worn with gold earrings.",
    "ed.l3": "Olive Afternoon",
    "ed.l3Alt": "Olive Afternoon: an olive jacket over a rust knife-pleat skirt, with an oxblood bag.",
    "ed.looksNote": "All three are looks rendered by Editorial Doll itself.",
    "ed.body":
      "Every garment, shoe and accessory is versioned: old and new versions sit side by side, and switching to a new one can be undone. The interface is in Chinese and English, and the muse is entirely fictional.",
    "ed.status":
      "Editorial Doll isn't available for download. To talk about a styling proposal or working together, write to me.",
    "ed.film": "Watch the 34-second demo ↗",
    "ed.site": "Showcase page ↗",

    "ps.kicker": "interactive narrative",
    "ps.title": "Where the light passes,<br />the words wake up.",
    "ps.lead":
      "A WebGL journey into a stone chamber under the sand, narrated in Chinese and English. The inscriptions on the wall start as faint grooves; when a sweep of light reaches into them they light up one by one, and one of them stays.",
    "ps.artLabel":
      "Illustration: eight inscriptions on a dark stone wall. A band of light sweeps from left to right, the inscriptions light up in turn, and one stays lit.",
    "ps.artCap": "An illustration, not a frame from the work.",
    "ps.sampleLabel": "The two-minute sample",
    "ps.s1": "Entrance",
    "ps.s2": "Inscribed antechamber",
    "ps.s3": "Light reveals the words",
    "ps.s4": "A lingering mark, a strange sound",
    "ps.s5": "Silence",
    "ps.body":
      "The stone is generated entirely in code: bedding, grain, worn block edges and drifted sand are all shaders, with no external textures. The inscriptions are cut into the stone, and what lights up is the bottom of each groove, not the surface. The two-minute sample is finished; the full piece is planned as seven parts, about 13 minutes long.",
    "ps.limits": "There is no public version yet and nothing to try online. When it's ready, it will be here.",
    "ps.facts": "TypeScript · three.js (WebGL 2) · narration in Chinese and English",

    "ct.title": "Write to me.",
    "ct.lead":
      "Want to plug checkwash into your PR review or CI? Hit a false positive or a miss on your own repo? Want to talk about a styling proposal with Editorial Doll, or just about procedural painting? All welcome, in English or 中文.",
    "ct.mail": "Email me",
    "ct.copy": "Copy address",
    "ct.issues": "Report a problem:",
    "ct.about": "I'm Nelson, an independent developer. Taipei · UTC+8",

    "fn.title": "Notes",
    "fn.1":
      "The moving picture at the top of this page is a 2D sketch: a CI screenshot of The Starry Night from starry-night-3d, cut into many small pieces and put back into 3D space. The work itself renders about 181,000 strokes live with three.js (WebGL 2).",
    "fn.2":
      "The diff on this page is illustrative. The rule name comes from checkwash's SPEC; see its README for the real output.",
    "fn.3":
      "checkwash flags known patterns of weakened tests. No findings doesn't mean the code is correct, and exit&nbsp;2 is an analysis error, not a pass.",
    "fn.back": "Back to text",
    "fn.backHero": "Back to the opening picture",
    "fn.backCw": "Back to the checkwash example",
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
    },
    en: {
      copy: "Copy",
      copied: "Copied",
      selectedShort: "Selected",
      emailCopied: "Address copied.",
      selected: "Selected. Press Ctrl+C (⌘C on a Mac) to copy.",
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
      return Math.max(MIN_COLS, base);
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

    // Fit the painting's depth cone (corners at a near and a far depth) into
    // the box. At E every corner projects onto the painting rectangle, so this
    // reduces exactly to lockedRect().
    function fitView(cam, box) {
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
      const view = fitView(cam, box);
      if (!view) return false;

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
        // On tall (portrait) screens, look from above so depth spreads the
        // pieces vertically and the cloud fills the screen; on wide screens,
        // look from the side.
        const portrait = window.innerHeight > window.innerWidth * 1.15;
        const baseYaw = portrait ? lerp(0.3, 0.14, ei) : lerp(0.85, 0.42, ei);
        const basePitch = portrait ? lerp(-0.75, -0.4, ei) : lerp(-0.22, -0.1, ei);
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

    // Same for links to something inside a step (the footnote's back link):
    // the browser would scroll to where the sticky stage sits right now, which
    // can be a later step where that caption is hidden.
    document.addEventListener("click", (e) => {
      const link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!link) return;
      const target = document.getElementById(link.getAttribute("href").slice(1));
      const step = target && hero.contains(target) ? target.closest(".step") : null;
      const span = hero.offsetHeight - window.innerHeight;
      const i = step ? Number(step.dataset.step) : -1;
      if (!(span > 0) || !(i >= 0)) return;
      e.preventDefault();
      const top = window.scrollY + hero.getBoundingClientRect().top;
      window.scrollTo(0, top + (STEP_AT[i] + 0.03) * span);
      target.focus({ preventScroll: true });
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
   * 6. Demos: each plays its story once when it scrolls into view, then
   *    rests on the final state. Buttons jump to any state.
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

  // The Returning Passage illustration: the light sweep is CSS animation on
  // data-state="play"; "final" (the HTML default) is the resting picture.
  function initSweep(id) {
    const fig = document.getElementById(id);
    if (!fig) return;

    function play() {
      fig.dataset.state = "idle";
      // Drop the running animations before starting them again.
      void fig.getBoundingClientRect();
      fig.dataset.state = "play";
    }

    let io = null;
    const replay = fig.querySelector(".replay");
    if (replay) {
      replay.addEventListener("click", () => {
        if (io) {
          io.disconnect();
          io = null;
        }
        if (motionOK()) play();
        else fig.dataset.state = "final";
      });
    }

    if (!motionOK() || !("IntersectionObserver" in window)) return;

    fig.dataset.state = "idle";
    io = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1];
        if (e.isIntersecting && e.intersectionRatio >= 0.39) {
          io.disconnect();
          io = null;
          play();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(fig);
  }

  /* ------------------------------------------------------------------ *
   * 7. Header: transparent over the top of the hero; colours follow the
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
   * 8. Copy buttons
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
   * 9. Start
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
      initDemo("demo-cw", [
        ["before", 0],
        ["after", 1400],
        ["flagged", 3400],
      ]);
      initSweep("passage-art");
      initCopy();
    } catch (err) {
      // Anything unexpected: fall back to the static page, which shows the
      // final state of everything and hides the controls that need JS.
      console.error(err);
      root.className = "no-js";
      [
        ["demo-cw", "flagged"],
        ["passage-art", "final"],
      ].forEach(([id, s]) => {
        const fig = document.getElementById(id);
        if (fig) fig.dataset.state = s;
      });
      document.querySelectorAll(".hero-fallback").forEach((img) => img.removeAttribute("aria-hidden"));
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
