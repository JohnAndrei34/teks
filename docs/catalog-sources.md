# Catalog sources: the 19 real games

Where every fact in `backend/data/games.json` and `developers.json` comes from, checked on 2026-11-22.
TEKS is a school project: these games and their media belong to their developers. TEKS is not affiliated with them and does not sell them.

## Checklist for the team

Fill these in, then edit the JSON and run `python -m scripts.seed` (from `backend/`).

- [ ] **Breadwinner: studio and official page.** Both `https://mithikagames.itch.io/breadwinner` and `https://mithika-studio.itch.io/breadwinner` are online, and one search summary mentioned "Mithika Games". We could not tell which page is official, so the game shows "Studio to be confirmed" with no link. Platforms and release date are also unknown.
- [ ] **Kalayaan Road: The Story of Kuya Jesse: studio, official page, platforms, release date.** Nothing about this game turned up in public searches. Genre (`Adventure`) and the description were written from the team's screenshots (chapter menu, pares cart, police station, hospital): please check both.
- [ ] **Confirm 6 studios credited from Steam.** When we planned this, these had no checked studio. Steam's own developer field now names one, so they are credited; to go back to "Studio to be confirmed", point the game at a `tbc-<game>` developer:
  - Aswang Hunter: Neuroticfly Games (Steam app 4692760; the trailer is on their channel)
  - Lola Maria: Kallim Studio (Steam app 4042190; the trailer is on their channel)
  - Mahika: Candy Cabinets Studio (Steam app 1778690)
  - Maiba Taya: SolitaryStudios, published by Neuroticfly Games (Steam app 5179520; the trailer is on the Solitary Studios channel)
  - Mandato: Nest Games, published by SolitaryStudios (Steam app 4897340; also `solitarystudios.itch.io/mandato`)
  - Sabado: Kiwi Dreams, published by Neuroticfly Games (Steam app 4986750)
- [ ] **No trailer from the studio's own channel** (so `trailer_url` is empty). Add the studio's YouTube link if they have one:
  Agimat and the World Beyond, Anito, Breadwinner, Eskinita, Kalayaan Road, Karinderya ni Mark, Mahika, Mandato, Patintero, Sabado, Water Delivery.
  - Water Delivery: we only found uploads by GameTrailers and by eastasiasoft (its PS4/PS5 publisher in Asia), not Frozen Lake Software.
  - Sabado: we only found uploads by Indie Games Hub.
  - Agimat: the game's channel (`youtube.com/channel/UCLkTKC2mcmX0GWn6wF0Wudw`) shows no public videos.
- [ ] **No official page:** Agimat and the World Beyond (no store page; a 2021 article said it targeted late 2023), Anito (2003, out of print), Breadwinner, Kalayaan Road.
- [ ] **Release date unknown** (left empty, not shown): Agimat, Aswang Hunter (Steam: "To be announced"), Breadwinner, Kalayaan Road, Karinderya ni Mark, Mahika and Mandato (Steam: "Coming soon"), Patintero.
- [ ] **Check our own writing:** every `cultural_note` and `tags` value is ours (general facts about the Filipino word or custom, not claims about the game). Descriptions and highlights paraphrase the official pages listed below.
- [ ] **Prices are sample demo prices** chosen by us, labelled "Demo price" on the site. They are not the games' real prices.
- [ ] **Fallen Tear and Until Then:** waiting for media (see the end of this file).

## The 19 games

Release dates are Steam release dates where the game is on Steam (several came out on itch.io first).

