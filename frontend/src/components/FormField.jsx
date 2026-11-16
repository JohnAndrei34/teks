// Wraps one labelled input. Pass the same `id` to the input, plus aria-invalid / aria-describedby={`${id}-msg`}.
export default function Field({ id, label, error, hint, children }) {
  return (
    <div className={`field${error ? ' bad' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      <p id={`${id}-msg`} className={error ? 'err' : 'hint'} style={error || hint ? undefined : { display: 'none' }}>
        {error || hint}
      </p>
    </div>
  )
}
