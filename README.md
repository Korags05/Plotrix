# Plotrix — Real-Time Property Demand Heatmap

> Where are people actually searching for property right now? Not last month. Right now.

**Live:** [plotrix.pages.dev](https://plotrix.pages.dev) · **Backend:** [Plotrix-Backend](https://github.com/Korags05/Plotrix-Backend)

![Plotrix Heatmap](https://raw.githubusercontent.com/Korags05/Plotrix/main/public/preview.png)

---

## What is this?

Plotrix is a real-time property demand heatmap engine for Indian cities. It ingests property search signals, maps them to H3 hexagonal grid cells, and visualises demand intensity on a live map — with time-decay so the heatmap always reflects current activity, not historical noise.

Think of it like Google Trends, but for property demand across Indian cities.

**Supported cities:** Delhi · Bangalore · Hyderabad · Pune · Chennai · Kolkata · Ahmedabad · Bhubaneswar

---

## How it works

```
User searches for property
        ↓
POST /api/v1/signals { lat, lng, city }
        ↓
Backend maps coordinates → H3 cell ID (resolution 8)
        ↓
Score upserted atomically in PostgreSQL
        ↓
Decay job runs hourly: score = score × e^(−λt)
        ↓
GET /api/v1/heatmap?city=delhi → GeoJSON
        ↓
Leaflet.js renders hexagons colored by intensity
```

---

## Features

- **Live heatmap** — refreshes every 15 seconds automatically
- **8 Indian cities** — switch cities with a smooth map fly animation
- **Shareable city links** — `plotrix.pages.dev?city=bangalore` works as a permanent link
- **Public API** — open API docs panel inside the app, no auth required
- **Time decay** — demand scores decay exponentially so stale data never pollutes the map
- **Simulate signals** — seed random signals in any city to demo the heatmap

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend framework | React + Vite |
| Map rendering | Leaflet.js |
| HTTP client | Axios |
| Routing | React Router |
| Deployment | Cloudflare Pages |

---

## Local development

**Prerequisites:** Node.js 18+

```bash
# clone the repo
git clone https://github.com/Korags05/Plotrix.git
cd Plotrix

# install dependencies
npm install

# create env file
echo "VITE_API_URL=http://localhost:8080" > .env

# start dev server
npm run dev
```

Open `http://localhost:5173`

> Make sure the backend is running on port 8080 — see [Plotrix-Backend](https://github.com/Korags05/Plotrix-Backend)

---

## Project structure

```
src/
├── config/
│   └── cities.js          # city coordinates + zoom levels
├── components/
│   ├── Map.jsx             # Leaflet map with H3 hexagon rendering
│   ├── CitySelector.jsx    # city switcher pill tabs
│   ├── Legend.jsx          # demand intensity legend
│   ├── StatsBar.jsx        # active cells counter
│   ├── SeedButton.jsx      # simulate signals button
│   └── ApiDocs.jsx         # inline API documentation panel
├── App.jsx                 # root component, state management
├── main.jsx                # entry point with React Router
└── index.css               # global styles
```

---

## Deployment

Deployed on **Cloudflare Pages** with automatic deploys on push to `main`.

Build settings:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |

Environment variable required:

```
VITE_API_URL=https://your-backend.onrender.com
```

---

## Public API

The backend exposes a free public API. Full docs available inside the app (click "API docs").

```bash
# get heatmap for a city
GET https://plotrix-backend.onrender.com/api/v1/heatmap?city=delhi

# post a search signal
POST https://plotrix-backend.onrender.com/api/v1/signals
Content-Type: application/json
{ "latitude": 28.6139, "longitude": 77.2090, "city": "delhi", "propertyType": "apartment" }

# get supported cities
GET https://plotrix-backend.onrender.com/api/v1/cities
```

---

## Color scale

| Color | Score range | Meaning |
|---|---|---|
| 🔴 Red | 8+ | Very high demand |
| 🟠 Orange | 5–8 | High demand |
| 🟡 Yellow | 2–5 | Medium demand |
| 🟢 Green | 0–2 | Low demand |

---

## Related

- **Backend repo:** [Plotrix-Backend](https://github.com/Korags05/Plotrix-Backend)
- **Live app:** [plotrix.pages.dev](https://plotrix.pages.dev)

---

## Author

**Kunal Saha** — building [OneNeev](https://linkedin.com/in/yourprofile), a group real estate buying platform.
