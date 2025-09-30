package com.web.gmarket.send.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.net.ftp.FTPClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.web.gmarket.bulk.broad.dto.BroadcastMsgDto;
import com.web.gmarket.common.dto.CommonSendDto;
import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.DBUtils;
import com.web.gmarket.common.utils.FtpUtils;
import com.web.gmarket.common.vo.FtpDto;
import com.web.gmarket.send.dto.SingleSendDto;
import com.web.gmarket.send.service.SingleSendService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class SingleSendServiceImpl implements SingleSendService {
	
	@Autowired
	private CommonService commonService;
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public Map<String, Integer> insertSingleSend(SingleSendDto singleSendDto) throws Exception {
		
		// 0: 옥션, 1: 지마켓
		int companyCode = singleSendDto.getCompanyCode();
		String dbName = DBUtils.getDBName(companyCode);
		Map<String, Integer> result = new HashMap<>();
		
		// String yyyyMMddHHmmssSSS => Date yyyyMMddHHmmssSSS 변환
		DateTimeFormatter orgFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
		// yyyyMMddHHmmssSSS => yyyy-MM-dd HH:mm:ss:SSS 변환
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
		
		String bMsgKey = String.format("%s%s", Long.toString(System.currentTimeMillis()).substring(0, 10), singleSendDto.getUserId()); // 대량 발송 키 생성
		String subject = singleSendDto.getMsgTitle();
		String content = singleSendDto.isRejectCheckDefault() ? String.format("%s%s", singleSendDto.getMsgWrite(), singleSendDto.getRejectNum()) : singleSendDto.getMsgWrite();
		String reqTime = singleSendDto.getTimeType() == 0 ? "CONVERT(char(20), GETDATE(), 120)" : LocalDateTime.parse(singleSendDto.getSendTime(), orgFormatter).format(formatter);
		String userId = singleSendDto.getUserId();
		String msgType = singleSendDto.getMsgType();
		
		// MMS일 경우 이미지 파일 업로드
		if(ConstantsUtils.MMS.equals(msgType)) {
			FTPClient ftpClient = FtpUtils.createConnection(companyCode, ConstantsUtils.ACTIVE);
			
			FtpDto ftpDto = FtpDto.builder()
					.companyCode(companyCode)
					.msgType(msgType)
					.imageName01(singleSendDto.getImageName01())
					.imageName02(singleSendDto.getImageName02())
					.build();
			
			FtpUtils.uploadFile(ftpClient, ftpDto);
			
			singleSendDto.setImagePath01(ftpDto.getImagePath01());
			singleSendDto.setImagePath02(ftpDto.getImagePath02());
		}
		
		// 데이터 설정
		BroadcastMsgDto broadcastMsgDto = BroadcastMsgDto.builder()
				.bMsgKey(bMsgKey)
				.loginId(userId)
				.userId(userId)
				.title(subject)
				.msg(content)
				.callbackNo(singleSendDto.getTranCallback())
				.cnt(singleSendDto.getTotalCount())
				.succCnt(0)
				.failCnt(0)
				.status(1)
				.svcType(String.format("%s_%s", "SINGLE", msgType.toUpperCase()))
				.sendInfo(singleSendDto.getSendInfo())
				.reqTime(reqTime)
				.timeType(singleSendDto.getTimeType())
				.build();
		
		// 대량 발송 등록
		commonService.getBroadcastMsgMapper(dbName).insertBroadcastMsg(broadcastMsgDto);
		
		// SMS / LMS / MMS 등록
		int succCnt = 0;
		int failCnt = 0;
		int totalCnt = 0;
		
		// 데이터 설정
		CommonSendDto commonSendDto = CommonSendDto.builder().build();
		commonSendDto.setTranDate(reqTime);
		commonSendDto.setTranCallback(singleSendDto.getTranCallback());
		commonSendDto.setTranPhone(singleSendDto.getTranPhone());
		commonSendDto.setTranStatus(1);
		commonSendDto.setTranMsg(content);
		commonSendDto.setBMsgKey(bMsgKey);
		commonSendDto.setReserved3(singleSendDto.getReserved3());
		commonSendDto.setTimeType(singleSendDto.getTimeType());
		
		// MMS인 경우 이미지 경로 저장 및 제목 저장
		if(ConstantsUtils.MMS.equals(msgType)) {
			commonSendDto.setImagePath01(singleSendDto.getImagePath01());
			commonSendDto.setImagePath02(singleSendDto.getImagePath02());
			commonSendDto.setTranTitle(subject);
			
		} else if(ConstantsUtils.MMS.equals(msgType)) commonSendDto.setTranTitle(subject);	// LMS인 경우 제목 저장		
		
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
		++totalCnt;
		commonService.getBroadcastMsgMapper(dbName).updateBroadcastMsgCountByType(bMsgKey, flagCnt > 0 ? ++succCnt : ++failCnt, flagCnt > 0 ? ConstantsUtils.FALG_T : ConstantsUtils.FALG_F);
		
		
		result.put(ConstantsUtils.TOTAL_COUNT, totalCnt);
		result.put(ConstantsUtils.SUCCESS_COUNT, succCnt);
		result.put(ConstantsUtils.FAILD_COUNT, failCnt);
		
		return result;
	}
}