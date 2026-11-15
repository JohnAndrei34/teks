import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createContact } from '../lib/api.js'
import { CONTACT, INQUIRY_TYPES, SOCIALS } from '../lib/content.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import Field from '../components/FormField.jsx'
import { fieldProps, inputClass } from '../lib/formStyles.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY = { inquiry_type: 'general', name: '', email: '', message: '' }

export default function Contact() {
  useDocumentTitle('Contact')
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const mutation = useMutation({ mutationFn: createContact })
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Enter your name.'
    if (!EMAIL.test(form.email.trim())) errs.email = 'Enter a valid email address.'
    if (!form.message.trim()) errs.message = 'Write a message.'
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus()
      return
    }
    mutation.mutate({ ...form, name: form.name.trim(), email: form.email.trim(), message: form.message.trim() })
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 md:grid-cols-[1fr_16rem]">
      <div>
        <h1 className="font-display text-4xl font-extrabold">Contact us</h1>
        <p className="mt-2 text-teks-muted">Questions, partnerships, review keys or event ideas? Tell us what you need.</p>

        {mutation.isSuccess ? (
          <div role="status" className="mt-6 rounded-2xl border border-teks-teal bg-teks-teal/10 p-6">
            <h2 className="font-display text-xl font-extrabold text-teks-teal">Message sent!</h2>
            <p className="mt-2 text-teks-muted">Salamat! We&apos;ll get back to you soon.</p>
            <button type="button" onClick={() => { setForm(EMPTY); mutation.reset() }} className="mt-4 rounded-lg border border-teks-teal px-4 py-2 font-semibold text-teks-teal">
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
            <Field id="inquiry_type" label="What is this about?">
              <select {...fieldProps('inquiry_type', errors)} value={form.inquiry_type} onChange={set('inquiry_type')} className={inputClass}>
                {INQUIRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field id="name" label="Name" error={errors.name}>
              <input {...fieldProps('name', errors)} value={form.name} onChange={set('name')} autoComplete="name" className={inputClass} />
            </Field>
            <Field id="email" label="Email" error={errors.email}>
              <input {...fieldProps('email', errors)} type="email" value={form.email} onChange={set('email')} autoComplete="email" className={inputClass} />
            </Field>
            <Field id="message" label="Message" error={errors.message}>
              <textarea {...fieldProps('message', errors)} rows={6} value={form.message} onChange={set('message')} className={inputClass} />
            </Field>
            {mutation.isError && (
              <p role="alert" className="rounded-lg border border-teks-primary bg-teks-primary/10 px-4 py-3 text-teks-primary-soft">{mutation.error.message}</p>
            )}
            <button type="submit" disabled={mutation.isPending} className="rounded-lg bg-teks-primary px-6 py-3 font-semibold text-white hover:bg-teks-primary-soft disabled:opacity-70">
              {mutation.isPending ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </div>

      <aside className="h-fit rounded-2xl border border-teks-border bg-teks-surface p-5" aria-label="Other ways to reach us">
        <h2 className="font-display font-extrabold text-teks-gold">Other ways to reach us</h2>
        <p className="mt-3 break-words text-sm">{CONTACT.email}</p>
        <ul className="mt-3 space-y-1 text-sm">
          {SOCIALS.map((s) => (
            <li key={s.label}><a href={s.href} className="text-teks-muted hover:text-teks-text hover:underline">{s.label}</a></li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
