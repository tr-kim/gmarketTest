export function switchTranRslt(value) {
  const v = value != null ? String(value).trim() : "";

  switch (v) {
    case "-2": return "결과 대기";
    case "-1": return "대기";
    case "0":  return "성공";
    case "1":  return "지능형 SMS 전송 API 버전 오류";
    case "2":  return "인증 실패";
    case "3":  return "연결 실패";
    case "4":  return "KT 지능형 시스템 오류";
    case "5":  return "SMS 형식 오류";
    case "6":  return "유효기간 만료";
    case "7":  return "결번";
    case "8":  return "단말기 전원 OFF";
    case "9":  return "단말기 음영 지역";
    case "A":  return "월별 전송 건수 초과";
    case "B":  return "초당 전송 속도 초과";
    case "C":  return "단말기 번호이동 관련 오류";
    case "D":  return "단말기 번호이동 관련 오류";
    case "E":  return "KT 지능형 시스템 호처리 실패";
    case "F":  return "KT Ann 폰 관련 오류";
    case "G":  return "파일 전송 오류";
    case "H":  return "스팸 차단";
    case "I":  return "스팸 차단(내부)";
    case "Y":  return "중복 메시지";
    case "Z":  return "기타 오류";
    default:   return "기타";
  }
}