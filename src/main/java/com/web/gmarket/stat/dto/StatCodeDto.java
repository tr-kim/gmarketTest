package com.web.gmarket.stat.dto;

import com.web.gmarket.common.utils.ConstantsUtils;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class StatCodeDto {
	
	// 테이블 시퀀스 번호
	private int tableSeq;
	
	// 테이블 구분 코드
	private int tableCode = -1;
	
	// 회사코드(default : 0) - 0 : Auction - 1 : Gmarket
	private int companyCode = 0;
	
	// 테이블 이름
	private String tableName;
	
	// 테이블 종류(default : 1) - 1 : SMS 일반 - 2 : SMS 대량(이력 테이블 사용) - 3 : LMS 대량(이력 테이블 사용) - 4 : MMS 대량(이력 테이블 사용)
	private int tableType = 1;
	
	// 정보 등록일 (Default : 현재시간)
	private String regDate;
	
	// 정보 수정일 (Default : 현재시간)
	private String chgDate;
	
	// 테이블 사용 여부(Default : Y) - Y : 사용 - N : 미사용
	private String useYn = ConstantsUtils.FLAG_Y;
	
	// 테이블 삭제 여부(Default : N) - Y : 삭제 - N : 미삭제
	private String delFlag = ConstantsUtils.FLAG_N;
}
