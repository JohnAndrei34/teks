# Taglish review: new and changed strings

For Dea. Every line of on-screen text in TEKS is written twice in `frontend/public/app.js`, as `L('Taglish', 'English')`.
These are the **97 strings we added or changed** while connecting your design to our backend. The Taglish is our draft: please correct anything that sounds off.

How to review:
- Write fixes in the **Your fix** column (or just tell us). We will update `app.js`.
- Keep the words in `{curly braces}` as they are: the site fills them in (a number, a name, an email).
- `game/games` means the site picks one depending on the number.
- Rows where both sides are the same were left in English on purpose (brand names, short labels). Translate them if you prefer.
- To see a string on the page: run the site, open the screen listed, and press the **EN / TL** button.


## Everywhere: errors and labels

Where: Network error message, developer type labels

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| 1 | Hindi maabot ang TEKS. Tingnan ang koneksyon mo at subukan ulit. | Could not reach TEKS. Check your connection and try again. | |
| 2 | Grupo ng estudyante | Student team | |
| 3 | Indie developer | Indie developer | |

## Home

Where: New "Pinoy Collections" row and the Top charts note

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| 4 | Mag-browse ayon sa kwentong Pinoy | Browse by Filipino story | |
| 5 | Alamat, laro sa kalye, kasaysayan, at araw-araw na buhay. | Folklore, street games, history and everyday life. | |
| 6 | Lahat ng koleksyon | All collections | |
| 7 | Sample ang mga rating. Ang download ay sample na bilang, dagdag ang totoong benta sa TEKS. | Ratings are sample scores. Download counts are sample numbers plus real purchases on TEKS. | |

## Game page

Where: Heading above the cultural note

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| 8 | Tala sa kultura | Cultural note | |

## Cart and checkout

Where: #/cart

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| 9 | Promo | Promo | |
| 10 | Mobile number | Mobile number | |
| 11 | Paraan ng bayad | Payment method | |
| 12 | Demo lang: walang hihinging card o account details. | Demo only: no card or account details are asked for. | |
| 13 | Promo code | Promo code | |
| 14 | Gamitin | Apply | |
| 15 | {percent}% bawas na | {percent}% off applied | |
| 16 | Hindi tanggap ang promo code na iyan. | That promo code is not valid. | |

## Sell a game (developer form)

Where: #/developers

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| 17 | Wala sa mga ito | None of these | |
| 18 | Uri ng developer | Developer type | |
| 19 | Plataporma | Platforms | |
| 20 | Hindi bababa sa 20 character | At least 20 characters | |
| 21 | May tanong muna? | Questions first? | |
| 22 | Kausapin kami | Contact us | |
| 23 | Natanggap. Ang reference mo ay #{id}. Mag-eemail kami pagkatapos ng review. | Received. Your reference is #{id}. We will email you after review. | |

## Sign-in help dialog

Where: "Need help?" on the sign-in screen

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| 24 | Wala pang pag-reset ng password. Magpadala ng mensahe sa pahinang Kontak, gumawa ng bagong account gamit ang ibang email, o magpatuloy bilang bisita. | Password reset is not available yet. Send us a message from the Contact page, create a new account with another email, or continue as a guest. | |

## About: FAQ

Where: #/about (also shown under the sign-in screen)

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| 25 | Ang TEKS ay isang school project. Sample lang ang mga laro at studio, at walang bayad na kinukuha sa checkout. | TEKS is a school project. The games and studios are sample data, and checkout takes no payment. | |
| 26 | Totoo ba ang mga rating at download? | Are the ratings and downloads real? | |
| 27 | Sample na datos ang mga rating at bilang ng download. Nadadagdagan ang download sa bawat totoong pagbili sa TEKS. | Ratings and download counts are sample data. Download counts also go up with every real purchase on TEKS. | |

## Pinoy Collections

Where: #/pinoy and #/pinoy/{collection}

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| 28 | Pinoy Collections \| TEKS | Pinoy Collections \| TEKS | |
| 29 | Mga larong may kwentong Pinoy | Games with Filipino stories | |
| 30 | Bawat koleksyon ay isang hibla ng buhay Pilipino: mga nilalang ng alamat, laro sa kalye, kasaysayan, at araw-araw na buhay sa barrio. | Each collection follows one thread of Filipino life: creatures from folklore, games from the street, moments from history, and everyday life in the barrio. | |
| 31 | {count} laro sa koleksyong ito | {count} game/games in this collection | |
| 32 | Buksan sa tindahan | Filter in the store | |
| 33 | Wala pang laro dito. | No games here yet. | |

