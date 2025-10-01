package com.web.gmarket.bulk.file.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.web.gmarket.bulk.file.dto.FileSendDto;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.vo.UploadProgress;

public interface FileSendService {
	
	int TEXT_ROW_MAX = ConstantsUtils.TEXT_ROW_MAX;
	
	String TXT_EXTENSION = ConstantsUtils.TXT_EXTENSION;
	String TXT_PATH   = ConstantsUtils.TXT_PATH;
	
	
	/**
	 * 파일 전송
	 * 
	 * @param dto
	 * @param uploadStatus
	 * @param jobId
	 * @return
	 * @throws Exception 
	 */
	public void insertFileSend(FileSendDto dto, Map<String, UploadProgress> uploadStatus, String jobId) throws Exception;
	
    /**
     * 텍스트 파일 업로드 및 데이터 파싱
     */
	public static Map<String, Object> uploadTxtFile(MultipartFile file, String userId) {
		Map<String, Object> result = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
		
		// 1. 파일 저장 경로
		File dir = new File(TXT_PATH);
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
		
		// 4. 저장 파일명 생성
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		String nowStr = sdf.format(new Date());
		
		// String savedFileName = "SEND_" + nowStr + "_" + originalFilename;
		String savedFileName = "SEND_" + nowStr + "_" + userId + TXT_EXTENSION;
		File savedFile = new File(TXT_PATH, savedFileName);
		
		List<Map<String, Object>> textNumbers = new ArrayList<>();
		
		try {
			// 5. 파일 저장
			file.transferTo(savedFile);
			
			// 6. 파일 읽기
			try (BufferedReader br = new BufferedReader(new FileReader(savedFile))) {
				StringBuilder sb = new StringBuilder();
				String line;
				while ((line = br.readLine()) != null) {
					sb.append(line);
				}
				
				// 콤마 기준 split
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
			}
			
			// 7. 20만 건 제한 체크
			if (textNumbers.size() > TEXT_ROW_MAX) {
				result.put("status", "error");
				result.put("message", "최대 20만 건을 초과할 수 없습니다. (현재: " + textNumbers.size() + "건)");
				return result;
			}
			
			data.put("txtFile", savedFileName);
			data.put("count", textNumbers.size());
			data.put("textNumber", textNumbers);
			
			result.put("status", "success");
			result.put("retData", data);
			
		} catch (Exception e) {
			result.put("status", "error");
			result.put("message", e.getMessage());
			
		} finally {
			// 파일 삭제
			// savedFile.delete();
		}
		
		return result;
	}
    
    
}
