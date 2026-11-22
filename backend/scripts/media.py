"""Convert the team's game media (teks-content/Game Pictures) into the WebP files the storefront uses.

Run from backend/ with the venv active (needs Pillow: pip install -r requirements-media.txt):
    python -m scripts.media                      # every game
    python -m scripts.media water-delivery bayani  # only these slugs
    python -m scripts.media --src "D:/path/to/Game Pictures"

Writes frontend/public/img/games/<slug>/{cover,hero,shot-N,shot-N-sm}.webp. Images are never upscaled.
Originals stay outside the repo. Alt text for screenshots lives in backend/data/games.json, not here.
"""

import io
import sys
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps

REPO = Path(__file__).resolve().parents[2]
DEFAULT_SRC = REPO.parent / "teks-content" / "Game Pictures"
OUT = REPO / "frontend" / "public" / "img" / "games"

COVER = (1200, 880)  # the card art box is 300:220
HERO_W, SHOT_W, THUMB_W = 1920, 1600, 480
MAX_BYTES = {"cover": 300_000, "hero": 300_000, "shot": 300_000, "thumb": 60_000}
MIN_COVER_W = 600  # below this a cover is not sharp at 2x on a 300px card

# Per game: source folder, cover (file + crop focus or fit), hero (file + focus), screenshots in order.
# focus = (x, y) from 0 to 1: where the crop window sits inside the image. "trim" = (left, top, right, bottom)
# fractions removed first (store-gallery arrows, video-player icons). fit=True letterboxes on a blurred copy.
GAMES = {
    "agimat-and-the-world-beyond": {
        "folder": "Agimat and the World Beyond",
        "cover": {"file": "Agimat and the World Beyond1.png", "focus": (0.5, 0.5)},
        "hero": {"file": "Agimat and the World Beyond1.png", "focus": (0.5, 0.5)},
        "shots": ["Agimat and the World Beyond2.png", "Agimat and the World Beyond3.png"],
    },
    "agnostiko-origins": {
        "folder": "Agnostiko Origin",
        "cover": {"file": "Agnostiko_Origin.jpg", "focus": (0.1, 0.5)},
        "hero": {"file": "Agnostiko_Origin.jpg", "focus": (0.3, 0.5)},
        "shots": ["Agnostiko_Origin2.png", "Agnostiko_Origin3.png", "Agnostiko_Origin4.png", "Agnostiko_Origin1.webp"],
    },
    "anito-defend-a-land-enraged": {
        "folder": "Anito_ Defend Land Enraged",
        "cover": {"file": "Anito Defend a Land Enraged2.jpg", "focus": (0.5, 0.5)},
        "hero": {"file": "Anito Defend a Land Enraged2.jpg", "focus": (0.5, 0.5)},
        "shots": ["Anito Defend a Land Enraged.jpeg", "Anito Defend a Land Enraged2.jpg",
                  "Anito Defend a Land Enraged1.jpeg", "Anito Defend a Land Enraged4.jpg"],
    },
    "aswang-hunter": {
        "folder": "Aswang",
        "cover": {"file": "Aswang.jpg", "focus": (0.5, 1.0)},
        "hero": {"file": "Aswang3.png", "focus": (0.5, 0.5)},
        # Aswang2 (graphic) stays last, never the cover or hero
        "shots": ["Aswang3.png", "Aswang4.png", "Aswang1.jpg", "Aswang2.png"],
    },
    "bayani": {
        "folder": "Bayani",
        "cover": {"file": "BAYANI-HD.jpg", "focus": (0.85, 0.5)},
        "hero": {"file": "BAYANI-HD.jpg", "focus": (0.5, 0.5)},
        "shots": ["Bayani2.jpg", "Bayani3.jpg", "Bayani5.jpg", "Bayani6.jpg", "Bayani7.jpg"],
    },
    "breadwinner": {
        "folder": "Breadwinner(Demo)",
        "cover": {"file": "breadwinner.webp", "focus": (0.5, 0.0)},
        "hero": {"file": "4.png", "focus": (0.5, 0.5)},
        "shots": [{"file": "1.png", "trim": (0.035, 0, 0.035, 0)}, "2.png", "3.png", "4.png", "5.png", "6.png"],
    },
    "eskinita": {
        "folder": "Eskinita",
        "cover": {"file": "logo4.jpg", "focus": (0.5, 0.5)},
        "hero": {"file": "logo4.jpg", "focus": (0.5, 0.5)},
        "shots": ["Eskinita1.jpg", "Eskinita2.png", "Eskinita3.png", "Eskinita4.png", "Eskinita6.png", "Eskinita7.png"],
    },
    "hapunan": {
        "folder": "Hapunan",
        "cover": {"file": "Hapunan.jfif", "focus": (0.5, 0.1)},
        "hero": {"file": "HAPUNAN5.png", "focus": (0.5, 0.5)},
        "shots": ["HAPUNAN5.png", "HAPUNAN3.png", "HAPUNAN2.png"],
    },
    "jeepney-simulator": {
        "folder": "Jeepyney Simulator",
        "cover": {"file": "JEEPNEYSIM-HD.jpg", "focus": (0.5, 0.5)},
        "hero": {"file": "JEEPNEYSIM-HD.jpg", "focus": (0.5, 0.5)},
        "shots": ["JEEP3.jpg", "JEEP4.jpg", "JEEP5.jpg", "JEEP6.jpg", "JEEP7.jpg"],
    },
    "kalayaan-road": {
        "folder": "Kalayaan Road",
        "cover": {"file": "logo2.png", "fit": True},
        "hero": {"file": "Kalayaan5.png", "focus": (0.5, 0.5)},
        "shots": ["Kalayaan2.png", "Kalayaan3.png", "Kalayaan5.png", "Kalayaan6.png", "kalayaan4.png"],
    },
    "karinderya-ni-mark": {
        "folder": "Karinderya ni Mark",
        "cover": {"file": "KARINDERYA3.png", "focus": (0.5, 0.5)},
        "hero": {"file": "KARINDERYA3.png", "focus": (0.5, 0.5)},
        "shots": ["KARINDERYA3.png", "KARINDERYA2.png", "KARINDERYA4.png"],
    },
    "lola-maria": {
        "folder": "Lola Maria",
        # 1-5.png were captured from a video player: trim its icons off the bottom
        "cover": {"file": "4.png", "focus": (0.5, 0.5), "trim": (0, 0, 0, 0.045)},
        "hero": {"file": "4.png", "focus": (0.5, 0.5), "trim": (0, 0, 0, 0.045)},
        "shots": [{"file": f"{n}.png", "trim": (0, 0, 0, 0.045)} for n in (1, 2, 3, 4, 5)],
    },
    "mahika": {
        "folder": "Mahika",
        "cover": {"file": "Mahika1.jpg", "focus": (0.6, 0.5)},
        "hero": {"file": "Mahika2.jpg", "focus": (0.5, 0.5)},
        "shots": ["Mahika1.jpg", "Mahika2.jpg", "Mahika3.jpg", "Mahika4.jpg", "Mahika5.jpg"],
    },
    "maiba-taya": {
        "folder": "Maiba Taya",
        "cover": {"file": "MAIBATAYA-HD.jpg", "focus": (0.05, 0.5)},
        "hero": {"file": "MAIBATAYA-HD.jpg", "focus": (0.5, 0.5)},
        "shots": ["Maiba_Taya8.jpg", "Maiba_taya1.jpg", "Maiba_taya2.jpg", "Maiba_Taya3.jpg", "Maiba_taya6.jpg", "Maiba_Taya4.jpg"],
    },
    "mandato": {
        "folder": "Mandato",
        "cover": {"file": "Mandato3.jpg", "focus": (0.5, 0.5)},
        "hero": {"file": "Mandato1.jpg", "focus": (0.5, 0.5)},
        "shots": ["Mandato1.jpg", "Mandato3.jpg", "Mandato4.jpg", "Mandato5.jpg", "Mandato6.jpg"],
    },
    "patintero": {
        "folder": "Patintero",
        "cover": {"file": "logo3.png", "focus": (0.5, 0.5)},
        "hero": {"file": "logo3.png", "focus": (0.5, 0.5)},
        "shots": ["Pantintero2.png", "Pantintero4.png", "Pantintero5.png", "Pantintero6.png", "Pantintero8.png", "Pantintero9.png"],
    },
    "sabado": {
        "folder": "Sabado",
        "cover": {"file": "Sabado.webp", "fit": True},
        "hero": {"file": "11.png", "focus": (0.5, 0.5)},
        "shots": ["11.png", "5.png", "6.png", "3.png", "4.png", "10.png"],
    },
    "taguan": {
        "folder": "TAGUAN",
        "cover": {"file": "TAGUAN-HD.jpg", "focus": (0.1, 0.5)},
        "hero": {"file": "TAGUAN-HD.jpg", "focus": (0.5, 0.5)},
        "shots": ["taguan5.jpg", "Taguan1.jpg", "Taguan7.jpg", "Taguan6.jpg", "Taguan4.jpg", "taguan2.jpg"],
    },
    "water-delivery": {
        "folder": "Water Delivery",
        "cover": {"file": "WATERDELIVERY-HD.jpg", "focus": (0.0, 0.5)},
        "hero": {"file": "WATERDELIVERY-HD.jpg", "focus": (0.5, 0.5)},
        "shots": ["WATERDELIVERY2.jpg", "WATERDELIVERY3.jpg", "WATERDELIVERY4.jpg"],
    },
}


