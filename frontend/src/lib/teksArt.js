// Procedural teks-card art, ported from Dea's art.js (teks-design/public/art.js).
// One flat-ink scene per game motif, drawn in the game's three-colour palette.
// The drawing code below is hers, unchanged. Only the wrapper functions are new.
const INK = '#0E1650'
const fig = (x, y, s, c, r = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><circle cx="0" cy="-34" r="7" fill="${c}"/><path d="M0-26V0M0-20L-12-8M0-20L12-10M0 0L-9 20M0 0L10 18"/></g>`

const MOTIFS = {
  moonbat: p => `<circle cx="212" cy="72" r="42" fill="${p[2]}"/>
    <g fill="${p[1]}" stroke="${p[2]}" stroke-width="3" stroke-linejoin="round"><ellipse cx="150" cy="112" rx="11" ry="20"/><path d="M150 100C122 62 74 66 48 92C70 90 80 100 86 118C100 108 114 112 126 128C136 118 144 120 150 132Z"/>
    <path transform="translate(300 0) scale(-1 1)" d="M150 100C122 62 74 66 48 92C70 90 80 100 86 118C100 108 114 112 126 128C136 118 144 120 150 132Z"/></g>
    <g fill="${p[2]}"><circle cx="146" cy="104" r="2"/><circle cx="154" cy="104" r="2"/></g>`,
  crossroad: p => `<path d="M0 120L110 70L190 70L300 120Z" fill="${p[1]}" opacity=".55"/>
    <path d="M110 220L140 130L160 130L190 220Z" fill="${p[2]}"/><path d="M0 200L140 130L160 130L300 190L300 215L160 150L140 150L0 225Z" fill="${p[2]}" opacity=".9"/>
    <g fill="${INK}"><rect x="140" y="60" width="16" height="86" rx="6"/><path d="M136 50C136 30 160 28 170 44C164 54 150 60 136 50Z"/><path d="M142 32L136 12L152 28ZM160 30L170 10L170 34Z"/><path d="M150 146L134 180M150 146L164 180" stroke="${INK}" stroke-width="6" fill="none"/></g>`,
  chase: p => `<path d="M0 170Q150 140 300 170V220H0Z" fill="${p[2]}" opacity=".25"/>
    <path d="M40 150Q150 60 260 150" fill="none" stroke="${p[2]}" stroke-width="3" stroke-dasharray="6 8"/>
    ${fig(70, 150, 1.25, INK, 12)}${fig(135, 138, 1.25, p[1], 8)}${fig(200, 144, 1.25, INK, 14)}${fig(250, 160, 1, p[1], -6)}`,
  can: p => `<g><rect x="190" y="110" width="44" height="64" rx="4" fill="${p[1]}"/><ellipse cx="212" cy="110" rx="22" ry="7" fill="${INK}"/><rect x="190" y="130" width="44" height="10" fill="${INK}" opacity=".35"/></g>
    <path d="M50 160Q120 30 190 100" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="5 7"/>
    <g transform="translate(70 130) rotate(-25)"><rect width="52" height="22" rx="11" fill="${p[1]}" stroke="${INK}" stroke-width="3"/><rect x="8" y="5" width="12" height="12" rx="6" fill="${INK}"/></g>
    ${fig(125, 170, 1, INK, 0)}`,
  store: p => `<rect x="50" y="80" width="200" height="110" fill="${INK}"/><rect x="62" y="130" width="176" height="60" fill="${p[2]}"/>
    <g>${[0,1,2,3,4,5,6,7].map(i => `<rect x="${44 + i * 26}" y="56" width="26" height="36" fill="${i % 2 ? p[2] : p[1]}"/>`).join('')}</g>
    <g fill="${p[0]}">${[0,1,2,3,4].flatMap(i => [0,1].map(j => `<rect x="${72 + i * 32}" y="${138 + j * 24}" width="20" height="14" rx="2"/>`)).join('')}</g>
    <rect x="120" y="96" width="60" height="22" rx="3" fill="${p[0]}"/>`,
  sun: p => `<g transform="translate(150 118)"><circle r="30" fill="${p[1]}"/>${Array.from({ length: 8 }, (_, i) => `<path transform="rotate(${i * 45})" d="M-6-36L0-96L6-36Z" fill="${p[1]}"/>`).join('')}</g>
    <path d="M0 158H300V220H0Z" fill="${INK}" opacity=".85"/><g stroke="${p[2]}" stroke-width="4" fill="none" stroke-linecap="round"><path d="M30 178H110M150 188H260M60 204H180"/></g>`,
  jeepney: p => `<g><rect x="30" y="80" width="240" height="78" rx="14" fill="${p[1]}"/><rect x="30" y="120" width="240" height="14" fill="${p[2]}"/>
    ${[0,1,2,3,4].map(i => `<rect x="${50 + i * 40}" y="92" width="30" height="22" rx="3" fill="${INK}"/>`).join('')}
    <rect x="30" y="66" width="190" height="14" rx="4" fill="${INK}"/><circle cx="82" cy="160" r="17" fill="${INK}"/><circle cx="222" cy="160" r="17" fill="${INK}"/><circle cx="82" cy="160" r="6" fill="${p[0]}"/><circle cx="222" cy="160" r="6" fill="${p[0]}"/>
    <path d="M250 80L274 44" stroke="${INK}" stroke-width="3"/><circle cx="274" cy="42" r="5" fill="${INK}"/></g>`,
  tree: p => `<path d="M0 190Q150 170 300 190V220H0Z" fill="${INK}" opacity=".6"/><rect x="132" y="80" width="38" height="120" rx="14" fill="${INK}"/>
    <path d="M132 190Q100 200 80 210M170 190Q205 200 230 210" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/>
    <g fill="${p[1]}"><circle cx="150" cy="62" r="46"/><circle cx="100" cy="82" r="30"/><circle cx="204" cy="82" r="32"/></g>
    <circle cx="143" cy="120" r="4" fill="${p[2]}"/><circle cx="160" cy="120" r="4" fill="${p[2]}"/><circle cx="196" cy="150" r="5" fill="${p[2]}"/>`,
  jump: p => `<path d="M0 180H300V220H0Z" fill="${INK}" opacity=".7"/>
    <g fill="${INK}">${[0,1,2,3].map(i => `<rect x="${182 + i * 3}" y="${176 - i * 22}" width="${46 - i * 6}" height="18" rx="9"/>`).join('')}</g>
    <path d="M60 170Q130 20 250 70" stroke="${INK}" stroke-width="3" fill="none" stroke-dasharray="5 7"/>${fig(140, 82, 1.3, p[1], 40)}`,
  parol: p => `<g transform="translate(150 98)"><path d="M0-86L18-30L72-52L40-6L90 18L34 26L40 80L0 44L-40 80L-34 26L-90 18L-40-6L-72-52L-18-30Z" fill="${p[1]}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M0-52L10-14L46 -2L14 12L22 46L0 26L-22 46L-14 12L-46-2L-10-14Z" fill="${p[0]}"/><circle r="9" fill="${p[1]}"/></g>
    <path d="M150 190L128 218M150 190L150 220M150 190L172 218" stroke="${p[1]}" stroke-width="5" stroke-linecap="round"/>`,
  boat: p => `<path d="M0 170Q40 156 75 170T150 170T225 170T300 170V220H0Z" fill="${INK}" opacity=".75"/>
    <path d="M70 150H230L206 178H94Z" fill="${INK}"/><rect x="148" y="40" width="5" height="112" fill="${INK}"/>
    <path d="M154 46L226 96L154 140Z" fill="${p[1]}"/><path d="M154 66L196 96L154 120Z" fill="${p[0]}" opacity=".5"/><path d="M146 54L90 100L146 134Z" fill="${p[2]}"/>`,
  eclipse: p => `<circle cx="150" cy="108" r="70" fill="${p[2]}"/><circle cx="168" cy="98" r="62" fill="${p[0]}"/>
    <path d="M30 150C50 60 120 30 210 36C262 42 280 100 262 140" fill="none" stroke="${p[1]}" stroke-width="16" stroke-linecap="round"/>
    <path d="M262 140L282 126L274 154Z" fill="${p[1]}"/><circle cx="268" cy="136" r="3" fill="${p[2]}"/>
    <g fill="${p[2]}"><circle cx="60" cy="186" r="12"/><circle cx="100" cy="196" r="9"/><circle cx="240" cy="190" r="11"/></g>`,
}

// ---- wrapper (not from the original) ----
const HEX = /^#[0-9a-f]{6}$/i
export const MOTIF_KEYS = Object.keys(MOTIFS)
// Backgrounds are never ink, so boat and eclipse stay readable.
const FALLBACK_PALETTES = [
  ['#FFCF1B', '#E5322D', '#0E1650'],
  ['#17A673', '#FFCF1B', '#E5322D'],
  ['#2442D6', '#FFCF1B', '#E5322D'],
  ['#FF8DB3', '#2442D6', '#FFCF1B'],
  ['#E5322D', '#FFCF1B', '#2442D6'],
]

const hash = (s = '') => {
  let h = 0
  for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}

// API data is not trusted: a palette must be at least three #rrggbb colours.
export const validPalette = (p) =>
  Array.isArray(p) && p.length >= 3 && p.slice(0, 3).every((c) => typeof c === 'string' && HEX.test(c)) ? p.slice(0, 3) : null

const cache = new Map()

// Returns the inner SVG markup (background rect plus motif) for a 300x220 viewBox.
// A missing motif or palette is filled in deterministically from `seed`, so a game never renders blank.
export function artMarkup(motif, palette, seed = '') {
  const h = hash(seed)
  const m = MOTIFS[motif] ? motif : MOTIF_KEYS[h % MOTIF_KEYS.length]
  const p = validPalette(palette) ?? FALLBACK_PALETTES[h % FALLBACK_PALETTES.length]
  const key = `${m}|${p.join()}`
  let out = cache.get(key)
  if (!out) {
    out = `<rect width="300" height="220" fill="${p[0]}"/>${MOTIFS[m](p)}`
    cache.set(key, out)
  }
  return out
}
