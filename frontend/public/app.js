import { art as drawArt } from './art.js';

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const art = g => drawArt({ motif: g.motif, pal: g.pal, title: esc(g.title) });   // procedural card art (art.js)
/* real cover art inside the card frame; Dea's procedural art stays as the fallback when a game has no cover
   or its image fails to load (see the 'error' listener near the router). Covers sit next to the title text,
   so they are decorative (alt=""). */
const cover = (g, { eager = false } = {}) => g.cover
  ? `<img class="cover" src="${esc(g.cover)}" alt="" width="300" height="220" decoding="async"${eager ? '' : ' loading="lazy"'} data-art="${g.id}">`
  : art(g);
const peso = n => '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked: state lives for this page only */ } },
};
const app = $('#app');
let games = [], config = { devShare: 0.8, genres: [], themes: [], collections: [], platforms: [] };
let collections = [];   // Pinoy Collections metadata (tagline, description) from /api/collections
let cart = store.get('teks.cart', []);
let localOwned = store.get('teks.owned', []);   // games bought as a guest on this browser
let owned = localOwned;                          // signed in: the account's library from the server
let likes = store.get('teks.likes', []);
let lang = store.get('teks.lang', 'en');
const readToken = () => { try { return JSON.parse(localStorage.getItem('teks.token')) || sessionStorage.getItem('teks.token') || null; } catch { return null; } };
let token = readToken();   // signed session token from /api/auth
let user = null;
const guestMode = { get() { try { return sessionStorage.getItem('teks.guest') === '1'; } catch { return false; } }, set() { try { sessionStorage.setItem('teks.guest', '1'); } catch { /* ignore */ } } };                              // { id, role: 'customer' | 'developer', name, email, studio? }
const L = (tl, en) => lang === 'tl' ? tl : en;       // inline translation: Taglish / English
const byId = id => games.find(g => g.id === id);
const saveCart = () => { store.set('teks.cart', cart); updateCount(); };
const saveOwned = () => store.set('teks.owned', localOwned);

async function api(path, opts = {}) {
  const headers = { ...(token ? { Authorization: 'Bearer ' + token } : {}), ...(opts.headers || {}) };
  const init = { method: opts.method || 'GET', headers };
  if (opts.body !== undefined) { headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(opts.body); }
  let res;
  try { res = await fetch(path, init); } catch { throw new Error(L('Hindi maabot ang TEKS. Tingnan ang koneksyon mo at subukan ulit.', 'Could not reach TEKS. Check your connection and try again.')); }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && token && !/^\/api\/(auth\/(login|signup)|admin\/)/.test(path)) sessionEnded();
  if (!res.ok) throw Object.assign(new Error(data.error || (typeof data.detail === 'string' && data.detail) || L('May nangyaring mali. Subukan ulit.', 'Something went wrong. Try again.')), { field: data.field, status: res.status });
  return data;
}

/* ---------- TEKS API data -> the shape this page was designed around ----------
   Every value is checked here, so the templates below only ever see slugs, numbers, hex colours
   and plain strings (strings are still escaped with esc() wherever they are written into HTML). */
const SLUG = /^[a-z0-9-]+$/;
const HEX = /^#[0-9a-f]{6}$/i;
const num = v => (Number.isFinite(Number(v)) ? Number(v) : 0);
const strs = a => (Array.isArray(a) ? a.map(String) : []);
const collTitle = slug => config.collections.find(c => c.slug === slug)?.title || '';
function normalizeConfig(c) {
  const cols = (Array.isArray(c.collections) ? c.collections : []).filter(x => SLUG.test(x?.slug || '')).map(x => ({ slug: x.slug, title: String(x.title || x.slug) }));
  return { devShare: num(c.developer_share_percent) / 100 || 0.8, genres: strs(c.genres), platforms: strs(c.platforms), collections: cols, themes: cols.map(x => x.title) };
}
function normalizeGame(g) {
  if (!g || !SLUG.test(g.slug || '')) return null;
  const collection = config.collections.some(c => c.slug === g.collection) ? g.collection : null;
  return {
    id: g.slug, dbId: num(g.id), no: num(g.card_no), title: String(g.title || ''),
    studio: String(g.developer?.name || ''), studioSlug: SLUG.test(g.developer?.slug || '') ? g.developer.slug : '',
    genre: String(g.genre || ''), collection, theme: collTitle(collection),
    price: num(g.sale_price ?? g.price), motif: String(g.motif || ''),
    pal: Array.isArray(g.palette) && g.palette.length === 3 && g.palette.every(x => HEX.test(x)) ? g.palette : ['#14213D', '#2F6FED', '#FFC93C'],
    blurb: String(g.short_description || ''), description: String(g.description || ''), highlights: strs(g.highlights),
    released: /^\d{4}-\d{2}-\d{2}$/.test(g.release_date || '') ? g.release_date : '', platforms: strs(g.platforms),
    downloads: num(g.downloads), culturalNote: g.cultural_note ? String(g.cultural_note) : '',
    featured: !!g.featured,
    cover: IMG.test(g.cover_image || '') ? g.cover_image : null,
    hero: IMG.test(g.hero_image || '') ? g.hero_image : null,
    shots: (Array.isArray(g.screenshots) ? g.screenshots : []).filter(s => IMG.test(s?.src || ''))
      .map(s => ({ src: s.src, sm: s.src.replace(/\.webp$/, '-sm.webp'), alt: String(s.alt || '') })),
    trailer: ytId(g.trailer_url), official: safeUrl(g.official_url), contentNote: g.content_note ? String(g.content_note) : '',
    clip: CLIPS.has(g.slug),
    tbc: g.developer?.slug?.startsWith('tbc-') || false,   // "Studio to be confirmed": no studio page
  };
}
/* media paths are frontend paths like img/games/<slug>/cover.webp */
const IMG = /^img\/(games\/[a-z0-9-]+\/)?[a-z0-9-]+\.(webp|jpg|png)$/;
/* games with a muted hero clip at img/games/<slug>/clip.mp4 (the path comes from the slug) */
const CLIPS = new Set(['maiba-taya', 'bayani', 'jeepney-simulator', 'water-delivery']);
const clipSrc = g => `img/games/${g.id}/clip.mp4`;
/* trailer_url is the studio's YouTube upload; only its 11-character video id is used, in a youtube-nocookie embed */
const ytId = u => (/^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[&?#].*)?$/.exec(u || '') || [])[1] || '';
const safeUrl = u => (/^https?:\/\/[^\s"'<>]+$/i.test(u || '') ? u : '');
const byFeatured = (a, b) => (b.featured - a.featured) || a.title.localeCompare(b.title);
const DISCLAIMER = () => L('Ang TEKS ay isang school project. Ang mga laro at media ay pag-aari ng kanilang mga developer; hindi kaugnay ng TEKS ang mga ito at hindi sila ibinebenta ng TEKS.', 'TEKS is a school project. Games and media belong to their developers; TEKS is not affiliated with them and does not sell them.');
const demoPrice = () => L('Demo na presyo', 'Demo price');
const COLL_ROUTES = { folklore: ['#D6336C', '#FFFFFF'], 'traditional-games': ['#FFC93C', '#14213D'], history: ['#2F6FED', '#FFFFFF'], 'everyday-life': ['#0E7C7B', '#FFFFFF'] };
const collStyle = slug => { const [c, i] = COLL_ROUTES[slug] || ['#14213D', '#FFFFFF']; return `--route:${c};--route-ink:${i}`; };
const devTypeLabel = t => ({ student: L('Grupo ng estudyante', 'Student team'), indie: L('Indie developer', 'Indie developer'), studio: 'Studio' }[t] || '');
const PAYMENTS = { gcash: 'GCash', maya: 'Maya', card: 'Card' };
const fmtWhen = iso => { const d = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(iso || '') ? iso : (iso || '') + 'Z'); return isNaN(d) ? '' : d.toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' }); };

/* the signed-in account's games come from its orders; guests keep theirs in this browser */
async function loadLibrary() {
  if (!user) { owned = localOwned; return; }
  try { owned = (await api('/api/me/library')).games.filter(id => byId(id)); } catch { owned = []; }
  cart = cart.filter(id => !owned.includes(id)); saveCart();
}
function updateCount() {
  const c = $('#cart-count');
  const grew = cart.length > Number(c.textContent || 0);
  c.textContent = cart.length; c.hidden = !cart.length;
  if (grew) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
  $('a.cart-link').setAttribute('aria-label', L(`Cart, ${cart.length} laro`, `Cart, ${cart.length} ${cart.length === 1 ? 'game' : 'games'}`));
}
let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
function applyLang() {
  document.documentElement.lang = lang === 'en' ? 'en' : 'fil';
  $$('[data-en]').forEach(el => { el.textContent = lang === 'en' ? el.dataset.en : el.dataset.tl; });
  const b = $('#lang');
  b.textContent = lang === 'en' ? 'EN' : 'TL';
  b.setAttribute('aria-label', lang === 'en' ? 'Language: English. Switch to Taglish.' : 'Wika: Taglish. Lipat sa English.');
  refreshAccountUi();
}

/* ---------- card parts ---------- */
/* genre colours. Action and Adventure were added for the real catalog: the logo red and the green from the
   design's card palettes, both with text contrast of 4.5:1 or more */
const ROUTES = { Action: ['#C0392B', '#FFFFFF'], Adventure: ['#17A673', '#14213D'], RPG: ['#F26B21', '#14213D'], Horror: ['#D6336C', '#FFFFFF'], Simulation: ['#0E7C7B', '#FFFFFF'], Casual: ['#FFC93C', '#14213D'], Strategy: ['#2F6FED', '#FFFFFF'] };
const routeStyle = g => { const [c, i] = ROUTES[g.genre || g] || ['#14213D', '#FFFFFF']; return `--route:${c};--route-ink:${i}`; };
const pad = n => String(n).padStart(3, '0');
const platLine = g => (g.platforms || []).join(' · ');
const platChips = g => `<div class="plats">${(g.platforms || []).map(p => `<span class="plat">${esc(p)}</span>`).join('')}</div>`;
const fmtDate = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
const shortDate = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

const studioName = g => g.tbc ? L('Studio na kukumpirmahin pa', 'Studio to be confirmed') : g.studio;
const studioLink = g => g.studioSlug && !g.tbc ? `<a href="#/studio/${g.studioSlug}">${esc(g.studio)}</a>` : esc(studioName(g));
/* teks card: framed collectible with Power / Rarity / Series stats; flips to a printed back */
const power = g => 50 + [...g.id].reduce((s, c) => s + c.charCodeAt(0), 0) % 50;
const rarity = g => g.price >= 350 ? [L('PAMBIHIRA', 'EPIC'), 'r-super', 3] : g.price >= 150 ? [L('BIHIRA', 'RARE'), 'r-rare', 2] : [L('KARANIWAN', 'COMMON'), '', 1];
const serye = g => String(g.no).padStart(2, '0');
function cardFace(g, as = 'a', extra = '') {
  const [rLabel, rClass, rLevel] = rarity(g), pw = power(g);
  const open = as === 'a' ? `<a class="teks${extra}" style="--mat:${g.pal[1]};${routeStyle(g)}" href="#/game/${g.id}">` : `<div class="teks" style="--mat:${g.pal[1]};${routeStyle(g)}">`;
  return `${open}
    <div class="art">${cover(g)}<span class="no">${L('Serye', 'Series')} ${serye(g)}</span><span class="rar ${rClass}">${rLabel}</span></div>
    <div class="info"><h3>${esc(g.title)}</h3><p class="studio">${esc(studioName(g))}</p>
    <dl class="stats"><div><dt>Power</dt><dd>${pw}</dd><div class="pips" aria-hidden="true">${[1, 2, 3, 4, 5].map(i => `<i class="${pw >= 40 + i * 10 ? 'on' : ''}"></i>`).join('')}</div></div><div><dt>${L('Pambihira', 'Rarity')}</dt><dd>${'★'.repeat(rLevel)}${'☆'.repeat(3 - rLevel)}</dd></div><div><dt>${L('Serye', 'Series')}</dt><dd>#${serye(g)}</dd></div></dl>
    <div class="meta"><span class="tag route">${esc(g.genre)}</span>${owned.includes(g.id) ? `<span class="tag owned">${L('Pag-aari mo na', 'Owned')}</span>` : `<span class="price-wrap"><small class="demo-tag">${demoPrice()}</small><span class="price">${peso(g.price)}</span></span>`}</div></div>
  ${as === 'a' ? '</a>' : '</div>'}`;
}
/* grid card: tihaya (face up) / taob (face down) flip */
function teks(g) {
  return `<div class="tk"><div class="tk-in">
    ${cardFace(g, 'a', ' face front')}
    <div class="face back" style="${routeStyle(g)}"><div class="label"><span class="brand">TEKS</span><h3>${esc(g.title)}</h3><p>${esc(g.blurb)}</p>
      <div class="row"><a class="btn small go" href="#/game/${g.id}">${L('Tingnan', 'View')}</a><span class="tag route">${esc(g.theme)}</span></div></div></div>
  </div><button class="flipbtn" type="button" aria-pressed="false" data-title="${esc(g.title)}" aria-label="${L('Taob', 'Flip')} ${esc(g.title)}">↻</button></div>`;
}
const bigCard = g => `<div class="big-card" style="--mat:${g.pal[1]}">${cardFace(g, 'div')}</div>`;
const buyBtn = g => owned.includes(g.id) ? `<a class="btn" href="#/collection">${L('Nasa koleksyon mo na', 'In your collection')}</a>`
  : cart.includes(g.id) ? `<a class="btn" href="#/cart">${L('Nasa cart. Mag-checkout', 'In cart. Check out')}</a>`
  : `<button class="btn go" type="button" data-buy="${g.id}">${L('Bilhin', 'Buy')} · ${peso(g.price)}</button>`;

/* click-and-drag scrolling for rails (mouse; touch and wheel scroll natively) */
function dragScroll(el) {
  let down = false, moved = false, x0 = 0, s0 = 0;
  el.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = false; x0 = e.clientX; s0 = el.scrollLeft; });
  window.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - x0;
    if (!moved && Math.abs(dx) > 6) { moved = true; el.classList.add('dragging'); }
    if (moved) el.scrollLeft = s0 - dx;
  });
  window.addEventListener('pointerup', () => { if (!down) return; down = false; setTimeout(() => el.classList.remove('dragging'), 0); });
  el.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
}
/* slow, endless drift to the left. Cards are cloned once so the loop never shows a seam;
   it pauses on hover, focus, drag, touch, wheel and arrow use, and stays off for reduced motion. */
