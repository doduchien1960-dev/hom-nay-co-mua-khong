import {DEFAULT_LOCATION,fetchWeather,weatherIcon,weatherLabel} from './weather.js';
import {buildRainStory,buildAdvice} from './rain-story.js';
import {initRadar} from './radar.js';
import {renderCityGrid} from './city-map.js';
import {shareToday} from './share-card.js';

const $=id=>document.getElementById(id);

function animateNumber(el,value,suffix='',digits=0){
  if(!Number.isFinite(value)){el.textContent='—';return}
  const start=performance.now(),duration=650;
  function tick(now){const p=Math.min(1,(now-start)/duration),e=1-Math.pow(1-p,3);el.textContent=(value*e).toFixed(digits)+suffix;if(p<1)requestAnimationFrame(tick)}
  requestAnimationFrame(tick);
}

function createDrops(){
  const root=$('rainDrops'); for(let i=0;i<15;i++){const d=document.createElement('span');d.className='drop';d.style.left=`${Math.random()*170}px`;d.style.top=`${Math.random()*25}px`;d.style.animationDelay=`${Math.random()*1.5}s`;root.appendChild(d)}
}
function setupReveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});document.querySelectorAll('.section-reveal').forEach(x=>io.observe(x));}
function renderTimeline(weather){
  const root=$('rainTimeline');root.innerHTML='';
  weather.hourly.forEach((h)=>{const d=document.createElement('div');d.className='hour'+(h.hour===weather.peakHour?' peak':'');d.innerHTML=`<div class="hour-time">${String(h.hour).padStart(2,'0')}h</div><div class="hour-icon">${weatherIcon(h.code)}</div><div class="hour-rain">${h.precipitation.toFixed(1)} mm</div>`;root.appendChild(d)});
  const peak=weather.peakHour; const text=weather.peakIntensity<1?'Hôm nay không có một đỉnh mưa đáng kể.':`Mưa mạnh nhất quanh ${String(peak).padStart(2,'0')}:00 · ${weather.peakIntensity.toFixed(1)} mm/h.`;$('timelineSummary').textContent=text;
}
function render(weather){
  const story=buildRainStory(weather), advice=buildAdvice(weather), current=weather.current||{};
  $('heroLocation').textContent=`${weather.location.name.toUpperCase()} · HÔM NAY`;
  $('heroHeadline').textContent=story.headline;
  $('heroSubline').textContent=`${weatherLabel(current.weather_code)} · ${Number(current.temperature_2m||0).toFixed(0)}°C · ${Number(current.relative_humidity_2m||0).toFixed(0)}% ẩm`;
  animateNumber($('totalRain'),weather.totalRain,'',1);animateNumber($('peakIntensity'),weather.peakIntensity,'',1);$('peakHour').textContent=weather.peakHour===null?'—':`${String(weather.peakHour).padStart(2,'0')}:00`;
  $('heroWeatherIcon').textContent=weatherIcon(current.weather_code);$('heroWeatherText').textContent=weatherLabel(current.weather_code);
  $('rainPersonality').textContent=story.personality;$('rainDescription').textContent=story.description;$('annoyanceScore').textContent=story.annoyance.toFixed(1);$('scoreBar').style.width=`${story.annoyance*10}%`;$('engineerQuote').textContent=`“${story.engineerComment}”`;
  $('bikeAdvice').textContent=advice.bike;$('shoeAdvice').textContent=advice.shoe;$('carAdvice').textContent=advice.car;$('outdoorAdvice').textContent=advice.outdoor;
  $('engRain').textContent=`${weather.totalRain.toFixed(1)} mm`;$('engPeak').textContent=`${weather.peakIntensity.toFixed(1)} mm/h`;$('engHour').textContent=story.peakText||'—';
  const stress=Math.min(100,weather.totalRain*1.4+weather.peakIntensity*2.4);$('stressBar').style.width=`${stress}%`;$('stressText').textContent=stress>75?'HIGH':stress>45?'MEDIUM':'LOW';$('runoffLevel').textContent=stress>75?'HIGH':stress>45?'MEDIUM':'LOW';
  $('shareTitle').textContent=story.personality;$('shareLine').textContent=story.headline;$('shareRain').textContent=weather.totalRain.toFixed(1);$('sharePeak').textContent=story.peakText||'—';
  renderTimeline(weather);
}

async function main(){
  createDrops();setupReveal();
  $('detailsToggle').addEventListener('click',()=>{const d=$('calculationDetails');d.hidden=!d.hidden;$('detailsToggle').querySelector('span').textContent=d.hidden?'+':'−'});
  $('shareBtn').addEventListener('click',shareToday);
  try{const weather=await fetchWeather(DEFAULT_LOCATION);render(weather);}catch(err){$('heroHeadline').textContent='Không lấy được dữ liệu thời tiết lúc này.';$('heroSubline').textContent='Bạn có thể thử tải lại trang sau ít phút.';console.error(err)}
  initRadar();renderCityGrid();
}
main();
