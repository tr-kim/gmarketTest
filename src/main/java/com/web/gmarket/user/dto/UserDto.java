package com.web.gmarket.user.dto;

import java.io.Serializable;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserDto implements Serializable {

	private static final long serialVersionUID = 1L;

	// 사용자 시퀀스
	private int userSeq;

	// 사용자 아이디
	private String userId;

	// 사용자 패스워드
	private String userPwd;

	// 사용자 이름
	private String userName;

	// 사용자 전화번호
	private String telNo;

	// 사용자 이메일
	private String email;

	// 회사코드(default : 0) - 0 : 옥션 - 1 : Gmarket
	private int companyCode;

	// 사용자 등급(Default : 2) - 0 : 관리자 등급 - 1 : 사용자 등급 - 2 : 운영자 등급
	private int userGrade;

	// SMS 사용 여부(Default : Y) - Y / N
	private String smsYn;

	// EXCEL 발송 사용 여부(Default : N)- Y / N
	private String excelYn;

	// FILE 발송 사용 여부(Default : N) - Y / N
	private String fileYn;

	// DB 발송 사용 여부(Default : N) - Y / N
	private String dbYn;

	// 정보 등록일 (Default : 현재시간)
	private String regDate;
	
	// 정보 수정일 (Default : 현재시간)
	private String chgDate;

	// 계정 사용 여부(Default : Y) - Y / N
	private String useYn;

	// 계정 삭제 여부(Default : N) - Y / N
	private String delFlag;

	// 사용자를 위한 저장공간 1(텍스트)
	private String userText0;

	// 사용자를 위한 저장공간 2(텍스트)
	private String userText1;

	// LMS 사용 여부(Default : N) - Y / N
	private String lmsYn;

	// MMS 사용 여부(Default : N) - Y / N
	private String mmsYn;

	// 암호화 된 사용자 암호
	private String enc1Pa;

	@Builder(toBuilder = true)
	private UserDto(int userSeq, String userId, String userPwd, String userName) {
		this.userSeq = userSeq;
		this.userId = userId;
		this.userPwd = userPwd;
		this.userName = userName;
	}
}
