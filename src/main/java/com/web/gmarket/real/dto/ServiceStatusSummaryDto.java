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
	private Integer dbNormalCount; // NORMAL
	private Integer dbWarnCount; // DELAY, ISSUE
	private Integer dbDownCount; // DOWN
	
	private Integer ifpNormalCount; // NORMAL
	private Integer ifpWarnCount; // DELAY, ISSUE
	private Integer ifpDownCount; // DOWN
	
	private Integer monNormalCount;	// NORMAL
	private Integer monWarnCount; // DELAY, ISSUE
	private Integer monDownCount; // DOWN
	
	private Integer sapNormalCount; // NORMAL
	private Integer sapWarnCount; // DELAY, ISSUE
	private Integer sapDownCount; // DOWN
	
}
