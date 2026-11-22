# Taglish review: every Filipino string in TEKS

For Dea and the team. Every on-screen string is written twice, as `L('Taglish', 'English')` in `frontend/public/app.js` (and as `data-tl` / `data-en` in `frontend/public/index.html`). In November 2026 we rewrote **all** of the Taglish so it sounds like the Filipino used in GCash, Shopee, Lazada and Steam PH groups, instead of word-for-word translation. The English did not change, except one label the team changed while deciding the ⚠ rows (T68: "Under ₱150" is now "₱150 and below", which is what the filter does).

**How to review:** read the **New Taglish** column. If a line sounds off, write your fix next to it (or tell us) and we update `app.js`. Rows marked **✓** were ⚠ (unsure) and have been decided by the team. `{curly}` parts are filled in by the site (a number, a name, a price); `game/games` means the site picks one.

## The rules we used

- **English stays English** for common app, shopping and gaming words: Home, Store, Cart, Checkout, Sign in, Sign out, Collection, Favorites, Download, Submit, Promo code, Demo price, Price, Total, Subtotal, Order, Genre, Rating, Studio, Developer, Trailer, Screenshot, Featured, New releases, Rankings, Filter, Sort, Search, Email, Password, Mobile number, Payment method, Place order, Play, Buy, Release date, Platform, Official page, guest, Owned, EPIC / RARE / COMMON.
- **Filipino** for the friendly parts: greetings, explanations, confirmations, errors, empty states and sentence buttons. Casual but polite: "mo" / "ka", never "ninyo".
- **Taglish verbs** are hyphenated: i-save, i-check, i-send, mag-submit, mag-sign in, mag-browse, na-place, naglo-load, sine-send, ire-review, iche-check.
- **One wording per thing**, everywhere:

  | Thing | Always | Not |
  |---|---|---|
  | your cart | Cart mo | Mga sasakyan mo (= "your vehicles") |
  | remove | Tanggalin | Alisin |
  | the store | Store (Tingnan ang Store, Bumalik sa Store) | Tindahan |
  | your library | Collection mo / Collection ko | Koleksyon |
  | price shown on games | Demo price | Demo na presyo |
  | liked games | Favorites, ♡ Like / ♥ Liked | Mga paborito, Gusto ko |
  | owned games | Owned | Pag-aari |
  | not signed in | guest (Magpatuloy bilang guest) | bisita |
  | send in a game | Mag-submit ng laro | Ipasa ang laro |
  | developer keeps 80% | Sa'yo ang 80% | Itago ang 80% (= "hide 80%") |
  | loading | Naglo-load... | Kinukuha... |
  | made by a studio | gawa ng {studio} | mula sa (= "from") |

## Errors we fixed (the meaning was wrong)

| Where | Old Taglish | Problem | New Taglish |
|---|---|---|---|
| Cart heading | Mga sasakyan mo | means "your vehicles" | Cart mo |
| Home band, Sell a game, About | Magbenta. Itago ang 80%. / at itago ang 80% | "itago" means "hide" | Magbenta. Sa'yo ang 80%. / at sa'yo ang 80% |
| Game page studio credit | mula sa {studio} | "from", not "by" | gawa ng {studio} |
| Store sort label | Ayusin | means "fix / arrange" | Sort |
| Trailer button label | (galing YouTube) | "from YouTube"; the English says it loads YouTube | (maglo-load ang YouTube) |
| Home rail label | Mag-scroll pagilid | not a standard word | Mag-scroll patagilid |
| Store: no results | Walang tumama | sounds like a lottery draw | Walang tugmang laro |
| Order stamp | Tapos na | "done", not "order placed" | Na-place na ang order mo |
| Hero pause button | Ihinto | "stop", a different action from pause | I-pause / I-play |
| About: what are teks | (no "trade") | left out "trade" from the English | ...kinokolekta, pinagpapalitan, at nilalaro... |

## ✓ Decided (were ⚠ unsure)

All 8 were decided by the team in November 2026; no ⚠ rows remain.

| # | We proposed | Decision | Final Taglish | Final English |
|---|---|---|---|---|
| T8 | Studio: hindi pa kumpirmado | Shorter, fits the card line | **Studio: TBC** | Studio to be confirmed |
| T68 | ₱150 pababa (demo) | Keep the Taglish; change the English to match it (the filter includes ₱150) | **₱150 pababa (demo)** | **₱150 and below (demo)** (was "Under ₱150 (demo)") |
| T90 | Paalala sa content | Use the English term | **Content note** | Content note |
| T94 | Tala sa kultura | Keep | **Tala sa kultura** | Cultural note |
| T125 | Na-place na ang order | Add "mo" (checkout toast and order stamp) | **Na-place na ang order mo** | Order placed |
| T135 | {n} sa {m} laro ang owned mo · {k} favorites | Keep | **{n} sa {m} laro ang owned mo · {k} favorites** | {n} of {m} games owned · {k} favorites |
| T156 | Klase ng developer | Go back to "Uri" | **Uri ng developer** | Developer type |
| T281 | General na tanong | Keep | **General na tanong** | General question |

## index.html (navigation and footer)

| # | Where | English | Old Taglish | New Taglish | Why |
|---|---|---|---|---|---|
| F1 | Skip link (keyboard) | Skip to content | Lumaktaw sa nilalaman | **Pumunta sa content** | "Lumaktaw" and "nilalaman" are textbook words. |
| F2 | Nav | Home | Simula | **Home** | Rule: "Home" stays English. |
| F3 | Nav | Store | Tindahan | **Store** | Rule: "Store" stays English. |
| F4 | Nav | Collection | Koleksyon | **Collection** | Rule: "Collection" stays English. |
| F5 | Nav | Sell a game | Magbenta | (same) | Short and clear. |
| F6 | Nav | About | Tungkol | **About** | "Tungkol" alone means "about (something)"; PH apps say "About". |
| F7 | Footer | Tech, Entertainment & Kreative Stories. An online store for games made by Filipino developers. | ...Tindahan ng mga larong gawa ng mga Pilipinong developer. | **...Online store para sa mga larong gawa ng mga Pilipinong developer.** | Keeps "online store" like the English. |
| F8 | Footer | Browse | Mag-browse | (same) | Natural. |
| F9 | Footer | All games | Lahat ng laro | (same) | Natural. |
| F10 | Footer | Pinoy Collections | Pinoy Collections | (same) | Name. |
| F11 | Footer | Newest | Pinakabago | (same) | Natural. |
| F12 | Footer | My collection | Koleksyon ko | **Collection ko** | Rule: "Collection" stays English. |
| F13 | Footer | Developers | Mga developer | (same) | Natural. |
| F14 | Footer | Sell your game | Ibenta ang laro mo | (same) | Natural. |
| F15 | Footer | Why TEKS | Bakit TEKS | (same) | Natural. |
| F16 | Footer | Contact us | Kausapin kami | (same) | Natural. |
| F17 | Footer | TEKS is a school project. Games and media belong to their developers; TEKS is not affiliated with them and does not sell them. Prices are demo prices, and checkout takes no payment. | Ang TEKS ay isang school project. Ang mga laro at media ay pag-aari ng kanilang mga developer; hindi kaugnay ng TEKS ang mga ito at hindi sila ibinebenta ng TEKS. Demo na presyo ang mga presyo, at walang bayad sa checkout. | **Ang TEKS ay isang school project. Pag-aari ng mga developer ang mga laro at media; hindi konektado ang TEKS sa kanila at hindi ibinebenta ng TEKS ang mga larong ito. Demo price ang mga presyo, at walang kinukuhang bayad sa checkout.** | Simpler; "Demo price" stays English. Same wording as the disclaimer in app.js (T3). |
| F18 | Language button (screen readers; app.js) | Language: English. Switch to Taglish. | Wika: Taglish. Lipat sa English. | **Language: Taglish. I-switch sa English.** | Matches the English label; "Lipat" alone sounds like moving house. |

## Every string in app.js

`Where` is the screen, with the line number(s) in `app.js`. A string used in several places has one row.

