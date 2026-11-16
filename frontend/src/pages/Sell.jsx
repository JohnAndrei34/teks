import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createSubmission, getConfig, pesoExact } from '../lib/api.js'
import { COLLECTION_LINKS, DEVELOPER_TYPES, GENRES, PLATFORMS, SELL } from '../lib/content.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import Field from '../components/FormField.jsx'
import { fieldProps } from '../lib/formStyles.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY = {
  studio_name: '', contact_name: '', email: '', developer_type: '', game_title: '',
  genre: '', collection: '', platforms: [], build_url: '', description: '',
}

function validate(f) {
  const e = {}
  if (!f.studio_name.trim()) e.studio_name = 'Enter your team or studio name.'
  if (!f.contact_name.trim()) e.contact_name = 'Enter a contact name.'
  if (!EMAIL.test(f.email.trim())) e.email = 'Enter a valid email address.'
  if (!f.developer_type) e.developer_type = 'Choose what kind of developer you are.'
  if (!f.game_title.trim()) e.game_title = 'Enter your game title.'
  if (!f.genre) e.genre = 'Choose a genre.'
  if (!f.platforms.length) e.platforms = 'Choose at least one platform.'
  if (!/^https?:\/\/\S+$/i.test(f.build_url.trim())) e.build_url = 'Enter a link starting with http:// or https://'
  if (f.description.trim().length < 20) e.description = 'Tell us a bit more (at least 20 characters).'
  return e
}

// Client-side only: the share comes from GET /api/config.
function EarningsCalculator({ share }) {
  const [price, setPrice] = useState(299)
  const per = Math.round(price * share) / 100
  return (
    <div className="box dark calc">
      <h2>What you earn</h2>
      <div className="field">
        <label htmlFor="cp" style={{ color: '#fff' }}>Price: <span>{pesoExact(price)}</span></label>
        <input id="cp" type="range" min="49" max="999" step="10" value={price} onChange={(e) => setPrice(+e.target.value)} />
      </div>
      <p style={{ margin: '1rem 0 .2rem' }}>Per copy you receive</p>
      <div className="big" aria-live="polite">{pesoExact(per)}</div>
      <p style={{ margin: '1rem 0 0' }}>Sell 100 copies and you receive {pesoExact(Math.round(price * share * 100) / 100)}.</p>
    </div>
  )
}

export default function Sell() {
  useDocumentTitle('Sell on TEKS')
  const config = useQuery({ queryKey: ['config'], queryFn: getConfig })
  const share = config.data?.developer_share_percent
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const mutation = useMutation({ mutationFn: createSubmission })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const togglePlatform = (p) =>
    setForm((f) => ({ ...f, platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p] }))

  const onSubmit = (e) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus()
      return
    }
    mutation.mutate({
      ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])),
      collection: form.collection || null,
    })
  }

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>{SELL.title}</h1>
          <p>{SELL.subtitle}</p>
        </div>
      </section>

      <div className="wrap section">
        <div className="two" style={{ alignItems: 'start' }}>
          <div className="box" id="submit">
            <h2>Submit a game</h2>
            {mutation.isSuccess ? (
              <div role="status">
                <h3>Submission received!</h3>
                <p>Salamat! We&apos;ll review your build and email you at {form.email.trim()}.</p>
                <button type="button" className="btn" onClick={() => { setForm(EMPTY); mutation.reset() }}>
                  Submit another game
                </button>
              </div>
            ) : (
              <form className="form" onSubmit={onSubmit} noValidate>
                <div className="pair">
                  <Field id="studio_name" label="Team / studio name" error={errors.studio_name}>
                    <input {...fieldProps('studio_name', errors)} value={form.studio_name} onChange={set('studio_name')} autoComplete="organization" />
                  </Field>
                  <Field id="contact_name" label="Contact person" error={errors.contact_name}>
                    <input {...fieldProps('contact_name', errors)} value={form.contact_name} onChange={set('contact_name')} autoComplete="name" />
                  </Field>
                </div>
                <div className="pair">
                  <Field id="email" label="Email" error={errors.email}>
                    <input {...fieldProps('email', errors)} type="email" value={form.email} onChange={set('email')} autoComplete="email" />
                  </Field>
                  <Field id="developer_type" label="Developer type" error={errors.developer_type}>
                    <select {...fieldProps('developer_type', errors)} value={form.developer_type} onChange={set('developer_type')}>
                      <option value="">Choose one</option>
                      {Object.entries(DEVELOPER_TYPES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </Field>
                </div>
                <Field id="game_title" label="Game title" error={errors.game_title}>
                  <input {...fieldProps('game_title', errors)} value={form.game_title} onChange={set('game_title')} />
                </Field>
                <div className="pair">
                  <Field id="genre" label="Genre" error={errors.genre}>
                    <select {...fieldProps('genre', errors)} value={form.genre} onChange={set('genre')}>
                      <option value="">Choose one</option>
                      {GENRES.map((g) => <option key={g}>{g}</option>)}
                    </select>
                  </Field>
                  <Field id="collection" label="Collection (optional)">
                    <select {...fieldProps('collection', errors)} value={form.collection} onChange={set('collection')}>
                      <option value="">None</option>
                      {COLLECTION_LINKS.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
                    </select>
                  </Field>
                </div>
                <fieldset className={`field${errors.platforms ? ' bad' : ''}`} aria-describedby="platforms-msg">
                  <legend>Platforms</legend>
                  <div className="checks" id="platforms" tabIndex={-1}>
                    {PLATFORMS.map((p) => (
                      <label key={p}>
                        <input type="checkbox" checked={form.platforms.includes(p)} onChange={() => togglePlatform(p)} />
                        {p}
                      </label>
                    ))}
                  </div>
                  <p id="platforms-msg" className="err">{errors.platforms}</p>
                </fieldset>
                <Field id="build_url" label="Playable build or trailer link" error={errors.build_url} hint="A link to a playable build or a download (Google Drive, itch.io, etc.).">
                  <input {...fieldProps('build_url', errors)} type="url" value={form.build_url} onChange={set('build_url')} placeholder="https://" />
                </Field>
                <Field id="description" label="Short pitch" error={errors.description}>
                  <textarea {...fieldProps('description', errors)} rows={4} value={form.description} onChange={set('description')} placeholder="What is the game, and which part of Filipino life or story does it draw on?" />
                </Field>
                {mutation.isError && <p role="alert" className="err">{mutation.error.message}</p>}
                <button type="submit" className="btn red" disabled={mutation.isPending} style={{ justifySelf: 'start' }}>
                  {mutation.isPending ? 'Sending' : 'Send for review'}
                </button>
              </form>
            )}
          </div>

          <div className="stack-gap">
            {share != null && <EarningsCalculator share={share} />}
            <div className="box">
              <h2>How it works</h2>
              <ol className="steps">
                {SELL.steps.map((s) => (
                  <li key={s.title}><span><strong>{s.title}.</strong> {s.body}</span></li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="benefits-h">
        <div className="wrap">
          <div className="head"><h2 id="benefits-h">Why sell on TEKS</h2></div>
          <ul className="panels" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {SELL.benefits(share).map((b) => (
              <li key={b.title} className="box">
                <h3>{b.title}</h3>
                <p style={{ margin: 0 }}>{b.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="faq-h">
        <div className="wrap">
          <div className="head"><h2 id="faq-h">FAQ</h2></div>
          <div className="faq">
            {SELL.faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
