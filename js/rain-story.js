window.RainStory = (() => {
  function score(total,peak,hour){
    const volume=Math.min(4,total/20), intensity=Math.min(4,peak/15), timing=(hour>=16&&hour<=19)?2:(hour>=6&&hour<=9?1:0);
    return Math.max(0,Math.min(10,Math.round((volume+intensity+timing)*10)/10));
  }
  function build(w){
    const total=w.total||0, peak=w.peakIntensity||0, hour=w.peakHour?new Date(w.peakHour).getHours():null, annoyance=score(total,peak,hour);
    let personality='MƯA NHẸ NHÀNG'; let subtitle='Một ngày mưa vừa đủ để thành phố chậm lại.'; let quote='“Có áo mưa thì cứ mang theo.”';
    if(peak>=20 || total>=45){personality='MƯA KHÔNG ĐÙA';subtitle='Mưa đủ mạnh để kế hoạch ngoài trời bắt đầu phải xem lại.';quote='“Nếu phải đi, hãy cho mình thêm thời gian.”';}
    else if((hour>=16&&hour<=19)||peak>=10){personality='MƯA CÔNG SỞ';subtitle='Đến đúng lúc thành phố chuẩn bị về nhà.';quote='“Đừng để giờ tan tầm quyết định tốc độ của bạn.”';}
    else if(total>=15||peak>=5){personality='MƯA DẠO CHƠI';subtitle='Có mưa, nhưng chưa đến mức phải hủy cả ngày.';quote='“Một chiếc áo mưa mỏng là đủ để yên tâm.”';}
    const bike=peak>=12||total>=35?['KHÓ','Mưa mạnh, đường trơn và tầm nhìn giảm.']:peak>=5?['CÂN NHẮC','Có thể đi, nhưng nên tránh giờ đỉnh.']:['ỔN','Theo dữ liệu hôm nay, áp lực mưa không cao.'];
    const shoe=peak>=8||total>=20?['KHÔNG NÊN','Giày trắng hôm nay hơi mạo hiểm.']:['CÓ THỂ','Nếu chỉ đi gần, vẫn ổn.'];
    const car=peak>=15?['CẨN THẬN','Đi chậm hơn ở đoạn ngập cục bộ.']:['ỔN','Vẫn nên để ý nước đọng khi mưa lớn.'];
    const coffee=hour>=16&&hour<=19?['SAU GIỜ ĐỈNH',`Sau ${Math.min(22,(hour||18)+2)}:00 sẽ dễ chịu hơn.`]:['KHÁ ỔN','Chọn nơi có mái che là đủ.'];
    return {annoyance,personality,subtitle,quote,bike,shoe,car,coffee};
  }
  function engineering(w){
    const p=w.peakIntensity||0,total=w.total||0; const runoff=Math.min(100,Math.round(total*1.15+p*1.5)); const drainage=Math.min(100,Math.round(total*.8+p*2.2));
    return {runoff,drainage,runoffLabel:runoff>=70?'HIGH':runoff>=40?'MEDIUM':'LOW',drainageLabel:drainage>=70?'HIGH':drainage>=40?'MEDIUM':'LOW'};
  }
  return {build,engineering};
})();