| # | Where (app.js line) | English | Old Taglish | New Taglish | Why |
|---|---|---|---|---|---|
| T1 | Errors (41) | Could not reach TEKS. Check your connection and try again. | Hindi maabot ang TEKS. Tingnan ang koneksyon mo at subukan ulit. | **Hindi makakonekta sa TEKS. I-check ang connection mo at subukan ulit.** | "makakonekta" and "I-check" are how PH apps say it; "maabot"/"Tingnan" were word-for-word. |
| T2 | Errors (44) | Something went wrong. Try again. | May nangyaring mali. Subukan ulit. | (same) | Natural. |
| T3 | Disclaimer (game, About, studio) (91) | TEKS is a school project. Games and media belong to their developers; TEKS is not affiliated with them and does not sell them. | Ang TEKS ay isang school project. Ang mga laro at media ay pag-aari ng kanilang mga developer; hindi kaugnay ng TEKS ang mga ito at hindi sila ibinebenta ng TEKS. | **Ang TEKS ay isang school project. Pag-aari ng mga developer ang mga laro at media; hindi konektado ang TEKS sa kanila at hindi ibinebenta ng TEKS ang mga larong ito.** | Simpler; "konektado" instead of the formal "kaugnay". |
| T4 | Price label (92) | Demo price | Demo na presyo | **Demo price** | Rule: "Demo price" stays English. |
| T5 | Studio type (95) | Student team | Grupo ng estudyante | **Student team** | "Student team" is what PH school teams call themselves; "Grupo ng estudyante" was word-for-word. |
| T6 | Studio type (95) | Indie developer | Indie developer | (same) | Same in both. |
| T7 | Header cart (110) | Cart, {cart.length} game/games | Cart, {cart.length} laro | (same) | Screen-reader label; fine. |
| ✓ T8 | Studio name (137) | Studio to be confirmed | Studio na kukumpirmahin pa | **Studio: TBC** | Decided: short enough for a card line; "kukumpirmahin pa" was stiff. |
| T9 | Game card (141) | EPIC | PAMBIHIRA | **EPIC** | Gaming rarity term; PH gamers use the English ("PAMBIHIRA" was word-for-word). |
| T10 | Game card (141) | RARE | BIHIRA | **RARE** | Gaming rarity term. |
| T11 | Game card (141) | COMMON | KARANIWAN | **COMMON** | Gaming rarity term. |
| T12 | Game card (147, 149) | Series | Serye | **Series** | Card label, same as the "Series 05" badge; gaming/collectible term. |
| T13 | Game card (149) | Rarity | Pambihira | **Rarity** | Gaming term. |
| T14 | Game card, Home (Bought on TEKS), Collection (150, 255, 654, 656, 666, 667) | Owned | Pag-aari mo na / Pag-aari | **Owned** | Steam/gaming term; "Pag-aari" sounds legal/formal. Same word everywhere. |
| T15 | Game card (158) | View | Tingnan | (same) | Natural. |
| T16 | Game card, Flip button (159, 1291) | Flip | Taob | (same) | "Taob" (face down) is the real teks street-game word Dea chose; keep. |
| T17 | Buy button (162) | In your collection | Nasa koleksyon mo na | **Nasa Collection mo na** | "Collection" stays English (nav name). |
| T18 | Buy button (163) | In cart. Check out | Nasa cart. Mag-checkout | **Nasa cart na. Mag-checkout** | Adds "na" (already in cart), like Shopee. |
| T19 | Buy button, Home (Bought on TEKS), Collection (164, 255, 658) | Buy | Bilhin | **Buy** | Rule: "Buy" stays English. |
| T20 | Toast (211) | {title} added to cart | {title} ay nasa cart na | **Naidagdag sa cart ang {title}** | Shopee/Lazada phrasing "Naidagdag sa cart". |
| T21 | Home hero (228) | Studio | Studio | (same) | Same in both. |
| T22 | Home hero, Game page (229, 516) | Release date | Petsa ng labas | **Release date** | Steam PH uses "Release date"; "Petsa ng labas" was word-for-word. |
| T23 | Home hero (230) | Genre | Genre | (same) | Same in both. |
| T24 | Home hero, Store, Game page (231, 385, 517) | Platform | Plataporma | **Platform** | "Plataporma" sounds like politics; gamers say "platform". |
| T25 | Home hero (234) | Featured game | Tampok na laro | **Featured game** | Rule: "Featured" stays English. |
| T26 | Home hero (238) | Details | Detalye | **Details** | Short button label; common in PH apps. |
| T27 | Home (Bought on TEKS) (249) | Rank | Ranggo | **Rank** | Gaming term (screen-reader label). |
| T28 | Home (Bought on TEKS), Home, Collection (255, 348, 657) | In cart | Sa cart / Nasa cart | **Nasa cart** | Same as before; one wording everywhere. |
| T29 | Home (264) | Scroll left | Pakaliwa | **Mag-scroll pakaliwa** | Clearer: says what the button does. |
| T30 | Home (264) | Scroll right | Pakanan | **Mag-scroll pakanan** | Clearer: says what the button does. |
| T31 | Home (271) | Featured games | Mga tampok na laro | **Featured games** | Rule: "Featured" stays English. |
| T32 | Home (278, 321) | Pause | Ihinto | **I-pause** | Media-player wording; "Ihinto" (stop) is a different action. |
| T33 | Home (283) | New arrivals | Bagong dating | (same) | Natural (Shopee uses "Bagong dating"). |
| T34 | Home (283) | New releases | Bagong labas | **New releases** | Rule: "New releases" stays English. |
| T35 | Home (283) | The newest games in the store. | Pinakabagong laro sa tindahan. | **Ang mga pinakabagong laro sa Store.** | "Store" stays English. |
| T36 | Home (284) | See all {games.length} games | Lahat ng {games.length} laro | **Tingnan lahat ng {games.length} laro** | English says "See all": adds "Tingnan". |
| T37 | Home (285) | New games. Scroll sideways. | Bagong laro. Mag-scroll pagilid. | **Mga bagong laro. Mag-scroll patagilid.** | Correct word is "patagilid" ("pagilid" is not standard). |
| T38 | Home (299) | Genres | Mga genre | **Genres** | Rule: "Genre" stays English. |
| T39 | Home (299) | Browse by genre | Mag-browse ayon sa genre | (same) | Natural Taglish already. |
| T40 | Home (299) | Jump straight to the kind of game you want to play. | Pumili ng uri ng laro na gusto mong laruin. | **Diretso na sa klase ng laro na gusto mong laruin.** | Matches "Jump straight to"; "Pumili ng uri" lost that. |
| T41 | Home (304) | Browse by Filipino story | Mag-browse ayon sa kwentong Pinoy | (same) | Natural. |
| T42 | Home (304) | Folklore, street games, history and everyday life. | Alamat, laro sa kalye, kasaysayan, at araw-araw na buhay. | (same) | Natural. |
| T43 | Home, Pinoy Collection page (305, 1044) | All collections | Lahat ng koleksyon | **Lahat ng collection** | "collection" stays English; Filipino does not add -s. |
| T44 | Home, Sell a game, About (290, 698, 988) | For developers | Para sa mga developer | (same) | Natural. |
| T45 | Home (291) | Sell. Keep {pct}%. | Magbenta. Itago ang {pct}%. | **Magbenta. Sa'yo ang {pct}%.** | Error fixed: "Itago" means "hide". "Sa'yo ang 80%" = you keep 80%. |
| T46 | Home (292) | Send your game and a short pitch. We review it and reply by email. When someone buys it, most of the sale is yours. | Ipadala ang laro mo at maikling pitch. Susuriin namin at sasagot sa email. Kapag may bumili, sa iyo ang malaking bahagi. | **I-send ang laro mo kasama ang maikling pitch. Ire-review namin ito at sasagot kami sa email. Kapag may bumili, sa'yo ang malaking bahagi ng benta.** | Casual verbs (I-send, Ire-review) like PH apps. |
| T47 | Home, Sell a game, My account, About (293, 700, 911, 990) | Submit a game | Ipasa ang laro | **Mag-submit ng laro** | Rule: "Submit" stays English; "Ipasa" can mean "pass on". |
| T48 | Home, About (293, 970) | Why TEKS | Bakit TEKS | (same) | Natural. |
| T49 | Home (295) | You receive per ₱299 copy | Kita sa bawat kopya ng ₱299 | **Kikitain mo sa bawat ₱299 na kopya** | Says "you" receive, like the English. |
| T50 | Home (310) | Rankings | Ranggo | **Rankings** | Gaming term. |
| T51 | Home (310) | Bought on TEKS | Nabili sa TEKS | (same) | Natural. |
| T52 | Home (310) | Copies from TEKS demo checkouts. No real payment is taken, and these are not the developers’ sales. | Bilang ng kopya mula sa demo checkout ng TEKS. Walang totoong bayad, at hindi ito benta ng mga developer. | (same) | Natural and exact. |
| T53 | Home (321) | Play | Ituloy | **I-play** | Resumes the slideshow; pairs with "I-pause". |
| T54 | Home (322) | Play the featured games | Ituloy ang mga tampok na laro | **I-play ang featured games** | Pairs with the button text. |
| T55 | Home (322) | Pause the featured games | Ihinto ang mga tampok na laro | **I-pause ang featured games** | Pairs with the button text. |
| T56 | Store (364) | Featured | Tampok | **Featured** | Rule: "Featured" stays English. |
| T57 | Store (364, 376) | Newest | Pinakabago | (same) | "Pinakabago" is natural for a sort option. |
| T58 | Store (364) | Price: low to high | Presyo: mababa muna | **Price: mababa hanggang mataas** | Rule: "Price" stays English; full low-to-high meaning. |
| T59 | Store (364) | Price: high to low | Presyo: mataas muna | **Price: mataas hanggang mababa** | Rule: "Price" stays English. |
| T60 | Store (364) | Title: A to Z | Pamagat: A-Z | **Title: A hanggang Z** | "Title" is common in PH apps; "Pamagat" is textbook. |
| T61 | Store, About (367, 956) | Games | Mga laro | (same) | Natural. |
| T62 | Store, Game page (367, 522) | Store | Tindahan | **Store** | Rule: "Store" stays English (was "Tindahan"). |
| T63 | Store (370) | Search games | Maghanap ng laro | **Mag-search ng laro** | Rule: "Search" stays English. |
| T64 | Store (370) | Search games, studios, or creatures... | Hanapin ang laro, studio, o nilalang... | **Mag-search ng laro, studio, o nilalang...** | Rule: "Search" stays English. |
| T65 | Store (371) | Clear search | Burahin ang hinahanap | **I-clear ang search** | "Burahin ang hinahanap" was stiff. |
| T66 | Store (374) | Quick filters | Mabilis na filter | **Quick filters** | Rule: "Filter" stays English. |
| T67 | Store (375) | All games | Lahat | **Lahat ng laro** | English is "All games"; "Lahat" alone dropped "games". |
| ✓ T68 | Store (377) | {amount} and below (demo) (was "Under {amount} (demo)") | Wala pang {amount} (demo) | **{amount} pababa (demo)** | Decided: Shopee-style "₱150 pababa"; the English was changed to match, since the filter includes ₱150. |
| T69 | Store (381, 382, 390) | Filters | Mga filter | **Filters** | Rule: "Filter" stays English. |
| T70 | Store (382) | Clear all | I-clear lahat | (same) | Natural. |
| T71 | Store, Collection, Sell a game (384, 664, 709) | Collection | Koleksyon | **Collection** | Same word as the Pinoy Collections. |
| T72 | Store (386) | Max demo price | Pinakamataas na demo na presyo | **Pinakamataas na demo price** | Rule: "Demo price" stays English. |
| T73 | Store (392) | Sort | Ayusin | **Sort** | Rule: "Sort" stays English ("Ayusin" means "fix/arrange"). |
| T74 | Store (426) | {list.length} of {games.length} games | {list.length} sa {games.length} laro | (same) | Natural. |
| T75 | Store (428) | No games match | Walang tumama | **Walang tugmang laro** | Natural; "Walang tumama" sounds like a lottery. |
| T76 | Store (428) | Try a different word, or remove a few filters. | Subukan ang ibang salita, o alisin ang ilang filter. | **Subukan ang ibang salita, o tanggalin ang ilang filter.** | "Tanggalin" instead of "alisin". |
| T77 | Store (428) | Clear all filters | I-clear lahat ng filter | (same) | Natural. |
| T78 | Store (431) | Remove filter | Alisin ang filter | **Tanggalin ang filter** | "Tanggalin" instead of "alisin". |
| T79 | Store (433) | Any | Kahit magkano | (same) | Natural. |
| T80 | Store (471) | Store \| TEKS | Tindahan \| TEKS | **Store \| TEKS** | Rule: "Store" stays English. |
| T81 | Game page (trailer) (476) | Play the {title} trailer (loads YouTube) | I-play ang trailer ng {title} (galing YouTube) | **I-play ang trailer ng {title} (maglo-load ang YouTube)** | English says it loads YouTube; "galing YouTube" meant "from YouTube". |
| T82 | Game page (trailer) (478) | Play trailer · YouTube | I-play ang trailer · YouTube | (same) | Natural. |
| T83 | Game page (trailer) (484) | {title} trailer | Trailer ng {title} | (same) | Natural. |
| T84 | Game page (screenshots) (496) | Previous screenshot | Naunang larawan | **Nakaraang screenshot** | Rule: "Screenshot" stays English. |
| T85 | Game page (screenshots) (496) | Next screenshot | Susunod na larawan | **Susunod na screenshot** | Rule: "Screenshot" stays English. |
| T86 | Game page (screenshots), Collection (497, 675) | Close | Isara | (same) | Natural. |
| T87 | Game page (528) | by | mula sa | **gawa ng** | "by" a studio = "gawa ng"; "mula sa" means "from". |
| T88 | Game page, Collection, Studio page (529, 675, 1077) | Official page | Opisyal na pahina | **Official page** | PH apps say "official page"; "Opisyal na pahina" was word-for-word. |
| T89 | Game page (529) | Get the game from its developer. | Bilhin o i-download ang laro mula sa developer. | **Kunin ang laro sa developer nito.** | Exact meaning of "Get the game from its developer". |
| ✓ T90 | Game page (530) | Content note | Paalala sa nilalaman | **Content note** | Decided: the English term reads best ("nilalaman" is textbook). |
| T91 | Game page (534, 557) | ♥ Liked | ♥ Gusto ko! | **♥ Liked** | Same as Facebook/Shopee "Like". |
| T92 | Game page (534, 557) | ♡ Like | ♡ Gusto ko | **♡ Like** | Same as Facebook/Shopee "Like"; "Gusto ko" changes meaning in later sentences. |
| T93 | Game page (535) | Highlights | Mga tampok | **Highlights** | Common in PH apps; "Mga tampok" is unclear. |
| ✓ T94 | Game page (536) | Cultural note | Tala sa kultura | (same) | Decided: keep. Correct, if a little formal. |
| T95 | Game page (537) | Where your {amount} would go (demo) | Saan mapupunta ang {amount} (demo) | **Saan mapupunta ang {amount} mo (demo)** | Adds "mo" for "your". |
| T96 | Game page (539) | In this demo, {studio} would receive {amount} and TEKS would keep {amount}. No real payment is taken. | Sa demo na ito, {studio} ay tatanggap ng {amount} at {amount} ang para sa tindahan. Walang totoong bayad. | **Sa demo na ito, makakatanggap ang {studio} ng {amount}, at {amount} ang mapupunta sa TEKS. Walang totoong bayad.** | Says TEKS keeps the rest, like the English ("tindahan" was vague). |
| T97 | Game page (543) | Trailer and screenshots | Trailer at mga larawan | **Trailer at screenshots** | Rule: "Trailer", "Screenshot" stay English. |
| T98 | Game page (545) | Screenshots | Mga larawan | **Screenshots** | Rule: "Screenshot" stays English ("larawan" = any picture). |
| T99 | Game page (545) | From the developer. Select one to enlarge it. | Mula sa developer. Pindutin para lumaki. | **Galing sa developer. Pumili ng isa para palakihin.** | "Pindutin" was vague; matches "Select one to enlarge it". |
| T100 | Game page (546) | Enlarge | Palakihin | (same) | Natural. |
| T101 | Game page (548) | You might also like | Baka magustuhan mo rin | (same) | Natural. |
| T102 | Game page (558) | Saved to your favorites | Nilagay sa paborito | **Na-save sa Favorites mo** | "Favorites" like Shopee; "Nilagay sa paborito" was stiff. |
| T103 | Cart / checkout (569) | Your cart is empty | Walang laman ang cart | **Wala pang laman ang cart mo** | Natural ("Your cart is empty"). |
| T104 | Cart / checkout (569) | Pick a game from the store and it will show up here. | Pumili ng laro sa tindahan at lalabas ito dito. | **Pumili ng laro sa Store at lalabas ito dito.** | "Store" stays English. |
| T105 | Cart / checkout, Collection, My account, About, Order, Not found page (569, 651, 655, 914, 950, 950, 1160, 1259) | Browse the store | Tingnan ang tindahan | **Tingnan ang Store** | "Store" stays English; one wording everywhere. |
| T106 | Cart / checkout, Order (576, 1183) | Promo | Promo | (same) | Same in both. |
| T107 | Cart / checkout (577) | To developers | Para sa developer | **Para sa mga developer** | Adds "mga" (plural, "To developers"). |
| T108 | Cart / checkout (578) | Total (demo) | Kabuuan (demo) | **Total (demo)** | Rule: "Total" stays English. |
| T109 | Cart / checkout (580) | Place order | Ilagay ang order | **Place order** | Shopee PH also says "Place Order" in Filipino mode. |
| T110 | Cart / checkout (583) | Your cart | Mga sasakyan mo | **Cart mo** | Error fixed: "Mga sasakyan mo" means "your vehicles". |
| T111 | Cart / checkout, Collection (585, 660) | Remove | Alisin | **Tanggalin** | Rule: "Tanggalin" instead of "Alisin". |
| T112 | Cart / checkout (586) | All prices are demo prices. TEKS does not sell these games; get them from each developer’s official page. | Demo na presyo ang lahat ng presyo. Hindi ibinebenta ng TEKS ang mga larong ito; bilhin ang mga ito sa opisyal na pahina ng developer. | **Demo price ang lahat ng presyo. Hindi ibinebenta ng TEKS ang mga larong ito; kunin sila sa official page ng bawat developer.** | "Demo price", "official page" stay English. |
| T113 | Cart / checkout (587, 587) | Order summary | Buod ng order / Buod | **Order summary** | PH checkout wording; "Buod" is textbook. |
| T114 | Cart / checkout, My account, Contact (590, 920, 1107) | Name | Pangalan | (same) | Natural. |
| T115 | Cart / checkout (592) | Mobile number | Mobile number | (same) | Rule: stays English. |
| T116 | Cart / checkout (593) | Payment method | Paraan ng bayad | **Payment method** | Shopee/GCash wording; "Paraan ng bayad" was word-for-word. |
| T117 | Cart / checkout (595) | Demo only: no card or account details are asked for. | Demo lang: walang hihinging card o account details. | **Demo lang ito: hindi kami hihingi ng card o account details.** | Clearer who asks ("kami"). |
| T118 | Cart / checkout (596) | Promo code | Promo code | (same) | Rule: stays English. |
| T119 | Cart / checkout, Sell a game (596, 709) | Optional | Opsyonal | **Optional** | Common in PH forms; "Opsyonal" is a spelled-out loanword. |
| T120 | Cart / checkout (597) | Apply | Gamitin | **I-apply** | Shopee "I-apply" for vouchers; "Gamitin" was vague. |
| T121 | Cart / checkout (599) | Demo checkout. No payment is taken. | Demo checkout. Walang bayad. | **Demo checkout ito. Walang kukuning bayad.** | Full sentence; matches "No payment is taken". |
| T122 | Cart / checkout (613) | {percent}% off applied | {percent}% bawas na | **Na-apply ang {percent}% off** | Shopee-style "Na-apply"; "bawas na" was unclear. |
| T123 | Cart / checkout (614) | That promo code is not valid. | Hindi tanggap ang promo code na iyan. | **Hindi valid ang promo code na iyan.** | "valid" is how PH apps say it; "Hindi tanggap" was stiff. |
| T124 | Cart / checkout (623) | Placing order | Pinoproseso | **Pinoproseso ang order** | Says what is being processed. |
| ✓ T125 | Cart / checkout, Order (632, 1174) | Order placed | Nailagay na ang order / Tapos na | **Na-place na ang order mo** | Decided: Shopee wording with "mo"; "Tapos na" (done) was vague on the stamp. |
| T126 | Collection (648) | My collection \| TEKS | Koleksyon ko \| TEKS | **Collection ko \| TEKS** | Rule: "Collection" stays English. |
| T127 | Collection (651) | Nothing here yet | Wala ka pang laro | **Wala pang laman dito** | Exact meaning of "Nothing here yet". |
| T128 | Collection (651) | Games you buy show up here, and games you mark with ♡ are saved under Favorites. Pick up your first one in the store. | Ang mga larong bibilhin mo ay lalabas dito, at ang mga laro na minarkahan mo ng ♡ ay mapupunta sa Mga paborito. Kumuha ng una sa tindahan. | **Dito lalabas ang mga larong bibilhin mo, at mase-save sa Favorites ang mga larong minarkahan mo ng ♡. Kunin ang una mo sa Store.** | Smoother order; "Favorites", "Store" stay English. |
| T129 | Collection (654) | Play | Laruin | **Play** | Rule: "Play" stays English. |
| T130 | Collection (655) | You do not own any games yet. | Wala ka pang pag-aaring laro. | **Wala ka pang nabibiling laro.** | Natural; "pag-aaring laro" was stiff. |
| T131 | Collection (660) | Remove from favorites | Alisin sa paborito | **Tanggalin sa Favorites** | Rule: "Tanggalin"; "Favorites" like Shopee. |
| T132 | Collection (661) | No favorites yet. Tap ♡ Like on a game page to save it here. | Wala pang paborito. Pindutin ang ♡ Gusto ko sa pahina ng laro para i-save ito dito. | **Wala pang favorites. I-tap ang ♡ Like sa page ng laro para i-save ito dito.** | Matches the "♡ Like" button. |
| T133 | Collection (661) | Find a game | Maghanap ng laro | (same) | Natural. |
| T134 | Collection (664) | My collection | Koleksyon ko | **Collection ko** | Rule: "Collection" stays English. |
| ✓ T135 | Collection (665) | {mine.length} of {games.length} games owned · {favs.length} favorite/favorites | {mine.length} sa {games.length} laro ang pag-aari mo · {favs.length} paborito | **{mine.length} sa {games.length} laro ang owned mo · {favs.length} favorites** | Decided: keep. "owned mo" is gamer Taglish. |
| T136 | Collection (666, 668) | Favorites | Mga paborito | **Favorites** | Like Shopee; "Mga paborito" is stiff. |
| T137 | Collection (667) | Games you have bought. | Mga larong nabili mo na. | (same) | Natural. |
| T138 | Collection (668) | Games you marked with Like. | Mga larong minarkahan mo ng Gusto ko. | **Mga larong ni-like mo.** | Matches the "♡ Like" button. |
| T139 | Collection (673) | This is a demo, so no game launcher is connected, and TEKS does not sell this game. Watch the trailer, or get the game from its official page. | Demo ito kaya hindi nakakabit ang launcher, at hindi ibinebenta ng TEKS ang larong ito. Panoorin ang trailer, o kunin ang laro sa opisyal na pahina nito. | **Demo lang ito kaya walang naka-connect na game launcher, at hindi ibinebenta ng TEKS ang larong ito. Panoorin ang trailer, o kunin ang laro sa official page nito.** | Casual Taglish ("naka-connect"). |
| T140 | Collection (682) | Removed from favorites | Inalis sa paborito | **Tinanggal sa Favorites** | Rule: "Tanggalin" family. |
| T141 | Sell a game (694) | Developer accounts only | Para sa developer account lang | **Para lang sa developer accounts** | Natural word order. |
| T142 | Sell a game (694) | You are signed in as a customer ({name}). Create a developer account to submit a game. | Naka-sign in ka bilang customer ({name}). Gumawa ng developer account para makapagpasa ng laro. | **Naka-sign in ka bilang customer ({name}). Gumawa ng developer account para makapag-submit ng laro.** | Rule: "Submit" stays English. |
| T143 | Sell a game (694) | Sign out and create a developer account | Mag-sign out at gumawa ng developer account | (same) | Natural. |
| T144 | Sell a game (695) | Sign in to submit a game | Mag-sign in para magpasa ng laro | **Mag-sign in para makapag-submit ng laro** | Rule: "Submit" stays English. |
| T145 | Sell a game (695) | You need a developer account to submit a game and follow your studio. | Kailangan ng developer account para makapagpasa ng laro at masubaybayan ang studio mo. | **Kailangan mo ng developer account para makapag-submit ng laro at masubaybayan ang studio mo.** | Adds "mo" (you need); "Submit" stays English. |
| T146 | Sell a game (695) | Sign in as a developer | Mag-sign in bilang developer | (same) | Natural. |
| T147 | Sell a game, About (695, 990) | Create a developer account | Gumawa ng developer account | (same) | Natural. |
| T148 | Sell a game (697) | Sell a game \| TEKS | Magbenta \| TEKS | **Magbenta ng laro \| TEKS** | Matches "Sell a game". |
| T149 | Sell a game (698) | Sell your game on TEKS | Ibenta ang laro mo | **Ibenta ang laro mo sa TEKS** | Adds "sa TEKS" like the English. |
| T150 | Sell a game (698) | Reach players who are looking for Filipino-made games, and keep {pct}% of every sale. | Maabot ang mga manlalarong naghahanap ng larong gawang Pinoy, at itago ang {pct}% ng bawat benta. | **Abutin ang mga player na naghahanap ng larong gawang Pinoy, at sa'yo ang {pct}% ng bawat benta.** | Error fixed: "itago" means "hide". |
| T151 | Sell a game, Sign in (703, 814) | Studio or developer | Studio o developer | (same) | Natural. |
| T152 | Sell a game (704) | Contact email | Email para sa contact | **Contact email** | Common form label. |
| T153 | Sell a game (706) | Game title | Pamagat ng laro | **Title ng laro** | "Title" is common; "Pamagat" is textbook. |
| T154 | Sell a game (708, 712) | Choose one | Pumili | **Pumili ng isa** | English is "Choose one". |
| T155 | Sell a game (709) | None of these | Wala sa mga ito | (same) | Natural. |
| ✓ T156 | Sell a game (712) | Developer type | Uri ng developer | (same) | Decided: keep "Uri ng developer" (correct and clear). |
| T157 | Sell a game (713) | Price in pesos | Presyo sa piso | **Price (sa piso)** | Rule: "Price" stays English. |
| T158 | Sell a game (715) | Platforms | Plataporma | **Platforms** | Gamers say "platform". |
| T159 | Sell a game (717) | Short pitch | Maikling pitch | (same) | Natural. |
| T160 | Sell a game (717) | At least 20 characters | Hindi bababa sa 20 character | **Hindi bababa sa 20 characters** | "characters" plural, as PH forms say it. |
| T161 | Sell a game (717) | What is the game, and which part of Filipino life or story does it draw on? | Tungkol saan ang laro, at anong bahagi ng buhay o kwentong Pilipino ang pinagmulan? | **Tungkol saan ang laro, at anong bahagi ng buhay o kwentong Pinoy ang pinaghugutan nito?** | "pinaghugutan" (drew from) matches "draw on". |
| T162 | Sell a game (718) | Playable build or trailer link | Link ng build o trailer | **Link ng playable build o trailer** | Keeps "playable" like the English. |
| T163 | Sell a game (719, 760) | Send for review | Ipadala para i-review | **I-send para ma-review** | Casual Taglish verbs. |
| T164 | Sell a game (724) | What you earn | Magkano ang kikitain mo | (same) | Natural. |
| T165 | Sell a game (725) | Price | Presyo | **Price** | Rule: "Price" stays English. |
| T166 | Sell a game (727) | Per copy you receive | Sa bawat kopya | **Kikitain mo bawat kopya** | Says "you", like the English. |
| T167 | Sell a game, About (729, 985) | How it works | Paano ito gumagana | (same) | Natural. |
| T168 | Sell a game (730) | Submit your game with a short pitch. | Ipasa ang laro at maikling pitch. | **I-submit ang laro mo kasama ang maikling pitch.** | Rule: "Submit" stays English. |
| T169 | Sell a game (730) | We check the build and reply by email. | Susuriin namin ang build at sasagot sa email. | **Iche-check namin ang build at sasagot kami sa email.** | Matches "We check"; "Susuriin" is formal. |
| T170 | Sell a game (730) | Your game goes in the store, and sales show up under your studio. | Lalabas ang laro sa tindahan at makikita ang benta sa studio mo. | **Ilalagay ang laro mo sa Store, at makikita ang sales sa ilalim ng studio mo.** | Matches "under your studio". |
| T171 | Sell a game (731) | Questions first? | May tanong muna? | (same) | Natural. |
| T172 | Sell a game (731) | Contact us | Kausapin kami | (same) | Natural. |
| T173 | Sell a game (737) | Sell 100 copies and you receive {amount}. | Kapag nakabenta ng 100 kopya, {amount} ang makukuha mo. | **Kapag nakabenta ka ng 100 kopya, {amount} ang matatanggap mo.** | Adds "ka"; "matatanggap" = receive. |
| T174 | Sell a game, Contact (745, 1125) | Sending | Ipinapadala | **Sine-send** | Casual Taglish for "Sending". |
| T175 | Sell a game (753) | Submission received | Natanggap na | **Natanggap na ang submission** | Says what was received. |
| T176 | Sell a game (754) | Received. Your reference is #{id}. We will email you after review. | Natanggap. Ang reference mo ay #{id}. Mag-eemail kami pagkatapos ng review. | **Natanggap na. Ang reference mo ay #{id}. Ie-email ka namin pagkatapos ng review.** | "Ie-email ka namin" is how PH apps say it. |
| T177 | Header account link, Sign in (769, 808, 823) | Sign in | Mag-sign in | **Sign in** | Rule: "Sign in" stays English. |
| T178 | Header account link (771) | Account: {name} | Account ni {name} | (same) | Natural. |
| T179 | Header account link (771) | Sign in or create an account | Mag-sign in o gumawa ng account | (same) | Natural. |
| T180 | Toast (788) | Your session ended. Please sign in again. | Natapos na ang session mo. Mag-sign in ulit. | **Tapos na ang session mo. Paki-sign in ulit.** | "Paki-" carries the "Please". |
| T181 | Sign in (808, 823) | Create account | Gumawa ng account | (same) | Natural. |
| T182 | Sign in (809) | Join TEKS and start your collection. | Sumali sa TEKS at simulan ang koleksyon mo. | **Sumali sa TEKS at simulan ang Collection mo.** | Rule: "Collection" stays English. |
| T183 | Sign in (809) | Welcome back. Pick up where you left off. | Maligayang pagbabalik. Ituloy kung saan ka huminto. | **Welcome back. Ituloy kung saan ka huminto.** | "Welcome back" is what PH apps say; "Maligayang pagbabalik" is very formal. |
| T184 | Sign in (811) | I am a | Ako ay | (same) | Label before the Customer / Developer choice. |
| T185 | Sign in (813, 837, 853) | Your name | Pangalan / Pangalan mo | **Pangalan mo** | English is "Your name"; same wording everywhere. |
| T186 | Sign in (817, 870) | Show | Ipakita | (same) | Natural. |
| T187 | Sign in (818) | At least 8 characters. | Hindi bababa sa 8 character. | **Hindi bababa sa 8 characters.** | "characters" plural, as PH forms say it. |
| T188 | Sign in (820) | Remember me | Tandaan ako | (same) | Natural. |
| T189 | Sign in (821) | Need help? | Kailangan ng tulong? | (same) | Natural. |
| T190 | Sign in (826) | or | o | (same) | Natural. |
| T191 | Sign in (828) | I already have an account | May account na ako | (same) | Natural. |
| T192 | Sign in, About (828, 950, 1000, 1000) | Create an account | Gumawa ng account | (same) | Natural. |
| T193 | Sign in (829) | Continue as guest | Magpatuloy bilang bisita | **Magpatuloy bilang guest** | PH apps say "guest"; "bisita" sounds like a house visitor. |
| T194 | Sign in (836) | CREATOR | TAGAGAWA | **CREATOR** | ID-card label, gaming style ("TAGAGAWA" was word-for-word). |
| T195 | Sign in (836) | PLAYER | MANLALARO | **PLAYER** | ID-card label, gaming style ("MANLALARO" was word-for-word). |
| T196 | Sign in (837, 855) | Your studio | Studio mo | (same) | Natural. |
| T197 | Sign in (838) | Role | Uri | **Role** | Short card label; "Uri" (type) was unclear. |
| T198 | Sign in (838) | Games | Laro | (same) | Short card labels. |
| T199 | Sign in (838) | Since | Mula | (same) | Short card labels. |
| T200 | Sign in (840) | Your card fills in as you type. Every account gets its own series number. | Napupunan ang card habang nagta-type ka. Bawat account ay may sariling numero ng serye. | **Napupunan ang card habang nagta-type ka. May sariling series number ang bawat account.** | "series number" matches the card. |
| T201 | Sign in (843) | Learn about TEKS | Alamin ang TEKS | **Alamin ang tungkol sa TEKS** | Adds "tungkol sa" (about). |
| T202 | Sign in (866) | Can’t sign in? | Hindi makapag-sign in? | (same) | Natural. |
| T203 | Sign in (866) | Password reset is not available yet. Send us a message from the Contact page, create a new account with another email, or continue as a guest. | Wala pang pag-reset ng password. Magpadala ng mensahe sa pahinang Kontak, gumawa ng bagong account gamit ang ibang email, o magpatuloy bilang bisita. | **Wala pang password reset sa ngayon. Mag-message sa amin sa Contact page, gumawa ng bagong account gamit ang ibang email, o magpatuloy bilang guest.** | PH app wording ("password reset", "Contact page", "guest"). |
| T204 | Sign in (866) | OK | Sige | (same) | Natural. |
| T205 | Sign in (870) | Hide | Itago | (same) | Natural. |
| T206 | Sign in (876) | One moment | Sandali lang | (same) | Natural. |
| T207 | Sign in (882) | Welcome, {x} | Maligayang pagdating, {x} | **Welcome, {x}** | "Maligayang pagdating" is formal; apps say "Welcome". |
| T208 | Sign in (901) | Sign in \| TEKS | Mag-sign in \| TEKS | **Sign in \| TEKS** | Rule: "Sign in" stays English. |
| T209 | Sign in, About (901, 947) | About TEKS | Tungkol sa TEKS | (same) | Natural. |
| T210 | My account (909) | {mine.length} game/games in the store, {x} copies from demo checkouts. | {mine.length} laro sa tindahan, {x} na nabili sa demo checkout. | **{mine.length} laro sa Store, {x} kopya mula sa demo checkouts.** | Matches "copies from demo checkouts". |
| T211 | My account (909) | No games in the store yet under your studio name. | Wala pang laro sa tindahan sa ilalim ng pangalan ng studio mo. | **Wala pang laro sa Store sa ilalim ng pangalan ng studio mo.** | "Store" stays English. |
| T212 | My account (912) | Your collection | Koleksyon mo | **Collection mo** | Rule: "Collection" stays English. |
| T213 | My account (913) | {owned.length} of {games.length} games collected. | {owned.length} sa {games.length} laro ang nasa koleksyon mo. | **{owned.length} sa {games.length} laro ang nasa Collection mo.** | Rule: "Collection" stays English. |
| T214 | My account (914) | Open collection | Buksan ang koleksyon | **Buksan ang Collection** | Your Collection (the nav page). |
| T215 | My account (916) | My account \| TEKS | Account ko \| TEKS | **Account ko \| TEKS** | Natural. |
| T216 | My account (917) | Hi | Kumusta | (same) | "Kumusta" is the natural greeting. |
| T217 | My account (919) | Account details | Detalye ng account | **Account details** | PH app wording. |
| T218 | My account (920) | Account type | Uri | **Account type** | "Uri" alone was unclear. |
| T219 | My account (921) | Sign out | Mag-sign out | **Sign out** | Rule: stays English (like "Sign in"). |
| T220 | My account (922) | You are signed out | Naka-sign out ka na | (same) | Natural. |
| T221 | About (935) | Is this a real store? | Totoong tindahan ba ito? | **Totoong store ba ito?** | "Store" stays English. |
| T222 | About (935) | Prices are demo prices, and checkout takes no payment. | Demo na presyo ang mga presyo, at walang bayad na kinukuha sa checkout. | **Demo price ang mga presyo, at walang kinukuhang bayad sa checkout.** | "Demo price" stays English. |
| T223 | About (936) | Are these real games? | Totoo ba ang mga laro? | **Totoong mga laro ba ito?** | More natural question order. |
| T224 | About (936) | Yes. They are real games by Filipino developers. Studios, descriptions and media come from their official pages. To buy or play a game, use its "Official page" link. We show no ratings or download counts, because we have no real data for them. | Oo. Mga totoong laro ito ng mga Pilipinong developer. Ang studio, paglalarawan, at media ay mula sa kanilang opisyal na pahina. Para bilhin o laruin ang isang laro, pumunta sa "Opisyal na pahina" nito. Walang rating o bilang ng download dito dahil wala kaming totoong datos para sa mga ito. | **Oo. Totoong mga laro ito na gawa ng mga Pilipinong developer. Galing sa kanilang official page ang studio, description, at media. Para bilhin o laruin ang isang laro, gamitin ang "Official page" link nito. Wala kaming ipinapakitang rating o download count, dahil wala kaming totoong data para sa mga ito.** | Matches the "Official page" button text. |
| T225 | About (937) | Do I need an account to browse? | Kailangan ko ba ng account para mag-browse? | (same) | Natural. |
| T226 | About (937) | No. You can continue as a guest. An account is only for saving your details or selling a game. | Hindi. Pwede kang magpatuloy bilang bisita. Kailangan lang ng account kung gusto mong mag-save ng detalye o magbenta ng laro. | **Hindi. Puwede kang magpatuloy bilang guest. Kailangan lang ang account para i-save ang details mo o magbenta ng laro.** | "guest", "i-save" like PH apps. |
| T227 | About (938) | How much do developers keep? | Magkano ang napupunta sa developer? | (same) | Natural. |
| T228 | About (938) | {pct}% of every sale. The rest runs the store. | {pct}% ng bawat benta. Ang natitira ay para sa pagpapatakbo ng tindahan. | **{pct}% ng bawat benta. Ang natitira ay pampatakbo ng store.** | Shorter ("pampatakbo"). |
| T229 | About (939) | How do I sell a game? | Paano ako magbebenta ng laro? | (same) | Natural. |
| T230 | About (939) | Create a developer account, then send your game and a short pitch from the Sell a game page. We review it and reply by email. | Gumawa ng developer account, pagkatapos ay ipadala ang laro at maikling pitch sa pahinang Magbenta. Susuriin namin at sasagot sa email. | **Gumawa ng developer account, tapos i-send ang laro mo at maikling pitch mula sa Magbenta page. Ire-review namin ito at sasagot kami sa email.** | Uses the Taglish nav name "Magbenta". |
| T231 | About (940) | What are teks? | Ano ang teks? | (same) | Natural. |
| T232 | About (940) | Small paper cards Filipino kids collect, trade and play with. Here, every game you buy becomes a card in your collection. | Maliliit na baraha na kinokolekta at nilalaro ng mga batang Pilipino. Dito, bawat larong bibilhin mo ay nagiging baraha sa koleksyon mo. | **Maliliit na papel na baraha na kinokolekta, pinagpapalitan, at nilalaro ng mga batang Pilipino. Dito, bawat larong bibilhin mo ay nagiging card sa Collection mo.** | Was missing "trade" (pinagpapalitan). |
| T233 | About (943) | About \| TEKS | Tungkol \| TEKS | **About \| TEKS** | Matches the nav ("About" stays English). |
| T234 | About (948) | Every Filipino game, on one shelf. | Bawat larong Pinoy, nasa iisang shelf. | (same) | Natural. |
| T235 | About (949) | TEKS is a store for games made by Filipino developers. Find them, buy them, collect them, and play. | Ang TEKS ay tindahan para sa mga larong gawa ng mga Pilipinong developer. Hanapin ang mga ito, bilhin, kolektahin, at laruin. | **Ang TEKS ay store para sa mga larong gawa ng mga Pilipinong developer. Hanapin, bilhin, kolektahin, at laruin.** | Shorter; "store" stays English. |
| T236 | About (950) | Sell your game | Magbenta ng laro | **Ibenta ang laro mo** | Same as the footer link. |
| T237 | About (955) | TEKS in numbers | TEKS sa mga numero | **TEKS sa numero** | Shorter and natural. |
| T238 | About (956, 979) | Studios | Mga studio | (same) | Natural. |
| T239 | About (956) | Developer share | Bahagi ng developer | **Share ng developer** | "Share" is the usual word for a revenue cut. |
| T240 | About (962) | The story | Ang kwento | (same) | Natural. |
| T241 | About (963) | Where the name comes from | Saan galing ang pangalan | (same) | Natural. |
| T242 | About (964) | Teks are the small paper cards Filipino children collected and played with. Kids traded them with friends, played them on the street, and took pride in the cards they had gathered. Here, every game is a card you collect, then play. | Ang teks ay maliliit na baraha na kinokolekta at nilalaro ng mga batang Pilipino. Pinagpapalit ito sa kaibigan, nilalaro sa kalye, at ipinagmamalaki. Ganoon din dito: bawat laro ay baraha na iyong kokolektahin, at pagkatapos ay lalaruin. | **Ang teks ay maliliit na papel na baraha na kinolekta at nilaro ng mga batang Pilipino noon. Pinagpapalit nila ito sa mga kaibigan, nilalaro sa kalye, at ipinagmamalaki ang mga naipon nilang baraha. Ganoon din dito: bawat laro ay card na kokolektahin mo, tapos lalaruin.** | Past tense like the English; adds "pride in the cards they gathered". |
| T243 | About (965) | Many local games sit across global stores and social media pages. Among thousands of international releases each year, they are easy to miss. TEKS gathers them in one store, so they are easy to find. | Kalat ang mga larong lokal sa iba-ibang store at social page, nalulunod sa libo-libong bagong labas bawat taon. Tinitipon sila ng TEKS sa iisang tindahan, para madali silang mahanap. | **Maraming lokal na laro ang nakakalat sa iba't ibang global store at social media page. Sa libo-libong international release bawat taon, madali silang hindi mapansin. Tinitipon sila ng TEKS sa iisang store, para madali silang mahanap.** | Closer to the English ("easy to miss"). |
| T244 | About (970) | Three promises | Tatlong pangako | (same) | Natural. |
| T245 | About (972) | One shelf | Iisang shelf | (same) | Natural. |
| T246 | About (972) | Every Filipino-made game in one place, instead of scattered across stores and pages. | Lahat ng larong gawang Pinoy ay nasa isang lugar, hindi na kailangang hanapin sa kung saan-saan. | **Lahat ng larong gawang Pinoy, nasa iisang lugar, imbes na nakakalat sa iba't ibang store at page.** | Matches "instead of scattered". |
| T247 | About (973) | A fair split | Patas na hatian | (same) | Natural. |
| T248 | About (973) | Every sale pays the developer {pct}%. | Bawat benta ay may {pct}% para sa developer. | **{pct}% ng bawat benta ay napupunta sa developer.** | Clearer word order. |
| T249 | About (974) | A card for every game | Baraha sa bawat laro | **May card ang bawat laro** | Natural phrasing. |
| T250 | About (974) | Every game you buy becomes a card in your collection, like the teks you traded as a kid. | Ang bawat larong bibilhin mo ay nagiging baraha sa koleksyon mo, parang teks noong bata ka. | **Bawat larong bibilhin mo ay nagiging card sa Collection mo, parang mga teks na pinagpapalitan mo noong bata ka.** | Adds "traded" like the English. |
| T251 | About (979) | Meet the studios | Kilalanin ang mga studio | (same) | Natural. |
| T252 | About (979) | The studios with games in the store right now. | Mga studio na may laro sa tindahan ngayon. | **Mga studio na may laro sa Store ngayon.** | "Store" stays English. |
| T253 | About (985) | For players | Para sa players | **Para sa mga player** | Adds "mga" (plural). |
| T254 | About (986) | Browse by genre, collection or platform. | Mag-browse ayon sa genre, koleksyon, o plataporma. | **Mag-browse ayon sa genre, collection, o platform.** | Keeps the English terms. |
| T255 | About (986) | Buy the games you want. Each one becomes a card. | Bilhin ang mga larong gusto mo. Bawat isa ay nagiging baraha. | **Bilhin ang mga larong gusto mo. Bawat isa ay nagiging card.** | "card" like the rest of the page. |
| T256 | About (986) | Open your collection and play. | Buksan ang koleksyon mo at maglaro. | **Buksan ang Collection mo at maglaro.** | Rule: "Collection" stays English. |
| T257 | About (987, 987) | Start collecting | Magsimulang mangolekta | (same) | Natural. |
| T258 | About (988) | Sell on TEKS | Magbenta sa TEKS | (same) | Natural. |
| T259 | About (989) | Create a developer account. | Gumawa ng developer account. | (same) | Natural. |
| T260 | About (989) | Send your game and a short pitch. We review it. | Ipadala ang laro at maikling pitch. Susuriin namin ito. | **I-send ang laro mo at maikling pitch. Ire-review namin ito.** | Same wording as the home band. |
| T261 | About (989) | When players buy it, you keep {pct}%. | Kapag may bumili, {pct}% ay sa iyo. | **Kapag may bumili, sa'yo ang {pct}%.** | Same wording as "Sa'yo ang 80%". |
| T262 | About (994) | Questions, answered | Madalas itanong | **Sagot sa mga tanong mo** | Matches "Questions, answered". |
| T263 | About (999) | Ready to start playing? | Handa ka na bang maglaro? | **Ready ka na bang maglaro?** | Natural gamer Taglish. |
| T264 | About (999) | Join for free, or browse as a guest first. | Sumali nang libre, o mag-browse muna bilang bisita. | **Sumali nang libre, o mag-browse muna bilang guest.** | "nang libre" is correct; "guest" like PH apps. |
| T265 | About (1000, 1000) | Just browse | Mag-browse muna | (same) | Natural. |
| T266 | Pinoy Collections (1022) | Open collection | Buksan ang koleksyon | **Buksan ang collection** | A Pinoy Collection (lower-case, like the English). |
| T267 | Pinoy Collections (1027) | Pinoy Collections \| TEKS | Pinoy Collections \| TEKS | (same) | Natural. |
| T268 | Pinoy Collections (1028) | Games with Filipino stories | Mga larong may kwentong Pinoy | (same) | Natural. |
| T269 | Pinoy Collections (1029) | Each collection follows one thread of Filipino life: creatures from folklore, games from the street, moments from history, and everyday life in the barrio. | Bawat koleksyon ay isang hibla ng buhay Pilipino: mga nilalang ng alamat, laro sa kalye, kasaysayan, at araw-araw na buhay sa barrio. | (same) | Natural. |
| T270 | Pinoy Collection page (1047) | {gg.length} game/games in this collection | {gg.length} laro sa koleksyong ito | **{gg.length} laro sa collection na ito** | "collection" stays English. |
| T271 | Pinoy Collection page (1047) | Filter in the store | Buksan sa tindahan | **I-filter sa Store** | Matches "Filter in the store". |
| T272 | Pinoy Collection page (1048) | No games here yet. | Wala pang laro dito. | (same) | Natural. |
| T273 | Studio page (1060, 1075) | Developer | Developer | (same) | Same in both. |
| T274 | Studio page (1062, 1078, 1083) | About the studio | Tungkol sa studio | (same) | Natural. |
| T275 | Studio page, Admin (1062, 1219) | Loading... | Kinukuha... | **Naglo-load...** | Taglish apps say "Naglo-load"; "Kinukuha" means "taking". |
| T276 | Studio page (1063) | On TEKS | Sa TEKS | (same) | Natural. |
| T277 | Studio page (1064) | Bought on TEKS (demo orders) | Nabili sa TEKS (demo) | **Nabili sa TEKS (demo orders)** | Matches the English. |
| T278 | Studio page (1065) | {mine.length} game/games on TEKS · demo prices only | {mine.length} laro sa TEKS · demo na presyo lang | **{mine.length} laro sa TEKS · demo price lang** | "Demo price" stays English. |
| T279 | Studio page (1068) | Games by {name} | Mga laro ng {name} | **Mga larong gawa ng {name}** | "gawa ng" (made by), like the game page. |
| T280 | Studio page (1078) | No information yet. | Wala pang impormasyon. | (same) | Natural. |
| ✓ T281 | Contact (topics) (1090) | General question | Pangkalahatang tanong | **General na tanong** | Decided: keep. "Pangkalahatang" is textbook. |
| T282 | Contact (topics) (1090) | About the store, an order or your account. | Tungkol sa tindahan, isang order, o account mo. | **Tungkol sa store, isang order, o account mo.** | "store" stays English. |
| T283 | Contact (topics) (1091) | Selling a game | Pagbebenta ng laro | (same) | Natural. |
| T284 | Contact (topics) (1091) | Before or while you submit a game. | Bago o habang nagpapasa ka ng laro. | **Bago o habang nagsa-submit ka ng laro.** | Rule: "Submit" stays English. |
| T285 | Contact (topics) (1092) | Creators and press | Content creator at press | **Creators at press** | PH creators call themselves "creators". |
| T286 | Contact (topics) (1092) | Reviews, streams or articles about Filipino games. | Review, stream, o artikulo tungkol sa larong Pinoy. | **Review, stream, o article tungkol sa mga larong Pinoy.** | Adds "mga" (plural). |
| T287 | Contact (topics) (1093) | Community and events | Komunidad at events | **Community at events** | PH gaming groups say "community". |
| T288 | Contact (topics) (1093) | Game jams, meetups or groups who want to work with us. | Game jam, meetup, o grupong gustong makipagtulungan. | **Game jam, meetup, o grupong gustong makipagtulungan sa amin.** | Adds "sa amin" (with us). |
| T289 | Contact (topics) (1094) | Schools and teachers | Paaralan at guro | **Mga paaralan at guro** | Plural, like the English. |
| T290 | Contact (topics) (1094) | Using TEKS in class or for a school project. | Paggamit ng TEKS sa klase o sa school project. | **Paggamit ng TEKS sa klase o para sa school project.** | Matches "for a school project". |
| T291 | Contact (1100) | Contact \| TEKS | Kontak \| TEKS | **Contact \| TEKS** | "Contact" stays English (page name). |
| T292 | Contact (1101) | Contact | Kontak | **Contact** | "Kontak" is a spelled-out loanword. |
| T293 | Contact (1101) | Talk to TEKS | Kausapin ang TEKS | (same) | Natural. |
| T294 | Contact (1102) | A question, a partnership, or a game we should know about? We reply by email. | May tanong, gustong makipag-partner, o may larong dapat naming makita? Sasagot kami sa email. | **May tanong, partnership, o larong dapat naming makita? Sasagot kami sa email.** | Matches the English list. |
| T295 | Contact (1104) | Send a message | Magpadala ng mensahe | **Mag-send ng message** | Casual Taglish. |
| T296 | Contact (1110) | What is it about? | Tungkol saan ito? | (same) | Natural. |
| T297 | Contact (1111) | Message | Mensahe | **Message** | Form label. |
| T298 | Contact (1111) | At least 10 characters | Hindi bababa sa 10 character | **Hindi bababa sa 10 characters** | Same as the other length hints. |
| T299 | Contact (1112, 1138) | Send message | Ipadala | **I-send ang message** | Says what is sent, like "Send message". |
| T300 | Contact (1116) | Who reads it | Sino ang babasa nito | **Sino ang nagbabasa nito** | Present tense, like "Who reads it". |
| T301 | Contact (1117) | The TEKS team reads every message. Pick the right topic so it reaches the right person. | Binabasa ng TEKS team ang bawat mensahe. Piliin ang tamang paksa para mapunta ito sa tamang tao. | **Binabasa ng TEKS team ang bawat message. Piliin ang tamang topic para mapunta ito sa tamang tao.** | "topic" is common; "paksa" is textbook. |
| T302 | Contact (1131) | Message sent | Naipadala ang mensahe | **Na-send na ang message** | Casual Taglish. |
| T303 | Contact (1132) | Sent. Reference #{id}. We will reply to {to}. | Naipadala. Reference #{id}. Sasagot kami sa {to}. | **Na-send na. Reference #{id}. Sasagot kami sa {to}.** | Casual Taglish. |
| T304 | Order (1148) | Order \| TEKS | Order \| TEKS | (same) | Natural. |
| T305 | Order (1149) | Loading your order... | Kinukuha ang order mo... | **Nilo-load ang order mo...** | Taglish apps say "Nilo-load". |
| T306 | Order (1154, 1175) | Order | Order | (same) | Natural. |
| T307 | Order (1159) | Order not found | Walang ganitong order | **Hindi nahanap ang order** | "Walang ganitong order" sounds like an accusation. |
| T308 | Order (1159) | Could not load the order | Hindi ma-load ang order | (same) | Natural. |
| T309 | Order (1160) | Check that the order code in the link is right. | Tingnan kung tama ang order code sa link. | **I-check kung tama ang order code sa link.** | "I-check" like PH apps. |
| T310 | Order (1176) | Thank you, {first}! {n} game is/games are now in your collection. Total {amount}. This is a demo checkout, so no payment was taken. | Salamat, {first}! {n} laro ang nasa koleksyon mo na. Kabuuan {amount}. Demo checkout ito, kaya walang bayad na kinuha. | **Salamat sa order mo, {first}! Nasa Collection mo na ang {n} laro. Total: {amount}. Demo checkout ito, kaya walang kinuhang bayad.** | Natural thank-you, like PH shops. |
| T311 | Order (1177) | receipt for | resibo para kay | **resibo para sa** | Followed by an email address, so "para sa" (not "para kay"). |
| T312 | Order (1178) | Open my collection | Buksan ang koleksyon ko | **Buksan ang Collection ko** | Rule: "Collection" stays English. |
| T313 | Order (1178) | Keep browsing | Mag-browse pa | (same) | Natural. |
| T314 | Order (1179) | Save the link to this page: the order code is the only way to open it again. | I-save ang link ng pahinang ito: ang order code lang ang paraan para mabuksan ito ulit. | **I-save ang link ng page na ito: ang order code lang ang paraan para mabuksan ito ulit.** | "page" is common; "pahina" is textbook. |
| T315 | Order (1181, 1181) | Receipt | Resibo | (same) | Natural. |
| T316 | Order (1182) | Subtotal | Subtotal | (same) | Natural. |
| T317 | Order (1184) | Total | Kabuuan | **Total** | Rule: "Total" stays English. |
| T318 | Order (1185) | To developers ({developer_share_percent}%) | Para sa developer ({developer_share_percent}%) | **Para sa mga developer ({developer_share_percent}%)** | Adds "mga". |
| T319 | Admin (1199) | TEKS dashboard | Dashboard ng TEKS | **TEKS dashboard** | Natural. |
| T320 | Admin (1200) | For the TEKS team only. The key stays in this tab and is forgotten when you close it. | Para sa TEKS team lang. Nasa tab na ito lang ang key at nawawala kapag isinara mo ito. | **Para lang sa TEKS team. Nasa tab na ito lang ang key, at mabubura ito kapag isinara mo ang tab.** | Clearer word order. |
| T321 | Admin (1203) | Enter the admin key | Ilagay ang admin key | (same) | Natural. |
| T322 | Admin (1206) | Open dashboard | Buksan ang dashboard | (same) | Natural. |
| T323 | Admin (1212) | Enter the key. | Ilagay ang key. | (same) | Natural. |
| T324 | Admin (1229) | That admin key is not right. | Mali ang admin key. | **Mali ang admin key na iyan.** | Matches "That admin key". |
| T325 | Admin (1230) | Could not load the dashboard | Hindi ma-load ang dashboard | (same) | Natural. |
| T326 | Admin (1242) | account | may account | (same) | Natural. |
| T327 | Admin (1242) | guest | bisita | **guest** | Same as "Continue as guest". |
| T328 | Admin (1250, 1253) | Orders | Order / Mga order | **Orders** | Rule: "Order" stays English. |
| T329 | Admin (1250) | Sales total | Kabuuang benta | **Total na benta** | Rule: "Total" stays English. |
| T330 | Admin (1250, 1254) | Submissions | Pinasang laro / Mga pinasang laro | **Submissions** | Rule: "Submit" family stays English. |
| T331 | Admin (1250, 1255) | Messages | Mensahe / Mga mensahe | **Messages** | Same as the Contact form. |
| T332 | Admin (1251) | {total} accounts: {customers} customers, {developers} developers | {total} account: {customers} customer, {developers} developer | (same) | Natural. |
| T333 | Admin (1251) | Lock dashboard | I-lock ang dashboard | (same) | Natural. |
| T334 | Admin (1253) | No orders yet. | Wala pang order. | (same) | Natural. |
| T335 | Admin (1254) | No submissions yet. | Wala pang pinasang laro. | **Wala pang submission.** | Rule: "Submit" family stays English. |
| T336 | Admin (1255) | No messages yet. | Wala pang mensahe. | **Wala pang message.** | Same as the Contact form. |
| T337 | Not found page (1259) | Not found \| TEKS | Hindi nahanap \| TEKS | (same) | Natural. |
| T338 | Not found page (1259) | Page not found | Walang ganitong pahina | **Hindi nahanap ang page** | "page" is common; "Walang ganitong pahina" was stiff. |
| T339 | Not found page (1259) | That page does not exist. Head back to the store. | Wala ang pahinang iyon. Bumalik sa tindahan. | **Walang ganyang page. Bumalik sa Store.** | User's example: "Bumalik sa Store". |
| T340 | Flip button (1291) | Flip back | Tihaya | (same) | "Tihaya" (face up) is the real teks street-game word Dea chose; keep. |
| T341 | Startup error (1326) | Could not load the store | Hindi ma-load ang tindahan | **Hindi ma-load ang Store** | "Store" stays English. |
| T342 | Startup error (1326) | Try again | Subukan ulit | (same) | Natural. |

