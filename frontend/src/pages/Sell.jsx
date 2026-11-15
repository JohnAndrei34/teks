import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createSubmission, getConfig } from '../lib/api.js'
import { COLLECTION_LINKS, DEVELOPER_TYPES, GENRES, PLATFORMS, SELL } from '../lib/content.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import Field from '../components/FormField.jsx'
import { fieldProps, inputClass } from '../lib/formStyles.js'

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
      <section className="sun-rays border-b border-teks-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">{SELL.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-teks-muted">{SELL.subtitle}</p>
          <a href="#submit" className="mt-6 inline-block rounded-lg bg-teks-primary px-6 py-3 font-semibold text-white hover:bg-teks-primary-soft">
            Submit your game
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12">
        <section aria-labelledby="benefits-h">
          <h2 id="benefits-h" className="mb-5 font-display text-2xl font-extrabold sm:text-3xl">Why sell on TEKS</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SELL.benefits(share).map((b) => (
              <li key={b.title} className="rounded-2xl border border-teks-border bg-teks-surface p-5">
                <h3 className="font-display font-extrabold text-teks-gold">{b.title}</h3>
                <p className="mt-1 text-sm text-teks-muted">{b.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how-h">
          <h2 id="how-h" className="mb-5 font-display text-2xl font-extrabold sm:text-3xl">How it works</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {SELL.steps.map((s, i) => (
              <li key={s.title} className="flex gap-4 rounded-2xl border border-teks-border bg-teks-surface p-5">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teks-gold font-display font-extrabold text-teks-bg">{i + 1}</span>
                <div>
                  <h3 className="font-display font-extrabold">{s.title}</h3>
                  <p className="text-sm text-teks-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="submit" aria-labelledby="submit-h" className="max-w-2xl scroll-mt-24">
          <h2 id="submit-h" className="mb-5 font-display text-2xl font-extrabold sm:text-3xl">Submit your game</h2>
          {mutation.isSuccess ? (
            <div role="status" className="rounded-2xl border border-teks-teal bg-teks-teal/10 p-6">
              <h3 className="font-display text-xl font-extrabold text-teks-teal">Submission received!</h3>
              <p className="mt-2 text-teks-muted">Salamat! We&apos;ll review your build and email you at {form.email.trim()}.</p>
              <button
                type="button"
                onClick={() => { setForm(EMPTY); mutation.reset() }}
                className="mt-4 rounded-lg border border-teks-teal px-4 py-2 font-semibold text-teks-teal"
              >
                Submit another game
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="studio_name" label="Team / studio name" error={errors.studio_name}>
                  <input {...fieldProps('studio_name', errors)} value={form.studio_name} onChange={set('studio_name')} className={inputClass} />
                </Field>
                <Field id="contact_name" label="Contact person" error={errors.contact_name}>
                  <input {...fieldProps('contact_name', errors)} value={form.contact_name} onChange={set('contact_name')} autoComplete="name" className={inputClass} />
                </Field>
                <Field id="email" label="Email" error={errors.email}>
                  <input {...fieldProps('email', errors)} type="email" value={form.email} onChange={set('email')} autoComplete="email" className={inputClass} />
                </Field>
                <Field id="developer_type" label="Developer type" error={errors.developer_type}>
                  <select {...fieldProps('developer_type', errors)} value={form.developer_type} onChange={set('developer_type')} className={inputClass}>
                    <option value="">Choose…</option>
                    {Object.entries(DEVELOPER_TYPES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </Field>
                <Field id="game_title" label="Game title" error={errors.game_title}>
                  <input {...fieldProps('game_title', errors)} value={form.game_title} onChange={set('game_title')} className={inputClass} />
                </Field>
                <Field id="genre" label="Genre" error={errors.genre}>
                  <select {...fieldProps('genre', errors)} value={form.genre} onChange={set('genre')} className={inputClass}>
                    <option value="">Choose…</option>
                    {GENRES.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </Field>
              </div>
              <Field id="collection" label="Pinoy Collection (optional)" hint="Pick one if your game fits.">
                <select {...fieldProps('collection', errors)} value={form.collection} onChange={set('collection')} className={inputClass}>
                  <option value="">None</option>
                  {COLLECTION_LINKS.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
                </select>
              </Field>
              <fieldset aria-describedby="platforms-msg">
                <legend className="mb-1 text-sm font-semibold">Platforms</legend>
                <div id="platforms" tabIndex={-1} className="flex gap-5">
                  {PLATFORMS.map((p) => (
                    <label key={p} className="flex items-center gap-2">
                      <input type="checkbox" checked={form.platforms.includes(p)} onChange={() => togglePlatform(p)} className="h-5 w-5 accent-teks-gold" />
                      {p}
                    </label>
                  ))}
                </div>
                <p id="platforms-msg" className="mt-1 text-sm text-teks-primary-soft">{errors.platforms}</p>
              </fieldset>
              <Field id="build_url" label="Build link" error={errors.build_url} hint="A link to a playable build or a download (Google Drive, itch.io, etc.).">
                <input {...fieldProps('build_url', errors)} type="url" value={form.build_url} onChange={set('build_url')} placeholder="https://" className={inputClass} />
              </Field>
              <Field id="description" label="About your game" error={errors.description}>
                <textarea {...fieldProps('description', errors)} rows={5} value={form.description} onChange={set('description')} className={inputClass} />
              </Field>
              {mutation.isError && (
                <p role="alert" className="rounded-lg border border-teks-primary bg-teks-primary/10 px-4 py-3 text-teks-primary-soft">{mutation.error.message}</p>
              )}
              <button type="submit" disabled={mutation.isPending} className="rounded-lg bg-teks-primary px-6 py-3 font-semibold text-white hover:bg-teks-primary-soft disabled:opacity-70">
                {mutation.isPending ? 'Sending…' : 'Submit game'}
              </button>
            </form>
          )}
        </section>

        <section aria-labelledby="faq-h" className="max-w-3xl">
          <h2 id="faq-h" className="mb-5 font-display text-2xl font-extrabold sm:text-3xl">FAQ</h2>
          <div className="space-y-2">
            {SELL.faq.map((f) => (
              <details key={f.q} className="group rounded-xl border border-teks-border bg-teks-surface p-4">
                <summary className="cursor-pointer font-semibold marker:text-teks-gold">{f.q}</summary>
                <p className="mt-2 text-teks-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
