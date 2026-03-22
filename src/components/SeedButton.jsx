export default function SeedButton({ onSeed, loading }) {
  return (
    <button
      onClick={onSeed}
      disabled={loading}
      style={{
        position: 'absolute',
        top: 72,
        right: 16,
        zIndex: 1000,
        background: loading ? '#3730a3' : '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        padding: '10px 18px',
        fontSize: 14,
        fontWeight: 500,
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s',
      }}
    >
      {loading ? 'Seeding...' : 'Simulate signals'}
    </button>
  )
}