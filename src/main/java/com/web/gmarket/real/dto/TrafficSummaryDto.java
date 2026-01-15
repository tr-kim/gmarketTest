package com.web.gmarket.real.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class TrafficSummaryDto {
	
	// 총 전송
	private Integer allSendCnt;
	
	// 총 성공
	private Integer allSuccCnt;
	
	// 총 실패
	private Integer allFailCnt;
	
	// 총 완료율(%)
	private Integer allCompleteRate;
}
