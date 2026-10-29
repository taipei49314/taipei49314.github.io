# Nelson (@taipei49314)

Personal site of Nelson, an independent developer in Taipei. Plain HTML, CSS and
JavaScript: no build step, no frameworks, no web fonts, no third-party requests.
GitHub Pages serves a lightly converted copy of the repository root (see below).

The page is built around one idea, 對得上 ("every stroke has to line up"): the strokes
of *The Starry Night* only form the painting from the painter's eye E, and each of
the four works lines up with one thing: a pass with its evidence, strokes with one
viewpoint, a look with the person wearing it, inscriptions with the light.

## What is on the page

| Section | What it shows |
| --- | --- |
| Hero | A CI screenshot of starry-night-3d's *The Starry Night*, cut into hundreds (phones) to a few thousand (desktop) tiles. Each tile sits on the ray from E at its own depth. As you scroll, a perspective camera moves to E and the tiles land exactly on the painting; the last step maps each work to what it lines up with. |
| Works | The four works as cards: checkwash, *The Starry Night from One Viewpoint*, Editorial Doll, *The Returning Passage*. Each card links to its section. |
| checkwash | `assert total == 105.3` loosened to `assert total > 0`: the test stays green, a number line shows which wrong answers now pass, and checkwash flags `ASSERT_WEAKENED`. Try-it commands for v0.10.0 and a block for people who build PR-review or CI tools. |
| The Starry Night | Three GPU renders from the starry-night-3d README (at E, stepping aside, inside the sky), links to the live work, and six of the 29 other paintings the same engine renders, with links to its witness, odyssey and atlas modes. |
| Editorial Doll | Three looks rendered by Editorial Doll, what the atelier does, and links to its showcase page and 34-second demo. No download: Editorial Doll is not publicly distributed. |
| The Returning Passage | Marked 製作中 (in progress). An SVG illustration, not a frame from the work: a band of light sweeps a stone slab and wakes eight made-up glyphs, one of which stays lit. The two-minute sample's five beats and what is finished. No link: there is no public version. |
| Contact | Email, copy button, GitHub and issue links for the two public repositories. |
| Notes | Numbered footnotes (in order of first appearance) with every limit the page relies on. |

The checkwash demo and the light sweep each play once when they scroll into view
and then rest on their final state; the demo's buttons jump to any step and the
sweep has a replay button. Version, license and requirement details for checkwash
sit in a closed disclosure; its status (alpha, pre-1.0) is always visible next to
its name.

The layout mode is chosen in a small inline script in `<head>` before first paint:
`is-scrub` (scroll-driven hero) or `is-static`. With `prefers-reduced-motion`,
without IntersectionObserver or sticky support, without JavaScript, or if `app.js`
fails to load or throws, the page is a static article showing the final state of
everything, and controls that need JavaScript are hidden.

## Files

- `index.html`: all content. The Chinese (zh-Hant) text lives here and is the default.
  A hidden SVG sprite at the top of `<body>` holds the gradients and glyphs the two
  Returning Passage illustrations share.
- `app.js`: the English strings (`EN`), the contact details (`SITE`), the tile
  engine (`createAnamorph`), the hero, the checkwash demo, the light sweep and the header.
- `styles.css`: two surfaces (night and gesso) plus a sand variant of night that uses
  The Returning Passage's own palette, two meaning colours (gold = lines up,
  red = got weaker), system font stacks.
- `assets/worlds/`, `assets/starry/`, `assets/looks/`: images (see below).
- `tools/build_site.py`: builds the deployable copy into `_site/` (CI only, needs Pillow).
- `tools/shoot.mjs`: screenshot matrix and smoke checks in headless Chromium (CI only).
- `.github/workflows/site.yml`: the CI described below.

## Editing

- **Versions and status** appear in `index.html` (the version pills next to each
  name, the works cards, the checkwash `.facts` list and try-it commands) and in the
  matching `EN` strings in `app.js` (`works.*Status`, `cw.*`, `ed.ver`). The checkwash
  version, date and commands were checked against the v0.10.0 release and README on
  2026-10-29.
- **Any text**: change the Chinese in `index.html` and the English under the same
  key in `EN`. Keys are `data-i18n` (element content), `data-i18n-html` (content
  with links) and `data-i18n-attr="attr:key;attr:key"` (attributes). A
  missing English key logs a console warning and falls back to Chinese.
- **Contact**: `SITE` at the top of `app.js` (also hard-coded in `index.html` so the
  page works without JavaScript).

## Images

