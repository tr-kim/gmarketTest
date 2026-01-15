package com.web.gmarket.real.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class TrafficDetailDto {
	
	// 전송
	private Integer auSendCnt; // 옥션
	
	// 성공
	private Integer auSuccCnt;
	
	// 실패
	private Integer auFailCnt;
	
	// 완료율(%)
	private Integer auCompleteRate;
	
	// 전송
	private Integer gmSendCnt; // G마켓
	
	// 성공
	private Integer gmSuccCnt;
	
	// 실패
	private Integer gmFailCnt;
	
	// 완료율(%)
	private Integer gmCompleteRate;
	
	// 전송
	private Integer scSendCnt; // 스마일캐시
	
	// 성공
	private Integer scSuccCnt;
	
	// 실패
	private Integer scFailCnt;
	
	// 완료율(%)
	private Integer scCompleteRate;
}
