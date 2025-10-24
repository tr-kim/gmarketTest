package com.web.gmarket.real.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class RealDto {
	
	// 테이블 코드
	private Integer tableCode;
	
	// 시간 00:00
	private String inTime;
	
	// 전송메시지
	private String sendCnt;
	
	// 성공메시지
	private String succCnt;
	
	// 실패메시지
	private String failCnt;
}
