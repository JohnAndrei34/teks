export const inputClass =
  'w-full rounded-lg border border-teks-border bg-teks-surface px-3 py-2.5 placeholder:text-teks-muted aria-[invalid=true]:border-teks-primary'

export const fieldProps = (id, errors) => ({
  id,
  'aria-invalid': errors[id] ? 'true' : undefined,
  'aria-describedby': `${id}-msg`,
})
