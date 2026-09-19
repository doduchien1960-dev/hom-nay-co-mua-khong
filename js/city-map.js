import {fetchWeather} from './weather.js';

const areas=[
  ['Quận 1',10.7769,106.7009],['Thủ Đức',10.8505,106.7717],['Bình Thạnh',10.8106,106.7091],
  ['Tân Bình',10.8015,106.6520],['Phú Nhuận',10.7992,106.6800],['Quận 7',10.7340,106.7218]
];
export async function renderCityGrid(){
  const root=document.getElementById('cityGrid');
  const results=await Promise.allSettled(areas.map(([name,lat,lon])=>fetchWeather({name,lat,lon})));
  root.innerHTML=results.map((r,i)=>{
    const name=areas[i][0];
    if(r.status!=='fulfilled')return `<article class="city-card"><div class="city-top"><span class="city-name">${name}</span><span class="city-value">—</span></div><div class="city-status">Không có dữ liệu</div></article>`;
    const w=r.value, rain=w.totalRain||0, width=Math.min(100,rain*3);
    const status=rain>=30?'Mưa đáng chú ý':rain>=10?'Có mưa':'Ít mưa';
    return `<article class="city-card"><div class="city-top"><span class="city-name">${name}</span><span class="city-value">${rain.toFixed(1)} mm</span></div><div class="city-status">${status}</div><div class="mini-track"><span style="width:${width}%"></span></div></article>`;
  }).join('');
  document.getElementById('cityStatus').textContent='So sánh tham khảo giữa một số khu vực trong thành phố.';
}
