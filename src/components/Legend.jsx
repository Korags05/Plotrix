const items = [
  { color: '#ef4444', label: 'Very high  (8+)' },
  { color: '#f97316', label: 'High  (5–8)' },
  { color: '#eab308', label: 'Medium  (2–5)' },
  { color: '#22c55e', label: 'Low  (0–2)' },
]

export default function Legend() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 32,
      left: 20,
      zIndex: 1000,
      background: '#1a1d27ee',
      border: '1px solid #ffffff18',
      borderRadius: 12,
      padding: '14px 16px',
      minWidth: 180,
    }}>
      <p style={{ fontSize: 11, color: '#666', marginBottom: 10, letterSpacing: '0.05em' }}>
        DEMAND INTENSITY
      </p>
      {items.map(item => (
        <div key={item.color} style={{
          display: 'flex', alignItems: 'center',
          gap: 8, marginBottom: 6, fontSize: 13
        }}>
          <div style={{
            width: 14, height: 14,
            borderRadius: 3,
            background: item.color,
            flexShrink: 0
          }} />
          {item.label}
        </div>
      ))}
    </div>
  )
}