function autoScroll(rail, speed = 36) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = [...rail.children];
  if (items.length < 2) return;
  items.forEach(n => { const c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.inert = true; rail.appendChild(c); });
  const first = items[0], clone0 = rail.children[items.length];
  rail.classList.add('auto');
  let pos = rail.scrollLeft, last = 0, hover = false, focus = false, down = false, holdUntil = 0;
  const hold = ms => { holdUntil = performance.now() + ms; };
  rail.addEventListener('mouseenter', () => hover = true); rail.addEventListener('mouseleave', () => hover = false);
  rail.addEventListener('focusin', () => focus = true); rail.addEventListener('focusout', () => focus = false);
  rail.addEventListener('pointerdown', () => { down = true; });
  window.addEventListener('pointerup', () => { if (down) { down = false; hold(1500); } });
  rail.addEventListener('wheel', () => hold(2500), { passive: true });
  rail.addEventListener('touchstart', () => hold(3000), { passive: true });
  $$(`[data-target="${rail.id}"]`).forEach(b => b.addEventListener('click', () => hold(3500)));
  const tick = t => {
    if (!document.body.contains(rail)) return;
    const dt = Math.min(0.05, (t - last) / 1000 || 0); last = t;
    const loop = clone0.offsetLeft - first.offsetLeft;
    const stopped = hover || focus || down || t < holdUntil || document.hidden;
    if (stopped) pos = rail.scrollLeft;
    else { pos += speed * dt; rail.scrollLeft = pos; }
    if (loop > 0 && rail.scrollLeft >= loop) { pos = rail.scrollLeft - loop; rail.scrollLeft = pos; }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
function addToCart(g, anchor) {
  if (cart.includes(g.id) || owned.includes(g.id)) return;
  cart.push(g.id); saveCart(); toast(L(`${g.title} ay nasa cart na`, `${g.title} added to cart`));
}

/* ---------- views ---------- */
/* full-screen hero: the game's 16:9 artwork (g.hero), or the procedural art when it has none. On wider screens a
   game with a clip plays it muted and looping over the artwork (its poster), unless the visitor prefers reduced
   motion or has Save-Data on. */
const playClip = g => g.clip && g.hero && !matchMedia('(prefers-reduced-motion: reduce)').matches
  && matchMedia('(min-width: 761px)').matches && !navigator.connection?.saveData;
const heroBg = (g, first = false) => !g.hero ? art(g)
  : playClip(g) ? `<video class="hero-img hero-clip" muted loop playsinline autoplay preload="metadata" poster="${esc(g.hero)}" aria-hidden="true" tabindex="-1"><source src="${clipSrc(g)}" type="video/mp4"></video>`
  : `<img class="hero-img" src="${esc(g.hero)}" alt="" decoding="async" data-art="${g.id}"${first ? ' fetchpriority="high"' : ''}>`;
function heroCopy(g) {
  // the artwork carries the title, so the heading steps aside; not for a clip (no title), and not on phones,
  // where the cropped artwork usually cuts the title off
  const logo = !!g.hero && !playClip(g) && matchMedia('(min-width: 761px)').matches;
  const facts = [
    [L('Studio', 'Studio'), esc(studioName(g))],
    g.released && [L('Petsa ng labas', 'Release date'), fmtDate(g.released)],
    [L('Genre', 'Genre'), esc(g.genre)],
    g.platforms.length && [L('Plataporma', 'Platform'), esc(platLine(g))],
  ].filter(Boolean);
  return `<div class="hero-copy${logo ? ' has-logo' : ''}" style="${routeStyle(g)}">
      <p class="led-label">${L('Tampok na laro', 'Featured game')}</p>
      <h1 class="${logo ? 'sr' : 'led'}">${esc(g.title)}</h1>
      <p class="hero-desc">${esc(g.blurb)}</p>
      <dl class="facts">${facts.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>
      <div class="actions">${buyBtn(g)}<a class="btn ghost" href="#/game/${g.id}">${L('Detalye', 'Details')}</a></div>
    </div>`;
}

/* ranked rows: copies bought on TEKS (demo orders). Real games have no sample ratings or download counts, so
   `downloads` is only what TEKS demo checkouts added. */
const fmtDl = n => Number(n).toLocaleString('en-US');
function chartRows() {
  const list = games.filter(g => g.downloads > 0).sort((a, b) => (b.downloads - a.downloads) || a.title.localeCompare(b.title));
  const max = Math.max(...list.map(g => g.downloads), 1);
  return list.slice(0, 8).map((g, i) => `<li class="chart-row" style="${routeStyle(g)}">
    <span class="rank-n r${i + 1}" aria-label="${L('Ranggo', 'Rank')} ${i + 1}">${i + 1}</span>
    <a class="c-art" href="#/game/${g.id}" aria-label="${esc(g.title)}">${cover(g)}</a>
    <div class="c-title"><a href="#/game/${g.id}">${esc(g.title)}</a><span class="studio">${esc(studioName(g))}</span><span class="tag route">${esc(g.genre)}</span></div>
    <div class="c-dl"><b>${fmtDl(g.downloads)}</b><small>${L('nabili (demo)', g.downloads === 1 ? 'copy (demo)' : 'copies (demo)')}</small><span class="meter-bar" aria-hidden="true"><i style="width:${Math.max(4, Math.round(g.downloads / max * 100))}%"></i></span></div>
    <div class="c-rate"><small>${esc(platLine(g))}</small></div>
    <span class="c-price">${peso(g.price)}</span>
    <div class="c-buy">${owned.includes(g.id) ? `<span class="tag owned">${L('Pag-aari', 'Owned')}</span>` : cart.includes(g.id) ? `<a class="btn small" href="#/cart">${L('Sa cart', 'In cart')}</a>` : `<button class="btn small go" type="button" data-chartbuy="${g.id}">${L('Bilhin', 'Buy')}</button>`}</div>
  </li>`).join('');
}

function home() {
  const newest = [...games].sort((a, b) => b.released.localeCompare(a.released) || a.title.localeCompare(b.title));
  const slides = [...games.filter(g => g.featured && g.hero), ...[...games].sort(byFeatured).filter(g => !(g.featured && g.hero))].slice(0, 6);
  const charted = chartRows();
  const pct = Math.round(config.devShare * 100);
  const arrows = target => `<div class="arrows"><button class="arrow" type="button" data-rail="-1" data-target="${target}" aria-label="${L('Pakaliwa', 'Scroll left')}">←</button><button class="arrow" type="button" data-rail="1" data-target="${target}" aria-label="${L('Pakanan', 'Scroll right')}">→</button></div>`;
  const genreList = config.genres.map(gn => [gn, games.filter(g => g.genre === gn).sort(byFeatured)]).filter(([, gg]) => gg.length);
  const genreTiles = genreList.map(([gn, gg]) => `<a class="cat" style="${routeStyle(gn)}" href="#/store?genre=${encodeURIComponent(gn)}"><div class="cat-art">${cover(gg[0])}</div><span class="cat-name">${esc(gn)}</span><span class="n">${gg.length} ${L('laro', gg.length === 1 ? 'game' : 'games')}</span></a>`).join('');
  const collTiles = collectionTiles();
  return {
    title: 'TEKS: Filipino games, all in one store',
    html: `
    <section class="hero-full" id="hero" role="region" aria-roledescription="carousel" aria-label="${L('Mga tampok na laro', 'Featured games')}">
      <div class="hero-bg" id="hero-bg">${heroBg(slides[0], true)}</div>
      <div class="hero-shade"></div>
      <div class="wrap hero-body" id="hero-body" aria-live="polite">${heroCopy(slides[0])}</div>
      <div class="wrap hero-foot">
        <ol class="hero-thumbs">${slides.map((g, i) => `<li><button class="hthumb" type="button" data-dep="${i}" aria-pressed="${i === 0}" aria-label="${esc(g.title)}">
          <span class="th-art">${cover(g)}</span><span class="th-t">${esc(g.title)}</span><span class="th-p">${peso(g.price)}</span></button></li>`).join('')}</ol>
        <div class="hero-ctrl"><button class="arrow" type="button" id="hero-pause" aria-pressed="false">${L('Ihinto', 'Pause')}</button></div>
      </div>
    </section>

    <section class="section"><div class="wrap wide">
      <div class="head"><div><span class="eyebrow">${L('Bagong dating', 'New arrivals')}</span><h2>${L('Bagong labas', 'New releases')}</h2><p>${L('Pinakabagong laro sa tindahan.', 'The newest games in the store.')}</p></div>
        <div class="head-r"><a class="btn alt small" href="#/store">${L(`Lahat ng ${games.length} laro`, `See all ${games.length} games`)}</a>${arrows('rail-new')}</div></div>
      <div class="rail" id="rail-new" tabindex="0" aria-label="${L('Bagong laro. Mag-scroll pagilid.', 'New games. Scroll sideways.')}">${newest.map(teks).join('')}</div>
    </div></section>

    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="head"><div><span class="eyebrow">${L('Mga genre', 'Genres')}</span><h2>${L('Mag-browse ayon sa genre', 'Browse by genre')}</h2><p>${L('Pumili ng uri ng laro na gusto mong laruin.', 'Jump straight to the kind of game you want to play.')}</p></div></div>
      <div class="cats${genreList.length === 6 ? ' six' : ''}">${genreTiles}</div>
    </div></section>

    ${collTiles ? `<section class="section" style="padding-top:0"><div class="wrap">
      <div class="head"><div><span class="eyebrow">Pinoy Collections</span><h2>${L('Mag-browse ayon sa kwentong Pinoy', 'Browse by Filipino story')}</h2><p>${L('Alamat, laro sa kalye, kasaysayan, at araw-araw na buhay.', 'Folklore, street games, history and everyday life.')}</p></div>
        <div class="head-r"><a class="btn alt small" href="#/pinoy">${L('Lahat ng koleksyon', 'All collections')}</a></div></div>
      <div class="cats four">${collTiles}</div>
    </div></section>` : ''}

    <section class="band"><div class="wrap">
      <div>
        <span class="eyebrow" style="color:var(--yellow)">${L('Para sa mga developer', 'For developers')}</span>
        <h2>${L(`Magbenta. Itago ang ${pct}%.`, `Sell. Keep ${pct}%.`)}</h2>
        <p>${L('Ipadala ang laro mo at maikling pitch. Susuriin namin at sasagot sa email. Kapag may bumili, sa iyo ang malaking bahagi.', 'Send your game and a short pitch. We review it and reply by email. When someone buys it, most of the sale is yours.')}</p>
        <div class="actions"><a class="btn go" href="#/developers">${L('Ipasa ang laro', 'Submit a game')}</a><a class="btn ghost" href="#/about">${L('Bakit TEKS', 'Why TEKS')}</a></div>
      </div>
      <div class="meter" aria-hidden="true"><div class="lab">${L('Kita sa bawat kopya ng ₱299', 'You receive per ₱299 copy')}</div><div class="digits">${peso(Math.round(299 * config.devShare * 100) / 100)}</div></div>
    </div></section>

    ${charted ? `<section class="section"><div class="wrap">
      <div class="head"><div><span class="eyebrow">${L('Ranggo', 'Rankings')}</span><h2>${L('Nabili sa TEKS', 'Bought on TEKS')}</h2><p>${L('Bilang ng kopya mula sa demo checkout ng TEKS. Walang totoong bayad, at hindi ito benta ng mga developer.', 'Copies from TEKS demo checkouts. No real payment is taken, and these are not the developers’ sales.')}</p></div></div>
      <ol class="chart" id="chart">${charted}</ol>
    </div></section>` : ''}`,
    mount() {
      let cur = 0, userPaused = matchMedia('(prefers-reduced-motion: reduce)').matches, hold = false, timer;
      const root = $('#hero'), bg = $('#hero-bg'), body = $('#hero-body');
      const pauseBtn = $('#hero-pause');
      // the pause button stops both the slideshow and the clip; hover and focus only hold the slideshow
      const setPauseUi = () => {
        root.classList.toggle('paused', userPaused || hold);
        pauseBtn.setAttribute('aria-pressed', userPaused);
        pauseBtn.textContent = userPaused ? L('Ituloy', 'Play') : L('Ihinto', 'Pause');
        pauseBtn.setAttribute('aria-label', userPaused ? L('Ituloy ang mga tampok na laro', 'Play the featured games') : L('Ihinto ang mga tampok na laro', 'Pause the featured games'));
        const v = $('video', bg); if (v) { if (userPaused) v.pause(); else v.play().catch(() => {}); }
      };
      pauseBtn.addEventListener('click', () => { userPaused = !userPaused; setPauseUi(); });
      const schedule = () => {
        clearTimeout(timer);
        timer = setTimeout(() => { if (!document.body.contains(root)) return; if (userPaused || hold || document.hidden) return schedule(); show(cur + 1); }, 6500);
      };
      const show = i => {
        cur = (i + slides.length) % slides.length;
        bg.innerHTML = heroBg(slides[cur]); body.innerHTML = heroCopy(slides[cur]);
        root.classList.remove('swap'); void root.offsetWidth; root.classList.add('swap');
        $$('.hthumb').forEach((d, k) => d.setAttribute('aria-pressed', k === cur));
        bindBuy(); setPauseUi(); schedule();
      };
      const bindBuy = () => $('[data-buy]', body)?.addEventListener('click', () => { addToCart(slides[cur]); show(cur); });
      $$('.hthumb').forEach(b => b.addEventListener('click', () => show(+b.dataset.dep)));
      root.addEventListener('mouseenter', () => { hold = true; setPauseUi(); }); root.addEventListener('mouseleave', () => { hold = false; setPauseUi(); });
      root.addEventListener('focusin', () => { hold = true; setPauseUi(); }); root.addEventListener('focusout', () => { hold = false; setPauseUi(); });
      setPauseUi(); bindBuy(); schedule();
$$('[data-rail]').forEach(b => b.addEventListener('click', () => { const r = $('#' + b.dataset.target); r.scrollBy({ left: +b.dataset.rail * r.clientWidth * 0.8, behavior: 'smooth' }); }));
      $$('.rail').forEach(dragScroll);
      autoScroll($('#rail-new'));
      $('#chart')?.addEventListener('click', e => {
        const b = e.target.closest('[data-chartbuy]'); if (!b) return;
        addToCart(byId(b.dataset.chartbuy));
        b.replaceWith(Object.assign(document.createElement('a'), { className: 'btn small', href: '#/cart', textContent: L('Sa cart', 'In cart') }));
      });
    },
  };
}

function storeView(params) {
  const csv = k => (params.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const maxP = Math.ceil(Math.max(...games.map(g => g.price), 50) / 50) * 50;
  const CHEAP = 150;
  const PLATS = config.platforms;
  const st = { q: params.get('q') || '', genre: csv('genre'), theme: csv('theme'), platform: csv('platform'),
    price: Math.min(maxP, Number(params.get('price')) || maxP), sort: ['newest', 'price-asc', 'price-desc', 'title'].includes(params.get('sort')) ? params.get('sort') : 'featured' };
  const countOf = (key, val) => games.filter(g => key === 'platform' ? (g.platforms || []).includes(val) : g[key] === val).length;
  const group = (key, label, list, route) => `<fieldset class="fgroup"><legend>${label}</legend>${list.map(v =>
    `<label class="check"><input type="checkbox" data-f="${key}" value="${esc(v)}" ${st[key].includes(v) ? 'checked' : ''}>${route ? `<i class="gdot" style="${routeStyle(v)}"></i>` : ''}<span class="lbl">${esc(v)}</span><small>${countOf(key, v)}</small></label>`).join('')}</fieldset>`;
  const sorts = [['featured', L('Tampok', 'Featured')], ['newest', L('Pinakabago', 'Newest')], ['price-asc', L('Presyo: mababa muna', 'Price: low to high')], ['price-desc', L('Presyo: mataas muna', 'Price: high to low')], ['title', L('Pamagat: A-Z', 'Title: A to Z')]];
  const html = `
    <section class="store-head"><div class="wide-wrap">
      <div class="sh-top"><div><span class="eyebrow">${L('Mga laro', 'Games')}</span><h1>${L('Tindahan', 'Store')}</h1></div><p class="sh-count" id="count" aria-live="polite"></p></div>
      <div class="searchbar" role="search">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
        <input id="q" type="search" autocomplete="off" aria-label="${L('Maghanap ng laro', 'Search games')}" placeholder="${L('Hanapin ang laro, studio, o nilalang...', 'Search games, studios, or creatures...')}" value="${esc(st.q)}">
        <button type="button" id="q-clear" class="q-clear" aria-label="${L('Burahin ang hinahanap', 'Clear search')}" hidden>×</button>
        <kbd aria-hidden="true">/</kbd>
      </div>
      <div class="quick" role="group" aria-label="${L('Mabilis na filter', 'Quick filters')}">
        <button type="button" class="chip" data-quick="all">${L('Lahat', 'All games')}</button>
        <button type="button" class="chip" data-quick="newest">${L('Pinakabago', 'Newest')}</button>
        <button type="button" class="chip" data-quick="cheap">${L(`Wala pang ${peso(CHEAP)} (demo)`, `Under ${peso(CHEAP)} (demo)`)}</button>
      </div>
    </div></section>
    <div class="wide-wrap store-layout">
      <aside class="store-side" id="side" aria-label="${L('Mga filter', 'Filters')}">
        <div class="side-head"><h2>${L('Mga filter', 'Filters')}</h2><button type="button" class="linkish" id="clear-all">${L('I-clear lahat', 'Clear all')}</button></div>
        ${group('genre', 'Genre', config.genres, true)}
        ${group('theme', L('Koleksyon', 'Collection'), config.themes)}
        ${group('platform', L('Plataporma', 'Platform'), PLATS)}
        <div class="fgroup"><label class="range-lab" for="price">${L('Pinakamataas na demo na presyo', 'Max demo price')}<b id="price-v"></b></label><input type="range" id="price" min="0" max="${maxP}" step="10" value="${st.price}"></div>
      </aside>
      <div class="store-main">
        <div class="results-bar">
          <button type="button" class="btn alt small filters-toggle" id="ft" aria-expanded="false" aria-controls="side">${L('Mga filter', 'Filters')}</button>
          <div class="active" id="active" aria-live="polite"></div>
          <label class="sortbox">${L('Ayusin', 'Sort')}<select id="sort">${sorts.map(([v, l]) => `<option value="${v}" ${st.sort === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        </div>
        <div id="results"></div>
        
      </div>
    </div>`;
  const mount = () => {
    const side = $('#side');
    const reset = () => Object.assign(st, { q: '', genre: [], theme: [], platform: [], price: maxP, sort: 'featured' });
    const match = g => (!st.genre.length || st.genre.includes(g.genre)) && (!st.theme.length || st.theme.includes(g.theme)) &&
      (!st.platform.length || st.platform.some(p => (g.platforms || []).includes(p))) && g.price <= st.price &&
      (!st.q.trim() || [g.title, studioName(g), g.blurb, g.description, g.genre, g.theme, ...(g.platforms || [])].join(' ').toLowerCase().includes(st.q.trim().toLowerCase()));
    const sync = () => {
      const p = new URLSearchParams();
      if (st.q) p.set('q', st.q);
      for (const k of ['genre', 'theme', 'platform']) if (st[k].length) p.set(k, st[k].join(','));
      if (st.price < maxP) p.set('price', st.price);
      if (st.sort !== 'featured') p.set('sort', st.sort);
      history.replaceState(null, '', '#/store' + (p.toString() ? '?' + p : ''));
    };
    const activeChips = () => {
      const out = [];
      if (st.q.trim()) out.push(['q', '', `“${st.q.trim()}”`]);
      for (const k of ['genre', 'theme', 'platform']) for (const v of st[k]) out.push([k, v, v]);
      if (st.price < maxP) out.push(['price', '', `≤ ${peso(st.price)}`]);
      return out;
    };
    const draw = () => {
      let list = games.filter(match);
      if (st.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
      else if (st.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
      else if (st.sort === 'newest') list.sort((a, b) => b.released.localeCompare(a.released) || a.title.localeCompare(b.title));
      else if (st.sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
      else list.sort(byFeatured);
      $('#count').textContent = L(`${list.length} sa ${games.length} laro`, `${list.length} of ${games.length} games`);
      $('#results').innerHTML = list.length ? `<div class="cards store-cards">${list.map(teks).join('')}</div>`
        : `<div class="empty"><h2>${L('Walang tumama', 'No games match')}</h2><p>${L('Subukan ang ibang salita, o alisin ang ilang filter.', 'Try a different word, or remove a few filters.')}</p><button class="btn go" id="clear" type="button">${L('I-clear lahat ng filter', 'Clear all filters')}</button></div>`;
      $('#clear')?.addEventListener('click', () => { reset(); sync(); paint(); });
      const chips = activeChips();
      $('#active').innerHTML = chips.map(([k, v, label]) => `<button type="button" class="achip" data-rm-k="${k}" data-rm-v="${esc(v)}" aria-label="${L('Alisin ang filter', 'Remove filter')}: ${esc(label)}">${esc(label)} <span aria-hidden="true">×</span></button>`).join('');
      $('#q-clear').hidden = !st.q;
      $('#price-v').textContent = st.price >= maxP ? L('Kahit magkano', 'Any') : peso(st.price);
      $$('[data-quick]').forEach(b => {
        const k = b.dataset.quick;
        b.setAttribute('aria-pressed', k === 'all' ? !chips.length && st.sort === 'featured' : k === 'cheap' ? st.price <= CHEAP : st.sort === k);
      });
      $('#clear-all').hidden = !chips.length && st.sort === 'featured';
    };
    const paint = () => {   // push state back into the controls, then redraw
      $('#q').value = st.q; $('#sort').value = st.sort; $('#price').value = st.price;
      $$('[data-f]').forEach(i => { i.checked = st[i.dataset.f].includes(i.value); });
      draw();
    };
    $('#q').addEventListener('input', e => { st.q = e.target.value; sync(); draw(); });
    $('#q-clear').addEventListener('click', () => { st.q = ''; $('#q').value = ''; $('#q').focus(); sync(); draw(); });
    $('#sort').addEventListener('change', e => { st.sort = e.target.value; sync(); draw(); });
    $('#price').addEventListener('input', e => { st.price = Number(e.target.value); sync(); draw(); });
    side.addEventListener('change', e => {
      const t = e.target;
      if (t.dataset.f) { const a = st[t.dataset.f]; st[t.dataset.f] = t.checked ? [...a, t.value] : a.filter(x => x !== t.value); }
      sync(); draw();
    });
    $('#clear-all').addEventListener('click', () => { reset(); sync(); paint(); });
    $$('[data-quick]').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.quick;
      if (k === 'all') reset();
      else if (k === 'cheap') st.price = st.price <= CHEAP ? maxP : CHEAP;
      else st.sort = st.sort === k ? 'featured' : k;
      sync(); paint();
    }));
    $('#active').addEventListener('click', e => {
      const b = e.target.closest('[data-rm-k]'); if (!b) return;
      const k = b.dataset.rmK, v = b.dataset.rmV;
      if (k === 'q') st.q = ''; else if (k === 'price') st.price = maxP; else st[k] = st[k].filter(x => x !== v);
      sync(); paint();
    });
    $('#ft').addEventListener('click', () => { const open = side.classList.toggle('open'); $('#ft').setAttribute('aria-expanded', open); });
    paint();
  };
  return { title: L('Tindahan | TEKS', 'Store | TEKS'), html, mount };
}

/* trailer: a poster button that loads the studio's YouTube upload (youtube-nocookie) only when clicked */
const trailerBox = g => g.trailer ? `<div class="trailer">
    <button class="trailer-play" type="button" data-yt="${g.trailer}" data-title="${esc(g.title)}" aria-label="${L(`I-play ang trailer ng ${esc(g.title)} (galing YouTube)`, `Play the ${esc(g.title)} trailer (loads YouTube)`)}">
      ${g.hero ? `<img src="${esc(g.hero)}" alt="" loading="lazy" decoding="async" width="1920" height="1080">` : art(g)}
      <span class="trailer-icon" aria-hidden="true">▶</span><span class="trailer-note">${L('I-play ang trailer · YouTube', 'Play trailer · YouTube')}</span>
    </button></div>` : '';
function bindTrailers(root = document) {
  $$('[data-yt]', root).forEach(b => b.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0`;
    f.title = L(`Trailer ng ${b.dataset.title}`, `${b.dataset.title} trailer`);
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true; f.referrerPolicy = 'strict-origin-when-cross-origin';
    b.replaceWith(f); f.focus();
  }, { once: true }));
}
/* screenshot lightbox in the shared <dialog id="dlg"> */
function openShot(g, i, opener) {
  const d = $('#dlg'), n = g.shots.length;
  const draw = () => {
    const s = g.shots[i];
    d.innerHTML = `<figure class="lb-fig"><img src="${esc(s.src)}" alt="${esc(s.alt)}"><figcaption>${esc(s.alt)} <span class="mono">${i + 1} / ${n}</span></figcaption></figure>
      <div class="lb-nav">${n > 1 ? `<button class="btn small alt" type="button" data-lb="-1" aria-label="${L('Naunang larawan', 'Previous screenshot')}">←</button><button class="btn small alt" type="button" data-lb="1" aria-label="${L('Susunod na larawan', 'Next screenshot')}">→</button>` : ''}
      <form method="dialog"><button class="btn small" type="submit">${L('Isara', 'Close')}</button></form></div>`;
    $$('[data-lb]', d).forEach(b => b.addEventListener('click', () => step(+b.dataset.lb)));
  };
  const step = k => { i = (i + k + n) % n; draw(); $(`[data-lb="${k}"]`, d)?.focus(); };
  const keys = e => { if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1); };
  d.className = 'lightbox'; draw();
  d.addEventListener('keydown', keys);
  d.addEventListener('close', () => { d.removeEventListener('keydown', keys); d.className = ''; opener?.focus(); }, { once: true });
  d.showModal();
}

