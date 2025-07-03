package com.web.gmarket.bulk.hist.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BulkHistDto {
	//조회 조건
	private String startDate;
	private String endDate;
	private String startTime;
	private String endTime;
    private String title;

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
