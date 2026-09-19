let map=null, layer=null, frames=[], frameIndex=0, timer=null;
const HCMC=[10.8231,106.6297];

export async function initRadar(){
  map=L.map('radarMap',{zoomControl:true}).setView(HCMC,10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
  L.marker(HCMC).addTo(map).bindPopup('TP. Hồ Chí Minh');
  try{
    const res=await fetch('https://api.rainviewer.com/public/weather-maps.json');
    if(!res.ok) throw new Error('Radar API');
    const data=await res.json();
    frames=[...(data.radar?.past||[]),...(data.radar?.nowcast||[])];
    renderFrame();
  }catch(err){
    document.getElementById('radarTime').textContent='Radar tạm thời không khả dụng';
  }
  document.getElementById('radarPlay').addEventListener('click',togglePlay);
  document.getElementById('radarNow').addEventListener('click',()=>{if(frames.length){frameIndex=Math.max(0,(dataPastIndex()-1));renderFrame()}});
}
function dataPastIndex(){return Math.max(0,frames.findIndex(f=>f.time>=Date.now()/1000));}
function renderFrame(){
  if(!map||!frames.length)return;
  const f=frames[frameIndex];
  const url=`${f.path}/256/{z}/{x}/{y}/2/1_1.png`;
  if(layer)map.removeLayer(layer);
  layer=L.tileLayer(url,{opacity:.62,tileSize:256,zIndex:10}).addTo(map);
  document.getElementById('radarTime').textContent=new Date(f.time*1000).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'});
}
function togglePlay(){
  const btn=document.getElementById('radarPlay');
  if(timer){clearInterval(timer);timer=null;btn.textContent='▶ Phát';return}
  btn.textContent='Ⅱ Dừng';
  timer=setInterval(()=>{frameIndex=(frameIndex+1)%frames.length;renderFrame()},1200);
}
