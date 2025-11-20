package com.web.gmarket.bulk.excel.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.web.gmarket.bulk.excel.dto.ExcelSendDto;
import com.web.gmarket.common.vo.UploadProgress;

public interface ExcelSendService {
	
	/**
	 * 엑셀 발송
	 *
	 * @param dto
	 * @param uploadStatus
	 * @param jobId
	 * @throws Exception 
	 */
	public void insertExcelSend(ExcelSendDto dto, Map<String, UploadProgress> uploadStatus, String jobId) throws Exception;
	
	/**
	 * 엑셀 파일 업로드 및 시트 목록 추출
	 * @throws IOException 
	 */
	public Map<String, Object> uploadExcelFile(MultipartFile file, String userId) throws IOException;
	
	/**
	 * 엑셀 파일 검증
	 * @throws IOException 
	 */
	public Map<String, Object> validateExcelFile(String excelFile, String sheetName) throws IOException;
	
	/**
	 * 엑셀 시트 읽기
	 * @throws IOException 
	 */
	public Map<String, Object> readExcelData(String excelFile, String sheetName) throws IOException;
	
	/**
	 * 발신번호, 수신번호 치환
	 */
	public String applyTranNum(String flag, String colLetters, String directValue, List<String> row);
	
	/**
	 * 메시지 치환
	 */
	public String applyMessage(String template, List<String> row);
	
	/**
	 * 메시지 길이(한글: 2 / 영어,숫자: 1)
	 */
	public int getSMSLen(String str);
	
	/**
	 * 메시지 에러 체크
	 */
	public String checkStrLen(int messageLen, int titleLen, String callee, String callback, String messageType);
	
}
