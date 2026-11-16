import { Link } from 'react-router-dom'
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
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">{BRAND.full}</p>
          <h1>Why TEKS</h1>
        </div>
      </section>
      <div className="wrap prose">
        <p>{TEKS_STORY}</p>

        <div className="two" style={{ marginTop: '1rem' }}>
          <section className="box" aria-labelledby="mission-h">
            <h2 id="mission-h">Mission</h2>
            <p style={{ fontSize: '1rem' }}>{MISSION}</p>
          </section>
          <section className="box dark" aria-labelledby="vision-h">
            <h2 id="vision-h">Vision</h2>
            <p style={{ fontSize: '1rem' }}>{VISION}</p>
          </section>
        </div>

        <h2>Objectives</h2>
        <ol className="steps">
          {OBJECTIVES.map((o) => <li key={o}><span>{o}</span></li>)}
        </ol>

        <h2>Who TEKS is for</h2>
        <ul className="panels" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {AUDIENCES.map((a) => (
            <li key={a.title} className="box">
              <h3>{a.title}</h3>
              <p style={{ fontSize: '1rem', margin: 0 }}>{a.body}</p>
            </li>
          ))}
        </ul>

        <h2>The team</h2>
        <ul className="team">
          {TEAM.map((m) => (
            <li key={m.name}>
              <span className="avatar" aria-hidden="true">{initials(m.name)}</span>
              <div>
                <p><strong>{m.name}</strong></p>
                <p className="role">{m.role}</p>
              </div>
            </li>
          ))}
        </ul>
        <p style={{ fontSize: '1rem', color: 'var(--muted)' }}>Design by Andrea Salvanera (Dea).</p>

        <div className="actions">
          <Link className="btn" to="/store">Browse the store</Link>
          <Link className="btn alt" to="/sell">Sell your game</Link>
        </div>
      </div>
    </>
  )
}
