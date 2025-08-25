package com.web.gmarket.bulk.file.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.web.gmarket.common.auth.dto.UserDetailsDto;

@RestController
@RequestMapping("/api/v1/fileSend")
public class RestFileSendController {
	
	final int TEXT_ROW_MAX = 200000;
	
	final String TXT_EXTENSION = ".txt";
	final String TXT_PATH   = "C:/excel_web/data";
	
	
	/**
	 * 텍스트 파일 업로드
	 */
	@PostMapping("/txtUpload")
	public Map<String, Object> uploadTxtFile(@RequestParam("file") MultipartFile file, Authentication authentication) throws IOException {
		Map<String, Object> result = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
		
		// 1. 파일 저장 경로
		String uploadDir = TXT_PATH;
		File dir = new File(uploadDir);
		if (!dir.exists()) {
			dir.mkdirs();
		}
		
		// 2. 확장자 체크
		String originalFilename = file.getOriginalFilename();
		if (originalFilename == null || !originalFilename.toLowerCase().endsWith(TXT_EXTENSION)) {
			result.put("status", "error");
			result.put("message", "txt 파일 형식이 아닙니다.");
			return result;
		}
		
		// 3. 파일 크기 체크
		if (file.isEmpty() || file.getSize() == 0) {
			result.put("status", "error");
			result.put("message", "파일 크기가 잘못되었습니다.");
			return result;
		}
	    
		// 4. 파일 저장
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		String nowStr = sdf.format(new Date());		
		//String savedFileName = "SEND_" + nowStr + "_" + originalFilename;
		
		//String userId = ((UserDetails) authentication.getPrincipal()).getUsername(); // 서버 세션 ID
		UserDetailsDto user = (UserDetailsDto) authentication.getPrincipal();
		String userId = user.getUserId();
		String savedFileName = "SEND_" + nowStr + "_" + userId + TXT_EXTENSION;
		
		File savedFile = new File(uploadDir + "/" + savedFileName);
		file.transferTo(savedFile);
		
		List<Map<String, Object>> textNumbers = new ArrayList<>();
		
		// 5. 파일 읽기
		try (BufferedReader br = new BufferedReader(new FileReader(savedFile))) {
			StringBuilder sb = new StringBuilder();
			String line;
			while ((line = br.readLine()) != null) {
				sb.append(line);
			}
			
			// 콤마 기준으로 split
			String[] numbers = sb.toString().split(",");
			
			for (int i = 0; i < numbers.length; i++) {
				String cleanNum = numbers[i].trim();
				if (!cleanNum.isEmpty()) {
					Map<String, Object> row = new HashMap<>();
					row.put("idx", i + 1); // 행번호
					row.put("value", cleanNum); // 수신번호
					textNumbers.add(row);
				}
			}
			
			// 6. 20만 건 체크
			if (textNumbers.size() > TEXT_ROW_MAX) {
				result.put("status", "error");
				result.put("message", "최대 20만 건을 초과할 수 없습니다. (현재: " + textNumbers.size() + "건)");
				return result;
			}
			
			// 리턴값 셋팅
			data.put("txtFile", savedFileName);
			data.put("count", textNumbers.size());
			data.put("textNumber", textNumbers);
			
			result.put("status", "success");
			result.put("retData", data);
			
		} catch (Exception e) {
			result.put("status", "error");
			result.put("message", e.getMessage());
			
		} finally {
			// 4. 파일 삭제
			// savedFile.delete();
		}
		
		return result;
	}
	
	
}