def load(path: Path, trim=None) -> Image.Image:
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    if trim:
        w, h = im.size
        l, t, r, b = trim
        im = im.crop((round(w * l), round(h * t), round(w * (1 - r)), round(h * (1 - b))))
    return im


def crop_to(im: Image.Image, ratio: float, focus=(0.5, 0.5)) -> Image.Image:
    """Largest window with this width/height ratio, placed at `focus` inside the image."""
    w, h = im.size
    if w / h > ratio:
        cw, ch = round(h * ratio), h
    else:
        cw, ch = w, round(w / ratio)
    x = round((w - cw) * focus[0])
    y = round((h - ch) * focus[1])
    return im.crop((x, y, x + cw, y + ch))


def shrink(im: Image.Image, max_w: int) -> Image.Image:
    if im.width <= max_w:
        return im
    return im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)


def fit(im: Image.Image, ratio: float) -> Image.Image:
    """Letterbox the whole image on a blurred, darkened, cropped copy of itself (for title banners)."""
    w = min(COVER[0], im.width)
    h = round(w / ratio)
    bg = crop_to(im, ratio).resize((w, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(24))
    bg = Image.blend(bg, Image.new("RGB", bg.size, (0, 0, 0)), 0.45)
    fg = shrink(im, w)
    if fg.height > h:
        fg = fg.resize((round(fg.width * h / fg.height), h), Image.LANCZOS)
    bg.paste(fg, ((w - fg.width) // 2, (h - fg.height) // 2))
    return bg


def save(im: Image.Image, path: Path, limit: int) -> int:
    for q in range(82, 34, -6):
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=q, method=6)
        if buf.tell() <= limit:
            break
    path.write_bytes(buf.getvalue())
    return buf.tell()


def build(slug: str, cfg: dict, src_root: Path) -> list[str]:
    src = src_root / cfg["folder"]
    out = OUT / slug
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob("*.webp"):
        old.unlink()
    notes = []

    c = cfg["cover"]
    im = load(src / c["file"], c.get("trim"))
    ratio = COVER[0] / COVER[1]
    cover = fit(im, ratio) if c.get("fit") else shrink(crop_to(im, ratio, c.get("focus", (0.5, 0.5))), COVER[0])
    n = save(cover, out / "cover.webp", MAX_BYTES["cover"])
    notes.append(f"cover {cover.width}x{cover.height} {n // 1024}KB" + ("  LOW-RES" if cover.width < MIN_COVER_W else ""))

    hcfg = cfg["hero"]
    hero = shrink(crop_to(load(src / hcfg["file"], hcfg.get("trim")), 16 / 9, hcfg.get("focus", (0.5, 0.5))), HERO_W)
    n = save(hero, out / "hero.webp", MAX_BYTES["hero"])
    notes.append(f"hero {hero.width}x{hero.height} {n // 1024}KB")

    for i, s in enumerate(cfg["shots"], 1):
        s = {"file": s} if isinstance(s, str) else s
        im = load(src / s["file"], s.get("trim"))
        big = shrink(im, SHOT_W)
        n1 = save(big, out / f"shot-{i}.webp", MAX_BYTES["shot"])
        n2 = save(shrink(im, THUMB_W), out / f"shot-{i}-sm.webp", MAX_BYTES["thumb"])
        notes.append(f"shot-{i} {big.width}x{big.height} {n1 // 1024}KB (+{n2 // 1024}KB)  <- {s['file']}")
    return notes


def main(argv: list[str]) -> None:
    src_root = DEFAULT_SRC
    if "--src" in argv:
        i = argv.index("--src")
        src_root = Path(argv[i + 1])
        argv = argv[:i] + argv[i + 2:]
    slugs = argv or list(GAMES)
    unknown = [s for s in slugs if s not in GAMES]
    if unknown:
        sys.exit(f"Unknown slug(s): {', '.join(unknown)}")
    for slug in slugs:
        print(f"== {slug}")
        for line in build(slug, GAMES[slug], src_root):
            print("   " + line)


if __name__ == "__main__":
    main(sys.argv[1:])
