#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).parent
AUDIO_ROOT = ROOT / "assets" / "audio"

# Tous tes packs ici
PACKS_CONFIG = [
    {
        "id": "trap",
        "title": "Trap",
        "cover": "assets/img/cat-trap.jpg",
        "description": "Trap bangers & dark vibes.",
        "audio_folder": "Trap",
    },
    {
        "id": "afro-fr",
        "title": "Afro Fr",
        "cover": "assets/img/cat-afro-fr.jpg",
        "description": "Afro / pop française chaude.",
        "audio_folder": "afro-fr",
    },
    {
        "id": "kpop",
        "title": "Kpop",
        "cover": "assets/img/cat-kpop.jpg",
        "description": "K-pop sucrée et énergétique.",
        "audio_folder": "kpop",
    },
    {
        "id": "kpop-xmas",
        "title": "Kpop Xmas",
        "cover": "assets/img/cat-kpop-xmas.jpg",
        "description": "K-pop spéciale Noël.",
        "audio_folder": "kpop-xmas",
    },
    {
        "id": "phonk",
        "title": "Phonk",
        "cover": "assets/img/cat-phonk.jpg",
        "description": "Phonk sombre et club.",
        "audio_folder": "phonk",
    },
    {
        "id": "pop-fr",
        "title": "Pop Fr",
        "cover": "assets/img/cat-pop-fr.jpg",
        "description": "Pop française moderne.",
        "audio_folder": "pop-fr",
    },
    {
        "id": "remix-hiphop",
        "title": "Remix Hiphop",
        "cover": "assets/img/cat-remix-hiphop.jpg",
        "description": "Remix hip-hop créatifs.",
        "audio_folder": "remix-hiphop",
    },
    {
        "id": "tube-fr",
        "title": "Tube Fr",
        "cover": "assets/img/cat-tube-fr.jpg",
        "description": "Tubes français radio-ready.",
        "audio_folder": "tube-fr",
    },
    {
    "id": "other-vibes",
    "title": "Other Vibes",
    "cover": "assets/img/cat-othervibes.jpg",
    "description": "Vibes expérimentales & bonus tracks.",
    "audio_folder": "Other vibes",
    },
]


def filename_to_title(path: Path) -> str:
    name = path.stem
    name = name.replace("_", " ").strip()
    return name


def make_sample_id(pack_id: str, path: Path) -> str:
    base = path.stem.lower()
    for ch in [" ", "_", "(", ")", ".", ",", ";", "’", "'", "«", "»"]:
        base = base.replace(ch, "-")
    while "--" in base:
        base = base.replace("--", "-")
    base = base.strip("-")
    return f"{pack_id}-{base}"


def build_packs():
    packs = []

    for cfg in PACKS_CONFIG:
        pack_id = cfg["id"]
        audio_folder = AUDIO_ROOT / cfg["audio_folder"]

        if not audio_folder.exists():
            print(f"[WARN] Dossier audio introuvable pour {pack_id}: {audio_folder}")
            samples = []
        else:
            audio_files = list(audio_folder.glob("*.wav")) + list(
                audio_folder.glob("*.mp3")
            )
            audio_files.sort()

            samples = []
            for f in audio_files:
                sample = {
                    "id": make_sample_id(pack_id, f),
                    "title": filename_to_title(f),
                    "bpm": None,   # à remplir plus tard si tu veux
                    "key": "",
                    "file": str((Path("assets") / "audio" / cfg["audio_folder"] / f.name).as_posix()),
                    "price": 300   # 💸 tous les beats à 300 €
                }
                samples.append(sample)

        pack_obj = {
            "id": cfg["id"],
            "title": cfg["title"],
            "cover": cfg["cover"],
            "description": cfg["description"],
            "samples": samples,
        }
        packs.append(pack_obj)

    return {"packs": packs}


def main():
    data = build_packs()
    out_path = ROOT / "data" / "packs.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ packs.json généré avec succès ({out_path})")


if __name__ == "__main__":
    main()

