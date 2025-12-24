package com.web.gmarket.serviceMgmt.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class ServiceMgmtDto {
	//조회 조건
	private String companyCode;
	private String svcName;
	
	//조회 옵션
	@JsonProperty("COMPANY_CODE")
	private String COMPANY_CODE;
	
	@JsonProperty("SVC_NAME")
	private String SVC_NAME;
	
	@JsonProperty("CHECK_BIT")
	private String CHECK_BIT;
}
