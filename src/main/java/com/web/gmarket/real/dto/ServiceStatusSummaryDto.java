package com.web.gmarket.real.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class ServiceStatusSummaryDto {
	
	// 회사 코드
	private Integer companyCode;
	
	/*	요약	 */
	private Integer dbNormalCount;			// DB 정상 카운트
	private Integer dbDownCount;			// DB 서비스 다운 카운트
	private Integer dbUnknownCount;			// DB 서비스 업데이트 여부
	
	private Integer ifpNormalCount;			// IFP 정상 카운트
	private Integer ifpDownCount;			// IFP 서비스 다운 카운트
	private Integer ifpUnknownCount;		// IFP 서비스 업데이트 여부
	
	private Integer monNormalCount;			// MEMMON 정상 카운트
	private Integer monDownCount;			// MEMMON 서비스 다운 카운트
	private Integer monUnknownCount;		// MEMMON 서비스 업데이트 여부
	
	private Integer sapNormalCount;			// STATP 정상 카운트
	private Integer sapDownCount;			// STATP 서비스 다운 카운트
	private Integer sapUnknownCount;		// STATP 서비스 업데이트 여부	
	
}
