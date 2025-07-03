package com.web.gmarket.hist.service.impl;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.web.gmarket.common.utils.TableNameUtil;
import com.web.gmarket.hist.dto.HistDto;
import com.web.gmarket.hist.mapper.HistMapper;
import com.web.gmarket.hist.service.HistService;

@Service
public class HistServiceImpl implements HistService {
	
	private final HistMapper histMapper;
	private final JdbcTemplate jdbcTemplate;
	
	public HistServiceImpl(HistMapper histMapper, JdbcTemplate jdbcTemplate) {
		this.histMapper = histMapper;
		this.jdbcTemplate = jdbcTemplate;
	}
	
	@Override
	public List<HistDto> getHistList(HistDto histDto) {
		String startMonth = histDto.getStartDate();
		String endMonth = histDto.getEndDate();
		String tableName = histDto.getTableName();
		
		//월별 리스트 생성
		List<String> tableList = TableNameUtil.getMonthTableNames(startMonth, endMonth, tableName, jdbcTemplate);
		histDto.setMonthTables(tableList);
		
		return histMapper.selectHistList(histDto);
	}
}
