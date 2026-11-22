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
