package com.web.gmarket.bulk.hist.service.impl;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.web.gmarket.bulk.hist.service.BulkHistService;
import com.web.gmarket.bulk.hist.dto.BulkHistDto;
import com.web.gmarket.bulk.hist.mapper.BulkHistMapper;

@Service
public class BulkHistServiceImpl implements BulkHistService {
    private final BulkHistMapper bulkHistMapper;
	//private final JdbcTemplate jdbcTemplate;
	
	public BulkHistServiceImpl(BulkHistMapper bulkHistMapper, JdbcTemplate jdbcTemplate) {
		this.bulkHistMapper = bulkHistMapper;
		//this.jdbcTemplate = jdbcTemplate;
	}
	
	@Override
	public List<BulkHistDto> getHistList(BulkHistDto bulkHistDto) {
		// String startMonth = bulkHistDto.getStartDate();
		// String endMonth = bulkHistDto.getEndDate();
		
		// //월별 리스트 생성
		// List<String> tableList = TableNameUtil.getMonthTableNames(startMonth, endMonth, "SMSCLI_TBL_EVENT", jdbcTemplate);
		
		// bulkHistDto.setMonthTables(tableList);
		
		return bulkHistMapper.selectBulkHistList(bulkHistDto);
	}

	@Override
	public int getHistCount(BulkHistDto bulkHistDto) {
		return bulkHistMapper.selectBulkHistCount(bulkHistDto);
	}
}