`assets/worlds/` comes from the `punctum-30-worlds-screenshots` artifact of the
starry-night-3d **CI & Pages** run
[39224915162](https://github.com/taipei49314/starry-night-3d/actions/runs/39224915162)
(main `015d0fb`, 2026-10-19), rendered in software. Stroke counts on the page come
from the same run's `verification-report.json`. They are the original 1280×720 PNGs,
unresized.

| File | Source file | sha256 |
| --- | --- | --- |
| `starry-night-e.png` | `60-high-starry.png` | `0e4a484ada1f469117578a5bb3bf74dcded7eb2637fe9c4212f03c4186bb31db` |
| `starry-night-rhone.png` | `18-rhone.png` | `2eb8703e1ad72a11aabc846dae88a224b18a86d0540b374948edbb9e85f9c7b7` |
| `sunflowers.png` | `13-sunflowers.png` | `3318006533000251ee16467fb420ec0e730c7ca4430b22985be58a7ffa8be4a5` |
| `wheatfield-crows.png` | `30-crows.png` | `75dd1e9959b8c3e5645a0b4f9766c7b4f80172b84517804e1abe318077c13e72` |
| `cafe-terrace.png` | `16-cafe.png` | `4c2d5c7c1b8a41723987ab9311a5e4837a95914664f5bb8cd75f4bda0a258232` |
| `wheat-field-cypresses.png` | `23-wheat.png` | `cf33c218533c7b0d039abdffc255314bd5ca1e4c2e06a92a1e7e3d3da538a142` |
| `bedroom-off-e.png` | `43-offE-bedroom-t14.png` | `9837d388a1ecf8f1430ef28cda96c7cfd1c071d8d22918deb7876206efddc999` |

`assets/starry/` holds three files copied unchanged from starry-night-3d `docs/media/`
at main `278293e1d91ad706b1dc24fc67b19196f2f6087d`. Its README says they were rendered
from that repository's code in headless Chrome on an NVIDIA laptop GPU, with the UI
hidden. The git blob ids match the source tree.

| File | Git blob | sha256 |
| --- | --- | --- |
| `at-eye.webp` | `95eb7f3a04ab68dddd3cd99dd653adae931054a8` | `9b7578932a9f75b697d13da11e207e28f232a94978298b1df37e1d5cd035846d` |
| `step-aside.webp` | `79fec3d3f0ec73777b396f7e81934321aa5c16a1` | `4286c060e1fe570df1a34ea5a096db939f422e5bb131e4ca50ec78c32346e566` |
| `twin-funnels.webp` | `f03cf0b15935bbb70d99176401553e23e8e4dae5` | `c616e00b1b1fd7e1d267aad6b9351aaead9a7661e5d27489d3106fcd44b3be86` |

`assets/looks/` holds three looks rendered by Editorial Doll (1024×1536 PNG, source
sha256 below), resized to 720×1080 and saved as JPEG (quality 86, Pillow LANCZOS).
The same three looks appear on the Editorial Doll showcase page.

| File | Source sha256 | sha256 |
| --- | --- | --- |
| `daylight-tailoring.jpg` | `e01f463883415bc3f515a6a2ad3950108b40649daab26032c7b03ce3ef08f628` | `1710ea0e5c442e7d9945e960ce0947d9bbe2e7062bfdec11fe97d78c37c6cc14` |
| `evening-silhouette.jpg` | `f78429f75d4d4fc7d9c31f69f7bc71b868b28e4a141a83cd1930b133bf85b44a` | `3f0bfb40997b99f1964d517b4d374f0fef5c99f3553480e152532b6cf8391a5e` |
| `olive-afternoon.jpg` | `c8176d191260dc306e1614699ba57d6b6fbff1dde0c38ff2d4057f10df737ae2` | `5d7aacfe731dca6c590955c7d9668663a7a768c9c61a8570c4e712f41ae4c128` |

The Returning Passage has no image file: its illustration is inline SVG with
made-up glyphs, drawn for this page.

The world PNGs total about 6.2 MB. The deployed copy does not use them directly: CI
converts each one to WebP (and The Starry Night also to JPEG for link previews) and
rewrites the references; `assets/starry/` and `assets/looks/` (about 0.9 MB) are copied
as is. Only the hero image loads eagerly; the rest use `loading="lazy"`.

## Preview, CI and deploy

- Open `index.html` in a browser. It also works from `file://` (with the PNGs).
- Every push and pull request runs **Site** (`.github/workflows/site.yml`) on
  GitHub-hosted runners:
  1. **Build**: `tools/build_site.py` copies the site into `_site/`, converts the
     images and fails if any reference is left dangling. The size table (converted
     and copied images) is in the run summary and the `build-report` artifact.
  2. **Screenshots** (one job per width: 375, 768, 1280, 1920): `tools/shoot.mjs`
     opens the built site in zh and en, with motion allowed and with
     `prefers-reduced-motion`, and saves screenshots at fixed points of the story
     (artifacts `screenshots-<width>`; each folder has a `report.json`). It fails on
     page or console errors, missing English strings, failed requests, the wrong
     layout mode, horizontal page scroll, a blank hero canvas at E, images that never
     load, a demo or light sweep that never finishes, or demo buttons and the
     language toggle that do nothing.
  3. **Deploy** (main only, and only if every screenshot job passed): publishes
     `_site/` to GitHub Pages at <https://taipei49314.github.io/>.

## Status

- 2026-10-29: redesigned around four works (checkwash, The Starry Night, Editorial
  Doll, The Returning Passage); the earlier tool sections and family table were removed.
- The earlier design was delivered at `0877330` (Site run
  [39253704116](https://github.com/taipei49314/taipei49314.github.io/actions/runs/39253704116)).
  Human visual acceptance has never been recorded for either design.
- Deploy needs GitHub Pages enabled for this repository.
