# Hôm Nay Có Mưa Không? — Final V2

Static website, deploy trực tiếp bằng GitHub → Vercel.

## Cấu trúc
- `index.html` — layout và semantic sections
- `css/style.css` — visual system, responsive, Leaflet tile fix, animation
- `js/weather.js` — Open-Meteo weather/forecast
- `js/rain-story.js` — Rain Personality + practical/engineering interpretation
- `js/radar.js` — RainViewer past radar frames + Leaflet
- `js/city-map.js` — multi-location city rainfall cards
- `js/share-card.js` — share image generator
- `js/app.js` — application orchestration

## Deploy
1. Upload/replace these files in the existing GitHub repository.
2. Commit changes to the production branch (normally `main`).
3. Vercel will automatically build/deploy the new commit when the repository is connected.
4. No build command, Node server, database, or environment variable is required.

## Data sources
- Weather/forecast: Open-Meteo
- Radar: RainViewer Weather Maps API (past radar frames)
- Basemap: OpenStreetMap

## Important
RainViewer's public API currently exposes past radar maps; this build does not pretend to provide a future radar forecast. District values are real Open-Meteo responses; missing data is displayed as `—` rather than generated randomly.
