window.RainWeather = (() => {
  const API = 'https://api.open-meteo.com/v1/forecast';
  const locations = {
    hcm: {name:'TP.HCM', label:'TP. HỒ CHÍ MINH', lat:10.7769, lon:106.7009},
    thuDuc: {name:'TP. Thủ Đức', label:'TP. THỦ ĐỨC', lat:10.849, lon:106.771},
    tanBinh: {name:'Tân Bình', label:'TÂN BÌNH', lat:10.8015, lon:106.652},
    binhThanh: {name:'Bình Thạnh', label:'BÌNH THẠNH', lat:10.8106, lon:106.7091},
    goVap: {name:'Gò Vấp', label:'GÒ VẤP', lat:10.8387, lon:106.6653}
  };
  async function fetchWeather(location=locations.hcm){
    const params = new URLSearchParams({
      latitude:location.lat,longitude:location.lon,timezone:'Asia/Ho_Chi_Minh',forecast_days:'2',
      hourly:['temperature_2m','apparent_temperature','precipitation','rain','showers','precipitation_probability','weather_code','relative_humidity_2m','wind_speed_10m'].join(','),
      daily:['precipitation_sum','rain_sum','showers_sum','precipitation_hours','precipitation_probability_max','weather_code'].join(',')
    });
    const res = await fetch(`${API}?${params}`,{cache:'no-store'});
    if(!res.ok) throw new Error(`Weather HTTP ${res.status}`);
    const data = await res.json();
    return normalize(data,location);
  }
  function normalize(data,location){
    const h=data.hourly||{}; const times=h.time||[]; const today=(data.daily?.time||[])[0];
    const rows=times.map((time,i)=>({time,temp:h.temperature_2m?.[i]??null,feels:h.apparent_temperature?.[i]??null,precip:h.precipitation?.[i]??0,rain:h.rain?.[i]??0,showers:h.showers?.[i]??0,prob:h.precipitation_probability?.[i]??0,code:h.weather_code?.[i]??0,humidity:h.relative_humidity_2m?.[i]??null,wind:h.wind_speed_10m?.[i]??null}));
    const dayRows=rows.filter(r=>r.time.startsWith(today));
    const total=dayRows.reduce((s,r)=>s+(Number(r.precip)||0),0);
    const peak=dayRows.reduce((a,r)=>((r.precip||0)>(a.precip||0)?r:a),{precip:0});
    const now=new Date(); const current=rows.reduce((a,r)=>Math.abs(new Date(r.time)-now)<Math.abs(new Date(a.time)-now)?r:a,rows[0]||{});
    return {location,rows:dayRows,total,peakIntensity:peak.precip||0,peakHour:peak.time||null,current,daily:data.daily||{},raw:data};
  }
  async function fetchCityRain(items){
    const lats=items.map(x=>x.lat).join(','); const lons=items.map(x=>x.lon).join(',');
    const params=new URLSearchParams({latitude:lats,longitude:lons,timezone:'Asia/Ho_Chi_Minh',forecast_days:'1',hourly:'precipitation,precipitation_probability'});
    const res=await fetch(`${API}?${params}`,{cache:'no-store'}); if(!res.ok) throw new Error(`City HTTP ${res.status}`);
    const data=await res.json(); const list=Array.isArray(data)?data:[data];
    return list.map((d,i)=>{const p=d.hourly?.precipitation||[]; const probs=d.hourly?.precipitation_probability||[]; const sum=p.slice(0,24).reduce((s,v)=>s+(Number(v)||0),0); const peak=Math.max(0,...p.slice(0,24).map(Number)); return {...items[i],rain:sum,peak,prob:Math.max(0,...probs.slice(0,24).map(Number))};});
  }
  return {locations,fetchWeather,fetchCityRain};
})();
