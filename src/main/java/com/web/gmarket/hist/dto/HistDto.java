package com.web.gmarket.hist.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HistDto {
	// 조회 조건
	private String startDate;
	private String endDate;
	private String startTime;
	private String endTime;
	private String phoneNum;
	private String tableName;
	private Integer companyCode;
	private List<String> monthTables;
	
	// DevExtreme 조회 옵션
	private List<Object> filter;
	private List<Object> group;
	private Integer skip;
	private Integer take;
	private List<Object> sort;
	
	// 조회 컬럼
	@JsonProperty("TRAN_PR")
	private String TRAN_PR;
	
	@JsonProperty("TRAN_PHONE")
	private String TRAN_PHONE;
	
	@JsonProperty("TRAN_CALLBACK")
	private String TRAN_CALLBACK;
	
	@JsonProperty("TRAN_STATUS")
	private String TRAN_STATUS;
	
	@JsonProperty("TRAN_DATE")
	private String TRAN_DATE;
	
	@JsonProperty("TRAN_RSLT")
	private String TRAN_RSLT;
	
	@JsonProperty("TRAN_MSG")
	private String TRAN_MSG;
	
	@JsonProperty("CORP_RESERVED2")
	private String CORP_RESERVED2;
	
	@JsonProperty("COMPANY_CODE")
	private Integer COMPANY_CODE;
	
	@JsonProperty("TABLE_NAME")
	private String TABLE_NAME;
}