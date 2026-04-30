export default function Toast({ show, message, isApp = false }) {
  return (
    <div className={`toast${show ? ' show' : ''}`} role="alert" style={isApp ? undefined : undefined}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <span>{message}</span>
    </div>
  )
}
