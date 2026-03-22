import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Map from './components/Map'
import Legend from './components/Legend'
import StatsBar from './components/StatsBar'
import CitySelector from './components/CitySelector'
import ApiDocs from './components/ApiDocs'
import { CITIES } from './config/cities'

const API = import.meta.env.VITE_API_URL

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const cityFromUrl = searchParams.get('city')
  const [activeCity, setActiveCity] = useState(
    cityFromUrl && CITIES[cityFromUrl] ? cityFromUrl : 'delhi'
  )
  const [geojson, setGeojson] = useState(null)
  const [stats, setStats]     = useState({ totalCells: 0, lastUpdated: null })
  const [loading, setLoading] = useState(false)
  const [showDocs, setShowDocs] = useState(false)

  const fetchHeatmap = useCallback(async (city) => {
    try {
      const res = await axios.get(`${API}/api/v1/heatmap?city=${city}`)
      setGeojson(res.data)
      setStats({ totalCells: res.data.totalCells, lastUpdated: new Date().toLocaleTimeString() })
    } catch (e) {
      console.error('Failed to fetch heatmap', e)
    }
  }, [])

  const handleCityChange = (city) => {
    setActiveCity(city)
    setGeojson(null)
    setSearchParams({ city })
    fetchHeatmap(city)
  }

  const seedSignals = async () => {
    setLoading(true)
    const { lat, lng } = CITIES[activeCity]
    const requests = Array.from({ length: 80 }, () => {
      return axios.post(`${API}/api/v1/signals`, {
        latitude:  lat + (Math.random() - 0.5) * 0.15,
        longitude: lng + (Math.random() - 0.5) * 0.15,
        propertyType: 'apartment',
        city: activeCity
      })
    })
    await Promise.all(requests)
    await fetchHeatmap(activeCity)
    setLoading(false)
  }

  useEffect(() => {
    fetchHeatmap(activeCity)
    const interval = setInterval(() => fetchHeatmap(activeCity), 15000)
    return () => clearInterval(interval)
  }, [activeCity, fetchHeatmap])

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'linear-gradient(to bottom, #0f1117f5, #0f111700)',
        pointerEvents: 'none'
      }}>
        <div>
          <h1 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.3px' }}>Plotrix</h1>
          <p style={{ fontSize: 11, color: '#666', marginTop: 1 }}>
            Real-time property demand · H3 hexagonal indexing
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, pointerEvents: 'all' }}>
          <button onClick={() => setShowDocs(d => !d)} style={ghostBtn}>
            {showDocs ? 'Close docs' : 'API docs'}
          </button>
          <button onClick={seedSignals} disabled={loading} style={primaryBtn(loading)}>
            {loading ? 'Seeding...' : 'Simulate signals'}
          </button>
        </div>
      </div>

      {/* Map */}
      <Map geojson={geojson} city={activeCity} />

      {/* City selector */}
      <CitySelector activeCity={activeCity} onChange={handleCityChange} />

      {/* Legend + stats */}
      <Legend />
      <StatsBar stats={stats} activeCity={activeCity} />

      {/* Shareable link banner */}
      <ShareBanner city={activeCity} />

      {/* API Docs panel */}
      {showDocs && <ApiDocs city={activeCity} onClose={() => setShowDocs(false)} />}

    </div>
  )
}

const ghostBtn = {
  background: '#1a1d27cc',
  color: '#aaa',
  border: '1px solid #ffffff22',
  borderRadius: 8,
  padding: '8px 14px',
  fontSize: 13,
  cursor: 'pointer',
}

const primaryBtn = (loading) => ({
  background: loading ? '#3730a3' : '#4f46e5',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 500,
  cursor: loading ? 'not-allowed' : 'pointer',
})

function ShareBanner({ city }) {
  const [copied, setCopied] = useState(false)
  const url = `${window.location.origin}?city=${city}`

  const copy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      position: 'absolute', bottom: 32, left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      background: '#1a1d27ee',
      border: '1px solid #ffffff18',
      borderRadius: 10,
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      fontSize: 12, color: '#888',
      whiteSpace: 'nowrap'
    }}>
      <span style={{ color: '#555', fontFamily: 'monospace' }}>{url}</span>
      <button onClick={copy} style={{
        background: copied ? '#166534' : '#1e293b',
        color: copied ? '#86efac' : '#aaa',
        border: '1px solid #ffffff18',
        borderRadius: 6, padding: '4px 10px',
        fontSize: 12, cursor: 'pointer'
      }}>
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  )
}