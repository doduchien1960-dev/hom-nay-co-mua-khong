# Hôm Nay Có Mưa Không? — V2

Static website, deploy trực tiếp từ GitHub sang Vercel.

## Chạy local

Không cần build step. Có thể mở bằng một static server vì ES Modules không nên chạy bằng `file://`.

Ví dụ:

```bash
python -m http.server 8080
```

Sau đó mở `http://localhost:8080`.

## Nguồn dữ liệu

- Weather/forecast: Open-Meteo
- Radar: RainViewer
- Map tiles: OpenStreetMap + Leaflet

## Deploy Vercel

Kết nối repository GitHub với Vercel. Mỗi lần commit/push lên branch production, Vercel sẽ tự deploy lại.

Không cần backend cho phiên bản hiện tại.
