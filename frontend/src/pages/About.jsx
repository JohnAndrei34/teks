import { AUDIENCES, BRAND, MISSION, OBJECTIVES, TEAM, TEKS_STORY, VISION } from '../lib/content.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'

const initials = (name) =>
  name
    .replace(/\(.*\)/, '')
    .trim()
    .split(/\s+/)
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

export default function About() {
  useDocumentTitle('About')
  return (
    <div className="mx-auto max-w-5xl space-y-14 px-4 py-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-teks-gold">{BRAND.full}</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">About TEKS</h1>
        <p className="mt-4 max-w-3xl text-lg text-teks-muted">{TEKS_STORY}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2" aria-label="Mission and vision">
        <div className="rounded-2xl border border-teks-border bg-teks-surface p-6">
          <h2 className="font-display text-xl font-extrabold text-teks-gold">Mission</h2>
          <p className="mt-2 text-teks-muted">{MISSION}</p>
        </div>
        <div className="rounded-2xl border border-teks-border bg-teks-surface p-6">
          <h2 className="font-display text-xl font-extrabold text-teks-gold">Vision</h2>
          <p className="mt-2 text-teks-muted">{VISION}</p>
        </div>
      </section>

      <section aria-labelledby="obj-h">
        <h2 id="obj-h" className="mb-4 font-display text-2xl font-extrabold sm:text-3xl">Objectives</h2>
        <ol className="space-y-2">
          {OBJECTIVES.map((o, i) => (
            <li key={o} className="flex gap-3 rounded-xl border border-teks-border bg-teks-surface p-4">
              <span aria-hidden="true" className="font-display font-extrabold text-teks-gold">#{i + 1}</span>
              <span>{o}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="who-h">
        <h2 id="who-h" className="mb-4 font-display text-2xl font-extrabold sm:text-3xl">Who TEKS is for</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((a) => (
            <li key={a.title} className="rounded-2xl border border-teks-border bg-teks-surface p-5 transition hover:-translate-y-1 hover:border-teks-gold">
              <h3 className="font-display font-extrabold">{a.title}</h3>
              <p className="mt-1 text-sm text-teks-muted">{a.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="team-h">
        <h2 id="team-h" className="mb-4 font-display text-2xl font-extrabold sm:text-3xl">The team</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m) => (
            <li key={m.name} className="flex items-center gap-4 rounded-2xl border border-teks-border bg-teks-surface p-4">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teks-primary to-teks-gold font-display text-lg font-extrabold text-white"
              >
                {initials(m.name)}
              </span>
              <div>
                <p className="font-semibold">{m.name}</p>
                <p className="text-sm text-teks-muted">{m.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
