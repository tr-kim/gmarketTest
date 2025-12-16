package com.web.gmarket.serviceMgmt.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ServiceMgmtDto {
	//조회 조건
	private String companyCode1;
	private String companyCode2;

	private String serviceName;
	private String checkBit;

	//조회 옵션
	@JsonProperty("SERVER_NAME")
	private String SERVER_NAME;

	@JsonProperty("SERVICE_NAME")
	private String SERVICE_NAME;

	@JsonProperty("CHECK_BIT")
	private String CHECK_BIT;
}
