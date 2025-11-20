package com.web.gmarket.bulk.file.service;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.web.gmarket.bulk.file.dto.FileSendDto;
import com.web.gmarket.common.vo.UploadProgress;

public interface FileSendService {
	
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
	public Map<String, Object> uploadTxtFile(MultipartFile file, String userId);
    
}
