package com.web.gmarket.hist.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.web.gmarket.common.config.JdbcTemplateProvider;
import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.common.utils.DBUtils;
import com.web.gmarket.common.utils.TableNameUtil;
import com.web.gmarket.hist.dto.HistDto;
import com.web.gmarket.hist.service.HistService;
import com.web.gmarket.stat.dto.StatCodeDto;

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
		Integer companyCode = histDto.getCompanyCode();
		String dbName = DBUtils.getDBName(companyCode);
		
		//월별 리스트 생성
		String startMonth = histDto.getStartDate();
		String endMonth = histDto.getEndDate();
		String tableName = histDto.getTableName();
		
		// 중분류 구분이 전체일 경우 테이블 이름 가져오기
		String tableNames = commonService.getStatCodeMapper().selectStatCodeList(companyCode, 0).stream()
				.map(StatCodeDto::getTableName)
				.collect(Collectors.joining(","));
		
		List<String> tableList = TableNameUtil.getMonthTableNames(companyCode, startMonth, endMonth, tableName.isBlank() ? tableNames : tableName, jdbcTemplateProvider.getJdbcTemplate(dbName));
		
		histDto.setMonthTables(tableList);
		
		return commonService.getHistMapper(dbName).selectHistList(histDto);
	}
	
	@Override
	public int getHistCount(HistDto histDto) {
		Integer companyCode = histDto.getCompanyCode();
		String dbName = DBUtils.getDBName(companyCode);
		
		return commonService.getHistMapper(dbName).selectHistCount(histDto);
	}
}
