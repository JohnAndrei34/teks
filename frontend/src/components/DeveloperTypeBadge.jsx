import { DEVELOPER_TYPES } from '../lib/content.js'

const STYLES = {
  student: 'border-teks-teal/60 text-teks-teal',
  indie: 'border-teks-gold/60 text-teks-gold',
  studio: 'border-teks-primary-soft/60 text-teks-primary-soft',
}

export default function DeveloperTypeBadge({ type }) {
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${STYLES[type] ?? 'border-teks-border text-teks-muted'}`}
    >
      {DEVELOPER_TYPES[type] ?? type}
    </span>
  )
}
