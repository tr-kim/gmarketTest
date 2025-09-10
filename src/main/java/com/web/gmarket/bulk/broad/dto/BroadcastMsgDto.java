package com.web.gmarket.bulk.broad.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class BroadcastMsgDto {

	// 대량 발송 시퀀스(자동증가)
	private Integer bSeq;
	
	// 대량 전송 메시지 키
	private String bMsgKey;
	
	// 로그인 ID
	private String loginId;
	
	// 사용자 ID
	private String userId;
	
	// 대량 전송 제목
	private String title;
	
	// 대량 전송 메시지
	private String msg;
	
	// 등록 / 입력된 시간
	private Date InTime;
	
	// 전송 예약 시간
	private String reqTime;
	
	// 회신 번호
	private String callbackNo;
	
	// 대량 메시지 갯수
	private Integer cnt;
	
	// 대량 발송 상태값
	private Integer status;
	
	// 대량 발송 서비스 종류 - EXCEL, FILE, DB
	private String svcType;
	
	// 전송 대상
	private String sendInfo;
	
	// 발송 테이블에 INSERST한 갯수
	private Integer succCnt;
	
	// 발송 테이블에 INSERT를 하지 못한 갯수
	private Integer failCnt;
	
	
	
	// 발송시간 유형 0 : 즉시, 1 : 예약
	private Integer timeType;
	
}
