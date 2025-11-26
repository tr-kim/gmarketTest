package com.web.gmarket.bulk.file.service.impl;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.net.ftp.FTPClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.web.gmarket.bulk.broad.dto.BroadcastMsgDto;
import com.web.gmarket.bulk.file.dto.FileSendDto;
import com.web.gmarket.bulk.file.service.FileSendService;
import com.web.gmarket.common.dto.CommonSendDto;
import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.DBUtils;
import com.web.gmarket.common.vo.FtpDto;
import com.web.gmarket.common.vo.UploadProgress;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FileSendServiceImpl implements FileSendService {
	
	private final CommonService commonService;
	
	public FileSendServiceImpl(CommonService commonService) {
		this.commonService = commonService;
	}
	
	int TEXT_ROW_MAX = ConstantsUtils.TEXT_ROW_MAX;
	String TXT_EXTENSION = ConstantsUtils.TXT_EXTENSION;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void insertFileSend(FileSendDto fileSendDto, Map<String, UploadProgress> uploadStatus, String jobId) throws Exception {
		
		// 0: 옥션, 1: 지마켓
		int companyCode = fileSendDto.getCompanyCode();
		String dbName = DBUtils.getDBName(companyCode);
		
		// String yyyyMMddHHmmssSSS => Date yyyyMMddHHmmssSSS 변환
		DateTimeFormatter orgFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
		// yyyyMMddHHmmssSSS => yyyy-MM-dd HH:mm:ss:SSS 변환
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
		
		String bMsgKey = String.format("%s%s", Long.toString(System.currentTimeMillis()).substring(0, 10), fileSendDto.getUserId()); // 대량 발송 키 생성
		String subject = fileSendDto.getMsgTitle();
		String content = fileSendDto.isRejectCheckDefault() ? String.format("%s%s", fileSendDto.getMsgWrite(), fileSendDto.getRejectNum()) : fileSendDto.getMsgWrite();
		String reqTime = fileSendDto.getTimeType() == 0 ? "CONVERT(char(20), GETDATE(), 120)" : LocalDateTime.parse(fileSendDto.getSendTime(), orgFormatter).format(formatter);
		String userId = fileSendDto.getUserId();
		String msgType = fileSendDto.getMsgType().toLowerCase();
		
		// MMS일 경우 이미지 파일 업로드
		if(ConstantsUtils.MMS.equals(msgType)) {
			
			try {
				
				// FTP 연결
				uploadStatus.put(jobId, new UploadProgress(0, 0, 0, "MMS 이미지 파일 업로드"));
				FTPClient ftpClient = commonService.createConnection(companyCode, ConstantsUtils.ACTIVE);
				
				// 파일 정보 셋팅
				FtpDto ftpDto = FtpDto.builder()
						.companyCode(companyCode)
						.msgType(msgType)
						.sendType(ConstantsUtils.SEND_TYPE_FILE)
						.imageName01(fileSendDto.getImageName01())
						.imageName02(fileSendDto.getImageName02())
						.build();
				
				// 파일 업로드
				commonService.uploadFile(ftpClient, ftpDto);
				
				// 파일 경로 저장
				fileSendDto.setImagePath01(ftpDto.getImagePath01());
				fileSendDto.setImagePath02(ftpDto.getImagePath02());
				
			} catch (IOException e) {
				throw new IOException(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> insertFileSend FTP 에러 발생 ", e);
			}
			
		}
		
		// 데이터 설정
		BroadcastMsgDto broadcastMsgDto = BroadcastMsgDto.builder()
				.bMsgKey(bMsgKey)
				.loginId(userId)
				.userId(userId)
				.title(subject)
				.msg(content)
				.callbackNo(fileSendDto.getCallbackNo())
				.cnt(fileSendDto.getTotalCount())
				.succCnt(0)
				.failCnt(0)
				.status(1)
				.svcType(String.format("%s_%s", "FILE", msgType.toUpperCase()))
				.sendInfo(fileSendDto.getSendInfo())
				.reqTime(reqTime)
				.timeType(fileSendDto.getTimeType())
				.build();
		
		// 대량 발송 등록
		uploadStatus.put(jobId, new UploadProgress(0, 0, 0, "대량 발송 등록"));
		commonService.getBroadcastMsgMapper(dbName).insertBroadcastMsg(broadcastMsgDto);
		
		// 파일 읽기
		uploadStatus.put(jobId, new UploadProgress(0, 0, 0, "파일 읽기"));
		File savedFile = new File(commonService.getFilePath(ConstantsUtils.TXT), fileSendDto.getTextFileName());
		
		int succCnt = 0;
		int failCnt = 0;
		int totalCnt = fileSendDto.getTotalCount();
		int sendCnt = 0;
		try (BufferedReader br = new BufferedReader(new FileReader(savedFile))) {
			StringBuilder sb = new StringBuilder();
			String line;
			while ((line = br.readLine()) != null) {
				sb.append(line);
			}
			
			// 데이터 설정
			CommonSendDto commonSendDto = CommonSendDto.builder().build();
			commonSendDto.setTranDate(reqTime);
			commonSendDto.setTranCallback(fileSendDto.getCallbackNo());
			commonSendDto.setTranStatus(1);
			commonSendDto.setTranMsg(content);
			commonSendDto.setBMsgKey(bMsgKey);
			commonSendDto.setReserved3(fileSendDto.getReserved());
			commonSendDto.setTimeType(fileSendDto.getTimeType());
			
			// MMS인 경우 이미지 경로 저장 및 제목 저장
			if(ConstantsUtils.MMS.equals(msgType)) {
				commonSendDto.setImagePath01(fileSendDto.getImagePath01());
				commonSendDto.setImagePath02(fileSendDto.getImagePath02());
				commonSendDto.setTranTitle(subject);
				
			} else if(ConstantsUtils.LMS.equals(msgType)) commonSendDto.setTranTitle(subject);	// LMS인 경우 제목 저장
			
			// 콤마 기준 split
			String[] numbers = sb.toString().split(",");
			
			for(String number : numbers) {
				commonSendDto.setTranPhone(number.trim().replaceAll("-", "").replaceAll(" ", ""));
				
				int flagCnt = 0;
				switch (msgType) {
					case ConstantsUtils.SMS:
						flagCnt = commonService.getCommonSendMapper(dbName).insertSmsEvent(commonSendDto);
						break;
					case ConstantsUtils.LMS:
						flagCnt = commonService.getCommonSendMapper(dbName).insertLmsEvent(commonSendDto);
						break;
					case ConstantsUtils.MMS:
						flagCnt = commonService.getCommonSendMapper(dbName).insertMmsEvent(commonSendDto);
						break;
					default:
						throw new IllegalArgumentException(String.format("%s%s", "혀용되지 않은 메시지 타입입니다 : ", msgType));
				}
				commonService.getBroadcastMsgMapper(dbName).updateBroadcastMsgCountByType(bMsgKey, flagCnt > 0 ? ++succCnt : ++failCnt, flagCnt > 0 ? ConstantsUtils.FLAG_T : ConstantsUtils.FLAG_F);
				++sendCnt;
				
				int progress = (int) (((float) sendCnt / totalCnt) * 100);
				uploadStatus.put(jobId, new UploadProgress(progress, succCnt, totalCnt, String.format("%d/%d 건 처리 완료", succCnt, totalCnt)));
			}
		}
	}

	@Override
	public Map<String, Object> uploadTxtFile(MultipartFile file, String userId) {
		Map<String, Object> result = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
		
		// 1. 파일 저장 경로
		File dir = new File(commonService.getFilePath(ConstantsUtils.TXT));
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
		// String savedFileName = "SEND_" + nowStr + "_" + userId + TXT_EXTENSION; 
		String savedFileName = String.format("SEND_%s_%s%s", nowStr, userId, TXT_EXTENSION); 
		File savedFile = new File(commonService.getFilePath(ConstantsUtils.TXT), savedFileName);
		
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