function gameView(id) {
  const g = byId(id);
  if (!g) return notFound();
  const dev = g.price * config.devShare;
  const related = (x, y) => (x.studioSlug === g.studioSlug && !g.tbc ? 4 : 0) + (x.collection && x.collection === g.collection ? 2 : 0) + (x.genre === g.genre ? 1 : 0);
  const same = games.filter(x => x.id !== g.id && related(x) > 0).sort((a, b) => related(b) - related(a) || byFeatured(a, b)).slice(0, 4);
  const liked = likes.includes(g.id);
  const facts = [
    g.released && [L('Petsa ng labas', 'Release date'), fmtDate(g.released)],
    g.platforms.length && [L('Plataporma', 'Platform'), esc(platLine(g))],
  ].filter(Boolean);
  return {
    title: `${g.title} | TEKS`,
    html: `<div class="wrap" style="${routeStyle(g)}">
      <p class="crumbs"><a href="#/store">${L('Tindahan', 'Store')}</a> / <a href="#/store?genre=${encodeURIComponent(g.genre)}">${esc(g.genre)}</a> / ${esc(g.title)}</p>
      <div class="game">
        ${bigCard(g)}
        <div>
          <span class="tag route">${esc(g.genre)}</span> ${g.collection ? `<a class="tag" style="${collStyle(g.collection)}" href="#/pinoy/${g.collection}">${esc(g.theme)}</a>` : ''}
          <h1>${esc(g.title)}</h1>
          <p class="by">${L('mula sa', 'by')} ${studioLink(g)}</p>
          ${g.official ? `<p class="official"><a class="btn alt small" href="${esc(g.official)}" target="_blank" rel="noopener noreferrer">${L('Opisyal na pahina', 'Official page')} <span aria-hidden="true">↗</span></a> <small>${L('Bilhin o i-download ang laro mula sa developer.', 'Get the game from its developer.')}</small></p>` : ''}
          ${g.contentNote ? `<p class="content-note" role="note"><b>${L('Paalala sa nilalaman', 'Content note')}:</b> ${esc(g.contentNote)}</p>` : ''}
          ${facts.length ? `<dl class="gfacts">${facts.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>` : ''}
          <p>${esc(g.description)}</p>
          <div class="buy"><span class="amount"><small>${demoPrice()}</small>${peso(g.price)}</span>${buyBtn(g)}
            <button class="btn alt small${liked ? ' liked' : ''}" id="like" type="button" aria-pressed="${liked}">${liked ? L('♥ Gusto ko!', '♥ Liked') : L('♡ Gusto ko', '♡ Like')}</button></div>
          ${g.highlights.length ? `<h3>${L('Mga tampok', 'Highlights')}</h3><ul class="list">${g.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
          ${g.culturalNote ? `<div class="culture"><h3>${L('Tala sa kultura', 'Cultural note')}</h3><p>${esc(g.culturalNote)}</p></div>` : ''}
          <h3>${L(`Saan mapupunta ang ${peso(g.price)} (demo)`, `Where your ${peso(g.price)} would go (demo)`)}</h3>
          <div class="bar-split" role="img" aria-label="${Math.round(config.devShare * 100)} percent to the developer"><i style="width:${config.devShare * 100}%"></i></div>
          <p class="split">${L(`Sa demo na ito, ${esc(studioName(g))} ay tatanggap ng ${peso(Math.round(dev * 100) / 100)} at ${peso(Math.round((g.price - dev) * 100) / 100)} ang para sa tindahan. Walang totoong bayad.`, `In this demo, ${esc(studioName(g))} would receive ${peso(Math.round(dev * 100) / 100)} and TEKS would keep ${peso(Math.round((g.price - dev) * 100) / 100)}. No real payment is taken.`)}</p>
          <p class="disclaimer">${DISCLAIMER()}</p>
        </div>
      </div>
      ${g.trailer || g.shots.length ? `<section class="section media" style="padding-top:0" aria-label="${L('Trailer at mga larawan', 'Trailer and screenshots')}">
        ${g.trailer ? `<div class="head"><h2>Trailer</h2></div>${trailerBox(g)}` : ''}
        ${g.shots.length ? `<div class="head"><h2>${L('Mga larawan', 'Screenshots')}</h2><p>${L('Mula sa developer. Pindutin para lumaki.', 'From the developer. Select one to enlarge it.')}</p></div>
          <ul class="shots">${g.shots.map((s, i) => `<li><button type="button" class="shot" data-shot="${i}" aria-label="${L('Palakihin', 'Enlarge')}: ${esc(s.alt)}"><img src="${esc(s.sm)}" alt="${esc(s.alt)}" loading="lazy" decoding="async" width="480" height="270"></button></li>`).join('')}</ul>` : ''}
      </section>` : ''}
      ${same.length ? `<div class="section" style="padding-top:1rem"><div class="head"><h2>${L('Baka magustuhan mo rin', 'You might also like')}</h2></div><div class="cards">${same.map(teks).join('')}</div></div>` : ''}
    </div>`,
    mount() {
      bindTrailers();
      $$('[data-shot]').forEach(b => b.addEventListener('click', () => openShot(g, +b.dataset.shot, b)));
      $('[data-buy]')?.addEventListener('click', () => { addToCart(g); render(); });
      $('#like').addEventListener('click', e => {
        const b = e.currentTarget, on = !likes.includes(g.id);
        likes = on ? [...likes, g.id] : likes.filter(x => x !== g.id); store.set('teks.likes', likes);
        b.classList.toggle('liked', on); b.setAttribute('aria-pressed', on); b.textContent = on ? L('♥ Gusto ko!', '♥ Liked') : L('♡ Gusto ko', '♡ Like');
        if (on) toast(L('Nilagay sa paborito', 'Saved to your favorites'));
      });
    },
  };
}

let promo = null;   // { code, percent } once Apply has checked it; the server checks it again at checkout
function cartView() {
  const items = cart.map(byId).filter(Boolean);
  if (!items.length) return {
    title: 'Cart | TEKS',
    html: `<div class="wrap section"><div class="empty"><h1>${L('Walang laman ang cart', 'Your cart is empty')}</h1><p>${L('Pumili ng laro sa tindahan at lalabas ito dito.', 'Pick a game from the store and it will show up here.')}</p><a class="btn go" href="#/store">${L('Tingnan ang tindahan', 'Browse the store')}</a></div></div>`,
  };
  const subtotal = items.reduce((s, g) => s + g.price, 0);
  const totals = () => { const discount = promo ? Math.floor(subtotal * promo.percent / 100) : 0; return { discount, total: subtotal - discount }; };
  const rows = () => {
    const { discount, total } = totals();
    return `<div class="row"><span>${items.length} ${L('laro', items.length === 1 ? 'game' : 'games')}</span><span>${peso(subtotal)}</span></div>
      ${promo ? `<div class="row"><span>${L('Promo', 'Promo')} ${esc(promo.code)} (−${promo.percent}%)</span><span>−${peso(discount)}</span></div>` : ''}
      <div class="row"><span>${L('Para sa developer', 'To developers')}</span><span>${peso(Math.round(total * config.devShare * 100) / 100)}</span></div>
      <div class="row total"><span>${L('Kabuuan (demo)', 'Total (demo)')}</span><span>${peso(total)}</span></div>`;
  };
  const placeLabel = () => `${L('Ilagay ang order', 'Place order')} · ${peso(totals().total)}`;
  return {
    title: 'Cart | TEKS',
    html: `<div class="wrap cart"><div><h1 style="font-size:clamp(2rem,4vw,2.8rem);margin-bottom:1.4rem">${L('Mga sasakyan mo', 'Your cart')}</h1>
      ${items.map(g => `<div class="line-item" style="${routeStyle(g)}"><a class="thumb" href="#/game/${g.id}" aria-label="${esc(g.title)}">${cover(g)}</a>
        <div><h3>${esc(g.title)}</h3><p>${esc(studioName(g))} · ${esc(g.genre)}</p><button class="linkish" data-rm="${g.id}" type="button">${L('Alisin', 'Remove')} ${esc(g.title)}</button></div><span class="amount"><small>${demoPrice()}</small>${peso(g.price)}</span></div>`).join('')}
      <p class="disclaimer">${L('Demo na presyo ang lahat ng presyo. Hindi ibinebenta ng TEKS ang mga larong ito; bilhin ang mga ito sa opisyal na pahina ng developer.', 'All prices are demo prices. TEKS does not sell these games; get them from each developer’s official page.')}</p></div>
      <aside class="summary" aria-label="${L('Buod ng order', 'Order summary')}"><h2>${L('Buod', 'Order summary')}</h2>
        <div id="sum-rows">${rows()}</div>
        <form id="checkout" novalidate>
          <label class="field" id="f-customer_name">${L('Pangalan', 'Name')}<input name="customer_name" autocomplete="name" value="${esc(user?.name || '')}"><span class="err" role="alert"></span></label>
          <label class="field" id="f-email">Email<input name="email" type="email" autocomplete="email" value="${esc(user?.email || '')}"><span class="err" role="alert"></span></label>
          <label class="field" id="f-mobile">${L('Mobile number', 'Mobile number')}<input name="mobile" type="tel" inputmode="tel" autocomplete="tel" placeholder="09171234567"><span class="err" role="alert"></span></label>
          <fieldset class="field pick" id="f-payment_method"><legend>${L('Paraan ng bayad', 'Payment method')}</legend>
            <div class="chips">${Object.entries(PAYMENTS).map(([v, label], i) => `<label class="chip"><input type="radio" name="payment_method" value="${v}"${i === 0 ? ' checked' : ''}>${label}</label>`).join('')}</div>
            <small>${L('Demo lang: walang hihinging card o account details.', 'Demo only: no card or account details are asked for.')}</small><span class="err" role="alert"></span></fieldset>
          <div class="field" id="f-promo_code"><label for="promo">${L('Promo code', 'Promo code')} <small>${L('Opsyonal', 'Optional')}</small></label>
            <div class="promo-row"><input id="promo" name="promo_code" autocomplete="off" autocapitalize="characters" maxlength="20" value="${esc(promo?.code || '')}"><button type="button" class="btn small alt" id="promo-apply">${L('Gamitin', 'Apply')}</button></div><span class="err" role="alert"></span></div>
          <button class="btn go" type="submit" id="place">${placeLabel()}</button>
          <small>${L('Demo checkout. Walang bayad.', 'Demo checkout. No payment is taken.')}</small>
          <span class="err" id="form-err" role="alert"></span>
        </form></aside></div>`,
    mount() {
      $$('[data-rm]').forEach(b => b.addEventListener('click', () => { cart = cart.filter(x => x !== b.dataset.rm); saveCart(); render(); }));
      const promoField = $('#f-promo_code');
      const promoErr = msg => { promoField.classList.toggle('bad', !!msg); $('.err', promoField).textContent = msg || ''; };
      const redrawTotals = () => { $('#sum-rows').innerHTML = rows(); $('#place').textContent = placeLabel(); };
      $('#promo-apply').addEventListener('click', async () => {
        const code = $('#promo').value.trim();
        promoErr('');
        if (!code) { promo = null; return redrawTotals(); }
        try {
          const r = await api('/api/promo/' + encodeURIComponent(code));
          if (r.valid) { promo = { code: code.toUpperCase(), percent: num(r.percent) }; toast(L(`${num(r.percent)}% bawas na`, `${num(r.percent)}% off applied`)); }
          else { promo = null; promoErr(L('Hindi tanggap ang promo code na iyan.', 'That promo code is not valid.')); }
        } catch (err) { if (!document.body.contains(promoField)) return; promoErr(err.message); }
        if (!document.body.contains(promoField)) return;
        redrawTotals();
      });
      $('#checkout').addEventListener('submit', async e => {
        e.preventDefault();
        const f = e.target, btn = $('button[type=submit]', f);
        $$('.field', f).forEach(x => { x.classList.remove('bad'); $('.err', x).textContent = ''; }); $('#form-err').textContent = '';
        btn.disabled = true; btn.textContent = L('Pinoproseso', 'Placing order');
        const body = { customer_name: f.customer_name.value, email: f.email.value, mobile: f.mobile.value, payment_method: f.payment_method.value,
          promo_code: f.promo_code.value.trim() || null, game_ids: items.map(g => g.dbId) };
        try {
          const { code } = await api('/api/orders', { method: 'POST', body });
          const ids = items.map(g => g.id);
          if (user) owned = [...new Set([...owned, ...ids])];
          else { localOwned = [...new Set([...localOwned, ...ids])]; owned = localOwned; saveOwned(); }
          cart = []; saveCart(); promo = null;
          toast(L('Nailagay na ang order', 'Order placed'));
          location.hash = '#/order/' + encodeURIComponent(code);
        } catch (err) {
          if (!document.body.contains(f)) return;
          const fld = err.field && $('#f-' + err.field);
          if (fld) { fld.classList.add('bad'); $('.err', fld).textContent = err.message; $('input,select,textarea', fld)?.focus(); } else $('#form-err').textContent = err.message;
          btn.disabled = false; btn.textContent = placeLabel();
        }
      });
    },
  };
}

function collectionView() {
  const mine = owned.map(byId).filter(Boolean);
  const favs = likes.map(byId).filter(Boolean);
  const title = L('Koleksyon ko | TEKS', 'My collection | TEKS');
  if (!mine.length && !favs.length) return {
    title,
    html: `<div class="wrap section"><div class="empty"><h1>${L('Wala ka pang laro', 'Nothing here yet')}</h1><p>${L('Ang mga larong bibilhin mo ay lalabas dito, at ang mga laro na minarkahan mo ng ♡ ay mapupunta sa Mga paborito. Kumuha ng una sa tindahan.', 'Games you buy show up here, and games you mark with ♡ are saved under Favorites. Pick up your first one in the store.')}</p><a class="btn go" href="#/store">${L('Tingnan ang tindahan', 'Browse the store')}</a></div></div>`,
  };
  const ownedBlock = mine.length
    ? `<div class="cards">${mine.map(g => `<div class="owned">${teks(g)}<span class="stamp">${L('Pag-aari', 'Owned')}</span><button class="btn small go" data-play="${g.id}" type="button">${L('Laruin', 'Play')} ${esc(g.title)}</button></div>`).join('')}</div>`
    : `<div class="coll-empty"><p>${L('Wala ka pang pag-aaring laro.', 'You do not own any games yet.')}</p><a class="btn small go" href="#/store">${L('Tingnan ang tindahan', 'Browse the store')}</a></div>`;
  const favAction = g => owned.includes(g.id) ? `<span class="tag owned">${L('Pag-aari', 'Owned')}</span>`
    : cart.includes(g.id) ? `<a class="btn small" href="#/cart">${L('Nasa cart', 'In cart')}</a>`
    : `<button class="btn small go" type="button" data-favbuy="${g.id}">${L('Bilhin', 'Buy')} · ${peso(g.price)}</button>`;
  const favBlock = favs.length
    ? `<div class="cards">${favs.map(g => `<div class="fav">${teks(g)}<div class="fav-actions">${favAction(g)}<button class="btn small alt" type="button" data-unlike="${g.id}" aria-label="${L('Alisin sa paborito', 'Remove from favorites')}: ${esc(g.title)}">♥ ${L('Alisin', 'Remove')}</button></div></div>`).join('')}</div>`
    : `<div class="coll-empty"><p>${L('Wala pang paborito. Pindutin ang ♡ Gusto ko sa pahina ng laro para i-save ito dito.', 'No favorites yet. Tap ♡ Like on a game page to save it here.')}</p><a class="btn small go" href="#/store">${L('Maghanap ng laro', 'Find a game')}</a></div>`;
  return {
    title,
    html: `<section class="page-head"><div class="wrap"><span class="eyebrow">${L('Koleksyon', 'Collection')}</span><h1>${L('Koleksyon ko', 'My collection')}</h1>
        <p>${L(`${mine.length} sa ${games.length} laro ang pag-aari mo · ${favs.length} paborito`, `${mine.length} of ${games.length} games owned · ${favs.length} ${favs.length === 1 ? 'favorite' : 'favorites'}`)}</p>
        <div class="coll-jump"><button type="button" class="chip" data-jump="owned-sec">${L('Pag-aari', 'Owned')} (${mine.length})</button><button type="button" class="chip" data-jump="fav-sec">♥ ${L('Mga paborito', 'Favorites')} (${favs.length})</button></div></div></section>
      <section class="section" id="owned-sec"><div class="wrap"><div class="head"><div><h2>${L('Pag-aari', 'Owned')}</h2><p>${L('Mga larong nabili mo na.', 'Games you have bought.')}</p></div></div>${ownedBlock}</div></section>
      <section class="section" id="fav-sec" style="padding-top:0"><div class="wrap"><div class="head"><div><h2>♥ ${L('Mga paborito', 'Favorites')}</h2><p>${L('Mga larong minarkahan mo ng Gusto ko.', 'Games you marked with Like.')}</p></div></div>${favBlock}</div></section>`,
    mount() {
      $$('[data-play]').forEach(b => b.addEventListener('click', () => {
        const g = byId(b.dataset.play), d = $('#dlg');
        d.className = g.trailer ? 'wide' : '';
        d.innerHTML = `<h2>${esc(g.title)}</h2><p>${L('Demo ito kaya hindi nakakabit ang launcher, at hindi ibinebenta ng TEKS ang larong ito. Panoorin ang trailer, o kunin ang laro sa opisyal na pahina nito.', 'This is a demo, so no game launcher is connected, and TEKS does not sell this game. Watch the trailer, or get the game from its official page.')}</p>
          ${trailerBox(g)}
          <div class="actions">${g.official ? `<a class="btn go" href="${esc(g.official)}" target="_blank" rel="noopener noreferrer">${L('Opisyal na pahina', 'Official page')} <span aria-hidden="true">↗</span></a>` : ''}<form method="dialog"><button class="btn">${L('Isara', 'Close')}</button></form></div>`;
        d.addEventListener('close', () => { d.className = ''; d.innerHTML = ''; }, { once: true });   // stops the video
        bindTrailers(d);
        d.showModal();
      }));
      $$('[data-unlike]').forEach(b => b.addEventListener('click', () => {
        likes = likes.filter(x => x !== b.dataset.unlike); store.set('teks.likes', likes);
        toast(L('Inalis sa paborito', 'Removed from favorites')); render();
      }));
      $$('[data-favbuy]').forEach(b => b.addEventListener('click', () => { addToCart(byId(b.dataset.favbuy)); render(); }));
      $$('[data-jump]').forEach(b => b.addEventListener('click', () => $('#' + b.dataset.jump).scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })));
    },
  };
}

function developersView() {
  const pct = Math.round(config.devShare * 100);
  const isDev = user?.role === 'developer';
  const gate = user
    ? `<div class="box gate"><h2>${L('Para sa developer account lang', 'Developer accounts only')}</h2><p>${L(`Naka-sign in ka bilang customer (${esc(user.name)}). Gumawa ng developer account para makapagpasa ng laro.`, `You are signed in as a customer (${esc(user.name)}). Create a developer account to submit a game.`)}</p><div class="actions"><button class="btn go" type="button" data-gate="switch">${L('Mag-sign out at gumawa ng developer account', 'Sign out and create a developer account')}</button></div></div>`
    : `<div class="box gate"><h2>${L('Mag-sign in para magpasa ng laro', 'Sign in to submit a game')}</h2><p>${L('Kailangan ng developer account para makapagpasa ng laro at masubaybayan ang studio mo.', 'You need a developer account to submit a game and follow your studio.')}</p><div class="actions"><a class="btn go" href="#/account?role=developer&next=/developers">${L('Mag-sign in bilang developer', 'Sign in as a developer')}</a><a class="btn alt" href="#/account?mode=signup&role=developer&next=/developers">${L('Gumawa ng developer account', 'Create a developer account')}</a></div></div>`;
  return {
    title: L('Magbenta | TEKS', 'Sell a game | TEKS'),
    html: `<section class="page-head"><div class="wrap"><span class="eyebrow">${L('Para sa mga developer', 'For developers')}</span><h1>${L('Ibenta ang laro mo', 'Sell your game on TEKS')}</h1><p>${L(`Maabot ang mga manlalarong naghahanap ng larong gawang Pinoy, at itago ang ${pct}% ng bawat benta.`, `Reach players who are looking for Filipino-made games, and keep ${pct}% of every sale.`)}</p></div></section>
    <div class="wrap section"><div class="two" style="align-items:start">
      ${isDev ? `<div class="box"><h2>${L('Ipasa ang laro', 'Submit a game')}</h2>
        <form class="form" id="submit" novalidate>
          <div class="pair">
            <label class="field" id="f-studio_name">${L('Studio o developer', 'Studio or developer')}<input name="studio_name" autocomplete="organization" value="${esc(user?.studio || '')}"><span class="err" role="alert"></span></label>
            <label class="field" id="f-email">${L('Email para sa contact', 'Contact email')}<input name="email" type="email" autocomplete="email" value="${esc(user?.email || '')}"><span class="err" role="alert"></span></label>
          </div>
          <label class="field" id="f-game_title">${L('Pamagat ng laro', 'Game title')}<input name="game_title" maxlength="80"><span class="err" role="alert"></span></label>
          <div class="pair">
            <label class="field" id="f-genre">Genre<select name="genre"><option value="">${L('Pumili', 'Choose one')}</option>${config.genres.map(x => `<option>${esc(x)}</option>`).join('')}</select><span class="err" role="alert"></span></label>
            <label class="field" id="f-collection">${L('Koleksyon', 'Collection')} <small>${L('Opsyonal', 'Optional')}</small><select name="collection"><option value="">${L('Wala sa mga ito', 'None of these')}</option>${config.collections.map(c => `<option value="${c.slug}">${esc(c.title)}</option>`).join('')}</select><span class="err" role="alert"></span></label>
          </div>
          <div class="pair">
            <label class="field" id="f-developer_type">${L('Uri ng developer', 'Developer type')}<select name="developer_type"><option value="">${L('Pumili', 'Choose one')}</option>${['student', 'indie', 'studio'].map(t => `<option value="${t}">${devTypeLabel(t)}</option>`).join('')}</select><span class="err" role="alert"></span></label>
            <label class="field" id="f-price">${L('Presyo sa piso', 'Price in pesos')}<input name="price" type="number" min="0" max="5000" step="1" value="199"><span class="err" role="alert"></span></label>
          </div>
          <fieldset class="field pick" id="f-platforms"><legend>${L('Plataporma', 'Platforms')}</legend>
            <div class="chips">${config.platforms.map(p => `<label class="chip"><input type="checkbox" name="platforms" value="${esc(p)}"${p === 'PC' ? ' checked' : ''}>${esc(p)}</label>`).join('')}</div><span class="err" role="alert"></span></fieldset>
          <label class="field" id="f-description">${L('Maikling pitch', 'Short pitch')} <small>${L('Hindi bababa sa 20 character', 'At least 20 characters')}</small><textarea name="description" rows="4" maxlength="2000" placeholder="${L('Tungkol saan ang laro, at anong bahagi ng buhay o kwentong Pilipino ang pinagmulan?', 'What is the game, and which part of Filipino life or story does it draw on?')}"></textarea><span class="err" role="alert"></span></label>
          <label class="field" id="f-build_url">${L('Link ng build o trailer', 'Playable build or trailer link')}<input name="build_url" type="url" maxlength="300" placeholder="https://"><span class="err" role="alert"></span></label>
          <button class="btn go" type="submit">${L('Ipadala para i-review', 'Send for review')}</button>
          <span class="err" id="form-err" role="alert"></span>
          <p id="ok" role="status"></p>
        </form></div>` : gate}
      <div style="display:grid;gap:1.5rem">
        <div class="box dark calc"><h2>${L('Magkano ang kikitain mo', 'What you earn')}</h2>
          <label class="field" for="cp">${L('Presyo', 'Price')}: <span id="cpv"></span></label>
          <input id="cp" type="range" min="49" max="999" step="10" value="299">
          <div class="meter" style="margin-top:1rem"><div class="lab">${L('Sa bawat kopya', 'Per copy you receive')}</div><div class="digits" id="cdev"></div></div>
          <p style="margin:1rem 0 0" id="c100"></p></div>
        <div class="box"><h2>${L('Paano ito gumagana', 'How it works')}</h2>
          <ol class="steps"><li>${L('Ipasa ang laro at maikling pitch.', 'Submit your game with a short pitch.')}</li><li>${L('Susuriin namin ang build at sasagot sa email.', 'We check the build and reply by email.')}</li><li>${L('Lalabas ang laro sa tindahan at makikita ang benta sa studio mo.', 'Your game goes in the store, and sales show up under your studio.')}</li></ol>
          <p class="split">${L('May tanong muna?', 'Questions first?')} <a href="#/contact?type=developer">${L('Kausapin kami', 'Contact us')}</a></p></div>
      </div></div></div>`,
    mount() {
      const calc = () => {
        const p = +$('#cp').value;
        $('#cpv').textContent = peso(p); $('#cdev').textContent = peso(Math.round(p * config.devShare * 100) / 100);
        $('#c100').textContent = L(`Kapag nakabenta ng 100 kopya, ${peso(Math.round(p * config.devShare * 10000) / 100)} ang makukuha mo.`, `Sell 100 copies and you receive ${peso(Math.round(p * config.devShare * 10000) / 100)}.`);
      };
      $('#cp').addEventListener('input', calc); calc();
      $('[data-gate=switch]')?.addEventListener('click', async () => { await signOut(); location.hash = '#/account?mode=signup&role=developer&next=/developers'; });
      $('#submit')?.addEventListener('submit', async e => {
        e.preventDefault();
        const f = e.target, btn = $('button[type=submit]', f);
        $$('.field', f).forEach(x => { x.classList.remove('bad'); $('.err', x).textContent = ''; }); $('#form-err').textContent = ''; $('#ok').textContent = '';
        btn.disabled = true; btn.textContent = L('Ipinapadala', 'Sending');
        const fd = new FormData(f), price = String(fd.get('price') ?? '').trim();
        const body = { studio_name: fd.get('studio_name'), email: fd.get('email'), game_title: fd.get('game_title'), genre: fd.get('genre'),
          developer_type: fd.get('developer_type'), collection: fd.get('collection') || null, platforms: fd.getAll('platforms'),
          price: price === '' ? null : Number(price), description: fd.get('description'), build_url: fd.get('build_url') };
        try {
          const r = await api('/api/submissions', { method: 'POST', body });
          if (!document.body.contains(f)) return;
          f.reset(); toast(L('Natanggap na', 'Submission received'));
          $('#ok').textContent = L(`Natanggap. Ang reference mo ay #${r.id}. Mag-eemail kami pagkatapos ng review.`, `Received. Your reference is #${r.id}. We will email you after review.`);
        } catch (err) {
          if (!document.body.contains(f)) return;
          const fld = err.field && $('#f-' + err.field);
          if (fld) { fld.classList.add('bad'); $('.err', fld).textContent = err.message; $('input,select,textarea', fld)?.focus(); } else $('#form-err').textContent = err.message;
        }
        btn.disabled = false; btn.textContent = L('Ipadala para i-review', 'Send for review');
      });
    },
  };
}