## Developer dashboard (Dea's branch, merged November 2026)

Dea's dashboard added 64 distinct strings (103 `L()` calls) plus the section names. We rewrote them with the rules above, and added the strings that the merge decisions needed (studio linking, read-only Store for developers, merged "Copies sold" card, sale dates without the time). Rows marked **⚠** are the ones we are least sure about.

### Section names and page headings (`DASH_SECTIONS`)

| # | Section | English | Old Taglish | New Taglish | Why |
|---|---|---|---|---|---|
| D1 | Overview (nav, title) | Overview | Overview | (same) | Common app term. |
| D2 | Overview heading | Your studio dashboard | Dashboard ng studio mo | (same) | Natural. |
| D3 | Overview intro | Downloads, profit and submissions for your studio at a glance. | Isang tingin sa download, kita at pasa ng studio mo. | **Download, profit at submissions ng studio mo, sa isang tingin.** | "Profit", "submissions" stay English (nav names); "pasa" can mean "passed". |
| D4 | Sales (nav) | Sales/Download | Sales/Download | (same) | Nav name. |
| D5 | Sales heading | Sales/Download tracker | Tracker ng Sales/Download | **Sales/Download tracker** | App term, same order as the English. |
| D6 | Sales intro | How many copies were downloaded and sold, per game and per month. | Ilang kopya ang na-download at nabenta, kada laro at kada buwan. | (same) | Natural. |
| D7 | Profit heading | Profit tracker | Tracker ng Profit | **Profit tracker** | App term. |
| D8 | Profit intro | Your earnings and the TEKS fee on every sale. | Ang kita mo at ang bahagi ng TEKS sa bawat benta. | **Ang profit mo at ang TEKS fee sa bawat benta.** | One word for each thing: "profit", "TEKS fee". |
| D9 | Purchases (nav) | Purchases | Mga bili | **Purchases** | "bili" alone reads like "buy!"; Shopee-style English nav. |
| D10 | Purchases heading | Purchases of your games | Mga bumili ng laro mo | (same) | Natural. |
| D11 | Purchases intro | Your latest sales and what each one earned you. | Ang pinakabagong benta, at kung magkano ang napunta sa iyo. | **Ang pinakabagong benta, at kung magkano ang kinita mo sa bawat isa.** | Keeps "each one". |
| D12 | My games (nav) | My games | Mga laro ko | (same) | Natural. |
| D13 | My games heading | Your games | Mga laro ng studio mo | (same) | Natural. |
| D14 | My games intro | Your games in the store and how they are doing. | Ang mga laro mo sa tindahan at kung gaano sila kasikat. | **Ang mga laro mo sa Store at kung kumusta sila.** | "Store" stays English; "kasikat" (how popular) changed the meaning. |
| D15 | Submissions (nav) | Submissions | Mga pasa | **Submissions** | Rule: "Submit" family stays English. |
| D16 | Submissions heading | My submissions | Mga pinasa kong laro | **Mga submission ko** | Same word as the nav. |
| D17 | Submissions intro | The review status of the games you sent in. | Ang status ng mga larong ipinasa mo para sa review. | **Ang review status ng mga larong na-submit mo.** | Same word as the nav. |
| D18 | Account heading | Developer account | Account ng developer | **Developer account** | App term. |
| D19 | Account intro | Your account and studio details. | Ang detalye ng account at studio mo. | **Ang details ng account at studio mo.** | "details", like "Account details". |

