# Nelson (@taipei49314)

Personal site of Nelson, an independent developer in Taipei. Plain HTML, CSS and
JavaScript: no build step, no frameworks, no web fonts, no third-party requests.
GitHub Pages serves the repository root as is.

The page is built around one idea, 對得上 ("every stroke has to line up"): the strokes
of PUNCTUM only form the painting from the painter's eye E, and a "pass" only means
something when it lines up with evidence.

## What is on the page

| Section | What it shows |
| --- | --- |
| Hero | A CI screenshot of PUNCTUM's *The Starry Night*, cut into hundreds (phones) to a few thousand (desktop) tiles. Each tile sits on the ray from E at its own depth. As you scroll, a perspective camera moves to E and the tiles land exactly on the painting; the last step links each kind of "pass" to its tool. |
| checkwash | `assert total == 105.3` loosened to `assert total > 0`: the test stays green, a number line shows which wrong answers now pass, and checkwash flags `ASSERT_WEAKENED`. Plus a block for people who build PR-review or CI tools. |
| pinwash | A committed exemption plus an uncommitted Stop hook rewritten to `exit 0`. Comparing only HEAD with the worktree trusts the exemption; the two comparisons that start at the pinned BASE read exemptions from BASE and catch it. |
| ledgerwash | Two DONE tasks with no receipts: `NO_OPERATION_HISTORY` and `DONE_TIME_BACKDATED`. |
| Family | The three tools side by side: what each reads, what it flags, its status. |
| PUNCTUM | The same tile engine on *Road with Cypress and Star*: it lifts the camera off E once by itself, then the buttons and slider are the visitor's. An E / off-E pair of real screenshots; six of the thirty worlds. |
| Contact | Email, copy button, GitHub and per-tool issue links. |
| Notes | Numbered footnotes (in order of first appearance) with every limit the page relies on. |

Each tool demo plays once when it scrolls into view and then rests on its final
state; the buttons jump to any step. Version, license and requirement details sit in
a closed disclosure under each tool; the status (alpha, pre-1.0) is always visible
next to the tool's name.

The layout mode is chosen in a small inline script in `<head>` before first paint:
`is-scrub` (scroll-driven hero) or `is-static`. With `prefers-reduced-motion`,
without IntersectionObserver or sticky support, without JavaScript, or if `app.js`
fails to load or throws, the page is a static article showing the final state of
everything, and controls that need JavaScript are hidden.

## Files

- `index.html`: all content. The Chinese (zh-Hant) text lives here and is the default.
- `app.js`: the English strings (`EN`), the contact details (`SITE`), the tile
  engine (`createAnamorph`), the hero, the PUNCTUM stage, the demos and the header.
- `styles.css`: two surfaces (night and gesso), two meaning colours (gold = lines up,
  red = got weaker), system font stacks.
- `assets/worlds/`: PUNCTUM screenshots (see below).
- `tools/build_site.py`: builds the deployable copy into `_site/` (CI only, needs Pillow).
- `tools/shoot.mjs`: screenshot matrix and smoke checks in headless Chromium (CI only).
- `.github/workflows/site.yml`: the CI described below.

## Editing

- **Versions and status** appear in `index.html` (the version pill next to each
  tool name and the family table share the `fam.*Status` keys; the `.facts` lists;
  the PUNCTUM facts line) and in the matching `EN` strings in `app.js` (`*.status`,
  `fam.*Status`). They were checked against the GitHub releases on 2026-10-19; the
  line under the family table (`fam.asOf`) carries that date.
- **Any text**: change the Chinese in `index.html` and the English under the same
  key in `EN`. Keys are `data-i18n` (element content), `data-i18n-html` (content
  with footnote links) and `data-i18n-attr="attr:key;attr:key"` (attributes). A
  missing English key logs a console warning and falls back to Chinese.
- **Contact**: `SITE` at the top of `app.js` (also hard-coded in `index.html` so the
  page works without JavaScript).

## Images

All images in `assets/worlds/` come from the `punctum-30-worlds-screenshots` artifact
of the starry-night-3d **CI & Pages** run
[39224915162](https://github.com/taipei49314/starry-night-3d/actions/runs/39224915162)
(main `015d0fb`, 2026-10-19). Stroke counts on the page come from the same run's
`verification-report.json`. They are the original 1280×720 PNGs, unresized.

| File | Source file | sha256 |
| --- | --- | --- |
| `starry-night-e.png` | `60-high-starry.png` | `0e4a484ada1f469117578a5bb3bf74dcded7eb2637fe9c4212f03c4186bb31db` |
| `road-cypress-e.png` | `61-high-roadcypress.png` | `31f4bec5b529200515d1eb28a6febdd056296179762b5dc2d60e8b35223fda43` |
| `road-cypress-off-e.png` | `46-offE-roadcypress-t14.png` | `e46295593be8b5c341008c96a8d703ae65d39d158b7246e20ac458b4e8a7ca77` |
| `starry-night-rhone.png` | `18-rhone.png` | `2eb8703e1ad72a11aabc846dae88a224b18a86d0540b374948edbb9e85f9c7b7` |
| `sunflowers.png` | `13-sunflowers.png` | `3318006533000251ee16467fb420ec0e730c7ca4430b22985be58a7ffa8be4a5` |
| `wheatfield-crows.png` | `30-crows.png` | `75dd1e9959b8c3e5645a0b4f9766c7b4f80172b84517804e1abe318077c13e72` |
| `cafe-terrace.png` | `16-cafe.png` | `4c2d5c7c1b8a41723987ab9311a5e4837a95914664f5bb8cd75f4bda0a258232` |
| `wheat-field-cypresses.png` | `23-wheat.png` | `cf33c218533c7b0d039abdffc255314bd5ca1e4c2e06a92a1e7e3d3da538a142` |
| `bedroom-off-e.png` | `43-offE-bedroom-t14.png` | `9837d388a1ecf8f1430ef28cda96c7cfd1c071d8d22918deb7876206efddc999` |

The PNGs in the repository total about 7.7 MB. The deployed copy does not use them
directly: CI converts each one to WebP (and The Starry Night also to JPEG for link
previews) and rewrites the references; see below. Only the hero image loads
eagerly; the rest use `loading="lazy"`.

## Preview, CI and deploy

- Open `index.html` in a browser. It also works from `file://` (with the PNGs).
- Every push and pull request runs **Site** (`.github/workflows/site.yml`) on
  GitHub-hosted runners:
  1. **Build**: `tools/build_site.py` copies the site into `_site/`, converts the
     images and fails if any reference is left dangling. The size table is in the
     run summary and the `build-report` artifact.
  2. **Screenshots** (one job per width: 375, 768, 1280, 1920): `tools/shoot.mjs`
     opens the built site in zh and en, with motion allowed and with
     `prefers-reduced-motion`, and saves screenshots at fixed points of the story
     (artifacts `screenshots-<width>`; each folder has a `report.json`). It fails on
     page or console errors, missing English strings, failed requests, the wrong
     layout mode, horizontal page scroll, a blank hero canvas at E, images that never
     load, or demo buttons and the language toggle that do nothing.
  3. **Deploy** (main only, and only if every screenshot job passed): publishes
     `_site/` to GitHub Pages at <https://taipei49314.github.io/>.

## Status

The screenshots are the first time this version has been rendered; read them
before treating the page as checked.
