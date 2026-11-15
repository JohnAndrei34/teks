// Wraps one labelled input. Pass the same `id` to the input, plus aria-invalid / aria-describedby={`${id}-msg`}.
export default function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      {children}
      <p id={`${id}-msg`} className={`mt-1 text-sm ${error ? 'text-teks-primary-soft' : 'text-teks-muted'}`}>
        {error || hint}
      </p>
    </div>
  )
}
