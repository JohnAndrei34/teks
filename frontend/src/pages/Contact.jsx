import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createContact } from '../lib/api.js'
import { CONTACT, INQUIRY_TYPES, SOCIALS } from '../lib/content.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import Field from '../components/FormField.jsx'
import { fieldProps } from '../lib/formStyles.js'

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
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Contact us</h1>
          <p>Questions, partnerships, review keys or event ideas? Tell us what you need.</p>
        </div>
      </section>
      <div className="wrap section">
        <div className="two" style={{ alignItems: 'start' }}>
          <div className="box">
            {mutation.isSuccess ? (
              <div role="status">
                <h2>Message sent!</h2>
                <p>Salamat! We&apos;ll get back to you soon.</p>
                <button type="button" className="btn" onClick={() => { setForm(EMPTY); mutation.reset() }}>Send another message</button>
              </div>
            ) : (
              <form className="form" onSubmit={onSubmit} noValidate>
                <Field id="inquiry_type" label="What is this about?">
                  <select {...fieldProps('inquiry_type', errors)} value={form.inquiry_type} onChange={set('inquiry_type')}>
                    {INQUIRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </Field>
                <div className="pair">
                  <Field id="name" label="Name" error={errors.name}>
                    <input {...fieldProps('name', errors)} value={form.name} onChange={set('name')} autoComplete="name" />
                  </Field>
                  <Field id="email" label="Email" error={errors.email}>
                    <input {...fieldProps('email', errors)} type="email" value={form.email} onChange={set('email')} autoComplete="email" />
                  </Field>
                </div>
                <Field id="message" label="Message" error={errors.message}>
                  <textarea {...fieldProps('message', errors)} rows={6} value={form.message} onChange={set('message')} />
                </Field>
                {mutation.isError && <p role="alert" className="err">{mutation.error.message}</p>}
                <button type="submit" className="btn red" disabled={mutation.isPending} style={{ justifySelf: 'start' }}>
                  {mutation.isPending ? 'Sending' : 'Send message'}
                </button>
              </form>
            )}
          </div>
          <aside className="box dark" aria-label="Other ways to reach us">
            <h2 style={{ fontSize: '1.5rem' }}>Other ways to reach us</h2>
            <p style={{ overflowWrap: 'anywhere' }}>{CONTACT.email}</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '.4rem' }}>
              {SOCIALS.map((s) => (
                <li key={s.label}><a href={s.href}>{s.label}</a></li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </>
  )
}
