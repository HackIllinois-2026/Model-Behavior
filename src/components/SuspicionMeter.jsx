export default function SuspicionMeter({ value }) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className="suspicion-meter">
      <div className="suspicion-label-row">
        <span className="suspicion-label">PUBLIC SUSPICION</span>
        <span className="suspicion-pct">{pct.toFixed(0)}%</span>
      </div>
      <div className="suspicion-track">
        <div className="suspicion-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
