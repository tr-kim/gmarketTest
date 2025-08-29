package com.web.gmarket.bulk.file.controller;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.web.gmarket.bulk.file.service.FileSendService;
import com.web.gmarket.common.auth.dto.UserDetailsDto;

@RestController
@RequestMapping("/api/v1/fileSend")
public class RestFileSendController {
	
	/**
	 * 텍스트 파일 업로드
	 */
	@PostMapping("/txtUpload")
	public Map<String, Object> uploadTxtFile(@RequestParam("file") MultipartFile file, Authentication authentication) {
		
		UserDetailsDto user = (UserDetailsDto) authentication.getPrincipal();
		String userId = user.getUserId();
		
		return FileSendService.uploadTxtFile(file, userId);
	}
	
	
}
