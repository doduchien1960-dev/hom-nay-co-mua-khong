const BASE = 'https://api.open-meteo.com/v1/forecast';
const AIR = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export const DEFAULT_LOCATION = { name:'TP. Hồ Chí Minh', shortName:'TP.HCM', lat:10.8231, lon:106.6297 };

function paramsToString(params){ return new URLSearchParams(Object.entries(params)).toString(); }

export async function fetchWeather(location=DEFAULT_LOCATION){
  const url = `${BASE}?${paramsToString({
    latitude:location.lat, longitude:location.lon, timezone:'Asia/Ho_Chi_Minh',
    current:'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m',
    hourly:'temperature_2m,precipitation,rain,precipitation_probability,weather_code,wind_speed_10m',
    forecast_days:2
  })}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error(`Weather API ${res.status}`);
  const data = await res.json();
  return normalizeWeather(data, location);
}

export async function fetchAir(location=DEFAULT_LOCATION){
  const url = `${AIR}?${paramsToString({latitude:location.lat,longitude:location.lon,timezone:'Asia/Ho_Chi_Minh',current:'european_aqi,pm2_5'})}`;
  const res = await fetch(url);
  if(!res.ok) return null;
  return res.json();
}

function normalizeWeather(data, location){
  const h=data.hourly||{};
  const times=h.time||[];
  const precip=h.precipitation||[];
  const rain=h.rain||precip.map(()=>0);
  const code=h.weather_code||[];
  const today=new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Ho_Chi_Minh'});
  const rows=times.map((time,i)=>({time, hour:new Date(time).getHours(), date:time.slice(0,10), precipitation:Number(precip[i]||0), rain:Number(rain[i]||0), probability:Number(h.precipitation_probability?.[i]||0), code:code[i]}));
  const todayRows=rows.filter(x=>x.date===today).slice(0,24);
  const totalRain=todayRows.reduce((s,x)=>s+x.precipitation,0);
  const peak=todayRows.reduce((a,b)=>b.precipitation>a.precipitation?b:a,{precipitation:0,hour:null});
  return {location,current:data.current,hourly:todayRows,totalRain,peakIntensity:peak.precipitation,peakHour:peak.hour,units:{precipitation:data.hourly_units?.precipitation||'mm'}};
}

export function weatherIcon(code=0){
  if(code===0) return '☀️';
  if([1,2].includes(code)) return '🌤️';
  if(code===3) return '☁️';
  if([45,48].includes(code)) return '🌫️';
  if([51,53,55,56,57].includes(code)) return '🌦️';
  if([61,63,65,66,67].includes(code)) return '🌧️';
  if([71,73,75,77].includes(code)) return '❄️';
  if([80,81,82].includes(code)) return '🌦️';
  if([95,96,99].includes(code)) return '⛈️';
  return '🌦️';
}

export function weatherLabel(code=0){
  if(code===0)return 'Trời quang'; if([1,2].includes(code))return 'Mây nhẹ'; if(code===3)return 'Nhiều mây'; if([45,48].includes(code))return 'Sương mù'; if([51,53,55,56,57].includes(code))return 'Mưa phùn'; if([61,63,65].includes(code))return 'Mưa'; if([80,81,82].includes(code))return 'Mưa rào'; if([95,96,99].includes(code))return 'Dông'; return 'Có mưa';
}
