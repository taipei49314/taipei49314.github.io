"""Build the deployable site into an output folder (CI only).

The repository keeps the original 1280x720 starry-night-3d CI screenshots as
PNG, so their provenance and sha256 stay checkable (see README). The deployed
copy is lighter: every assets/worlds/*.png becomes a WebP, The Starry Night
also gets a JPEG for link previews (og:image), and index.html / app.js are
rewritten to point at the converted files. Every other folder under assets/
(already WebP or JPEG) is copied as is. Fails if a reference is left
dangling.

Usage: python tools/build_site.py --out _site   (needs Pillow)
"""

import argparse
import json
import os
import re
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES = ["index.html", "styles.css", "app.js"]
REWRITE = ["index.html", "app.js"]
WORLDS = Path("assets/worlds")
COPIED = [Path("assets/starry"), Path("assets/looks")]
OG_IMAGE = "starry-night-e"
WEBP_QUALITY = 82
JPEG_QUALITY = 86


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", required=True)
    out = Path(parser.parse_args().out).resolve()
    if out.exists():
        shutil.rmtree(out)
    (out / WORLDS).mkdir(parents=True)

    for name in PAGES:
        shutil.copy2(ROOT / name, out / name)
    for folder in COPIED:
        shutil.copytree(ROOT / folder, out / folder)

    rows = []
    for png in sorted((ROOT / WORLDS).glob("*.png")):
        with Image.open(png) as im:
            rgb = im.convert("RGB")
            webp = out / WORLDS / (png.stem + ".webp")
            rgb.save(webp, "WEBP", quality=WEBP_QUALITY, method=6)
            row = {"file": png.name, "png_bytes": png.stat().st_size, "webp_bytes": webp.stat().st_size}
            if png.stem == OG_IMAGE:
                jpg = out / WORLDS / (png.stem + ".jpg")
                rgb.save(jpg, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
                row["jpg_bytes"] = jpg.stat().st_size
            rows.append(row)

    for name in REWRITE:
        path = out / name
        text = path.read_text(encoding="utf-8")
        # Link previews: JPEG is the safest format for og:image.
        text = text.replace(
            "https://taipei49314.github.io/assets/worlds/%s.png" % OG_IMAGE,
            "https://taipei49314.github.io/assets/worlds/%s.jpg" % OG_IMAGE,
        )
        text = re.sub(r"(assets/worlds/[a-z0-9-]+)\.png", r"\1.webp", text)
        path.write_text(text, encoding="utf-8", newline="\n")

    # Every assets reference must exist in the output; no PNG may remain.
    problems = []
    for name in REWRITE:
        text = (out / name).read_text(encoding="utf-8")
        for ref in sorted(set(re.findall(r"assets/[A-Za-z0-9_-]+/[A-Za-z0-9_.-]+\.[A-Za-z0-9]+", text))):
            if ref.endswith(".png"):
                problems.append("%s still references %s" % (name, ref))
            elif not (out / ref).is_file():
                problems.append("%s references missing %s" % (name, ref))

    total_png = sum(r["png_bytes"] for r in rows)
    total_new = sum(r["webp_bytes"] + r.get("jpg_bytes", 0) for r in rows)
    copied = [{"file": str(f.relative_to(out).as_posix()), "bytes": f.stat().st_size}
              for folder in COPIED for f in sorted((out / folder).rglob("*")) if f.is_file()]
    total_copied = sum(c["bytes"] for c in copied)
    report = {"images": rows, "png_total": total_png, "converted_total": total_new,
              "copied": copied, "copied_total": total_copied, "problems": problems}
    (out.parent / "build-report.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    lines = ["## Image conversion", "", "| file | PNG | WebP | JPEG |", "| --- | ---: | ---: | ---: |"]
    for r in rows:
        lines.append("| %s | %d KB | %d KB | %s |" % (
            r["file"], r["png_bytes"] // 1024, r["webp_bytes"] // 1024,
            ("%d KB" % (r["jpg_bytes"] // 1024)) if "jpg_bytes" in r else "",
        ))
    lines.append("")
    lines.append("Worlds: %.1f MB PNG -> %.1f MB converted. Copied as is (%s): %.1f MB. Images deployed: %.1f MB." % (
        total_png / 1e6, total_new / 1e6, ", ".join(f.as_posix() for f in COPIED), total_copied / 1e6,
        (total_new + total_copied) / 1e6))
    summary = "\n".join(lines) + "\n"
    print(summary)
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as fh:
            fh.write(summary)

    for p in problems:
        print("ERROR:", p, file=sys.stderr)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
