import { Link } from 'react-router-dom'

export default function SectionHeader({ title, subtitle, to, linkLabel = 'See all', as: Tag = 'h2' }) {
  return (
    <div className="head">
      <div>
        <Tag>{title}</Tag>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="btn alt small">
          {linkLabel}
        </Link>
      )}
    </div>
  )
}
