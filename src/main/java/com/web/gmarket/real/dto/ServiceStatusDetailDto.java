package com.web.gmarket.real.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class ServiceStatusDetailDto {
	
	// 회사 코드
	private Integer companyCode;
	
	// 서비스 이름
	private String svcName;
	
	// 프로세스 이름
	private String procName;
	
	// 프로세스 유형
	private String procType;
	
	private Integer dbSeshChk;				// DB 세션 단절
	private Integer dbSeshSts;				// DB 세션 상태
	private Integer dbUpdateDelay;			// 1~4분 미갱신
	private Integer dbUpdateDown;			// 5분 이상 미갱신
	
	private Integer ktSeshChk;				// KT 세션 단절
	private Integer ktSeshSts;				// KT 세션 상태
	private Integer ktUpdateDelay;			// 1~4분 미갱신
	private Integer ktUpdateDown;			// 5분 이상 미갱신
	
	private Integer swDownChk;				// S/W down
	private Integer swDownSts;				// S/W down 상태
	private Integer swUpdateDelay;			// 1~4분 미갱신
	private Integer swUpdateDown;			// 5분 이상 미갱신
}