### Dashboard strings

| # | Where | English | Old Taglish | New Taglish | Why |
|---|---|---|---|---|---|
| D20 | Top bar label (screen readers) | Developer dashboard | Dashboard ng developer | **Developer dashboard** | App term. |
| D21 | ⚠ Breadcrumb label (screen readers) | Breadcrumb | Kinaroroonan | **Nasaan ka** | "Kinaroroonan" is textbook; "Nasaan ka" (where you are) is unusual for a breadcrumb but clear. |
| D22 | Breadcrumb, page title | Dashboard / Dashboard \| TEKS | Dashboard | (same) | App term. |
| D23 | Signed-out gate | Sign in to see your dashboard | Mag-sign in para makita ang dashboard | (same) | Natural. |
| D24 | Signed-out gate | You need a developer account to see your studio sales and profit. | Kailangan ng developer account para makita ang benta at kita ng studio mo. | **Kailangan mo ng developer account para makita ang sales at profit ng studio mo.** | Adds "mo"; "sales", "profit" like the nav. |
| D25 | Customer gate | You are signed in as a customer ({name}). The dashboard is for developers. | Naka-sign in ka bilang customer ({name}). Ang dashboard ay para sa mga developer. | **…Para sa mga developer ang dashboard.** | More natural word order. |
| D26 | Buttons | Submit a game | Ipasa ang laro | **Mag-submit ng laro** | Same wording as the rest of the site. |
| D27 | Customer gate | Browse the store | Tingnan ang tindahan | **Tingnan ang Store** | Same wording as the rest of the site. |
| D28 | ⚠ Purchase lines, table header | Paid | Binayad | **Bayad** | "Binayad" is colloquial; ⚠ "Bayad" could be read as "payment" (the next column is "Payment"). |
| D29 | Purchases table header | Payment | Bayad | **Payment** | Rule: "Payment method" stays English; avoids two "Bayad" columns. |
| D30 | Empty states | This studio has no games in the store yet. | Wala pang laro ang studio na ito sa tindahan. | **…sa Store.** | "Store" stays English. |
| D31 | Empty states | You have not submitted a game yet. | Wala ka pang pinasang laro. | **Wala ka pang na-submit na laro.** | "Submit" family. |
| D32 | Empty states | No purchases yet. Every sale of your games will show up here. | Wala pang bumibili. Lalabas dito ang bawat benta ng laro mo. | (same) | Natural. |
| D33 | Linked studio, no games | No games in the store yet | Wala pang laro sa tindahan | **Wala pang laro sa Store** | "Store" stays English. |
| D34 | Linked studio, no games | We found no games in the catalog under "{studio}". Sales and profit show up here once your game is added. | Walang laro sa katalogo sa ilalim ng "{studio}". Lalabas ang benta at kita dito kapag naidagdag na ang laro mo. | **Wala pang laro sa catalog sa ilalim ng "{studio}". Lalabas dito ang sales at profit kapag naidagdag na ang laro mo.** | "catalog" (katalogo is a spelled loanword); "sales", "profit". |
| D35 | Split bar (screen readers) | {share} percent to you, {rest} to TEKS | {share} porsyento sa iyo, {rest} sa TEKS | **{share}% sa'yo, {rest}% sa TEKS** | Shorter, natural. |
| D36 | Split legend | You | Ikaw | (same) | Natural. |
| D37 | Overview hero, profit cards | Your profit ({share}%) / Your profit | Kita mo | **Profit mo** | One word for profit everywhere (the nav says "Profit"). |
| D38 | Overview buttons, links | Profit tracker / Sales/Download tracker | Tracker ng Profit / Tracker ng Sales/Download | **Profit tracker / Sales/Download tracker** | Same as the headings. |
| D39 | Overview, Profit | How each sale is split | Hatian ng bawat benta | (same) | Natural. |
| D40 | Cards, My games stats | Copies sold | Kopyang nabenta | **Nabentang kopya** | More natural order. |
| D41 | Overview card | Games in the store | Laro sa tindahan | **Laro sa Store** | "Store" stays English. |
| D42 | Overview card | Awaiting review | Naghihintay ng review | (same) | Natural. |
| D43 | ⚠ Overview panel | Recent purchases | Mga huling bumili | (same) | "the latest buyers"; close but not word-for-word. |
| D44 | Overview link | All purchases | Lahat ng bili | **Lahat ng purchases** | Same word as the nav. |
| D45 | Overview, Profit | Profit per month | Kita kada buwan | **Profit kada buwan** | One word for profit. |
| D46 | Empty state | No profit yet. | Wala ka pang kita. | **Wala ka pang profit.** | One word for profit. |
| D47 | Overview panel | Top games | Pinakamaraming download | **Top games** | Gaming term; the old text meant "most downloads". |
| D48 | Overview rows | your profit | kita mo | **profit mo** | One word for profit. |
| D49 | Overview link | My games | Mga laro ko | (same) | Same as the nav. |
| D50 | Overview panel | Latest submissions | Pinakabagong pasa | **Mga bagong submission** | Same word as the nav. |
| D51 | Links, panel | All submissions | Lahat ng pasa | **Lahat ng submissions** | Same word as the nav. |
| D52 | Sales card | Sales at list price | Benta sa orihinal na presyo | **Sales sa list price** | "list price" is the shop term. |
| D53 | Sales, empty | No sales yet. | Wala pang benta. | (same) | Natural. |
| D54 | Sales chart | Copies sold per month | Kopyang nabenta kada buwan | **Nabentang kopya kada buwan** | Same order as D40. |
| D55 | Profit card | Total revenue | Kabuuang binayad ng mga bumili | **Total revenue** | Rule: "Total" stays English; old text was long. |
| D56 | Profit card | TEKS fee ({rest}%) | Bahagi ng TEKS ({rest}%) | **TEKS fee ({rest}%)** | One word for the fee everywhere. |
| D57 | Profit panel | Profit per game | Kita kada laro | **Profit kada laro** | One word for profit. |
| D58 | Profit rows | Revenue {amount} · TEKS fee {amount} | Binayad {amount} · TEKS {amount} | **Revenue {amount} · TEKS fee {amount}** | Same words as the cards. |
| D59 | ⚠ Purchases panel | Latest 50 sales | Pinakabagong 50 benta | **Huling 50 na benta** | ⚠ "na" after a number is common in chat but not textbook; "Huling 50 benta" is the alternative. |
| D60 | Purchases table (screen readers) | Purchases table | Talaan ng mga bili | **Table ng purchases** | "Talaan" is textbook. |
| D61 | Purchases table header | Game | Laro | (same) | Natural. |
| D62 | Purchases table header | Date | Petsa | (same) | Natural. |
| D63 | Purchases button | Show all {n} | Ipakita lahat ({n}) | (same) | Natural. |
| D64 | ⚠ Purchases button | Show fewer | Ipakita ang mas kaunti | (same) | Correct, but a bit long for a button. |
| D65 | My games button | Show stats / Hide stats | Ipakita ang stats / Itago ang stats | (same) | Natural. |
| D66 | Page title | {section} \| TEKS | {section} \| TEKS | (same) | Uses the section names above. |
| D67 | Loading | Loading | Naglo-load | (same) | Natural. |
| D68 | Demo banner | Sample / This is sample data for the demo, not real sales. | Sample / Sample data ito para sa demo. Hindi ito totoong benta. | (same) | Natural. |
| D69 | Error | Could not load this page | Hindi ma-load ang pahina | **Hindi ma-load ang page** | "page", like the rest of the site. |
| D70 | Error button | Back to overview | Bumalik sa overview | (same) | Natural. |
| D71 | Account panel | Account details / Account type / Sign out | Detalye ng account / Uri / Mag-sign out | **Account details / Account type / Sign out** | Same as the customer account page. |

