package com.web.gmarket.hist.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.config.JdbcTemplateProvider;
import com.web.gmarket.common.utils.DBUtils;
import com.web.gmarket.common.utils.TableNameUtil;
import com.web.gmarket.hist.dto.HistDto;
import com.web.gmarket.hist.mapper.HistMapper;
import com.web.gmarket.hist.service.HistService;

@Service
public class HistServiceImpl implements HistService {
	
	private final JdbcTemplateProvider jdbcTemplateProvider;
	private final DynamicDataSourceService dynamicDataSourceService;
	
	public HistServiceImpl(JdbcTemplateProvider jdbcTemplateProvider, DynamicDataSourceService dynamicDataSourceService) {
		this.jdbcTemplateProvider = jdbcTemplateProvider;
		this.dynamicDataSourceService = dynamicDataSourceService;
	}
	
	@Override
	public List<HistDto> getHistList(HistDto histDto) {
		String startMonth = histDto.getStartDate();
		String endMonth = histDto.getEndDate();
		String tableName = histDto.getTableName();
		
		String dbName = DBUtils.getDBName(histDto.getCompanyCode());
		
		//월별 리스트 생성
		List<String> tableList = TableNameUtil.getMonthTableNames(startMonth, endMonth, tableName, jdbcTemplateProvider.getJdbcTemplate(dbName));
		histDto.setMonthTables(tableList);
		
		return getMapper(dbName).selectHistList(histDto);
	}
	
	@Override
	public int getHistCount(HistDto histDto) {
		String dbName = DBUtils.getDBName(histDto.getCompanyCode());
		
		return getMapper(dbName).selectHistCount(histDto);
	}
	
	public HistMapper getMapper(String dbName) {
		return dynamicDataSourceService.getMapper(dbName, HistMapper.class);
	}
}
