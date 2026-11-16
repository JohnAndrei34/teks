import { DEVELOPER_TYPES } from '../lib/content.js'

export default function DeveloperTypeBadge({ type }) {
  return <span className={`tag ${type}`}>{DEVELOPER_TYPES[type] ?? type}</span>
}