## Studio page

Where: #/studio/{studio}

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| 34 | Tungkol sa studio | About the studio | |
| 35 | Kinukuha... | Loading... | |
| 36 | Sa TEKS | On TEKS | |
| 37 | Download (sample + benta) | Downloads (sample + sales) | |
| 38 | {count} laro · karaniwang rating {average}/100 · {percent}% ng bawat benta ay sa studio | {count} game/games · average rating {average}/100 · the studio keeps {percent}% of every sale | |
| 39 | Mga laro ng {studio} | Games by {studio} | |

## Contact page

Where: #/contact (topics and form)

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| 40 | Pangkalahatang tanong | General question | |
| 41 | Tungkol sa tindahan, isang order, o account mo. | About the store, an order or your account. | |
| 42 | Pagbebenta ng laro | Selling a game | |
| 43 | Bago o habang nagpapasa ka ng laro. | Before or while you submit a game. | |
| 44 | Content creator at press | Creators and press | |
| 45 | Review, stream, o artikulo tungkol sa larong Pinoy. | Reviews, streams or articles about Filipino games. | |
| 46 | Komunidad at events | Community and events | |
| 47 | Game jam, meetup, o grupong gustong makipagtulungan. | Game jams, meetups or groups who want to work with us. | |
| 48 | Paaralan at guro | Schools and teachers | |
| 49 | Paggamit ng TEKS sa klase o sa school project. | Using TEKS in class or for a school project. | |
| 50 | Kontak \| TEKS | Contact \| TEKS | |
| 51 | Kontak | Contact | |
| 52 | Kausapin ang TEKS | Talk to TEKS | |
| 53 | May tanong, gustong makipag-partner, o may larong dapat naming makita? Sasagot kami sa email. | A question, a partnership, or a game we should know about? We reply by email. | |
| 54 | Magpadala ng mensahe | Send a message | |
| 55 | Tungkol saan ito? | What is it about? | |
| 56 | Mensahe | Message | |
| 57 | Hindi bababa sa 10 character | At least 10 characters | |
| 58 | Ipadala | Send message | |
| 59 | Sino ang babasa nito | Who reads it | |
| 60 | Binabasa ng TEKS team ang bawat mensahe. Piliin ang tamang paksa para mapunta ito sa tamang tao. | The TEKS team reads every message. Pick the right topic so it reaches the right person. | |
| 61 | Naipadala ang mensahe | Message sent | |
| 62 | Naipadala. Reference #{id}. Sasagot kami sa {email}. | Sent. Reference #{id}. We will reply to {email}. | |

## Order page

Where: #/order/{code}

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| 63 | Order \| TEKS | Order \| TEKS | |
| 64 | Kinukuha ang order mo... | Loading your order... | |
| 65 | Walang ganitong order | Order not found | |
| 66 | Hindi ma-load ang order | Could not load the order | |
| 67 | Tingnan kung tama ang order code sa link. | Check that the order code in the link is right. | |
| 68 | Salamat, {name}! {count} laro ang nasa koleksyon mo na. Kabuuan {total}. Demo checkout ito, kaya walang bayad na kinuha. | Thank you, {name}! {count} game is/games are now in your collection. Total {total}. This is a demo checkout, so no payment was taken. | |
| 69 | resibo para kay | receipt for | |
| 70 | Mag-browse pa | Keep browsing | |
| 71 | I-save ang link ng pahinang ito: ang order code lang ang paraan para mabuksan ito ulit. | Save the link to this page: the order code is the only way to open it again. | |
| 72 | Resibo | Receipt | |
| 73 | Subtotal | Subtotal | |
| 74 | Para sa developer ({percent}%) | To developers ({percent}%) | |

## Admin dashboard

Where: #/admin (team only, not linked in the menu)

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| 75 | Dashboard ng TEKS | TEKS dashboard | |
| 76 | Para sa TEKS team lang. Nasa tab na ito lang ang key at nawawala kapag isinara mo ito. | For the TEKS team only. The key stays in this tab and is forgotten when you close it. | |
| 77 | Ilagay ang admin key | Enter the admin key | |
| 78 | Buksan ang dashboard | Open dashboard | |
| 79 | Ilagay ang key. | Enter the key. | |
| 80 | Mali ang admin key. | That admin key is not right. | |
| 81 | Hindi ma-load ang dashboard | Could not load the dashboard | |
| 82 | may account | account | |
| 83 | bisita | guest | |
| 84 | Order | Orders | |
| 85 | Kabuuang benta | Sales total | |
| 86 | Pinasang laro | Submissions | |
| 87 | Mensahe | Messages | |
| 88 | {total} account: {customers} customer, {developers} developer | {total} accounts: {customers} customers, {developers} developers | |
| 89 | I-lock ang dashboard | Lock dashboard | |
| 90 | Mga order | Orders | |
| 91 | Wala pang order. | No orders yet. | |
| 92 | Mga pinasang laro | Submissions | |
| 93 | Wala pang pinasang laro. | No submissions yet. | |
| 94 | Mga mensahe | Messages | |
| 95 | Wala pang mensahe. | No messages yet. | |

