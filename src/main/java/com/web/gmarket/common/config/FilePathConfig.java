package com.web.gmarket.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import com.web.gmarket.common.utils.ConstantsUtils;

import lombok.Getter;
import lombok.Setter;

@Component
@ConfigurationProperties(prefix = "file.path")
@Getter
@Setter
public class FilePathConfig {

	private String excel;
	private String txt;
	
	private String imageSingle;
	private String imageExcel;
	private String imageFile;
	private String imageDb;
	
	public String getImageFilePath(String type) {
	    return switch(type) {
	        case ConstantsUtils.SEND_TYPE_SINGLE -> this.imageSingle;
	        case ConstantsUtils.SEND_TYPE_EXCEL -> this.imageExcel;
	        case ConstantsUtils.SEND_TYPE_FILE -> this.imageFile;
	        case ConstantsUtils.SEND_TYPE_DB -> this.imageDb;
	        default -> throw new IllegalArgumentException("Unknown type: " + type);
	    };
	}
}