/* ---------- accounts: customers and developers ---------- */
function refreshAccountUi() {
  const a = $('#acct'); if (!a) return;
  a.textContent = user ? user.name.split(' ')[0] : L('Mag-sign in', 'Sign in');
  a.classList.toggle('in', !!user);
  a.setAttribute('aria-label', user ? L(`Account ni ${user.name}`, `Account: ${user.name}`) : L('Mag-sign in o gumawa ng account', 'Sign in or create an account'));
}
function clearToken() { token = null; try { localStorage.removeItem('teks.token'); sessionStorage.removeItem('teks.token'); } catch { /* ignore */ } }
function setSession(t, u, remember = true) {
  clearToken(); token = t; user = u;
  try { if (remember) localStorage.setItem('teks.token', JSON.stringify(t)); else sessionStorage.setItem('teks.token', t); } catch { /* storage blocked: stays signed in for this page only */ }
  refreshAccountUi();
}
async function signOut() {
  const t = token;
  try { if (t) await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: 'Bearer ' + t } }); } catch { /* offline: the token is still cleared here */ }
  clearToken(); user = null; owned = localOwned; refreshAccountUi();
}
function sessionEnded() {   // the server says our session is over (expired or signed out elsewhere)
  if (!token) return;
  clearToken();
  const had = !!user; user = null; owned = localOwned; refreshAccountUi();
  if (had) { toast(L('Natapos na ang session mo. Mag-sign in ulit.', 'Your session ended. Please sign in again.')); if (games.length) render(true); }
}
async function validateSession() {
  if (!token) return;
  try { user = await api('/api/auth/me'); refreshAccountUi(); } catch { /* a 401 is handled by sessionEnded */ }
}

