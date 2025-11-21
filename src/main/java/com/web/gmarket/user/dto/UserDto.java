package com.web.gmarket.user.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.validation.ValidationGroups.NotBlankGroup1;
import com.web.gmarket.common.validation.ValidationGroups.NotBlankGroup2;
import com.web.gmarket.common.validation.ValidationGroups.NotBlankGroup3;
import com.web.gmarket.common.validation.ValidationGroups.PatternGroup1;
import com.web.gmarket.common.validation.ValidationGroups.PatternGroup2;
import com.web.gmarket.common.validation.ValidationGroups.PatternGroup3;
import com.web.gmarket.common.validation.ValidationGroups.PatternGroup4;
import com.web.gmarket.common.validation.ValidationGroups.PatternGroup5;
import com.web.gmarket.common.validation.ValidationGroups.SizeGroup1;
import com.web.gmarket.common.validation.ValidationGroups.SizeGroup2;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class UserDto implements Serializable {

	private static final long serialVersionUID = 1L;

	/****************************** 조회 컬럼 ***************************/
	@JsonProperty("USER_SEQ")
	private Integer USER_SEQ;
	
	@JsonProperty("USER_ID")
	private String USER_ID;
	
	@JsonProperty("USER_NAME")
	private String USER_NAME;
	
	@JsonProperty("TEL_NO")
	private String TEL_NO;
	
	@JsonProperty("HP_NO")
	private String HP_NO;
	
	@JsonProperty("EMAIL")
	private String EMAIL;
	
	@JsonProperty("COMPANY_CODE")
	private Integer COMPANY_CODE;
	
	@JsonProperty("USER_GRADE")
	private Integer USER_GRADE;
	
	@JsonProperty("SMS_YN")
	private String SMS_YN;
	
	@JsonProperty("EXCEL_YN")
	private String EXCEL_YN;
	
	@JsonProperty("FILE_YN")
	private String FILE_YN;
	
	@JsonProperty("DB_YN")
	private String DB_YN;
	
	@JsonProperty("REG_DATE")
	private String REG_DATE;
	
	@JsonProperty("CHG_DATE")
	private String CHG_DATE;
	
	@JsonProperty("USE_YN")
	private String USE_YN;
	
	@JsonProperty("DEL_FLAG")
	private String DEL_FLAG;
	
	@JsonProperty("USER_TEXT0")
	private String USER_TEXT0;
	
	@JsonProperty("USER_TEXT1")
	private String USER_TEXT1;
	
	@JsonProperty("LMS_YN")
	private String LMS_YN;
	
	@JsonProperty("MMS_YN")
	private String MMS_YN;
	
	
	/****************************** 검색 컬럼 ***************************/
	// 사용자 시퀀스
	private Integer userSeq;

	// 사용자 아이디
	@NotBlank(message = "아이디는 필수 입력 값입니다.", groups = NotBlankGroup1.class)
	@Size(min = 3, max = 10, message = "아이디는 3~10자 이내로 입력해야 합니다.", groups = SizeGroup1.class)
	@Pattern(regexp = "^(?!.*\\s).*$", message = "아이디는 공백을 포함할 수 없습니다.", groups = PatternGroup1.class)
	@Pattern(regexp = "^[A-Za-z0-9_]+$", message = "아이디에 허용되지않는 문자가 입력되었습니다.", groups = PatternGroup2.class)
	private String userId;

	// 사용자 패스워드
	@NotBlank(message = "비밀번호는 필수 입력 값입니다.", groups = NotBlankGroup2.class)
	@Size(min = 8, max = 20, message = "비밀번호는 8~20자 이내로 입력해야 합니다.", groups = SizeGroup2.class)
	@Pattern(regexp = "^[A-Za-z0-9]+$", message = "비밀번호에 허용되지않는 문자가 입력되었습니다.", groups = PatternGroup3.class)
	private String userPwd;

	// 사용자 이름
	@NotBlank(message = "사용자 이름은 필수 입력 값입니다.", groups = NotBlankGroup3.class)
	private String userName;

	// 사용자 전화번호
	@Pattern(regexp = "(^$|^01[016789]-?\\d{3,4}-?\\d{4}$)", message = "유효한 전화번호 형식이어야 합니다.", groups = PatternGroup4.class)
	private String hpNo;

	// 사용자 휴대전화
	@Pattern(regexp = "(^$|^01[016789]-?\\d{3,4}-?\\d{4}$)", message = "유효한 휴대전화번호 형식이어야 합니다.", groups = PatternGroup5.class)
	private String telNo;

	// 사용자 이메일
//	@Pattern(regexp = "(^$|^[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,}$)", message = "유효한 이메일 형식이어야 합니다.", groups = PatternGroup.class)
//	@Email
//	private String email;

	// 회사코드(default : 0) - 0 : 옥션 - 1 : Gmarket
	@Builder.Default
	@NotBlank(message = "회사코드는 필수입니다.")
	private Integer companyCode = 0;

	// 사용자 등급(Default : 2) - 0 : 관리자 등급 - 1 : 사용자 등급 - 2 : 운영자 등급
	@Builder.Default
	@NotBlank(message = "사용자 등급은 필수입니다.")
	private Integer userGrade = 2;

	// SMS 사용 여부(Default : Y) - Y / N
	@Builder.Default
	@NotBlank(message = "SMS 사용 여부는 필수 입력 값입니다.")
	private String smsYn = ConstantsUtils.FALG_Y;

	// EXCEL 발송 사용 여부(Default : N)- Y / N
	@Builder.Default
	@NotBlank(message = "EXCEL 발송 사용 여부는 필수 입력 값입니다.")
	private String excelYn = ConstantsUtils.FALG_N;

	// FILE 발송 사용 여부(Default : N) - Y / N
	@Builder.Default
	@NotBlank(message = "FILE 발송 사용 여부는 필수 입력 값입니다.")
	private String fileYn = ConstantsUtils.FALG_N;

	// DB 발송 사용 여부(Default : N) - Y / N
	@Builder.Default
	@NotBlank(message = "DB 발송 사용 여부는 필수 입력 값입니다.")
	private String dbYn = ConstantsUtils.FALG_N;

	// 정보 등록일 (Default : 현재시간)
	private String regDate;

	// 정보 수정일 (Default : 현재시간)
	private String chgDate;

	// 계정 사용 여부(Default : Y) - Y / N
	@Builder.Default
	@NotBlank(message = "DB 발송 사용 여부는 필수 입력 값입니다.")
	private String useYn = ConstantsUtils.FALG_N;

	// 계정 삭제 여부(Default : N) - Y / N
	@Builder.Default
	@NotBlank(message = "계정 삭제 여부는 필수 입력 값입니다.")
	private String delFlag = ConstantsUtils.FALG_N;

	// 사용자를 위한 저장공간 1(텍스트)
	private String userText0;

	// 사용자를 위한 저장공간 2(텍스트)
	private String userText1;

	// LMS 사용 여부(Default : N) - Y / N
	@Builder.Default
	@NotBlank(message = "LMS 사용 여부는 필수 입력 값입니다.")
	private String lmsYn = ConstantsUtils.FALG_N;

	// MMS 사용 여부(Default : N) - Y / N
	@Builder.Default
	@NotBlank(message = "MMS 사용 여부는 필수 입력 값입니다.")
	private String mmsYn = ConstantsUtils.FALG_N;

	// 암호화 된 사용자 암호
	private String enc1Pa;
	
	// DevExtreme 조회 옵션
	private Integer skip = 0;
	private Integer take = 50;
	private List<Object> sort = new ArrayList<>();
	
	@Builder(toBuilder = true)
	private UserDto(int userSeq, String userId, String userPwd, String userName) {
		this.userSeq = userSeq;
		this.userId = userId;
		this.userPwd = userPwd;
		this.userName = userName;
	}
}