### Strings that changed with the merge decisions

| # | Where | English (new or changed) | Old Taglish (Dea) | New Taglish | Why |
|---|---|---|---|---|---|
| D72 | Unlinked account panel (replaces "This studio belongs to another account") | Your studio is not linked yet | Hawak ng ibang account ang studio na ito | **Hindi pa naka-link ang studio mo** | Studios are now linked by the team, not "first account wins". |
| D73 | Unlinked account panel | To protect each studio's sales data, the TEKS team links developer accounts to studios by hand. If you made a game in our catalog, contact us and we will link "{studio}" to your account. New here? Submit your game first. | (was: "{studio}" is already registered to another developer account… If this studio is really yours, get in touch with us.) | **Para protektado ang sales data ng bawat studio, ang TEKS team mismo ang nagli-link ng developer account sa studio nito. Kung gawa mo ang isang laro sa catalog namin, kausapin kami at ili-link namin ang "{studio}" sa account mo. Bago ka pa lang? I-submit muna ang laro mo.** | New text for the new rule. |
| D74 | Overview hero | From {n} copies sold. | (was: Mula sa {n} kopyang nabenta at {m} download.) | **Mula sa {n} nabentang kopya.** | Downloads and copies sold are the same number on TEKS. |
| D75 | Merged card note | Each copy is one download | (new; replaces the "Total downloads" card: Kabuuang download) | **Bawat kopya ay isang download** | One card instead of two with the same number. |
| D76 | Sales panel (was "Downloads per game") | Copies sold per game | Download kada laro | **Nabentang kopya kada laro** | Same reason. |
| D77 | Sales rows (was "{n} sold on TEKS · {amount} sales") | {amount} sales at list price | {n} nabenta sa TEKS · {amount} benta | **{amount} na sales sa list price** | The number of copies is now the bar value. |
| D78 | Purchases hint | Showing the latest 50. Buyers are not identified, and only the day of each sale is shown (Philippine time). | Ang pinakabagong 50 lang ang ipinapakita. Hindi ipinapakita ang pangalan ng bumili. | **Ang huling 50 lang ang nakalista. Hindi ipinapakita kung sino ang bumili, at ang araw lang ng bawat benta ang makikita (oras sa Pilipinas).** | Sales now show the day only, in Manila time. |
| D79 | My games hint | Click a card or "Show stats" to see its copies sold and profit. The ↻ button flips the card. | I-click ang card o ang "Ipakita ang stats" para makita ang download at kita. Ang ↻ ay pang-taob ng card. | **I-click ang card o ang "Ipakita ang stats" para makita ang nabentang kopya at profit nito. Pang-taob ng card ang ↻.** | Matches the merged numbers. |
| D80 | Cart, developer account | Developer accounts have no cart | (new) | **Walang cart ang developer account** | Replaces the silent redirect. |
| D81 | Cart, developer account | A developer account is for selling and your dashboard. You can browse the store, but to buy games, use a customer account. | (new) | **Para sa pagbebenta at sa dashboard mo ang developer account. Puwede mong tingnan ang Store, pero para bumili ng laro, gumamit ng customer account.** | Explains the closed cart. |
| D82 | Cart, developer account | Go to your dashboard | (new) | **Pumunta sa dashboard** | Natural. |
| D83 | Customer account page | Want to sell a game? You need a separate developer account. | (new) | **Gusto mo bang magbenta ng laro? Kailangan mo ng hiwalay na developer account.** | Path for customers who want to sell. |
| D84 | Customer account page | How to become a developer | (new) | **Paano maging developer** | Link to the Sell a game page. |
| D85 | About FAQ answer (changed English) | A developer account is separate from a customer account. Sign up as a developer, then send your game and a short pitch from the Sell a game page. We review it and reply by email. Already have a customer account? That page shows you how to switch. | Gumawa ng developer account, tapos i-send ang laro mo at maikling pitch mula sa Magbenta page. Ire-review namin ito at sasagot kami sa email. | **Hiwalay ang developer account sa customer account. Mag-sign up bilang developer, tapos i-send ang laro mo at maikling pitch mula sa Magbenta page. Ire-review namin ito at sasagot kami sa email. May customer account ka na? Makikita sa page na iyon kung paano lumipat.** | Customers no longer see "Sell a game" in the menu, so the FAQ links to it and explains the switch. |
