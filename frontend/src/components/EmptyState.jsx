export default function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {action}
    </div>
  )
}
