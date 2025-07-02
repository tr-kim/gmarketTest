package com.web.gmarket.hist.dto;

import java.util.List;

import lombok.Data;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HistDto {
	//조회 조건
	private String startDate;
	private String endDate;
	private String startTime;
	private String endTime;
	private String phoneNum;
	private List<String> monthTables;
	
	//조회 컬럼
	private String tranPr;
	private String tranPhone;
	private String tranCallback;
	private String tranStatus;
	private String tranDate;
	private String tranRslt;
	private String tranMsg;
	private String corpReserved2;
}
