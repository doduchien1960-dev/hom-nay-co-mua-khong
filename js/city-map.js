window.CityView = (() => {
  const districts=[
    {name:'Trung tâm',short:'Q.1',lat:10.7769,lon:106.7009},
    {name:'Bình Thạnh',short:'Bình Thạnh',lat:10.8106,lon:106.7091},
    {name:'Tân Bình',short:'Tân Bình',lat:10.8015,lon:106.652},
    {name:'Gò Vấp',short:'Gò Vấp',lat:10.8387,lon:106.6653},
    {name:'Thủ Đức',short:'TP. Thủ Đức',lat:10.849,lon:106.771},
    {name:'Quận 7',short:'Q.7',lat:10.735,lon:106.721}
  ];
  function render(items){const grid=document.getElementById('cityGrid'); grid.innerHTML=''; items.forEach(x=>{const card=document.createElement('article');card.className='city-card';card.innerHTML=`<div><div class="city-name">${x.name}</div><div class="city-meta">${x.short}</div></div><div class="city-rain">${Number.isFinite(x.rain)?x.rain.toFixed(1):'—'}<small>mm / ngày</small></div><div class="city-status">Đỉnh ${Number.isFinite(x.peak)?x.peak.toFixed(1):'—'} mm/h · Xác suất ${Number.isFinite(x.prob)?Math.round(x.prob):'—'}%</div>`;grid.appendChild(card)})}
  return {districts,render};
})();
