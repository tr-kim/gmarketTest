package com.web.gmarket.bulk.hist.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BulkHistDto {
	//조회 조건
	private String startDate;
	private String endDate;
	private String startTime;
	private String endTime;
	private String bulkMsgKey;
	private String bulkTitle;
	private String svcType;
	private Integer companyCode;
	private List<String> monthTables;
	
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
	
	@JsonProperty("CALLBACK_NO")
	private String CALLBACK_NO;
	
	@JsonProperty("CNT")
	private String CNT;
	
	@JsonProperty("STATUS")
	private String STATUS;
	
	@JsonProperty("SVC_TYPE")
	private String SVC_TYPE;
	
	@JsonProperty("SEND_INFO")
	private String SEND_INFO;
	
	@JsonProperty("SUCC_CNT")
	private Integer SUCC_CNT;
	
	@JsonProperty("FAIL_CNT")
	private Integer FAIL_CNT;
	
	@JsonProperty("CNT_STANBY")
	private Integer CNT_STANBY;
	
	@JsonProperty("CNT_TRAN")
	private Integer CNT_TRAN;
	
	@JsonProperty("CNT_SUCC")
	private Integer CNT_SUCC;
	
	@JsonProperty("CNT_DUP")
	private Integer CNT_DUP;
	
	@JsonProperty("CNT_SENDFAIL")
	private Integer CNT_SENDFAIL;
}