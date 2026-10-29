// Screenshot matrix and smoke checks for the built site (CI only).
//
// For one viewport width it opens the page in zh and en, with motion allowed
// and with prefers-reduced-motion, takes screenshots at fixed points of the
// story, and fails on: page errors, console errors, missing English strings,
// failed requests or HTTP errors, the wrong layout mode, horizontal page
// scroll, a blank hero canvas at E, images that never load, a demo or the
// light sweep that never finishes, and demo buttons or the language toggle
// that do nothing.
//
// Usage: node tools/shoot.mjs --width 375 --out shots/375
//        (serve _site first, e.g. on http://127.0.0.1:8080/)

import { chromium } from "playwright";
import { mkdir, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith("--") ? [...acc, [a.slice(2), all[i + 1]]] : acc), [])
);
const BASE = process.env.SITE_URL || "http://127.0.0.1:8080/";
const OUT = args.out || "shots";
const WIDTH = Number(args.width || 1280);

const VIEWPORTS = {
  375: { width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  768: { width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  1280: { width: 1280, height: 800, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  1920: { width: 1920, height: 1080, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
};
const vp = VIEWPORTS[WIDTH];
if (!vp) {
  console.error("unknown width", WIDTH);
  process.exit(2);
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function run(browser, lang, motion) {
  const name = `${WIDTH}-${lang}-${motion}`;
  const dir = path.join(OUT, name);
  await mkdir(dir, { recursive: true });
  const result = { name, problems: [], notes: [], shots: [] };
  const fail = (msg) => result.problems.push(msg);

  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: motion === "reduced" ? 1 : vp.deviceScaleFactor,
    isMobile: vp.isMobile,
    hasTouch: vp.hasTouch,
    reducedMotion: motion === "reduced" ? "reduce" : "no-preference",
    locale: lang === "zh" ? "zh-TW" : "en-US",
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => fail(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    const text = m.text();
    if (m.type() === "error") fail(`console.error: ${text}`);
    else if (text.includes("[i18n]")) fail(`console.${m.type()}: ${text}`);
    else if (m.type() === "warning") result.notes.push(`console.warning: ${text}`);
  });
  page.on("requestfailed", (r) => fail(`requestfailed: ${r.url()} ${r.failure() ? r.failure().errorText : ""}`));
  page.on("response", (r) => {
    if (r.status() >= 400) fail(`http ${r.status()}: ${r.url()}`);
  });

  const shot = async (label, opts = {}) => {
    const file = path.join(dir, `${label}.png`);
    await page.screenshot({ path: file, ...opts });
    result.shots.push(file);
  };
  const overflow = async (where) => {
    const extra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (extra > 1) fail(`horizontal overflow of ${extra}px at ${where}`);
  };
  const scrollTo = (y) => page.evaluate((y) => window.scrollTo(0, y), y);
  const scrollIntoView = (sel, block) =>
    page.evaluate(
      ([sel, block]) => {
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ block, behavior: "instant" });
        return !!el;
      },
      [sel, block]
    );

  await page.goto(BASE + (lang === "en" ? "?lang=en" : ""), { waitUntil: "load" });
  await wait(400);

  const info = await page.evaluate(() => ({
    cls: document.documentElement.className,
    lang: document.documentElement.lang,
    title: document.title,
  }));
  result.notes.push(`html class="${info.cls}" lang="${info.lang}" title="${info.title}"`);
  const wantMode = motion === "reduced" ? "is-static" : "is-scrub";
  if (!info.cls.split(/\s+/).includes(wantMode)) fail(`expected ${wantMode}, got "${info.cls}"`);
  if (info.lang !== (lang === "en" ? "en" : "zh-Hant")) fail(`html lang is "${info.lang}"`);

  if (motion === "motion") {
    const hero = await page.evaluate(() => {
      const h = document.getElementById("hero");
      return { top: h.getBoundingClientRect().top + window.scrollY, span: h.offsetHeight - window.innerHeight };
    });
    await wait(2600); // intro lay-in
    await shot("01-hero-intro");
    await overflow("hero intro");

    for (const [p, label, ms] of [
      [0.38, "02-hero-moving", 1600],
      [0.68, "03-hero-locked", 2000],
      [0.92, "04-hero-bridge", 1600],
    ]) {
      await scrollTo(hero.top + p * hero.span);
      await wait(ms);
      await shot(label);
      if (label === "03-hero-locked") {
        const state = await page.evaluate(() => {
          const h = document.getElementById("hero");
          const c = document.getElementById("hero-canvas");
          let lit = 0;
          let total = 0;
          try {
            const ctx = c.getContext("2d");
            const w = c.width;
            const hgt = c.height;
            const data = ctx.getImageData(Math.floor(w * 0.3), Math.floor(hgt * 0.3), Math.floor(w * 0.4), Math.floor(hgt * 0.4)).data;
            for (let i = 0; i < data.length; i += 4 * 97) {
              total++;
              if (data[i + 3] > 0 && data[i] + data[i + 1] + data[i + 2] > 60) lit++;
            }
          } catch (e) {
            return { error: String(e) };
          }
          return { ready: h.classList.contains("is-ready"), step: h.dataset.step, lit, total };
        });
        result.notes.push(`hero at E: ${JSON.stringify(state)}`);
        if (state.error) fail(`hero canvas unreadable: ${state.error}`);
        else if (!state.ready) fail("hero canvas never became ready");
        else if (state.step !== "2") fail(`hero step at p=0.68 is ${state.step}, expected 2`);
        else if (state.lit < state.total * 0.5) fail(`hero canvas at E looks blank (${state.lit}/${state.total} lit samples)`);
      }
    }

    const stops = [
      ["05-works", "#works", "start", 900],
      ["06-checkwash", "#checkwash", "start", 500],
      ["07-checkwash-demo", "#demo-cw", "center", 4600],
      ["08-starry", "#starry", "start", 1200],
      ["09-gallery", ".gallery:not(.triptych)", "start", 1500],
      ["10-editorial-doll", "#editorial-doll", "start", 1200],
      ["11-passage", "#passage", "start", 900],
      ["12-passage-sweep", "#passage-art", "center", 6400],
      ["13-contact", "#contact", "start", 700],
      ["14-footer", "footer", "start", 500],
    ];
    for (const [label, sel, block, ms] of stops) {
      if (sel && !(await scrollIntoView(sel, block))) fail(`missing ${sel}`);
      await wait(ms);
      await shot(label);
      await overflow(label);
    }

    // The sweep is 25 CSS animations: the light band plus three layers of each
    // of the eight glyphs. All of them must have run to the end.
    const states = await page.evaluate(() => {
      const art = document.getElementById("passage-art");
      const anims = art.getAnimations ? art.getAnimations({ subtree: true }) : [];
      return {
        cw: document.getElementById("demo-cw").dataset.state,
        sweep: art.dataset.state,
        finished: anims.filter((a) => a.playState === "finished").length,
        unfinished: anims.filter((a) => a.playState !== "finished").length,
      };
    });
    result.notes.push(`demo end states: ${JSON.stringify(states)}`);
    if (states.cw !== "flagged") fail(`checkwash demo did not finish: ${JSON.stringify(states)}`);
    if (states.sweep !== "play" || states.finished < 25 || states.unfinished) fail(`light sweep did not play to the end: ${JSON.stringify(states)}`);
  } else {
    // Static article: scroll through so lazy images load, then one full page.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += Math.floor(vp.height * 0.8)) {
      await scrollTo(y);
      await wait(120);
    }
    await scrollTo(0);
    await wait(500);
    await shot("01-top");
    await overflow("static page");
    const sweep = await page.evaluate(() => document.getElementById("passage-art").dataset.state);
    if (sweep !== "final") fail(`static page shows the light sweep in state "${sweep}", expected "final"`);
    // Readable viewport-sized views of the static article (the full-page
    // image is too tall to inspect at phone widths).
    for (const [label, sel] of [
      ["03-hero-bridge", ".step-bridge"],
      ["04-works", "#works"],
      ["05-checkwash-demo", "#demo-cw"],
      ["06-starry", "#starry"],
      ["07-gallery", ".gallery:not(.triptych)"],
      ["08-editorial-doll", "#editorial-doll"],
      ["09-passage-art", "#passage-art"],
      ["10-contact", "#contact"],
    ]) {
      if (!(await scrollIntoView(sel, "start"))) fail(`missing ${sel}`);
      await wait(250);
      await shot(label);
    }
    await scrollTo(0);
  }

  // Every <img> on the page must have loaded by now.
  await page
    .waitForFunction(() => Array.from(document.images).every((i) => i.complete), null, { timeout: 20000 })
    .catch(() => fail("images still loading after 20s"));
  const broken = await page.evaluate(() =>
    Array.from(document.images)
      .filter((i) => i.complete && i.naturalWidth === 0)
      .map((i) => i.getAttribute("src"))
  );
  if (motion === "reduced" || broken.length) {
    for (const src of broken) fail(`image failed to load: ${src}`);
  }

  // Interactions: a demo button and the language toggle.
  const demo = await page.evaluate(() => {
    const b = document.querySelector('#demo-cw .seg-btn[data-to="before"]');
    if (!b || getComputedStyle(b).display === "none") return "no-button";
    b.click();
    return document.getElementById("demo-cw").dataset.state;
  });
  if (demo !== "before") fail(`checkwash "before" button gave state "${demo}"`);
  const toggled = await page.evaluate(() => {
    const before = document.documentElement.lang;
    document.getElementById("lang-toggle").click();
    return { before, after: document.documentElement.lang, h1: document.getElementById("hero-title").textContent };
  });
  if (toggled.before === toggled.after) fail(`language toggle did nothing (${toggled.before})`);
  result.notes.push(`toggle: ${JSON.stringify(toggled)}`);

  if (motion === "reduced") {
    // Back to the visitor's language, demo back to its final state, then the full page.
    await page.evaluate(() => {
      document.getElementById("lang-toggle").click();
      document.querySelector('#demo-cw .seg-btn[data-to="flagged"]').click();
    });
    await wait(300);
    await shot("02-full-page", { fullPage: true });
  }

  await context.close();
  return result;
}

const browser = await chromium.launch();
const results = [];
for (const lang of ["zh", "en"]) {
  for (const motion of ["motion", "reduced"]) {
    try {
      results.push(await run(browser, lang, motion));
    } catch (e) {
      results.push({ name: `${WIDTH}-${lang}-${motion}`, problems: [`crashed: ${e && e.stack ? e.stack : e}`], notes: [], shots: [] });
    }
  }
}
await browser.close();

await mkdir(OUT, { recursive: true });
await writeFile(path.join(OUT, "report.json"), JSON.stringify(results, null, 2) + "\n");

const lines = [`## Screenshots ${WIDTH}px`, ""];
for (const r of results) {
  lines.push(`### ${r.name}: ${r.problems.length ? "FAIL" : "ok"} (${r.shots.length} shots)`);
  for (const p of r.problems) lines.push(`- FAIL ${p}`);
  for (const n of r.notes) lines.push(`- ${n}`);
  lines.push("");
}
const summary = lines.join("\n");
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary + "\n");
process.exit(results.some((r) => r.problems.length) ? 1 : 0);
