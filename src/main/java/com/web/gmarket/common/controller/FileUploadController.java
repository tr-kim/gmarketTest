package com.web.gmarket.common.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.web.gmarket.common.utils.ConstantsUtils;

@RestController
@RequestMapping("/files/upload")
public class FileUploadController {
	
	@PostMapping("/fileUpload")
	public ResponseEntity<?> uploadFile(
			@RequestParam("files[]") List<MultipartFile> files,
			@RequestParam(value = "imgNumFlag", required = false) String imgNumFlag,
			@RequestParam(value = "fileName1", required = false) String fileName1,
			@RequestParam(value = "fileName2", required = false) String fileName2,
			@RequestParam(value = "sendType", required = true) String sendType
	) {
		Map<String, Object> response = new HashMap<>();
		
		try {
			if (files == null || files.isEmpty()) {
				response.put(ConstantsUtils.STATUS, ConstantsUtils.FAIL);
				response.put(ConstantsUtils.MESSAGE, "업로드할 파일이 없습니다.");
				
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
			}
			
			// 오늘 날짜
			LocalDate today = LocalDate.now();
			String folderMonth = today.format(DateTimeFormatter.ofPattern("yyyyMM"));   // 202509
			String folderDate = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));  // 20250910
			
			// 폴더 경로
			String path = null;
			if ("SINGLE".equalsIgnoreCase(sendType.trim())) {
				path = ConstantsUtils.SINGLE_IMAGE_PATH;
			} else if ("EXCEL".equalsIgnoreCase(sendType.trim())) {
				path = ConstantsUtils.EXCEL_IMAGE_PATH;
			} else if ("FILE".equalsIgnoreCase(sendType.trim())) {
				path = ConstantsUtils.FILE_IMAGE_PATH;
			} else if ("DB".equalsIgnoreCase(sendType.trim())) {
				path = ConstantsUtils.DB_IMAGE_PATH;
			}
			
			Path monthPath = Paths.get(path, folderMonth);
			Path datePath  = Paths.get(monthPath.toString(), folderDate);
			
			// 폴더 생성
			if (!Files.exists(datePath)) {
				Files.createDirectories(datePath);
			}
			
			// 파일 저장
			for (MultipartFile file : files) {
				if (!file.isEmpty()) {
					String originalFileName = file.getOriginalFilename();
					
					// 현재 시간
					LocalDateTime now = LocalDateTime.now();
					String fileDate   = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmSSS")); // 밀리초
					
					String newFileName = fileDate + "_" + originalFileName;
					
					Path filePath = datePath.resolve(newFileName); // C:/path/202509111704963_sample.jpg
					Files.write(filePath, file.getBytes());
					
					// 파일명 리턴
					response.put("fileName", newFileName);
				}
			}
			
			response.put(ConstantsUtils.STATUS, ConstantsUtils.SUCCESS);
			response.put(ConstantsUtils.MESSAGE, "업로드 성공");
			
			return ResponseEntity .status(HttpStatus.OK).body(response);
			
		} catch (Exception e) {
			e.printStackTrace();
			
			response.put(ConstantsUtils.STATUS, ConstantsUtils.ERROR);
			response.put(ConstantsUtils.MESSAGE, "업로드 실패: " + e.getMessage());
			
			return ResponseEntity .status(HttpStatus.INTERNAL_SERVER_ERROR) .body(response);
		}
	}
	
}
