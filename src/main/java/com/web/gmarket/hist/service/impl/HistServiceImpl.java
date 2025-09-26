package com.web.gmarket.hist.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.web.gmarket.common.config.JdbcTemplateProvider;
import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.common.utils.DBUtils;
import com.web.gmarket.common.utils.TableNameUtil;
import com.web.gmarket.hist.dto.HistDto;
import com.web.gmarket.hist.service.HistService;

@Service
public class HistServiceImpl implements HistService {
	
	private final JdbcTemplateProvider jdbcTemplateProvider;
	private final CommonService commonService;
	
	public HistServiceImpl(JdbcTemplateProvider jdbcTemplateProvider, CommonService commonService) {
		this.jdbcTemplateProvider = jdbcTemplateProvider;
		this.commonService = commonService;
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
		
		return commonService.getHistMapper(dbName).selectHistList(histDto);
	}
	
	@Override
	public int getHistCount(HistDto histDto) {
		String dbName = DBUtils.getDBName(histDto.getCompanyCode());
		
		return commonService.getHistMapper(dbName).selectHistCount(histDto);
	}
}
