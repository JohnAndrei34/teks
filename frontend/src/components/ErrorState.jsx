export default function ErrorState({ message = 'Something went wrong while loading this.', onRetry }) {
  return (
    <div role="alert" className="empty bad">
      <h2>Something went wrong</h2>
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn red">
          Try again
        </button>
      )}
    </div>
  )
}
