import { CITIES } from '../config/cities'

export default function CitySelector({ activeCity, onChange }) {
  return (
    <div style={{
      position: 'absolute',
      top: 64,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      display: 'flex',
      gap: 6,
      background: '#1a1d27ee',
      border: '1px solid #ffffff18',
      borderRadius: 12,
      padding: '6px',
    }}>
      {Object.entries(CITIES).map(([key, city]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            background: activeCity === key ? '#4f46e5' : 'transparent',
            color: activeCity === key ? '#fff' : '#888',
            border: 'none',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: activeCity === key ? 500 : 400,
            cursor: 'pointer',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap'
          }}
        >
          {city.name}
        </button>
      ))}
    </div>
  )
}