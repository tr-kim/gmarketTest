package com.web.gmarket.bulk.db.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.web.gmarket.common.config.DynamicDataSourceService;
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
	
	@Override
	public List<DbSendDto> getDbSendList(DbSendDto dbSendDto) {
		String dbName = DBUtils.getDBName(dbSendDto.getCompanyCode());
		
		// 테이블명 세팅
		dbSendDto.setTableName(resolveTableName(dbSendDto.getMessageType()));
		
		return getMapper(dbName).selectDbSendList(dbSendDto);
	}
	
	@Override
	public int getDbSendCount(DbSendDto dbSendDto) {
		String dbName = DBUtils.getDBName(dbSendDto.getCompanyCode());
		return getMapper(dbName).selectDbSendCount(dbSendDto);
	}

	// 삭제 추가
	@Override
	public int deleteDbSend(DbSendDto dbSendDto) {
		String dbName = DBUtils.getDBName(dbSendDto.getCompanyCode());
		
		// 테이블명 세팅
		dbSendDto.setTableName(resolveTableName(dbSendDto.getMessageType()));
		
		return getMapper(dbName).deleteDbSend(dbSendDto);
	}
	
	private DbSendMapper getMapper(String dbName) {
		return dynamicDataSourceService.getMapper(dbName, DbSendMapper.class);
	}
	
	// 테이블명 변환 공통화
	private String resolveTableName(String messageType) {
		switch (messageType) {
			case "sms": return "SMSCLI_TBL_LARGE";
			case "lms": return "LMSCLI_TBL_LARGE";
			case "mms": return "MMSCLI_TBL_LARGE";
			default: return "SMSCLI_TBL_LARGE";
		}
	}
}

