package com.web.gmarket.stat.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

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

	// 저장 시간 - 형식 : YYYYMMDDHH24
	private String resultDate;

	// 테이블 구분 코드
	private int tableCode = 0;

	// 이통사 구분 코드
	private String telSect;

	// 메시지 전송 시도 횟수
	private int tryCnt;

	// 메시지 전송 성공 횟수
	private int succCnt;

	// 전송 실패 횟수 (기타 오류) - API 버전오류, 인증실패, BIND 미수행 - 호스팅 시스템 내부 오류 - ISMC 전달 오류 - 기타
	// 오류
	private int fail00;

	// 전송 실패 횟수 (메시지 형식 오류)
	private int fail01;

	// 전송 실패 횟수 (유효시간 만료)
	private int fail02;

	// 전송 실패 횟수 (결번)
	private int fail03;

	// 전송 실패 횟수 (단말기 Power Off)
	private int fail04;

	// 전송 실패 횟수 (음영)
	private int fail05;

	// 전송 실패 횟수 (전송 건수 초과)
	private int fail06;

	// 전송 실패 횟수 (스팸 차단)
	private int fail07;

	// 전송 실패 횟수 (중복 메시지)
	private int fail08;

	// 전송 실패 횟수 (수신거부 등록번호)
	private int fail09;

	// 테이블 이름
	private String tableName;

	// 테이블 구분 코드 목록
	private List<Integer> tableCodeList = new ArrayList<>();
	
	private String startDate;
	private String endDate;
	
	private int timeType = 1;

	// 페이징
	private int skip = 0;
	private int take = 50;
}