function accountView(params) {
  if (user) return accountHome();
  const st = { mode: params.get('mode') === 'signup' ? 'signup' : 'login', role: params.get('role') === 'developer' ? 'developer' : 'customer', name: '', studio: '', email: '' };
  const next = /^\/(store|cart|collection|developers|contact|pinoy(\/[a-z0-9-]+)?|studio\/[a-z0-9-]+|game\/[a-z0-9-]+)$/.test(params.get('next') || '') ? params.get('next') : '';
  const tiles = [...games, ...games].map(g => `<div>${art(g)}</div>`).join('');
  const cardNo = s => { s = s.trim().toLowerCase(); if (!s) return '000'; let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 900; return String(h + 100); };
  const body = () => {
    const signup = st.mode === 'signup', dev = st.role === 'developer';
    const pill = (r, label) => `<button type="button" class="role" role="radio" aria-checked="${st.role === r}" data-role="${r}"><b>${label}</b></button>`;
    return `<section class="auth">
      <div class="auth-bg" aria-hidden="true"><div class="auth-bg-grid">${tiles}</div></div>
      <div class="auth-shell"><div class="auth-panel">
        <div class="auth-main">
          <h1>${signup ? L('Gumawa ng account', 'Create account') : L('Mag-sign in', 'Sign in')}</h1>
          <p class="auth-lead">${signup ? L('Sumali sa TEKS at simulan ang koleksyon mo.', 'Join TEKS and start your collection.') : L('Maligayang pagbabalik. Ituloy kung saan ka huminto.', 'Welcome back. Pick up where you left off.')}</p>
          <div class="role-block">
            <div class="role-pick" role="radiogroup" aria-label="${L('Ako ay', 'I am a')}">${pill('customer', 'Customer')}${pill('developer', 'Developer')}</div></div>
          <form id="auth-form" novalidate>
            ${signup ? `<label class="field" id="f-name">${L('Pangalan', 'Your name')}<input name="name" autocomplete="name" value="${esc(st.name)}"><span class="err" role="alert"></span></label>` : ''}
            ${signup && dev ? `<label class="field" id="f-studio">${L('Studio o developer', 'Studio or developer')}<input name="studio" autocomplete="organization" value="${esc(st.studio)}"><span class="err" role="alert"></span></label>` : ''}
            <label class="field" id="f-email">Email<input name="email" type="email" autocomplete="email" value="${esc(st.email)}"><span class="err" role="alert"></span></label>
            <div class="field" id="f-password"><label for="pw">Password</label>
              <div class="pw"><input id="pw" name="password" type="password" autocomplete="${signup ? 'new-password' : 'current-password'}"><button type="button" class="pw-toggle" aria-pressed="false">${L('Ipakita', 'Show')}</button></div>
              ${signup ? `<small>${L('Hindi bababa sa 8 character.', 'At least 8 characters.')}</small>` : ''}<span class="err" role="alert"></span></div>
            <div class="form-row">
              <label class="remember"><input type="checkbox" name="remember" checked> ${L('Tandaan ako', 'Remember me')}</label>
              <button type="button" class="help-link" data-help>${L('Kailangan ng tulong?', 'Need help?')}</button>
            </div>
            <button class="btn go" type="submit">${signup ? L('Gumawa ng account', 'Create account') : L('Mag-sign in', 'Sign in')}</button>
            <span class="err" id="form-err" role="alert"></span>
          </form>
          <div class="auth-or" aria-hidden="true"><span>${L('o', 'or')}</span></div>
          <div class="auth-alt">
            <button type="button" class="alt-btn" data-mode="${signup ? 'login' : 'signup'}">${signup ? L('May account na ako', 'I already have an account') : L('Gumawa ng account', 'Create an account')}</button>
            <button type="button" class="alt-btn quiet" data-guest>${L('Magpatuloy bilang bisita', 'Continue as guest')}</button>
          </div>
        </div>
        <aside class="auth-card-col">
          <button type="button" class="lang-btn auth-lang" id="lang2" aria-label="${lang === 'en' ? 'Language: English. Switch to Taglish.' : 'Wika: Taglish. Lipat sa English.'}">${lang === 'en' ? 'EN' : 'TL'}</button>
          <span class="logo static auth-logo"><span class="logo-img" role="img" aria-label="TEKS"></span></span>
          <div class="id-card ${dev ? 'dev' : 'cust'}" aria-hidden="true">
            <div class="id-art"><span class="id-no" id="id-no">No. 000</span><span class="id-avatar" id="id-avatar">?</span><span class="id-rar">${dev ? L('TAGAGAWA', 'CREATOR') : L('MANLALARO', 'PLAYER')}</span></div>
            <div class="id-info"><h3 id="id-name">${L('Pangalan mo', 'Your name')}</h3><p class="id-sub" id="id-sub">${dev ? L('Studio mo', 'Your studio') : 'Customer'}</p>
              <dl class="stats"><div><dt>${L('Uri', 'Role')}</dt><dd>${dev ? 'Dev' : 'Player'}</dd></div><div><dt>${L('Laro', 'Games')}</dt><dd>0</dd></div><div><dt>${L('Mula', 'Since')}</dt><dd>${new Date().getFullYear()}</dd></div></dl></div>
          </div>
          <p class="auth-card-note">${L('Napupunan ang card habang nagta-type ka. Bawat account ay may sariling numero ng serye.', 'Your card fills in as you type. Every account gets its own series number.')}</p>
        </aside>
      </div></div>
      <button type="button" class="scroll-cue" data-scroll-about>${L('Alamin ang TEKS', 'Learn about TEKS')} <span aria-hidden="true">↓</span></button>
    </section>`;
  };
  const mount = () => {
    const rootEl = $('#auth-root');
    const smooth = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    const grab = () => { const f = $('#auth-form'); if (!f) return; for (const k of ['name', 'studio', 'email']) if (f.elements[k]) st[k] = f.elements[k].value; };
    const updateCard = () => {
      const f = $('#auth-form'), v = k => (f.elements[k]?.value || '').trim();
      const name = v('name') || v('email').split('@')[0];
      $('#id-name').textContent = name || L('Pangalan mo', 'Your name');
      $('#id-avatar').textContent = (name[0] || '?').toUpperCase();
      $('#id-sub').textContent = st.role === 'developer' ? (v('studio') || L('Studio mo', 'Your studio')) : 'Customer';
      $('#id-no').textContent = 'No. ' + cardNo(v('email'));
    };
    const redraw = focusSel => { grab(); rootEl.innerHTML = body(); bind(); if (focusSel) $(focusSel)?.focus(); };
    const bind = () => {
      $$('[data-role]').forEach(b => b.addEventListener('click', () => { st.role = b.dataset.role; redraw(`[data-role="${st.role}"]`); }));
      $$('[data-mode]').forEach(b => b.addEventListener('click', () => { st.mode = b.dataset.mode; redraw('#auth-form input'); }));
      $$('#auth-root [data-guest]').forEach(b => b.addEventListener('click', () => { guestMode.set(); location.hash = next ? '#' + next : '#/'; }));
      $('[data-scroll-about]').addEventListener('click', () => $('#auth-about').scrollIntoView({ behavior: smooth(), block: 'start' }));
      $('[data-help]').addEventListener('click', () => {
        const d = $('#dlg');
        d.innerHTML = `<h2>${L('Hindi makapag-sign in?', 'Can\u2019t sign in?')}</h2><p>${L('Wala pang pag-reset ng password. Magpadala ng mensahe sa pahinang Kontak, gumawa ng bagong account gamit ang ibang email, o magpatuloy bilang bisita.', 'Password reset is not available yet. Send us a message from the Contact page, create a new account with another email, or continue as a guest.')}</p><form method="dialog"><button class="btn">${L('Sige', 'OK')}</button></form>`;
        d.showModal();
      });
      const tog = $('.pw-toggle');
      tog.addEventListener('click', () => { const i = $('#pw'), show = i.type === 'password'; i.type = show ? 'text' : 'password'; tog.setAttribute('aria-pressed', show); tog.textContent = show ? L('Itago', 'Hide') : L('Ipakita', 'Show'); });
      $('#auth-form').addEventListener('input', updateCard);
      $('#auth-form').addEventListener('submit', async e => {
        e.preventDefault();
        const f = e.target, btn = $('button[type=submit]', f), label = btn.textContent;
        $$('.field', f).forEach(x => { x.classList.remove('bad'); $('.err', x).textContent = ''; }); $('#form-err').textContent = '';
        btn.disabled = true; btn.textContent = L('Sandali lang', 'One moment');
        const v = k => f.elements[k]?.value ?? '';
        try {
          const r = await api('/api/auth/' + (st.mode === 'signup' ? 'signup' : 'login'), { method: 'POST', body: { role: st.role, remember: f.elements.remember.checked, name: v('name'), studio: v('studio'), email: v('email'), password: v('password') } });
          setSession(r.token, r.user, f.elements.remember.checked);
          await loadLibrary();
          toast(L(`Maligayang pagdating, ${r.user.name.split(' ')[0]}`, `Welcome, ${r.user.name.split(' ')[0]}`));
          location.hash = next ? '#' + next : r.user.role === 'developer' ? '#/developers' : '#/';
        } catch (err) {
          const fld = err.field && $('#f-' + err.field);
          if (fld) { fld.classList.add('bad'); $('.err', fld).textContent = err.message; $('input', fld)?.focus(); } else $('#form-err').textContent = err.message;
          btn.disabled = false; btn.textContent = label;
        }
      });
      $('#lang2').addEventListener('click', toggleLang);
      updateCard();
    };
    bind();
    // buttons inside the About section below
    $$('#auth-about [data-guest]').forEach(b => b.addEventListener('click', () => { guestMode.set(); location.hash = next ? '#' + next : '#/'; }));
    $$('#auth-about [data-scroll-top]').forEach(b => b.addEventListener('click', () => {
      st.mode = 'signup'; if (b.dataset.scrollTop) st.role = b.dataset.scrollTop;
      redraw(); window.scrollTo({ top: 0, behavior: smooth() }); setTimeout(() => $('#auth-form input')?.focus({ preventScroll: true }), 300);
    }));
  };
  return { title: L('Mag-sign in | TEKS', 'Sign in | TEKS'), html: `<div id="auth-root">${body()}</div><section id="auth-about" class="auth-about-wrap" aria-label="${L('Tungkol sa TEKS', 'About TEKS')}">${aboutView(true).html}</section>`, mount, auth: true };
}