## Start-up error

Where: Shown if the store cannot load

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| 96 | Hindi ma-load ang tindahan | Could not load the store | |
| 97 | Subukan ulit | Try again | |

## Footer (index.html)

Where: bottom of every page. These live in `frontend/public/index.html` as `data-tl` / `data-en`.

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| F1 | Pinoy Collections | Pinoy Collections | |
| F2 | Kausapin kami | Contact us | |
| F3 | Isang school project. Sample lang ang mga laro, studio, rating at bilang ng download, at walang bayad sa checkout. | A school project. Games, studios, ratings and download counts are sample data, and checkout takes no payment. | |

## Developer tracker (#/tracker, developer accounts only)

Where: the "Tracker" nav link and account button, and the tracker page.

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| T1 | Tracker ng studio mo | Your studio tracker | |
| T2 | Tracker ng Sales/Download | Sales/Download tracker | |
| T3 | Tracker ng Profit | Profit tracker | |
| T4 | Mga pinasa kong laro | My submissions | |
| T5 | Kabuuang download / Kopyang nabenta sa TEKS / Benta sa orihinal na presyo | Total downloads / Copies sold on TEKS / Sales at list price | |
| T6 | Kabuuang binayad ng mga bumili / Bahagi ng TEKS (20%) / Kita mo (80%) | Total revenue / TEKS fee (20%) / Your profit (80%) | |
| T7 | Download kada laro / Kita kada laro / Kita kada buwan / Mga nakaraang buwan | Downloads per game / Profit per game / Profit per month / Recent months | |
| T8 | Wala pang laro ang studio na ito sa tindahan. | This studio has no games in the store yet. | |
| T9 | Walang laro sa katalogo sa ilalim ng "{studio}". Lalabas ang benta at kita dito kapag naidagdag na ang laro mo. | We found no games in the catalog under "{studio}". Sales and profit show up here once your game is added. | |
| T10 | Wala pang benta. / Wala ka pang kita. / Wala ka pang pinasang laro. | No sales yet. / No profit yet. / You have not submitted a game yet. | |
| T11 | Mag-sign in para makita ang tracker | Sign in to see your tracker | |
| T12 | Para sa developer account lang (tracker) | Developer accounts only (tracker) | |
| T13 | Buksan ang tracker | Open tracker | |
| T14 | Tracker (nav, para sa developer) | Tracker (nav, developers only) | |

## Developer dashboard (replaces the account page for developer accounts)

Where: `#/account` and the "Dashboard" nav link, developer accounts only. Tab names T2-T4 above are reused.

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| D1 | Dashboard ng studio mo | Your studio dashboard | |
| D2 | Dashboard (nav, para sa developer) | Dashboard (nav, developers only) | |
| D3 | Overview / Mga laro ko / Account (tab names) | Overview / My games / Account | |
| D4 | Laro sa tindahan / Naghihintay ng review | Games in the store / Awaiting review | |
| D5 | Pinakamaraming download / Pinakabagong pasa | Top games / Latest submissions | |
| D6 | kita mo | your profit | |
| D7 | Mga laro ng studio mo | Your games | |
| D8 | Walang laro sa katalogo sa ilalim ng "{studio}" (pa). | No games in the catalog under "{studio}" yet. | |

## Developer dashboard as Home (update)

Where: for developer accounts, Home is the dashboard and the nav link reads "Dashboard". The earlier D2 entry applies to this link.

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| D9 | Mga bili | Purchases (tab) | |
| D10 | Mga huling bumili / Lahat ng bili | Recent purchases / All purchases | |
| D11 | Mga bumili ng laro mo | Purchases of your games | |
| D12 | Binayad | Paid | |
| D13 | Wala pang bumibili. | No purchases yet. | |
| D14 | Ang pinakabagong 50 lang ang ipinapakita. Hindi ipinapakita ang pangalan ng bumili. | Showing the latest 50. Buyers are not identified. | |

## Developer dashboard in the top bar (supersedes the tab names above)

