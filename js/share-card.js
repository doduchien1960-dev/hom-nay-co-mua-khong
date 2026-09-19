export async function shareToday(){
  const card=document.getElementById('shareCard');
  try{
    if(navigator.share){ await navigator.share({title:'Hôm Nay Có Mưa Không?',text:`${document.getElementById('shareTitle').textContent} — ${document.getElementById('shareLine').textContent}`}); return; }
    await navigator.clipboard.writeText(`${document.getElementById('shareTitle').textContent}\n${document.getElementById('shareLine').textContent}`);
    showToast('Đã copy nội dung chia sẻ.');
  }catch(e){ showToast('Chưa thể chia sẻ trên thiết bị này.'); }
}
function showToast(text){const t=document.getElementById('toast');t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)}
