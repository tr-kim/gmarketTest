package com.web.gmarket.real.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class SummaryProcNameDto {
	private int companyCode;
	private String svcName;
	
	// NORMAL: 정상, DOWN: 다운, ISSUE: 이슈, DELAY: 지연
	private String status;
}
