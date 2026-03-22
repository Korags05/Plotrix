import { CITIES } from '../config/cities'

export default function StatsBar({ stats, activeCity }) {
  return (
    <div style={{
      position: 'absolute', bottom: 80, right: 20,
      zIndex: 1000,
      background: '#1a1d27ee',
      border: '1px solid #ffffff18',
      borderRadius: 12,
      padding: '14px 18px',
      textAlign: 'right',
      minWidth: 140
    }}>
      <div style={{ fontSize: 28, fontWeight: 600, color: '#fff' }}>
        {stats.totalCells}
      </div>
      <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
        active cells · {CITIES[activeCity]?.name}
      </div>
      {stats.lastUpdated && (
        <div style={{ fontSize: 11, color: '#444', marginTop: 6 }}>
          updated {stats.lastUpdated}
        </div>
      )}
    </div>
  )
}