function accountHome() {
  const dev = user.role === 'developer';
  const mine = dev ? games.filter(g => !g.tbc && g.studio.toLowerCase() === (user.studio || '').toLowerCase()) : [];
  const dl = mine.reduce((s, g) => s + (g.downloads || 0), 0);
  const card = dev ? `<div class="box"><h2>${esc(user.studio)}</h2>
      <p>${mine.length ? L(`${mine.length} laro sa tindahan, ${dl.toLocaleString('en-US')} na nabili sa demo checkout.`, `${mine.length} ${mine.length === 1 ? 'game' : 'games'} in the store, ${dl.toLocaleString('en-US')} copies from demo checkouts.`) : L('Wala pang laro sa tindahan sa ilalim ng pangalan ng studio mo.', 'No games in the store yet under your studio name.')}</p>
      ${mine.length ? `<ul class="list">${mine.map(g => `<li><a href="#/game/${g.id}">${esc(g.title)}</a> · ${(g.downloads || 0).toLocaleString('en-US')}</li>`).join('')}</ul>` : ''}
      <div class="actions"><a class="btn go" href="#/developers">${L('Ipasa ang laro', 'Submit a game')}</a></div></div>`
    : `<div class="box"><h2>${L('Koleksyon mo', 'Your collection')}</h2>
      <p>${L(`${owned.length} sa ${games.length} laro ang nasa koleksyon mo.`, `${owned.length} of ${games.length} games collected.`)}</p>
      <div class="actions"><a class="btn go" href="#/collection">${L('Buksan ang koleksyon', 'Open collection')}</a><a class="btn alt" href="#/store">${L('Tingnan ang tindahan', 'Browse the store')}</a></div></div>`;
  return {
    title: L('Account ko | TEKS', 'My account | TEKS'),
    html: `<section class="page-head"><div class="wrap"><span class="eyebrow">${dev ? 'Developer' : 'Customer'}</span><h1>${L('Kumusta', 'Hi')}, ${esc(user.name.split(' ')[0])}</h1><p>${esc(user.email)}</p></div></section>
      <div class="wrap section"><div class="two" style="align-items:start">${card}
        <div class="box"><h2>${L('Detalye ng account', 'Account details')}</h2>
          <dl class="acct-dl"><div><dt>${L('Pangalan', 'Name')}</dt><dd>${esc(user.name)}</dd></div><div><dt>Email</dt><dd>${esc(user.email)}</dd></div><div><dt>${L('Uri', 'Account type')}</dt><dd>${dev ? 'Developer' : 'Customer'}</dd></div>${dev ? `<div><dt>Studio</dt><dd>${esc(user.studio)}</dd></div>` : ''}</dl>
          <button class="btn alt" id="signout" type="button">${L('Mag-sign out', 'Sign out')}</button></div></div></div>`,
    mount() { $('#signout').addEventListener('click', async () => { await signOut(); toast(L('Naka-sign out ka na', 'You are signed out')); render(false); }); },
  };
}

