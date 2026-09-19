export function buildRainStory(weather){
  const total=weather.totalRain||0, peak=weather.peakIntensity||0, hour=weather.peakHour;
  const peakText=hour===null?'':`${String(hour).padStart(2,'0')}:00`;
  let personality, headline, annoyance, description, engineerComment;
  if(total<2 && peak<1){ personality='MƯA NGÀY NGHỈ'; headline='Thành phố hôm nay khá dễ chịu.'; annoyance=1.5; description='Có thể mang ô cho chắc, nhưng khả năng cao bạn không cần dùng đến.'; engineerComment='Hôm nay chưa có lý do để mở bản vẽ thoát nước.'; }
  else if(total<10 && peak<5){ personality='MƯA DẠO CHƠI'; headline='Có mưa, nhưng chưa đến mức phải đổi kế hoạch.'; annoyance=3.2; description='Một ngày có vài nhịp mưa. Áo mưa gọn trong cốp là đủ.'; engineerComment='Lưu ý cục bộ ở các trận mưa rào; chưa phải một ngày mưa lớn.'; }
  else if(total<30 && peak<15){ personality='MƯA CÔNG SỞ'; headline='Đến đúng lúc bạn chuẩn bị tan làm.'; annoyance=6.1; description=`Nhịp mưa đáng chú ý${peakText?` quanh ${peakText}`:''}. Nếu có lịch ngoài trời, nên có phương án B.`; engineerComment='Cường độ bắt đầu đáng để quan tâm ở các điểm thoát nước cục bộ.'; }
  else { personality='MƯA KHÔNG ĐÙA'; headline='Hôm nay nên để ý đường về.'; annoyance=8.2; description=`Lượng mưa và cường độ đều cao${peakText?`, đỉnh khoảng ${peakText}`:''}. Nếu không cần thiết, đừng cố thắng thời tiết.`; engineerComment='Mưa lớn trong thời gian ngắn có thể tạo áp lực lên hệ thống thoát nước cục bộ.'; }
  return {personality,headline,annoyance,description,engineerComment,peakText};
}

export function buildAdvice(weather){
  const total=weather.totalRain||0, peak=weather.peakIntensity||0, h=weather.peakHour;
  const heavy=peak>=15||total>=30;
  const moderate=peak>=5||total>=10;
  return {
    bike: heavy?'😬 Nếu được, né giờ mưa':moderate?'🟡 Đi được, nhớ áo mưa':'🟢 Khá ổn',
    shoe: heavy||moderate?'❌ Đừng mang đôi bạn thích nhất':'🟢 Tạm an toàn',
    car: heavy?'🟡 OK, nhưng chừa thêm thời gian':'🟢 Khá ổn',
    outdoor: h!==null && h>=16 && h<=19 ? '🟡 Tránh giờ tan tầm' : heavy?'🟡 Xem radar trước khi đi':'🟢 Có thể đi'
  };
}
