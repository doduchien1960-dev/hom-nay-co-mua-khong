window.RainRadar = (() => {
  const API='https://api.rainviewer.com/public/weather-maps.json';
  let map=null,layer=null,frames=[],index=0,timer=null,host='https://tilecache.rainviewer.com';
  const color=2;
  async function init(el,lat=10.7769,lon=106.7009){
    map=L.map(el,{zoomControl:false,attributionControl:true,preferCanvas:true}).setView([lat,lon],9);
    L.control.zoom({position:'topright'}).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
    L.circleMarker([lat,lon],{radius:6,color:'#356ae6',weight:3,fillColor:'#fff',fillOpacity:1}).addTo(map);
    setTimeout(()=>map.invalidateSize(),250); window.addEventListener('resize',()=>map.invalidateSize());
    await refresh();
  }
  async function refresh(){
    const res=await fetch(API,{cache:'no-store'}); if(!res.ok) throw new Error(`Radar HTTP ${res.status}`); const data=await res.json();
    host=data.host||host; frames=(data.radar?.past||[]).slice(-13); if(!frames.length) throw new Error('No radar frames'); index=frames.length-1; render();
    return frames;
  }
  function render(){
    if(!map||!frames[index])return; const f=frames[index]; if(layer)map.removeLayer(layer); const url=`${host}${f.path}/256/{z}/{x}/{y}/${color}/1_1.png`; layer=L.tileLayer(url,{opacity:.72,zIndex:500,maxNativeZoom:7,maxZoom:19,tileSize:256,updateWhenIdle:true,keepBuffer:2}).addTo(map); document.dispatchEvent(new CustomEvent('radar:time',{detail:{time:f.time,index,total:frames.length}})); }
  function play(){stop();timer=setInterval(()=>{index=(index+1)%frames.length;render()},1100)} function stop(){if(timer){clearInterval(timer);timer=null}} function now(){stop();index=frames.length-1;render()} 
  return {init,refresh,play,stop,now};
})();
