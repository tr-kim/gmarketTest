package com.web.gmarket.wait.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WaitDto {
	//조회 조건
	private String startDate;
	private String endDate;
	private String startTime;
	private String endTime;
	private String bulkMsgKey;
	private String svcType;
	private String waitTitle;
	private Integer companyCode;
	
	// DevExtreme 조회 옵션
	private List<Object> filter;
	private List<Object> group;
	private Integer skip;
	private Integer take;
	private List<Object> sort;
	
	//조회 컬럼
	@JsonProperty("B_SEQ")
	private String B_SEQ;
	
	@JsonProperty("B_MSG_KEY")
	private String B_MSG_KEY;
	
	@JsonProperty("LOGIN_ID")
	private String LOGIN_ID;
	
	@JsonProperty("USER_ID")
	private String USER_ID;
	
	@JsonProperty("TITLE")
	private String TITLE;
	
	@JsonProperty("MSG")
	private String MSG;
	
	@JsonProperty("IN_TIME")
	private String IN_TIME;
	
	@JsonProperty("REQ_TIME")
	private String REQ_TIME;
	
	@JsonProperty("CNT")
	private String CNT;
	
	@JsonProperty("STATUS")
	private String STATUS;
	
	@JsonProperty("SVC_TYPE")
	private String SVC_TYPE;
}