| Game | Studio (source) | Official page | Trailer (`trailer_url`, channel) | Release date |
|---|---|---|---|---|
| Agimat and the World Beyond | Boom Brain Studio, Laguna (Rappler; Philstar Life, 2021) | none | none | unknown |
| Agnostiko ORIGINS | Singles Alliance, solo dev Leoned Andrew Tumbaga (Inquirer Technology; Nintendo eShop) | [Nintendo eShop](https://www.nintendo.com/us/store/products/agnostiko-origins-switch/), also [itch.io](https://singlesalliance.itch.io/agnostiko) | [fR7eQrQChb4](https://www.youtube.com/watch?v=fR7eQrQChb4), Singles Alliance | 2024-06-14 (Switch) |
| Anito: Defend a Land Enraged | Anino Entertainment (Wikipedia; Metacritic) | none (out of print) | none | 2003-11-22 (PH launch; sources differ by a day or two) |
| Aswang Hunter | Neuroticfly Games (Steam) | [Steam 4692760](https://store.steampowered.com/app/4692760/) | [pvBThRVaBTw](https://www.youtube.com/watch?v=pvBThRVaBTw), Neuroticfly Games | To be announced |
| Bayani | Ranida Games (Steam) | [Steam 941020](https://store.steampowered.com/app/941020/), game site bayaniph.com | [xh0prFVUams](https://www.youtube.com/watch?v=xh0prFVUams), RanidaTV (Tokyo Game Show 2020 trailer) | 2019-06-11 |
| Breadwinner | **to be confirmed** | none | none | unknown |
| Eskinita | Machu (Steam; itch.io `machudev`) | [Steam 4840880](https://store.steampowered.com/app/4840880/), also [itch.io](https://machudev.itch.io/eskinita) | none | 2026-06-28 (Steam) |
| Hapunan | Yikon Games (Steam: "YIKON GAMES INC", published by Neuroticfly Games); developer Josef Yenko (Inquirer) | [Steam 4750540](https://store.steampowered.com/app/4750540/), also [itch.io](https://yikon.itch.io/hapunan) | [k8a9v9MBBq8](https://www.youtube.com/watch?v=k8a9v9MBBq8), Yikon | 2026-08-25 (Steam; on itch.io since early 2025) |
| Jeepney Simulator | Spacezero Interactive (Steam; Wikipedia) | [Steam 2489990](https://store.steampowered.com/app/2489990/) (2819970 is Jeepney Simulator 2) | [ty2Y-EnXas4](https://www.youtube.com/watch?v=ty2Y-EnXas4), Spacezero Interactive | 2023-09-16 (left Early Access) |
| Kalayaan Road: The Story of Kuya Jesse | **to be confirmed** | none | none | unknown |
| Karinderya ni Mark | Mark The Panda (itch.io) | [itch.io](https://mark-the-panda.itch.io/karinderya-ni-mark) | none | unknown |
| Lola Maria | Kallim Studio (Steam) | [Steam 4042190](https://store.steampowered.com/app/4042190/) | [nRUbL8SOQEs](https://www.youtube.com/watch?v=nRUbL8SOQEs), Kallim Studio | 2025-10-11 |
| Mahika | Candy Cabinets Studio (Steam) | [Steam 1778690](https://store.steampowered.com/app/1778690/) | none | Coming soon |
| Maiba Taya | SolitaryStudios, published by Neuroticfly Games (Steam) | [Steam 5179520](https://store.steampowered.com/app/5179520/) | [uCQzNtoauAE](https://www.youtube.com/watch?v=uCQzNtoauAE), Solitary Studios | 2026-10-08 (Early Access) |
| Mandato | Nest Games, published by SolitaryStudios (Steam) | [Steam 4897340](https://store.steampowered.com/app/4897340/) | none | Coming soon |
| Patintero | Dream illustration (itch.io) | [itch.io](https://dreamillustration.itch.io/patintero) | none | unknown |
| Sabado | Kiwi Dreams, published by Neuroticfly Games (Steam) | [Steam 4986750](https://store.steampowered.com/app/4986750/) | none | 2026-11-02 |
| Taguan | Murushii Studios (Steam) | [Steam 4186430](https://store.steampowered.com/app/4186430/), also [itch.io](https://murushii.itch.io/taguan) | [slyJr4iJH6Y](https://www.youtube.com/watch?v=slyJr4iJH6Y), Murushii | 2025-12-24 (Steam; itch.io first) |
| Water Delivery | Frozen Lake Software (Steam) | [Steam 3077670](https://store.steampowered.com/app/3077670/) | none | 2024-09-18 |

Trailer channels were checked with YouTube's oEmbed endpoint (`author_name`). Trailers are embedded from `youtube-nocookie.com` only after the visitor clicks; nothing is re-uploaded.

Content note: Aswang Hunter's game page shows "Contains horror / blood" (its gallery includes `Aswang2.png`, a bleeding pregnant woman, as the last screenshot). Taguan's Steam page also warns about blood and mild gore; it has no note on TEKS yet.

## Not in the catalog yet (no media)

| Game | Studio | Official page | Trailers found | Release |
|---|---|---|---|---|
| Fallen Tear: The Ascension | Steam lists CMD Studios (publishers CMD Studios, Holysoft GmbH); press credits Winter Crew Studio, the team under CMD Studios | [Steam 1446900](https://store.steampowered.com/app/1446900/), fallentearascension.com | only re-uploads found (GameTrailers, Indie Games Hub); check the studio's channel | 2026-09-23 (Steam 1.0) |
| Until Then | Polychroma Games, published by Maximum Entertainment (Steam) | [Steam 1574820](https://store.steampowered.com/app/1574820/) | only GameTrailers uploads found; check Polychroma's or the publisher's channel | 2024-06-25 (PC, PS5; later Switch and Xbox) |

To add one: put its media in `teks-content/Game Pictures/<folder>`, add an entry to `GAMES` in `backend/scripts/media.py`, run `python -m scripts.media <slug>`, then add it to `games.json` (and its studio to `developers.json`) and seed.

## How the media was made

- Originals stay in `teks-content/Game Pictures` (inventory: [game-media-inventory.md](game-media-inventory.md)). Nothing over 10 MB is in the repo.
- Images: `backend/scripts/media.py` (Pillow, `pip install -r requirements-media.txt`). Per game it writes `frontend/public/img/games/<slug>/cover.webp` (300:220 crop, up to 1200x880), `hero.webp` (16:9, up to 1920 wide), and `shot-N.webp` (up to 1600 wide) plus `shot-N-sm.webp` (480 wide), each under 300 KB (thumbnails under 60 KB). Images are never upscaled. The script holds the chosen source files, crop positions and trims.
- Trims: Breadwinner `1.png` loses 3.5% left and right (store-gallery arrows). Lola Maria `1-5.png` lose 4.5% at the bottom (video-player icons).
- Skipped: tiny thumbnails (Bayani4, JEEP1, JEEP2, Mandato2, TAGUAN2(1), Taguan10, Anito3), exact duplicates (TAGUAN3(1), TAGUAN4(1)), the Agimat "2D Platformer" video (GameGeeks News re-upload) and the Anito trailer (Russian subtitles).
- Low-resolution covers: Agimat (671 px wide), Aswang Hunter (630), Sabado (616, letterboxed). They are still sharp enough for a 300 px card.
- Hero clips (muted, 1280x720 H.264, CRF 28, `+faststart`), cut from the studios' trailers in `teks-content`:

  | Game | Source | Cut | Size |
  |---|---|---|---|
  | Maiba Taya | Maiba Taya - Official Announcement Trailer.mp4 | 15.0 s, 12 s long | 1.4 MB |
  | Bayani | Trailer - Tokyo Game Show 2020.mp4 | 47.5 s, 12 s long | 4.2 MB |
  | Jeepney Simulator | Jeepney Simulator - Early Access Trailer.mp4 | 1.0 s, 12 s long | 1.2 MB |
  | Water Delivery | wd.mp4 | 10.0 s, 5.9 s long (the only stretch with no text on screen) | 0.4 MB |

  Command: `ffmpeg -ss <start> -t <length> -i <source> -an -vf "scale=1280:-2,fps=30,format=yuv420p" -c:v libx264 -preset slow -crf 28 -profile:v high -movflags +faststart clip.mp4`. The frontend lists clip games in `CLIPS` in `app.js`; the path is always `img/games/<slug>/clip.mp4`.
