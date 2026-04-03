package com.web.gmarket.stat.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class StatDto extends StatCodeDto implements Serializable {

	private static final long serialVersionUID = 1L;

	/****************************** 조회 컬럼 ***************************/
	// 저장 시간 - 형식 : YYYYMMDDHH24
	@JsonProperty("RESULT_DATE")
	private String RESULT_DATE;

	// 테이블 구분 코드
	@JsonProperty("TABLE_CODE")
	private int TABLE_CODE;
	
	// 테이블 이름
	@JsonProperty("TABLE_NAME")
	private String TABLE_NAME;

	// 이통사 구분 코드
//	private String telSect;

	// 메시지 전송 시도 횟수
	@JsonProperty("TRY_CNT")
	private Integer TRY_CNT;

	// 메시지 전송 성공 횟수
	@JsonProperty("SUCC_CNT")
	private Integer SUCC_CNT;
	
	// 메시지 전송 실패 횟수
	@JsonProperty("FAIL_CNT")
	private Integer FAIL_CNT;

	// 전송 실패 횟수 (기타 오류)
	// API 버전 오류, 인증 실패, BIND 미수행, 호스팅 시스템 내부 오류, ISMC 전달 오류
	@JsonProperty("FAIL_00")
	private Integer FAIL_00;

	// 전송 실패 횟수 (메시지 형식 오류)
	@JsonProperty("FAIL_01")
	private Integer FAIL_01;

	// 전송 실패 횟수 (유효시간 만료)
	@JsonProperty("FAIL_02")
	private Integer FAIL_02;

	// 전송 실패 횟수 (결번)
	@JsonProperty("FAIL_03")
	private Integer FAIL_03;

	// 전송 실패 횟수 (단말기 Power Off)
	@JsonProperty("FAIL_04")
	private Integer FAIL_04;

	// 전송 실패 횟수 (음영)
	@JsonProperty("FAIL_05")
	private Integer FAIL_05;

	// 전송 실패 횟수 (전송 건수 초과)
	@JsonProperty("FAIL_06")
	private Integer FAIL_06;

	// 전송 실패 횟수 (스팸 차단)
	@JsonProperty("FAIL_07")
	private Integer FAIL_07;

	// 전송 실패 횟수 (중복 메시지)
	@JsonProperty("FAIL_08")
	private Integer FAIL_08;

	// 전송 실패 횟수 (수신거부 등록번호)
	@JsonProperty("FAIL_09")
	private Integer FAIL_09;

	// 회사 구분 코드
	@JsonProperty("COMPANY_CODE")
	private Integer COMPANY_CODE;

	/****************************** 검색 컬럼 ***************************/
	// 테이블 이름
	private int tableCode = 0;

	// 테이블 이름
	private String tableName;

	// 테이블 구분 코드 목록
	private List<Integer> tableCodeList = new ArrayList<>();
	
	// 시작일
	private String startDate;
	
	// 종료일
	private String endDate;
	
	// 사직 시
	private String startHour = "09";
	
	// 종료 시
	private String endHour = "09";
	
	// 시간 구분 1: 시간(yyyyMMddHH), 2: 일(yyyyMMdd), 3: 월(yyyyMM), 4: 년(yyyy)
	private int timeType = 2;

	
	// DevExtreme 조회 옵션
	private Integer skip = 0;
	private Integer take = 50;
	private List<Object> sort = new ArrayList<>();
}
