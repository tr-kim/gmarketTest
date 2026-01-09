package com.web.gmarket.real.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class SummaryProcCountDto {
	// 전체
	private int totalCount;
	
	// 정상
	private int normalCount;
	
	// 다운
	private int downCount;
	
	// 이슈
	private int issueCount;
	
	// 지연
	private int delayCount;
}
