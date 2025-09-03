package com.web.gmarket.send.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.send.dto.SendDto;
import com.web.gmarket.send.mapper.SendMapper;
import com.web.gmarket.send.service.SendService;

@Service
public class SendServiceImpl implements SendService {
	
	@Autowired
	private DynamicDataSourceService dynamicDataSourceService;

	@Override
	public int insertSmsEvent(SendDto dto) {
		return 0;
	}

	@Override
	public int insertLmsEvent(SendDto dto) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int insertMmsEvent(SendDto dto) {
		// TODO Auto-generated method stub
		return 0;
	}
	
	public SendMapper getMapper(String dbName) {
		return dynamicDataSourceService.getMapper(dbName, SendMapper.class);
	}
	
}