function aboutView(embedded = false) {   // embedded: shown under the sign-in screen, so its buttons act on this page
  const pct = Math.round(config.devShare * 100);
  const fan = [...games].sort(byFeatured).slice(0, 3);
  const studios = {};
  for (const g of games) if (!g.tbc) (studios[g.studio] ||= []).push(g);
  const studioList = Object.entries(studios).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  const stat = (n, label) => `<div class="ab-stat"><b>${n}</b><span>${label}</span></div>`;
  const icon = d => `<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const faq = [
    [L('Totoong tindahan ba ito?', 'Is this a real store?'), `${DISCLAIMER()} ${L('Demo na presyo ang mga presyo, at walang bayad na kinukuha sa checkout.', 'Prices are demo prices, and checkout takes no payment.')}`],
    [L('Totoo ba ang mga laro?', 'Are these real games?'), L('Oo. Mga totoong laro ito ng mga Pilipinong developer. Ang studio, paglalarawan, at media ay mula sa kanilang opisyal na pahina. Para bilhin o laruin ang isang laro, pumunta sa "Opisyal na pahina" nito. Walang rating o bilang ng download dito dahil wala kaming totoong datos para sa mga ito.', 'Yes. They are real games by Filipino developers. Studios, descriptions and media come from their official pages. To buy or play a game, use its "Official page" link. We show no ratings or download counts, because we have no real data for them.')],
    [L('Kailangan ko ba ng account para mag-browse?', 'Do I need an account to browse?'), L('Hindi. Pwede kang magpatuloy bilang bisita. Kailangan lang ng account kung gusto mong mag-save ng detalye o magbenta ng laro.', 'No. You can continue as a guest. An account is only for saving your details or selling a game.')],
    [L('Magkano ang napupunta sa developer?', 'How much do developers keep?'), L(`${pct}% ng bawat benta. Ang natitira ay para sa pagpapatakbo ng tindahan.`, `${pct}% of every sale. The rest runs the store.`)],
    [L('Paano ako magbebenta ng laro?', 'How do I sell a game?'), L('Gumawa ng developer account, pagkatapos ay ipadala ang laro at maikling pitch sa pahinang Magbenta. Susuriin namin at sasagot sa email.', 'Create a developer account, then send your game and a short pitch from the Sell a game page. We review it and reply by email.')],
    [L('Ano ang teks?', 'What are teks?'), L('Maliliit na baraha na kinokolekta at nilalaro ng mga batang Pilipino. Dito, bawat larong bibilhin mo ay nagiging baraha sa koleksyon mo.', 'Small paper cards Filipino kids collect, trade and play with. Here, every game you buy becomes a card in your collection.')],
  ];
  return {
    title: L('Tungkol | TEKS', 'About | TEKS'),
    html: `
    <section class="ab-hero"><div class="wide-wrap ab-hero-grid">
      <div>
        <span class="eyebrow">${L('Tungkol sa TEKS', 'About TEKS')}</span>
        <${embedded ? 'h2' : 'h1'} class="ab-title">${L('Bawat larong Pinoy, nasa iisang shelf.', 'Every Filipino game, on one shelf.')}</${embedded ? 'h2' : 'h1'}>
        <p class="ab-lead">${L('Ang TEKS ay tindahan para sa mga larong gawa ng mga Pilipinong developer. Hanapin ang mga ito, bilhin, kolektahin, at laruin.', 'TEKS is a store for games made by Filipino developers. Find them, buy them, collect them, and play.')}</p>
        ${embedded ? `<div class="actions"><button type="button" class="btn go" data-guest>${L('Tingnan ang tindahan', 'Browse the store')}</button><button type="button" class="btn alt" data-scroll-top>${L('Gumawa ng account', 'Create an account')}</button></div>` : `<div class="actions"><a class="btn go" href="#/store">${L('Tingnan ang tindahan', 'Browse the store')}</a><a class="btn alt" href="#/developers">${L('Magbenta ng laro', 'Sell your game')}</a></div>`}
      </div>
      <div class="ab-fan" aria-hidden="true">${fan.map((g, i) => `<div class="ab-card c${i}">${cardFace(g, 'div')}</div>`).join('')}</div>
    </div></section>

    <section class="wide-wrap ab-stats" aria-label="${L('TEKS sa mga numero', 'TEKS in numbers')}">
      ${stat(games.length, L('Mga laro', 'Games'))}${stat(studioList.length, L('Mga studio', 'Studios'))}${stat(config.collections.length, 'Pinoy Collections')}${stat(pct + '%', L('Bahagi ng developer', 'Developer share'))}
    </section>

    <section class="section"><div class="wrap ab-story">
      <div class="ab-back" aria-hidden="true"><span class="ab-brand">T.E.K.S</span><small>Tech, Entertainment &amp; Kreative Stories</small></div>
      <div>
        <span class="eyebrow">${L('Ang kwento', 'The story')}</span>
        <h2>${L('Saan galing ang pangalan', 'Where the name comes from')}</h2>
        <p>${L('Ang teks ay maliliit na baraha na kinokolekta at nilalaro ng mga batang Pilipino. Pinagpapalit ito sa kaibigan, nilalaro sa kalye, at ipinagmamalaki. Ganoon din dito: bawat laro ay baraha na iyong kokolektahin, at pagkatapos ay lalaruin.', 'Teks are the small paper cards Filipino children collected and played with. Kids traded them with friends, played them on the street, and took pride in the cards they had gathered. Here, every game is a card you collect, then play.')}</p>
        <p>${L('Kalat ang mga larong lokal sa iba-ibang store at social page, nalulunod sa libo-libong bagong labas bawat taon. Tinitipon sila ng TEKS sa iisang tindahan, para madali silang mahanap.', 'Many local games sit across global stores and social media pages. Among thousands of international releases each year, they are easy to miss. TEKS gathers them in one store, so they are easy to find.')}</p>
      </div>
    </div></section>

    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="head"><div><span class="eyebrow">${L('Bakit TEKS', 'Why TEKS')}</span><h2>${L('Tatlong pangako', 'Three promises')}</h2></div></div>
      <div class="ab-pillars">
        <div class="ab-pillar">${icon('<path d="M3 7h18M3 12h18M3 17h18"/>')}<h3>${L('Iisang shelf', 'One shelf')}</h3><p>${L('Lahat ng larong gawang Pinoy ay nasa isang lugar, hindi na kailangang hanapin sa kung saan-saan.', 'Every Filipino-made game in one place, instead of scattered across stores and pages.')}</p></div>
        <div class="ab-pillar">${icon('<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 10c0-1.5 1.3-2 3-2s3 .7 3 2-1.3 1.8-3 2-3 .6-3 2 1.3 2 3 2 3-.5 3-2"/>')}<h3>${L('Patas na hatian', 'A fair split')}</h3><p>${L(`Bawat benta ay may ${pct}% para sa developer.`, `Every sale pays the developer ${pct}%.`)}</p></div>
        <div class="ab-pillar">${icon('<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 8h6M9 12h6"/>')}<h3>${L('Baraha sa bawat laro', 'A card for every game')}</h3><p>${L('Ang bawat larong bibilhin mo ay nagiging baraha sa koleksyon mo, parang teks noong bata ka.', 'Every game you buy becomes a card in your collection, like the teks you traded as a kid.')}</p></div>
      </div>
    </div></section>

    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="head"><div><span class="eyebrow">${L('Mga studio', 'Studios')}</span><h2>${L('Kilalanin ang mga studio', 'Meet the studios')}</h2><p>${L('Mga studio na may laro sa tindahan ngayon.', 'The studios with games in the store right now.')}</p></div></div>
      <p class="disclaimer">${DISCLAIMER()}</p>
      <div class="ab-studios">${studioList.map(([name, gs]) => `<div class="ab-studio"><h3>${!embedded && gs[0].studioSlug ? `<a href="#/studio/${gs[0].studioSlug}">${esc(name)}</a>` : esc(name)}</h3><p class="mono">${gs.length} ${L('laro', gs.length === 1 ? 'game' : 'games')}</p><ul>${gs.map(g => `<li>${embedded ? `<span class="gl"><i class="gdot" style="${routeStyle(g)}"></i>${esc(g.title)}</span>` : `<a href="#/game/${g.id}"><i class="gdot" style="${routeStyle(g)}"></i>${esc(g.title)}</a>`}</li>`).join('')}</ul></div>`).join('')}</div>
    </div></section>

    <section class="section" style="padding-top:0"><div class="wrap two">
      <div class="box"><span class="eyebrow">${L('Para sa players', 'For players')}</span><h2>${L('Paano ito gumagana', 'How it works')}</h2>
        <ol class="steps"><li>${L('Mag-browse ayon sa genre, koleksyon, o plataporma.', 'Browse by genre, collection or platform.')}</li><li>${L('Bilhin ang mga larong gusto mo. Bawat isa ay nagiging baraha.', 'Buy the games you want. Each one becomes a card.')}</li><li>${L('Buksan ang koleksyon mo at maglaro.', 'Open your collection and play.')}</li></ol>
        ${embedded ? `<button type="button" class="btn" data-guest>${L('Magsimulang mangolekta', 'Start collecting')}</button>` : `<a class="btn" href="#/store">${L('Magsimulang mangolekta', 'Start collecting')}</a>`}</div>
      <div class="box dark"><span class="eyebrow" style="color:var(--yellow)">${L('Para sa mga developer', 'For developers')}</span><h2>${L('Magbenta sa TEKS', 'Sell on TEKS')}</h2>
        <ol class="steps"><li>${L('Gumawa ng developer account.', 'Create a developer account.')}</li><li>${L('Ipadala ang laro at maikling pitch. Susuriin namin ito.', 'Send your game and a short pitch. We review it.')}</li><li>${L(`Kapag may bumili, ${pct}% ay sa iyo.`, `When players buy it, you keep ${pct}%.`)}</li></ol>
        ${embedded ? `<button type="button" class="btn yellow" data-scroll-top="developer">${L('Gumawa ng developer account', 'Create a developer account')}</button>` : `<a class="btn yellow" href="#/developers">${L('Ipasa ang laro', 'Submit a game')}</a>`}</div>
    </div></section>

    <section class="section" style="padding-top:0"><div class="wrap ab-faq">
      <div class="head"><div><span class="eyebrow">FAQ</span><h2>${L('Madalas itanong', 'Questions, answered')}</h2></div></div>
      ${faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}
    </div></section>

    <section class="band"><div class="wrap ab-cta">
      <div><h2>${L('Handa ka na bang maglaro?', 'Ready to start playing?')}</h2><p>${L('Sumali nang libre, o mag-browse muna bilang bisita.', 'Join for free, or browse as a guest first.')}</p></div>
      ${embedded ? `<div class="actions"><button type="button" class="btn go" data-scroll-top>${L('Gumawa ng account', 'Create an account')}</button><button type="button" class="btn ghost" data-guest>${L('Mag-browse muna', 'Just browse')}</button></div>` : `<div class="actions"><a class="btn go" href="#/account?mode=signup">${L('Gumawa ng account', 'Create an account')}</a><a class="btn ghost" href="#/store">${L('Mag-browse muna', 'Just browse')}</a></div>`}
    </div></section>`,
  };
}
/* ================= TEKS additions: Pinoy Collections, studios, contact, order page, admin =================
   Built from the design's own pieces (page-head, cats, cards, box, two, form, field, success, summary). */

/* Pinoy Collections tiles (home and #/pinoy) */
function collectionTiles() {
  return config.collections.map(c => {
    const gg = games.filter(g => g.collection === c.slug).sort(byFeatured);
    return gg.length ? `<a class="cat" style="${collStyle(c.slug)}" href="#/pinoy/${c.slug}"><div class="cat-art">${cover(gg[0])}</div><span class="cat-name">${esc(c.title)}</span><span class="n">${gg.length} ${L('laro', gg.length === 1 ? 'game' : 'games')}</span></a>` : '';
  }).join('');
}

function pinoyIndexView() {
  const meta = slug => collections.find(c => c.slug === slug) || {};
  const blocks = config.collections.map(c => {
    const gg = games.filter(g => g.collection === c.slug).sort(byFeatured);
    if (!gg.length) return '';
    return `<section class="section" style="padding-top:0"><div class="wrap" style="${collStyle(c.slug)}">
      <div class="head"><div><span class="eyebrow coll-eyebrow">${gg.length} ${L('laro', gg.length === 1 ? 'game' : 'games')}</span><h2>${esc(c.title)}</h2>${meta(c.slug).tagline ? `<p>${esc(meta(c.slug).tagline)}</p>` : ''}</div>
        <div class="head-r"><a class="btn alt small" href="#/pinoy/${c.slug}">${L('Buksan ang koleksyon', 'Open collection')}</a></div></div>
      <div class="cards">${gg.map(teks).join('')}</div>
    </div></section>`;
  }).join('');
  return {
    title: L('Pinoy Collections | TEKS', 'Pinoy Collections | TEKS'),
    html: `<section class="page-head"><div class="wrap"><span class="eyebrow">Pinoy Collections</span><h1>${L('Mga larong may kwentong Pinoy', 'Games with Filipino stories')}</h1>
        <p>${L('Bawat koleksyon ay isang hibla ng buhay Pilipino: mga nilalang ng alamat, laro sa kalye, kasaysayan, at araw-araw na buhay sa barrio.', 'Each collection follows one thread of Filipino life: creatures from folklore, games from the street, moments from history, and everyday life in the barrio.')}</p></div></section>
      <section class="section"><div class="wrap"><div class="cats four">${collectionTiles()}</div></div></section>
      ${blocks}`,
  };
}

function pinoyView(slug) {
  const c = config.collections.find(x => x.slug === slug);
  if (!c) return notFound();
  const m = collections.find(x => x.slug === slug) || {};
  const gg = games.filter(g => g.collection === slug).sort(byFeatured);
  const others = config.collections.filter(x => x.slug !== slug);
  return {
    title: `${c.title} | TEKS`,
    html: `<section class="page-head" style="${collStyle(slug)}"><div class="wrap"><span class="eyebrow coll-eyebrow">Pinoy Collection</span><h1>${esc(c.title)}</h1>${m.tagline ? `<p>${esc(m.tagline)}</p>` : ''}
        <div class="coll-jump">${others.map(o => `<a class="chip" href="#/pinoy/${o.slug}">${esc(o.title)}</a>`).join('')}<a class="chip" href="#/pinoy">${L('Lahat ng koleksyon', 'All collections')}</a></div></div></section>
      <div class="wrap">${m.description ? `<div class="prose"><p>${esc(m.description)}</p></div>` : ''}</div>
      <section class="section"${m.description ? ' style="padding-top:0"' : ''}><div class="wrap">
        <div class="head"><div><h2>${L(`${gg.length} laro sa koleksyong ito`, `${gg.length} ${gg.length === 1 ? 'game' : 'games'} in this collection`)}</h2></div><div class="head-r"><a class="btn alt small" href="#/store?theme=${encodeURIComponent(c.title)}">${L('Buksan sa tindahan', 'Filter in the store')}</a></div></div>
        ${gg.length ? `<div class="cards">${gg.map(teks).join('')}</div>` : `<div class="coll-empty"><p>${L('Wala pang laro dito.', 'No games here yet.')}</p></div>`}
      </div></section>`,
  };
}

function studioView(slug) {
  if (!SLUG.test(slug || '') || slug.startsWith('tbc-')) return notFound();
  const mine = games.filter(g => g.studioSlug === slug).sort(byFeatured);
  const name = mine[0]?.studio || '';
  const dl = mine.reduce((s, g) => s + g.downloads, 0);
  return {
    title: `${name || 'Studio'} | TEKS`,
    html: `<section class="page-head"><div class="wrap"><span class="eyebrow" id="st-type">${L('Developer', 'Developer')}</span><h1 id="st-name">${esc(name)}</h1><p id="st-loc"></p></div></section>
      <div class="wrap section"><div class="two" style="align-items:start">
        <div class="box" id="st-about"><h2>${L('Tungkol sa studio', 'About the studio')}</h2><p class="mono">${L('Kinukuha...', 'Loading...')}</p></div>
        <div class="box dark"><h2>${L('Sa TEKS', 'On TEKS')}</h2>
          <div class="meter"><div class="lab">${L('Nabili sa TEKS (demo)', 'Bought on TEKS (demo orders)')}</div><div class="digits">${fmtDl(dl)}</div></div>
          <p style="margin:1rem 0 0">${L(`${mine.length} laro sa TEKS · demo na presyo lang`, `${mine.length} ${mine.length === 1 ? 'game' : 'games'} on TEKS · demo prices only`)}</p>
          <p class="disclaimer" style="margin:.8rem 0 0">${DISCLAIMER()}</p></div>
      </div>
      ${mine.length ? `<div class="section" style="padding-bottom:0"><div class="head"><div><h2>${L(`Mga laro ng ${esc(name)}`, `Games by ${esc(name)}`)}</h2></div></div><div class="cards">${mine.map(teks).join('')}</div></div>` : ''}
      </div>`,
    mount() {
      const about = $('#st-about');
      api('/api/developers/' + slug).then(d => {
        if (!document.body.contains(about)) return;
        $('#st-name').textContent = d.name; document.title = `${d.name} | TEKS`;
        $('#st-type').textContent = devTypeLabel(d.type) || L('Developer', 'Developer');
        $('#st-loc').textContent = d.location || '';
        const links = [[safeUrl(d.website_url), L('Opisyal na pahina', 'Official page')], [safeUrl(d.facebook_url), 'Facebook']].filter(([u]) => u);
        about.innerHTML = `<h2>${L('Tungkol sa studio', 'About the studio')}</h2><p>${d.bio ? esc(d.bio) : L('Wala pang impormasyon.', 'No information yet.')}</p>
          ${links.length ? `<div class="actions">${links.map(([u, l]) => `<a class="btn alt small" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${l} <span aria-hidden="true">↗</span></a>`).join('')}</div>` : ''}`;
      }).catch(err => {
        if (!document.body.contains(about)) return;
        if (err.status === 404) return mountView(notFound());
        about.innerHTML = `<h2>${L('Tungkol sa studio', 'About the studio')}</h2><p class="err">${esc(err.message)}</p>`;
      });
    },
  };
}

const inquiries = () => [
  ['general', L('Pangkalahatang tanong', 'General question'), L('Tungkol sa tindahan, isang order, o account mo.', 'About the store, an order or your account.')],
  ['developer', L('Pagbebenta ng laro', 'Selling a game'), L('Bago o habang nagpapasa ka ng laro.', 'Before or while you submit a game.')],
  ['creator', L('Content creator at press', 'Creators and press'), L('Review, stream, o artikulo tungkol sa larong Pinoy.', 'Reviews, streams or articles about Filipino games.')],
  ['community', L('Komunidad at events', 'Community and events'), L('Game jam, meetup, o grupong gustong makipagtulungan.', 'Game jams, meetups or groups who want to work with us.')],
  ['school', L('Paaralan at guro', 'Schools and teachers'), L('Paggamit ng TEKS sa klase o sa school project.', 'Using TEKS in class or for a school project.')],
];
function contactView(params) {
  const list = inquiries();
  const type = list.some(([v]) => v === params.get('type')) ? params.get('type') : 'general';
  return {
    title: L('Kontak | TEKS', 'Contact | TEKS'),
    html: `<section class="page-head"><div class="wrap"><span class="eyebrow">${L('Kontak', 'Contact')}</span><h1>${L('Kausapin ang TEKS', 'Talk to TEKS')}</h1>
        <p>${L('May tanong, gustong makipag-partner, o may larong dapat naming makita? Sasagot kami sa email.', 'A question, a partnership, or a game we should know about? We reply by email.')}</p></div></section>
      <div class="wrap section"><div class="two" style="align-items:start">
        <div class="box"><h2>${L('Magpadala ng mensahe', 'Send a message')}</h2>
          <form class="form" id="contact-form" novalidate>
            <div class="pair">
              <label class="field" id="f-name">${L('Pangalan', 'Name')}<input name="name" autocomplete="name" maxlength="80" value="${esc(user?.name || '')}"><span class="err" role="alert"></span></label>
              <label class="field" id="f-email">Email<input name="email" type="email" autocomplete="email" maxlength="120" value="${esc(user?.email || '')}"><span class="err" role="alert"></span></label>
            </div>
            <label class="field" id="f-inquiry_type">${L('Tungkol saan ito?', 'What is it about?')}<select name="inquiry_type">${list.map(([v, l]) => `<option value="${v}"${v === type ? ' selected' : ''}>${l}</option>`).join('')}</select><span class="err" role="alert"></span></label>
            <label class="field" id="f-message">${L('Mensahe', 'Message')} <small>${L('Hindi bababa sa 10 character', 'At least 10 characters')}</small><textarea name="message" rows="6" maxlength="2000"></textarea><span class="err" role="alert"></span></label>
            <button class="btn go" type="submit">${L('Ipadala', 'Send message')}</button>
            <span class="err" id="form-err" role="alert"></span>
            <p id="ok" role="status"></p>
          </form></div>
        <div class="box dark"><h2>${L('Sino ang babasa nito', 'Who reads it')}</h2>
          <p>${L('Binabasa ng TEKS team ang bawat mensahe. Piliin ang tamang paksa para mapunta ito sa tamang tao.', 'The TEKS team reads every message. Pick the right topic so it reaches the right person.')}</p>
          <ul class="list">${list.map(([, l, d]) => `<li><b>${l}</b>: ${d}</li>`).join('')}</ul></div>
      </div></div>`,
    mount() {
      $('#contact-form').addEventListener('submit', async e => {
        e.preventDefault();
        const f = e.target, btn = $('button[type=submit]', f);
        $$('.field', f).forEach(x => { x.classList.remove('bad'); $('.err', x).textContent = ''; }); $('#form-err').textContent = ''; $('#ok').textContent = '';
        btn.disabled = true; btn.textContent = L('Ipinapadala', 'Sending');
        const fd = new FormData(f);
        try {
          const r = await api('/api/contact', { method: 'POST', body: { name: fd.get('name'), email: fd.get('email'), inquiry_type: fd.get('inquiry_type'), message: fd.get('message') } });
          if (!document.body.contains(f)) return;
          const to = fd.get('email');
          f.reset(); toast(L('Naipadala ang mensahe', 'Message sent'));
          $('#ok').textContent = L(`Naipadala. Reference #${r.id}. Sasagot kami sa ${to}.`, `Sent. Reference #${r.id}. We will reply to ${to}.`);
        } catch (err) {
          if (!document.body.contains(f)) return;
          const fld = err.field && $('#f-' + err.field);
          if (fld) { fld.classList.add('bad'); $('.err', fld).textContent = err.message; $('input,select,textarea', fld)?.focus(); } else $('#form-err').textContent = err.message;
        }
        btn.disabled = false; btn.textContent = L('Ipadala', 'Send message');
      });
    },
  };
}

