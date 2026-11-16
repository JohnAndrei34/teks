// Inputs inside <Field> are styled by .field in teks.css; `input` class is for bare inputs.
export const inputClass = ''
export const bareInput = 'input'

export const fieldProps = (id, errors) => ({
  id,
  'aria-invalid': errors[id] ? 'true' : undefined,
  'aria-describedby': `${id}-msg`,
})
