package com.web.gmarket.common.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class ServiceInfoDto {
	
	// 서비스 시퀀스 번호(자동증가)
	private Integer svcSeq;
	
	// 회사코드(default : 0) 0 : Auction 1 : Gmarket 2: Smile Cash
	private Integer companyCode;
	
	// 서비스명
	private String svcName;
	
	// 프로세스명
	private String procName;
	
	// 테이블 코드
	private int tableCode;
	
	// 테이블 이름
	private String tableName;
}