/* order confirmation: #/order/{code}. The code is long and random, so the link itself is the key. */
function orderView(code) {
  if (!/^[A-Za-z0-9-]{4,40}$/.test(code || '')) return notFound();
  return {
    title: L('Order | TEKS', 'Order | TEKS'),
    html: `<div class="wrap" id="order-root"><div class="success"><span class="stamp">Order</span><p class="mono" style="margin-top:1rem">${L('Kinukuha ang order mo...', 'Loading your order...')}</p></div></div>`,
    mount() {
      const root = $('#order-root');
      api('/api/orders/' + encodeURIComponent(code)).then(o => {
        if (!document.body.contains(root)) return;
        document.title = `${L('Order', 'Order')} ${o.code} | TEKS`;
        root.innerHTML = orderHtml(o);
      }).catch(err => {
        if (!document.body.contains(root)) return;
        root.className = 'wrap section';
        root.innerHTML = `<div class="empty"><h1>${err.status === 404 ? L('Walang ganitong order', 'Order not found') : L('Hindi ma-load ang order', 'Could not load the order')}</h1>
          <p>${err.status === 404 ? L('Tingnan kung tama ang order code sa link.', 'Check that the order code in the link is right.') : esc(err.message)}</p><a class="btn go" href="#/store">${L('Tingnan ang tindahan', 'Browse the store')}</a></div>`;
      });
    },
  };
}
function orderHtml(o) {
  const items = Array.isArray(o.items) ? o.items : [];
  const n = items.length, first = esc(String(o.customer_name || '').split(' ')[0]);
  const line = it => {
    const g = byId(it.slug);
    return `<div class="line-item"${g ? ` style="${routeStyle(g)}"` : ''}>${g ? `<a class="thumb" href="#/game/${g.id}" aria-label="${esc(g.title)}">${cover(g)}</a>` : '<span class="thumb"></span>'}
      <div><h3>${esc(it.title)}</h3><p>${esc(it.studio)}</p></div><span class="amount">${peso(num(it.price))}</span></div>`;
  };
  const payouts = Array.isArray(o.payouts) ? o.payouts : [];
  return `<div class="success"><span class="stamp">${L('Tapos na', 'Order placed')}</span>
      <h1>${L('Order', 'Order')} ${esc(o.code)}</h1>
      <p>${L(`Salamat, ${first}! ${n} laro ang nasa koleksyon mo na. Kabuuan ${peso(num(o.total))}. Demo checkout ito, kaya walang bayad na kinuha.`, `Thank you, ${first}! ${n} ${n === 1 ? 'game is' : 'games are'} now in your collection. Total ${peso(num(o.total))}. This is a demo checkout, so no payment was taken.`)}</p>
      <p class="mono">${esc(PAYMENTS[o.payment_method] || '')} · ${esc(fmtWhen(o.created_at))} · ${L('resibo para kay', 'receipt for')} ${esc(o.email)}</p>
      <div class="actions"><a class="btn go" href="#/collection">${L('Buksan ang koleksyon ko', 'Open my collection')}</a><a class="btn alt" href="#/store">${L('Mag-browse pa', 'Keep browsing')}</a></div>
      <p class="split" style="margin-top:1.2rem">${L('I-save ang link ng pahinang ito: ang order code lang ang paraan para mabuksan ito ulit.', 'Save the link to this page: the order code is the only way to open it again.')}</p></div>
    <div class="cart order-cart"><div>${items.map(line).join('')}</div>
      <aside class="summary" aria-label="${L('Resibo', 'Receipt')}"><h2>${L('Resibo', 'Receipt')}</h2>
        <div class="row"><span>${L('Subtotal', 'Subtotal')}</span><span>${peso(num(o.subtotal))}</span></div>
        ${num(o.discount) ? `<div class="row"><span>${L('Promo', 'Promo')} ${esc(o.promo_code || '')}</span><span>−${peso(num(o.discount))}</span></div>` : ''}
        <div class="row total"><span>${L('Kabuuan', 'Total')}</span><span>${peso(num(o.total))}</span></div>
        <p class="sub">${L(`Para sa developer (${num(o.developer_share_percent)}%)`, `To developers (${num(o.developer_share_percent)}%)`)}</p>
        ${payouts.map(p => `<div class="row"><span>${esc(p.studio)}</span><span>${peso(num(p.amount))}</span></div>`).join('')}
      </aside></div>`;
}

/* admin: not linked anywhere. The key lives in this tab only (sessionStorage) and goes out as X-Admin-Key. */
let adminKeyMem = '', adminError = '';
const adminKey = {
  get() { try { return sessionStorage.getItem('teks.adminKey') || adminKeyMem; } catch { return adminKeyMem; } },
  set(v) { adminKeyMem = v; try { sessionStorage.setItem('teks.adminKey', v); } catch { /* memory only */ } },
  clear() { adminKeyMem = ''; try { sessionStorage.removeItem('teks.adminKey'); } catch { /* ignore */ } },
};
function adminView() {
  const key = adminKey.get();
  const head = `<section class="page-head"><div class="wrap"><span class="eyebrow">Admin</span><h1>${L('Dashboard ng TEKS', 'TEKS dashboard')}</h1>
    <p>${L('Para sa TEKS team lang. Nasa tab na ito lang ang key at nawawala kapag isinara mo ito.', 'For the TEKS team only. The key stays in this tab and is forgotten when you close it.')}</p></div></section>`;
  if (!key) return {
    title: 'Admin | TEKS',
    html: `${head}<div class="wrap section"><div class="box admin-gate"><h2>${L('Ilagay ang admin key', 'Enter the admin key')}</h2>
      <form class="form" id="admin-form" novalidate><div class="field${adminError ? ' bad' : ''}" id="f-key"><label for="admin-key">Admin key</label>
        <input id="admin-key" type="password" autocomplete="off"><span class="err" role="alert">${esc(adminError)}</span></div>
        <button class="btn go" type="submit">${L('Buksan ang dashboard', 'Open dashboard')}</button></form></div></div>`,
    mount() {
      $('#admin-key').focus();
      $('#admin-form').addEventListener('submit', e => {
        e.preventDefault();
        const v = $('#admin-key').value.trim();
        if (!v) { adminError = L('Ilagay ang key.', 'Enter the key.'); return render(false); }
        adminKey.set(v); adminError = ''; render(false);
      });
    },
  };
  return {
    title: 'Admin | TEKS',
    html: `${head}<div class="wrap section" id="admin-root"><p class="mono">${L('Kinukuha...', 'Loading...')}</p></div>`,
    mount() {
      const root = $('#admin-root');
      const get = kind => api('/api/admin/' + kind, { headers: { 'X-Admin-Key': key } });
      Promise.all(['orders', 'submissions', 'messages', 'users'].map(get)).then(([orders, subs, msgs, users]) => {
        if (!document.body.contains(root)) return;
        root.innerHTML = adminHtml(orders, subs, msgs, users);
        $('#admin-lock').addEventListener('click', () => { adminKey.clear(); render(false); });
      }).catch(err => {
        if (!document.body.contains(root)) return;
        if (err.status === 401) { adminKey.clear(); adminError = L('Mali ang admin key.', 'That admin key is not right.'); return render(false); }
        root.innerHTML = `<div class="empty"><h2>${L('Hindi ma-load ang dashboard', 'Could not load the dashboard')}</h2><p>${esc(err.message)}</p></div>`;
      });
    },
  };
}
function adminHtml(orders, subs, msgs, users) {
  const stat = (n, label) => `<div class="ab-stat"><b>${esc(n)}</b><span>${label}</span></div>`;
  const none = t => `<p class="mono admin-none">${t}</p>`;
  const sales = orders.reduce((s, o) => s + num(o.total), 0);
  const inq = Object.fromEntries(inquiries().map(([v, l]) => [v, l]));
  const orderRow = o => `<li><div class="al-top"><b class="mono">${esc(o.code)}</b><span class="amount">${peso(num(o.total))}</span></div>
    <p>${esc(o.customer_name)} · ${esc(o.email)} · ${esc(o.mobile)}</p>
    <p class="mono">${esc(PAYMENTS[o.payment_method] || o.payment_method)}${o.promo_code ? ` · ${esc(o.promo_code)}` : ''} · ${o.user_id ? L('may account', 'account') : L('bisita', 'guest')} · ${esc(fmtWhen(o.created_at))}</p></li>`;
  const subRow = s => `<li><div class="al-top"><b>${esc(s.game_title)}</b><span class="tag">${esc(s.status)}</span></div>
    <p>${esc(s.studio_name)} (${esc(devTypeLabel(s.developer_type) || s.developer_type)}) · ${esc(s.contact_name)} · ${esc(s.email)}</p>
    <p class="mono">${esc(s.genre)}${s.collection ? ` · ${esc(collTitle(s.collection) || s.collection)}` : ''} · ${esc(strs(s.platforms).join(', '))}${s.price != null ? ` · ${peso(num(s.price))}` : ''} · ${esc(fmtWhen(s.created_at))}</p>
    ${safeUrl(s.build_url) ? `<p><a href="${esc(safeUrl(s.build_url))}" target="_blank" rel="noopener noreferrer">${esc(s.build_url)}</a></p>` : ''}
    <p class="pre">${esc(s.description)}</p></li>`;
  const msgRow = m => `<li><div class="al-top"><b>${esc(m.name)}</b><span class="tag">${esc(inq[m.inquiry_type] || m.inquiry_type)}</span></div>
    <p class="mono">${esc(m.email)} · ${esc(fmtWhen(m.created_at))}</p><p class="pre">${esc(m.message)}</p></li>`;
  return `<div class="ab-stats admin-stats">${stat(orders.length, L('Order', 'Orders'))}${stat(peso(sales), L('Kabuuang benta', 'Sales total'))}${stat(subs.length, L('Pinasang laro', 'Submissions'))}${stat(msgs.length, L('Mensahe', 'Messages'))}</div>
    <p class="mono admin-users">${L(`${num(users.total)} account: ${num(users.customers)} customer, ${num(users.developers)} developer`, `${num(users.total)} accounts: ${num(users.customers)} customers, ${num(users.developers)} developers`)} · <button class="linkish" type="button" id="admin-lock">${L('I-lock ang dashboard', 'Lock dashboard')}</button></p>
    <div class="admin-grid">
      <div class="box"><h2>${L('Mga order', 'Orders')}</h2>${orders.length ? `<ul class="admin-list">${orders.map(orderRow).join('')}</ul>` : none(L('Wala pang order.', 'No orders yet.'))}</div>
      <div class="box"><h2>${L('Mga pinasang laro', 'Submissions')}</h2>${subs.length ? `<ul class="admin-list">${subs.map(subRow).join('')}</ul>` : none(L('Wala pang pinasang laro.', 'No submissions yet.'))}</div>
      <div class="box"><h2>${L('Mga mensahe', 'Messages')}</h2>${msgs.length ? `<ul class="admin-list">${msgs.map(msgRow).join('')}</ul>` : none(L('Wala pang mensahe.', 'No messages yet.'))}</div>
    </div>`;
}

const notFound = () => ({ title: L('Hindi nahanap | TEKS', 'Not found | TEKS'), html: `<div class="wrap section"><div class="empty"><h1>${L('Walang ganitong pahina', 'Page not found')}</h1><p>${L('Wala ang pahinang iyon. Bumalik sa tindahan.', 'That page does not exist. Head back to the store.')}</p><a class="btn go" href="#/store">${L('Tingnan ang tindahan', 'Browse the store')}</a></div></div>` });

/* ---------- router ---------- */
function mountView(v, keepScroll) {
  const dlg = $('#dlg'); if (dlg.open) dlg.close();
  document.title = v.title;
  document.body.classList.toggle('auth-mode', !!v.auth);
  app.innerHTML = v.html;
  v.mount?.();
  if (!keepScroll) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
}
function render(keepScroll = true) {
  const [path, qs] = (location.hash.slice(1) || '/').split('?');
  const params = new URLSearchParams(qs || '');
  const seg = path.split('/').filter(Boolean);
  const page = seg[0] || 'home';
  if (page === 'home' && !user && !guestMode.get()) { location.replace('#/account'); return; }
  const navOf = { game: 'store', pinoy: 'store', studio: 'store', order: 'cart' };
  $$('[data-nav]').forEach(a => a.getAttribute('data-nav') === (navOf[page] || page) ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  const views = { home, store: () => storeView(params), game: () => gameView(seg[1]), cart: () => cartView(), collection: collectionView, developers: developersView, about: aboutView, account: () => accountView(params),
    pinoy: () => (seg[1] ? pinoyView(seg[1]) : pinoyIndexView()), studio: () => studioView(seg[1]), contact: () => contactView(params), order: () => orderView(seg[1]), admin: adminView };
  mountView((views[page] || notFound)(), keepScroll);
}
let ready = false;   // set once the catalog has loaded; the first render then uses whatever hash is current
window.addEventListener('hashchange', () => { if (ready) render(false); });
document.addEventListener('keydown', e => {
  if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)) return;
  const q = $('#q'); if (q && $('.store-side')) { e.preventDefault(); q.focus(); }
});
document.addEventListener('click', e => {
  const b = e.target.closest('.flipbtn'); if (!b) return;
  const on = b.closest('.tk').classList.toggle('flipped');
  b.setAttribute('aria-pressed', on); b.setAttribute('aria-label', (on ? L('Tihaya', 'Flip back') : L('Taob', 'Flip')) + ' ' + b.dataset.title);
});
/* a cover or hero image that fails to load is replaced by the game's procedural card art (art.js);
   a screenshot that fails to load is hidden from the gallery */
document.addEventListener('error', e => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement)) return;
  if (img.closest('.shot')) { img.closest('li').hidden = true; return; }
  const g = img.dataset.art && byId(img.dataset.art); if (!g) return;
  const t = document.createElement('template'); t.innerHTML = art(g); img.replaceWith(t.content);
}, true);
const toggleLang = () => { lang = lang === 'en' ? 'tl' : 'en'; store.set('teks.lang', lang); applyLang(); updateCount(); if (games.length) render(true); };
$('#lang').addEventListener('click', toggleLang);
// keep the session honest: re-check when the tab comes back, every 5 minutes, and when another tab signs in or out
document.addEventListener('visibilitychange', () => { if (!document.hidden) validateSession(); });
setInterval(validateSession, 5 * 60 * 1000);
window.addEventListener('storage', e => {
  if (e.key !== 'teks.token') return;
  const t = readToken();
  if (!t && token) { token = null; user = null; owned = localOwned; refreshAccountUi(); if (games.length) render(true); }
  else if (t && t !== token) { token = t; validateSession().then(loadLibrary).then(() => games.length && render(true)); }
});

(async function init() {
  applyLang();
  try {
    const [g, c, cols] = await Promise.all([api('/api/games'), api('/api/config'), api('/api/collections').catch(() => [])]);
    config = normalizeConfig(c);
    games = (Array.isArray(g) ? g : []).map(normalizeGame).filter(Boolean);
    collections = Array.isArray(cols) ? cols : [];
    cart = cart.filter(id => byId(id));
    if (token) { try { user = await api('/api/auth/me'); } catch { clearToken(); } }
    await loadLibrary();
    refreshAccountUi(); updateCount(); ready = true; render(false);
  } catch (e) {
    app.innerHTML = `<div class="wrap section"><div class="empty"><h1>${L('Hindi ma-load ang tindahan', 'Could not load the store')}</h1><p>${esc(e.message)}</p><button class="btn go" type="button" id="retry">${L('Subukan ulit', 'Try again')}</button></div></div>`;
    $('#retry').addEventListener('click', () => location.reload());
  }
})();
