package com.web.gmarket.common.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class CommonSendDto {

	// 수신번호
	private String tranPhone;
	
	// 발신번호
	private String tranCallback;
	
	// 전송 상태 
	private Integer tranStatus;
	
	// 전송 요청 시간
	private String tranDate;
	
	// 메세지 제목
	private String tranTitle;
	
	// 메세지 내용
	private String tranMsg;
	
	// 대량발송 메시지 키
	private String bMsgKey;
	
	// SPAM 필터링 사용 여부
	private String reserved3;
	
	// 이미지 파일 경로 1
	private String imagePath01;
	
	// 이미지 파일 경로 2
	private String imagePath02;
	
	// 이미지 파일 경로 3
	private String imagePath03;
	
	// 발송시간 유형 0 : 즉시, 1 : 예약
	private Integer timeType;
}
