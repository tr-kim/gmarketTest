package com.web.gmarket.alarm.dto;

import java.io.Serializable;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class AlarmDto implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	// 알림 시퀀스 번호(자동 증가)
	private Integer almSeq;
	
	// 회사코드 - 0: 옥션, 1: G마켓, 2: 스마일캐시
	private Integer companyCode = 0;
	
	// 서비스명
	private String svcName;
	
	// 프로세스명
	private String procName;
	
	// 테이블명
	private String tableName;
	
	// 모듈 유형 - 1: DB 세션 단전, 2: KT 세션 단절, 3: S/W Down, 4: 미발송 적체, 5: 결과대기 적체
	private Integer monType;
	
	// 모듈 설명
	private String monComment;
	
	// 알림 유형 - 1: 발생, 2: 복구
	private Integer almType;
	
	// 알림 설명
	private String almComment;
	
	// 알림 상세
	private String almInfo;
	
	// 알림 발생 시간
	private String almDate;
	
	// 조회 기간
	private String startDate;
	private String endDate;
	
	// page
	private int skip = 0;
	private int take = 50;
	
}
