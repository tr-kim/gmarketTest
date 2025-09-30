package com.web.gmarket.common.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FtpDto {

	private Integer companyCode;
	private String msgType;
	private String imageName01;
	private String imageName02;
	private String imagePath01;
	private String imagePath02;
}
