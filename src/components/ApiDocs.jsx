const API = import.meta.env.VITE_API_URL

export default function ApiDocs({ city, onClose }) {
  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, bottom: 0,
      width: 420, zIndex: 2000,
      background: '#0f1117',
      borderLeft: '1px solid #ffffff12',
      overflowY: 'auto',
      padding: '24px 24px 48px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Public API</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', fontSize: 20, cursor: 'pointer' }}>×</button>
      </div>

      <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 24 }}>
        Plotrix is free to use. No API key required. Use it to power your own real estate apps.
      </p>

      <Section title="Get heatmap for a city">
        <Method>GET</Method>
        <Code>{`${API}/api/v1/heatmap?city=${city}`}</Code>
        <p style={desc}>Returns a GeoJSON FeatureCollection of H3 hexagonal cells with demand scores.</p>
        <Code>{`{
  "type": "FeatureCollection",
  "city": "${city}",
  "totalCells": 177,
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[...]]
      },
      "properties": {
        "cellId": "8865b1a6fffffff",
        "score": 6.4,
        "signalCount": 12
      }
    }
  ]
}`}</Code>
      </Section>

      <Section title="Post a search signal">
        <Method>POST</Method>
        <Code>{`${API}/api/v1/signals`}</Code>
        <p style={desc}>Fire this when a user searches for a property. Increments the demand score for that area.</p>
        <Code>{`// Request body
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "city": "${city}",
  "propertyType": "apartment"
}`}</Code>
      </Section>

      <Section title="Get supported cities">
        <Method>GET</Method>
        <Code>{`${API}/api/v1/cities`}</Code>
        <p style={desc}>Returns all supported cities with coordinates and zoom levels.</p>
      </Section>

      <Section title="Shareable city link">
        <p style={desc}>Each city heatmap has a permanent shareable URL:</p>
        <Code>{`${window.location.origin}?city=${city}`}</Code>
      </Section>

    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 13, fontWeight: 500, color: '#aaa', marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  )
}

function Method() {
  return (
    <span style={{
      background: '#1e3a5f', color: '#60a5fa',
      fontSize: 11, fontWeight: 600,
      padding: '2px 8px', borderRadius: 4,
      display: 'inline-block', marginBottom: 8
    }}>GET</span>
  )
}

function Code({ children }) {
  return (
    <pre style={{
      background: '#1a1d27',
      border: '1px solid #ffffff12',
      borderRadius: 8,
      padding: '12px 14px',
      fontSize: 11,
      color: '#a5b4fc',
      overflowX: 'auto',
      marginBottom: 10,
      lineHeight: 1.6,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all'
    }}>{children}</pre>
  )
}

const desc = {
  fontSize: 12,
  color: '#555',
  lineHeight: 1.6,
  marginBottom: 10
}