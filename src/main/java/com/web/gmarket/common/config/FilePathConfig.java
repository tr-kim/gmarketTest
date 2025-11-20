package com.web.gmarket.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

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
	
}
