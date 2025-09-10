package com.web.gmarket.bulk.db.service;

import java.util.List;

import com.web.gmarket.bulk.db.dto.DbSendDto;

public interface DbSendService {
	
	List<DbSendDto> getDbSendList(DbSendDto dbSendDto);
	
	int getDbSendCount(DbSendDto dbSendDto);
	
	int deleteDbSend(DbSendDto dbSendDto);
}
