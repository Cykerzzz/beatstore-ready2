#!/usr/bin/env python3
# generate_packs.py — scanne assets/audio/* et produit data/packs.json

import os, json, sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
AUDIO_DIR = ROOT / "assets" / "audio"
IMG_DIR   = ROOT / "assets" / "img"
OUT_DIR   = ROOT / "data"
OUT_FILE  = OUT_DIR / "packs.json"

AUDIO_EXTS = {".wav", ".mp3", ".aiff", ".aif", ".m4a", ".flac", ".ogg"}

def nice_title(s: str) -> str:
    s = s.replace('_', ' ').replace('-', ' ')
    return ' '.join(w.capitalize() for w in s.split())

def pick_cover(cat_id: str) -> str:
    # essaie plusieurs variantes (jpg/png/jpeg)
    candidates = [
        IMG_DIR / f"cover-{cat_id}.jpg",
        IMG_DIR / f"cover-{cat_id}.png",
        IMG_DIR / f"{cat_id}.jpg",
        IMG_DIR / f"{cat_id}.png",
    ]
    for p in candidates:
        if p.exists():
            rel = p.relative_to(ROOT).as_posix()
            return rel
    # fallback générique
    default = IMG_DIR / "cover-default.jpg"
    if default.exists():
        return default.relative_to(ROOT).as_posix()
    return "assets/img/cover-default.jpg"

def main():
    if not AUDIO_DIR.exists():
        print(f"[!] Dossier audio introuvable: {AUDIO_DIR}")
        sys.exit(1)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    packs = []
    for cat in sorted(p.name for p in AUDIO_DIR.iterdir() if p.is_dir()):
        cat_path = AUDIO_DIR / cat
        samples = []
        for root, _, files in os.walk(cat_path):
            for f in sorted(files):
                ext = Path(f).suffix.lower()
                if ext in AUDIO_EXTS:
                    full = Path(root) / f
                    rel_path = full.relative_to(ROOT).as_posix()

                    # Encodage URL des chemins (espaces, accents) pour le navigateur
                    url = '/'.join(quote(part) for part in rel_path.split('/'))
                    samples.append({
                        "title": Path(f).stem,
                        "file": url
                    })

        if not samples:
            continue

        packs.append({
            "id": cat,                           # ex: "afro-fr"
            "title": nice_title(cat),            # ex: "Afro Fr"
            "genre": cat.upper().replace('-',' '),
            "cover": pick_cover(cat),
            "description": f"Auto-imported from folder: {cat}",
            "samples": samples
        })

    data = {"packs": packs}
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"[OK] Écrit {OUT_FILE} avec {len(packs)} pack(s).")

if __name__ == "__main__":
    main()

