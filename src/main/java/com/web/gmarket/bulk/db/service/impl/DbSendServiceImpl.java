package com.web.gmarket.bulk.db.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.DBUtils;
import com.web.gmarket.bulk.db.dto.DbSendDto;
import com.web.gmarket.bulk.db.mapper.DbSendMapper;
import com.web.gmarket.bulk.db.service.DbSendService;

@Service
public class DbSendServiceImpl implements DbSendService {
	private final DynamicDataSourceService dynamicDataSourceService;
	
	public DbSendServiceImpl(DynamicDataSourceService dynamicDataSourceService) {
		this.dynamicDataSourceService = dynamicDataSourceService;
	}
	
	// 메시지 타입별 테이블명 치환
	private String resolveTableName(String messageType) {
		switch (messageType) {
			case "sms": return ConstantsUtils.SMSCLI_TBL_LARGE;
			case "lms": return ConstantsUtils.LMSCLI_TBL_LARGE;
			case "mms": return ConstantsUtils.MMSCLI_TBL_LARGE;
			default: return ConstantsUtils.SMSCLI_TBL_LARGE;
		}
	}
	
	// 요청번호 목록 조회
	@Override
	public List<DbSendDto> getDbSendList(DbSendDto dbSendDto) {
		// 테이블명 세팅
		dbSendDto.setTableName(resolveTableName(dbSendDto.getMessageType()));
		
		String dbName = DBUtils.getDBName(dbSendDto.getCompanyCode());
		return getMapper(dbName).selectDbSendList(dbSendDto);
	}
	
	// 요청번호 카운트 조회
	@Override
	public int getDbSendCount(DbSendDto dbSendDto) {
		// 테이블명 세팅
		dbSendDto.setTableName(resolveTableName(dbSendDto.getMessageType()));
		
		String dbName = DBUtils.getDBName(dbSendDto.getCompanyCode());
		return getMapper(dbName).selectDbSendCount(dbSendDto);
	}
	
	// 요청번호 삭제
	@Override
    public int deleteDbSend(DbSendDto dbSendDto) {
		// 테이블명 세팅
        dbSendDto.setTableName(dbSendDto.getResultTable());
        
        String dbName = DBUtils.getDBName(dbSendDto.getResultCompany());
        return getMapper(dbName).deleteDbSend(dbSendDto);
    }
	
	private DbSendMapper getMapper(String dbName) {
		return dynamicDataSourceService.getMapper(dbName, DbSendMapper.class);
	}
	
}

