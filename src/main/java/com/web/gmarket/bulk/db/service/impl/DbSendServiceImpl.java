package com.web.gmarket.bulk.db.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.commons.net.ftp.FTPClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.web.gmarket.bulk.broad.dto.BroadcastMsgDto;
import com.web.gmarket.bulk.db.dto.DbSendDto;
import com.web.gmarket.bulk.db.service.DbSendService;
import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.DBUtils;
import com.web.gmarket.common.utils.FtpUtils;
import com.web.gmarket.common.vo.FtpDto;

@Service
public class DbSendServiceImpl implements DbSendService {
	
	@Autowired
	private CommonService commonService;
	
	// 메시지 타입별 테이블명 치환
	private String resolveTableName(String messageType) {
		switch (messageType) {
			case ConstantsUtils.SMS: return ConstantsUtils.SMSCLI_TBL_LARGE;
			case ConstantsUtils.LMS: return ConstantsUtils.LMSCLI_TBL_LARGE;
			case ConstantsUtils.MMS: return ConstantsUtils.MMSCLI_TBL_LARGE;
			default: return ConstantsUtils.SMSCLI_TBL_LARGE;
		}
	}
	
	// 요청번호 목록 조회
	@Override
	public List<DbSendDto> getDbSendList(DbSendDto dbSendDto) {
		// 테이블명 세팅
		dbSendDto.setTableName(resolveTableName(dbSendDto.getMessageType()));
		
		String dbName = DBUtils.getDBName(dbSendDto.getCompanyCode());
		return commonService.getDbSendMapper(dbName).selectDbSendList(dbSendDto);
	}
	
	// 요청번호 카운트 조회
	@Override
	public int getDbSendCount(DbSendDto dbSendDto) {
		// 테이블명 세팅
		dbSendDto.setTableName(resolveTableName(dbSendDto.getMessageType()));
		
		String dbName = DBUtils.getDBName(dbSendDto.getCompanyCode());
		return commonService.getDbSendMapper(dbName).selectDbSendCount(dbSendDto);
	}
	
	// 요청번호 삭제
	@Override
    public int deleteDbSend(DbSendDto dbSendDto) {
		// 테이블명 세팅
        dbSendDto.setTableName(dbSendDto.getResultTable());
        
        String dbName = DBUtils.getDBName(dbSendDto.getResultCompany());
        return commonService.getDbSendMapper(dbName).deleteDbSend(dbSendDto);
    }
	
	// DB 발송
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int insertDbSend(DbSendDto dbSendDto) throws Exception {
		int result = 0;
		
		String dbName = DBUtils.getDBName(dbSendDto.getLargeCategory());
		dbSendDto.setTableName(resolveTableName(dbSendDto.getMsgType()));
		
		// DB 발송 전 요청번호 삭제
		commonService.getDbSendMapper(dbName).deleteDbSend(dbSendDto);
		
		// MMS일 경우 이미지 파일 업로드
		if(ConstantsUtils.MMS.equals(dbSendDto.getMsgType())) {
			FTPClient ftpClient = FtpUtils.createConnection(dbSendDto.getLargeCategory(), ConstantsUtils.ACTIVE);
			
			FtpDto ftpDto = FtpDto.builder()
					.largeCategory(dbSendDto.getLargeCategory())
					.msgType(dbSendDto.getMsgType())
					.imageName01(dbSendDto.getImageName01())
					.imageName02(dbSendDto.getImageName02())
					.build();
			
			FtpUtils.uploadFile(ftpClient, ftpDto);
			
			dbSendDto.setImagePath01(ftpDto.getImagePath01());
			dbSendDto.setImagePath02(ftpDto.getImagePath02());
		}
		
		// String yyyyMMddHHmmssSSS => Date yyyyMMddHHmmssSSS 변환
		DateTimeFormatter orgFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
		// yyyyMMddHHmmssSSS => yyyy-MM-dd HH:mm:ss:SSS 변환
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
		
		String bMsgKey = String.format("%s%s", Long.toString(System.currentTimeMillis()).substring(0, 10), dbSendDto.getUserId()); // 대량 발송 키 생성
		String subject = dbSendDto.getMsgTitle();
		String content = dbSendDto.isRejectCheckDefault() ? String.format("%s%s", dbSendDto.getMsgWrite(), dbSendDto.getRejectNum()) : dbSendDto.getMsgWrite();
		String reqTime = dbSendDto.getTimeType() == 0 ? "CONVERT(char(20), GETDATE(), 120)" : LocalDateTime.parse(dbSendDto.getSendTime(), orgFormatter).format(formatter);
		String userId = dbSendDto.getUserId();
		String msgType = dbSendDto.getMsgType();
		
		// 데이터 설정
		BroadcastMsgDto broadcastMsgDto = BroadcastMsgDto.builder()
				.bMsgKey(bMsgKey)
				.loginId(userId)
				.userId(userId)
				.title(subject)
				.msg(content)
				.callbackNo(dbSendDto.getTranCallback())
				.cnt(dbSendDto.getTotalCount())
				.succCnt(0)
				.failCnt(0)
				.status(1)
				.svcType(String.format("%s_%s", "DB", msgType.toUpperCase()))
				.sendInfo(dbSendDto.getSendInfo())
				.reqTime(reqTime)
				.timeType(dbSendDto.getTimeType())
				.build();
		
		// 대량 발송 등록
		int cnt = commonService.getBroadcastMsgMapper(dbName).insertBroadcastMsg(broadcastMsgDto);
		
		if(cnt > 0) {
			
			// 총 건수
			int totalCnt = dbSendDto.getTotalCount();
			
			// 성공 건수
			int updateCnt = commonService.getDbSendMapper(dbName).updateDbSend(dbSendDto);
			
			// 성공 실패 건수 업데이트
			commonService.getBroadcastMsgMapper(dbName).updateBroadcastMsgCount(bMsgKey, updateCnt, (totalCnt - updateCnt), msgType);
			
			result = updateCnt;
		}
	
		return result;
	}
}

