package com.web.gmarket.bulk.excel.dto;

import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.validation.ValidationGroups.MinGroup1;
import com.web.gmarket.common.validation.ValidationGroups.NotBlankGroup1;
import com.web.gmarket.common.validation.ValidationGroups.NotBlankGroup2;
import com.web.gmarket.common.validation.ValidationGroups.NotBlankGroup3;
import com.web.gmarket.common.validation.ValidationGroups.NotBlankGroup4;
import com.web.gmarket.common.validation.ValidationGroups.NotBlankGroup5;
import com.web.gmarket.common.validation.ValidationGroups.NotBlankGroup6;
import com.web.gmarket.common.validation.ValidationGroups.NotBlankGroup7;
import com.web.gmarket.common.validation.ValidationGroups.NotBlankGroup8;
import com.web.gmarket.common.validation.ValidationGroups.PatternGroup1;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ExcelSendDto {

	// 엑셀 파일 이름
	@NotBlank(message = "엑셀파일을 선택해주세요.", groups = NotBlankGroup1.class)
	private String excelFileName;
	
	// 엑셀 시트
	@NotBlank(message = "시트를 선택하세요.", groups = NotBlankGroup2.class)
	private String sheet;
	
	// 발신번호 유형
	// 0 : 직접입력, 1 : 시트 선택
	private Integer callbackSelect = 0;
	
	// 발신번호
	@NotBlank(message = "회신번호를 입력하세요.", groups = NotBlankGroup3.class)
	private String callback;
	
	// 수신번호 유형
	// 0 : 직접입력, 1 : 시트 선택
	private Integer calleeSelect = 0;
	
	// 수신번호
	@NotBlank(message = "수신번호를 입력하세요.", groups = NotBlankGroup3.class)
	private String callee;
	
	// 대분류 - 0 : 옥션, 1 : G마켓
	@Min(value = 0, message = "대분류를 선택하세요.", groups = MinGroup1.class)
	private Integer largeCategory = ConstantsUtils.AUCTION_CODE;
	
	// 사용자 아이디
	@NotBlank(message = "사용자아이디를 입력 하세요.", groups = NotBlankGroup4.class)
	private String userId;
	
	// 메시지 제목
	private String msgTitle;
	
	// 메시지 유형
	// SMS(default), LMS, MMS
	@NotBlank(message = "메시지 분류를 선택하세요.", groups = NotBlankGroup5.class) 
	private String msgType = ConstantsUtils.SMS;
	
	// 메시지 내용
	@NotBlank(message = "메시지를 입력하세요.", groups = NotBlankGroup6.class)
	private String msgWrite;
	
	// 전송대상
	@NotBlank(message = "전송대상을 입력 하세요.", groups = NotBlankGroup7.class)
	private String sendInfo;
	
	// SMS 수신여부
	@NotBlank(message = "SMS 수신여부를 선택하세요.", groups = NotBlankGroup8.class)
	private String reserved;
	
	// 수신 거부 여부
	private boolean rejectCheckDefault = false;
	
	// 수신 거부 번호 옥션(default), 지마켓
	private String rejectNum = ConstantsUtils.AUCTION_REJECT_NUM;
	
	// 발송시간 유형 0 : 즉시, 1 : 예약
	private Integer timeType = 0;
	
	// 발송 시간
	@Pattern(
        regexp = "^(19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])([01][0-9]|2[0-3])([0-5][0-9])([0-5][0-9])\\d{3}$",
        message = "날짜는 yyyyMMddHHmmssSSS 형식이어야 합니다 (예: 20251225143025123)",
        groups = PatternGroup1.class
    )
	private String sendTime;
	
	// 분할 전송 여부 Y, N
	private String splitSend = ConstantsUtils.FALG_N;
	
	// 분할 전송
	private Integer splitMinute = 0;
	private Integer splitNum = 0;
	
	// 전송 범위 여부
	private boolean tranCheckDefault = false;
	
	// 전송 범위
	private Integer tranRangeStart = 0;
	private Integer tranRangeEnd = 0;
	
	// 이미지 유형 0 : image_path_1, 1 : image_path_1, image_path_2, 기타 image_path_2
	private Integer preViewFlag = 0;
	
	// 이미지 이름
	private String imageName01;
	private String imageName02;
	
	// 이미지 경로
	private String imagePath01;
	private String imagePath02;
}
