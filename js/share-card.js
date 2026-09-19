window.ShareCard = (() => {
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  async function create(data){
    const host=document.getElementById('shareCanvasHost'); host.innerHTML=`<div class="share-render"><div><div class="small">HÔM NAY CÓ MƯA KHÔNG? · ${esc(data.location)}</div><div style="height:55px"></div><h2>${esc(data.personality)}</h2><p class="quote">${esc(data.subtitle)}</p></div><div><div class="line"></div><div style="height:30px"></div><div class="small">LƯỢNG MƯA HÔM NAY</div><div class="big">${esc(data.total)} mm</div><div style="height:24px"></div><div class="small">ĐỈNH MƯA · ${esc(data.peakHour)}</div><div style="height:30px"></div><p class="quote">“${esc(data.quote)}”</p></div></div>`;
    const node=host.firstElementChild;
    if(window.html2canvas){const canvas=await html2canvas(node,{scale:1,backgroundColor:'#f5f4ef'});const a=document.createElement('a');a.download='hom-nay-co-mua-khong.png';a.href=canvas.toDataURL('image/png');a.click();return true;}
    return false;
  }
  return {create};
})();
