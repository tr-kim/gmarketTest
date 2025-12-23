package com.web.gmarket.real.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class ServiceStatusFailoverDto {

	private String flag;
	private String companyCode;
	private String serverId;

	@JsonProperty("COMPANY_CODE")
	private String COMPANY_CODE;

	@JsonProperty("SERVER_ID")
	private String SERVER_ID;

	@JsonProperty("SERVER_STAT")
	private String SERVER_STAT;

	@JsonProperty("MANUAL_FLAG")
	private String MANUAL_FLAG;
}
