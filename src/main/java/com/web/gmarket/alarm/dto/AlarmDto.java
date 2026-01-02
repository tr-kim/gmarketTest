package com.web.gmarket.alarm.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class AlarmDto implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/****************************** 조회 컬럼 ***************************/
	// 알림 시퀀스 번호(자동 증가)
	@JsonProperty("ALM_SEQ")
	private Integer ALM_SEQ;
	
	// 회사코드 - 0: 옥션, 1: G마켓, 2: 스마일캐시
	@JsonProperty("COMPANY_CODE")
	private Integer COMPANY_CODE;
	
	// 서비스명
	@JsonProperty("SVC_NAME")
	private String SVC_NAME;
	
	// 프로세스 명
	@JsonProperty("PROC_NAME")
	private String PROC_NAME;
	
	// 테이블 이름
	@JsonProperty("TABLE_NAME")
	private String TABLE_NAME;
	
	// 모듈 유형 - 1: DB 세션 단전, 2: KT 세션 단절, 3: S/W Down, 4: 미발송 적체, 5: 결과대기 적체
	@JsonProperty("MON_TYPE")
	private Integer MON_TYPE;
	
	// 모듈 설명
	@JsonProperty("MON_COMMENT")
	private String MON_COMMENT;
	
	// 알림 유형 - 1: 발생, 2: 복구
	@JsonProperty("ALM_TYPE")
	private Integer ALM_TYPE;
	
	// 알림 설명
	@JsonProperty("ALM_COMMENT")
	private String ALM_COMMENT;
	
	// 알림 상세
	@JsonProperty("ALM_INFO")
	private String ALM_INFO;
	
	// 알림 발생 시간
	@JsonProperty("ALM_DATE")
	private String ALM_DATE;
	
	/****************************** 검색 컬럼 ***************************/
	// 알림 시퀀스 번호(자동 증가)
	private Integer almSeq;
	
	// 회사코드 - 0: 옥션, 1: G마켓, 2: 스마일캐시
	private Integer companyCode = 0;

	// 서버 아이디
	private Integer serverId;
	
	// 서비스명
	private String svcName;
	
	// 조회 기간
	private String startDate;
	private String endDate;
	
	// DevExtreme 조회 옵션
	private Integer skip = 0;
	private Integer take = 50;
	private List<Object> sort = new ArrayList<>();
	
}
