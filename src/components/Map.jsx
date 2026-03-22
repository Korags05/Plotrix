import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { CITIES } from '../config/cities'

function scoreToStyle(score) {
  if (score >= 8) return { fillColor: '#ef4444', fillOpacity: 0.75, color: '#ef4444', weight: 1, opacity: 0.3 }
  if (score >= 5) return { fillColor: '#f97316', fillOpacity: 0.65, color: '#f97316', weight: 1, opacity: 0.3 }
  if (score >= 2) return { fillColor: '#eab308', fillOpacity: 0.55, color: '#eab308', weight: 1, opacity: 0.3 }
  return { fillColor: '#22c55e', fillOpacity: 0.40, color: '#22c55e', weight: 1, opacity: 0.3 }
}

export default function Map({ geojson, city }) {
  const mapRef      = useRef(null)
  const layerRef    = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (instanceRef.current) return
    instanceRef.current = L.map(mapRef.current, { zoomControl: false })
      .setView([28.6139, 77.2090], 11)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO', maxZoom: 19
    }).addTo(instanceRef.current)

    L.control.zoom({ position: 'topright' }).addTo(instanceRef.current)
  }, [])

  // fly to city when it changes
  useEffect(() => {
    if (!instanceRef.current || !city) return
    const { lat, lng, zoom } = CITIES[city]
    instanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 })
  }, [city])

  // update hexagons when data changes
  useEffect(() => {
    if (!instanceRef.current || !geojson) return
    if (layerRef.current) instanceRef.current.removeLayer(layerRef.current)

    layerRef.current = L.geoJSON(geojson, {
      style: f => scoreToStyle(f.properties.score),
      onEachFeature: (feature, layer) => {
        layer.bindTooltip(
          `<strong>Score:</strong> ${feature.properties.score.toFixed(2)}<br/>
           <strong>Signals:</strong> ${feature.properties.signalCount}`,
          { sticky: true }
        )
      }
    }).addTo(instanceRef.current)
  }, [geojson])

  return <div ref={mapRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
}