Where: for developer accounts the top bar shows these links instead of Home / Store / Collection / Sell / About, and each opens its own page (`#/dashboard/<section>`).

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| N1 | Overview / Sales/Download / Profit / Mga bili / Mga laro ko / Mga pasa / Tindahan | Overview / Sales/Download / Profit / Purchases / My games / Submissions / Store | |
| N2 | Isang tingin sa download, kita at pasa ng studio mo. | Downloads, profit and submissions for your studio at a glance. | |
| N3 | Ilang kopya ang na-download at nabenta, kada laro at kada buwan. | How many copies were downloaded and sold, per game and per month. | |
| N4 | Ang kita mo at ang bahagi ng TEKS sa bawat benta. | Your earnings and the TEKS fee on every sale. | |
| N5 | Ang pinakabagong benta, at kung magkano ang napunta sa iyo. | Your latest sales and what each one earned you. | |
| N6 | Ang mga laro mo sa tindahan at kung gaano sila kasikat. | Your games in the store and how they are doing. | |
| N7 | Ang status ng mga larong ipinasa mo para sa review. | The review status of the games you sent in. | |
| N8 | Ang detalye ng account at studio mo. / Account ng developer | Your account and studio details. / Developer account | |
| N9 | Saan napupunta ang bawat piso / Hatian ng bawat benta | Where each peso goes / How each sale is split | |
| N10 | {n}% sa iyo ({amount}) · {m}% sa TEKS ({amount}) | {n}% to you ({amount}) · {m}% to TEKS ({amount}) | |
| N11 | Lahat ng pasa / Mag-sign in para makita ang dashboard | All submissions / Sign in to see your dashboard | |
| N12 | Mag-sign in bilang developer / Ang dashboard ay para sa mga developer. | Sign in as a developer / The dashboard is for developers. | |
| N13 | {n} kopyang binayad ng mga bumili / Hindi ma-load ang pahina / Naglo-load | paid by buyers / Could not load this page / Loading | |

## Demo data notice (developer dashboard, only when the backend runs with TRACKER_MOCK=1)

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| M1 | Sample / Sample data ito para sa demo. Hindi ito totoong benta. | Sample / This is sample data for the demo, not real sales. | |

## Developer dashboard: My games cards, navigation and ownership

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| A1 | I-tap ang ↻ sa card para makita ang likod nito. | Use the ↻ button on a card to flip it. | |
| A2 | Kopyang nabenta | Copies sold | |
| A3 | Kinaroroonan (breadcrumb label) / Dashboard | Breadcrumb / Dashboard | |
| A4 | Dashboard ng developer (nav label) | Developer dashboard (nav label) | |
| A5 | Bumalik sa overview | Back to overview | |
| A6 | Hawak ng ibang account ang studio na ito | This studio belongs to another account | |
| A7 | Ang "{studio}" ay nakarehistro na sa ibang developer account, kaya hindi mo makikita ang benta nito. | "{studio}" is already registered to another developer account, so its sales are not shown here. | |
| A8 | Kung sa iyo talaga ang studio na ito, kausapin kami. / Kausapin kami | If this studio is really yours, get in touch with us. / Contact us | |

## My games: stats on click

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| S1 | Ipakita ang stats / Itago ang stats | Show stats / Hide stats | |
| S2 | I-click ang card o ang "Ipakita ang stats" para makita ang download at kita. Ang ↻ ay pang-taob ng card. | Click a card or "Show stats" to see its downloads and profit. The ↻ button flips the card. | |

## Developer dashboard redesign (layout and new strings)

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| R1 | Kita mo (80%) / Mula sa {n} kopyang nabenta at {m} download. | Your profit (80%) / From {n} copies sold and {m} downloads. | |
| R2 | Ikaw / TEKS (legend of the split bar) | You / TEKS | |
| R3 | Kita kada buwan / Kopyang nabenta kada buwan | Profit per month / Copies sold per month | |
| R4 | Pinakabagong 50 benta | Latest 50 sales | |
| R5 | Lahat ng pasa | All submissions | |
| R6 | Laro / Binayad / Kita mo / Promo / Bayad / Petsa (purchases table headings) | Game / Paid / Your profit / Promo / Payment / Date | |
| R7 | Talaan ng mga bili | Purchases table (screen-reader label) | |
| R8 | Wala pang bumibili. Lalabas dito ang bawat benta ng laro mo. | No purchases yet. Every sale of your games will show up here. | |

## Developer dashboard: wide layout

| # | Taglish (draft) | English | Your fix |
|---|---|---|---|
| W1 | Ipakita lahat ({n}) / Ipakita ang mas kaunti | Show all {n} / Show fewer | |
