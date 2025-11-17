from pathlib import Path
import json
import unicodedata

# Dossier racine du projet
ROOT = Path(__file__).parent

# Configuration des packs (à adapter si tu changes les covers / descriptions)
PACK_CONFIGS = [
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
        "cover": "assets/img/cat-other-vibes.jpg",  # adapte si ton fichier a un autre nom
        "description": "Vibes expérimentales & bonus tracks.",
        "audio_folder": "Other vibes",
    },
]


def slugify(text: str) -> str:
    """Crée un id propre à partir du titre (sans accents, espaces -> -)."""
    text = unicodedata.normalize("NFD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = text.lower()

    result = []
    last_dash = False
    for c in text:
        if c.isalnum():
            result.append(c)
            last_dash = False
        else:
            if not last_dash:
                result.append("-")
                last_dash = True
    slug = "".join(result).strip("-")
    return slug or "track"


def filename_to_title(name: str) -> str:
    """Titre lisible à partir du nom de fichier (sans extension)."""
    stem = Path(name).stem
    # tu peux tweaker ça si tu veux garder les tirets
    return stem.replace("_", " ").replace("-", " ").strip()


def build_packs():
    packs = []

    for cfg in PACK_CONFIGS:
        folder = ROOT / "assets" / "audio" / cfg["audio_folder"]

        if not folder.exists():
            print(f"⚠️  Dossier audio introuvable: {folder}")
            continue

        audio_files = sorted(folder.glob("*.mp3"))

        samples = []
        for f in audio_files:
            title = filename_to_title(f.name)
            sample_id = f"{cfg['id']}-{slugify(title)}"

            file_path = Path("assets") / "audio" / cfg["audio_folder"] / f.name

            samples.append({
                "id": sample_id,
                "title": title,
                "bpm": None,
                "key": "",
                "file": file_path.as_posix(),
                "price": 300,
            })

        pack_obj = {
            "id": cfg["id"],
            "title": cfg["title"],
            "cover": cfg["cover"],
            "description": cfg["description"],
            "samples": samples,
        }
        packs.append(pack_obj)

        print(f"✅ Pack '{cfg['id']}' : {len(samples)} beats trouvés")

    return {"packs": packs}


def main():
    data = build_packs()
    out_path = ROOT / "data" / "packs.json"
    out_path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"\n💾 Fichier généré : {out_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

