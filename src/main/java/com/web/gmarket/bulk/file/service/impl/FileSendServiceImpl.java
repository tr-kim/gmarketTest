package com.web.gmarket.bulk.file.service.impl;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.net.ftp.FTPClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.web.gmarket.bulk.broad.dto.BroadcastMsgDto;
import com.web.gmarket.bulk.broad.mapper.BroadcastMsgMapper;
import com.web.gmarket.bulk.file.dto.FileSendDto;
import com.web.gmarket.bulk.file.service.FileSendService;
import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.dto.CommonSendDto;
import com.web.gmarket.common.mapper.CommonSendMapper;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.DBUtils;
import com.web.gmarket.common.utils.FtpUtils;
import com.web.gmarket.common.vo.FtpDto;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FileSendServiceImpl implements FileSendService {
	
	@Autowired
	private DynamicDataSourceService dynamicDataSourceService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Map<String, Integer> insertFileSend(FileSendDto fileSendDto) throws Exception {
		
		// 0: 옥션, 1: 지마켓
		int companyCode = fileSendDto.getLargeCategory();
		String dbName = DBUtils.getDBName(companyCode);
		Map<String, Integer> result = new HashMap<>();
		
		// String yyyyMMddHHmmssSSS => Date yyyyMMddHHmmssSSS 변환
		DateTimeFormatter orgFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
		// yyyyMMddHHmmssSSS => yyyy-MM-dd HH:mm:ss:SSS 변환
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
		
		String bMsgKey = String.format("%s%s", Long.toString(System.currentTimeMillis()).substring(0, 10), fileSendDto.getUserId()); // 대량 발송 키 생성
		String subject = fileSendDto.getMsgTitle();
		String content = fileSendDto.isRejectCheckDefault() ? String.format("%s%s", fileSendDto.getMsgWrite(), fileSendDto.getRejectNum()) : fileSendDto.getMsgWrite();
		String reqTime = fileSendDto.getTimeType() == 0 ? "CONVERT(char(20), GETDATE(), 120)" : LocalDateTime.parse(fileSendDto.getSendTime(), orgFormatter).format(formatter);
		String userId = fileSendDto.getUserId();
		String msgType = fileSendDto.getMsgType();
		
		// MMS일 경우 이미지 파일 업로드
		if(ConstantsUtils.MMS.equals(msgType)) {
			FTPClient ftpClient = FtpUtils.createConnection(companyCode, ConstantsUtils.ACTIVE);
			
			FtpDto ftpDto = FtpDto.builder()
					.largeCategory(companyCode)
					.msgType(msgType)
					.imageName01(fileSendDto.getImageName01())
					.imageName02(fileSendDto.getImageName02())
					.build();
			
			FtpUtils.uploadFile(ftpClient, ftpDto);
			
			fileSendDto.setImagePath01(ftpDto.getImagePath01());
			fileSendDto.setImagePath02(ftpDto.getImagePath02());
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
		getBroadcastMsgMapper(dbName).insertBroadcastMsg(broadcastMsgDto);
		
		File savedFile = new File(TXT_PATH, fileSendDto.getTextFileName());
		
		int succCnt = 0;
		int failCnt = 0;
		int totalCnt = 0;
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
				
			} else if(ConstantsUtils.MMS.equals(msgType)) commonSendDto.setTranTitle(subject);	// LMS인 경우 제목 저장
			
			// 콤마 기준 split
			String[] numbers = sb.toString().split(",");
			
			for(String number : numbers) {
				commonSendDto.setTranPhone(number.trim().replaceAll("-", "").replaceAll(" ", ""));
				
				int flagCnt = 0;
				switch (msgType) {
					case ConstantsUtils.SMS:
						flagCnt = getCommonSendMapper(dbName).insertSmsEvent(commonSendDto);
						break;
					case ConstantsUtils.LMS:
						flagCnt = getCommonSendMapper(dbName).insertLmsEvent(commonSendDto);
						break;
					case ConstantsUtils.MMS:
						flagCnt = getCommonSendMapper(dbName).insertMmsEvent(commonSendDto);
						break;
					default:
						throw new IllegalArgumentException(String.format("%s%s", "혀용되지 않은 메시지 타입입니다 : ", msgType));
				}
				++totalCnt;
				getBroadcastMsgMapper(dbName).updateBroadcastMsg(bMsgKey, flagCnt > 0 ? ++succCnt : ++failCnt, flagCnt > 0 ? ConstantsUtils.FALG_T : ConstantsUtils.FALG_F);
			}
		}
		
		result.put(ConstantsUtils.TOTAL_COUNT, totalCnt);
		result.put(ConstantsUtils.SUCCESS_COUNT, succCnt);
		result.put(ConstantsUtils.FAILD_COUNT, failCnt);
		
		return result;
	}
	
	public BroadcastMsgMapper getBroadcastMsgMapper(String dbName) {
		return dynamicDataSourceService.getMapper(dbName, BroadcastMsgMapper.class);
	}

	public CommonSendMapper getCommonSendMapper(String dbName) {
		return dynamicDataSourceService.getMapper(dbName, CommonSendMapper.class);
	}
}
