import { Link } from 'react-router-dom'

export default function SectionHeader({ title, subtitle, to, linkLabel = 'See all', as: Tag = 'h2' }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
      <div>
        <Tag className="font-display text-2xl font-extrabold sm:text-3xl">{title}</Tag>
        {subtitle && <p className="mt-1 text-teks-muted">{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="text-sm font-semibold text-teks-gold hover:underline">
          {linkLabel} →
        </Link>
      )}
    </div>
  )
}
