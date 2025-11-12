package com.web.gmarket.hist.service.impl;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
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
		String tableName = histDto.getTableName();
		
		// 월 셋팅하기
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMM");		// yyyyMM 형식의 문자열을 파싱하기 위한 Formatter
		YearMonth month = YearMonth.parse(histDto.getStartDate(), formatter);		
		LocalDate startTime = month.atDay(1);										// 시작일 기준으로 시작 날짜 생성 ex) 2025-11-01
		LocalDate endTime = month.atEndOfMonth();									// 시작일 기준으로 마지막 날짜 생성 ex) 2025-11-30
		
		// 중분류가 빈 값(전체 조회)일 경우 시작일만 조회
		histDto.setStartTime(tableName.isBlank() ? startTime.toString() : histDto.getStartTime());
		histDto.setEndTime(tableName.isBlank() ? endTime.toString() : histDto.getEndTime());
		
		String startDate = histDto.getStartDate();
		String endDate = tableName.isBlank() ? histDto.getStartDate() : histDto.getEndDate();
		
		// 중분류 구분이 전체일 경우 전체 테이블명 가져오기
		String tableNames = commonService.getStatCodeMapper().selectStatCodeList(companyCode, 0).stream()
				.map(StatCodeDto::getTableName)
				.collect(Collectors.joining(","));
		
		// 월별 테이블 존재 여부 확인 및 목록 생성
		List<String> tableList = TableNameUtil.getMonthTableNames(
				companyCode,
				startDate,
				endDate,
				tableName.isBlank() ? tableNames : tableName,
				jdbcTemplateProvider.getJdbcTemplate(dbName)
		);
		
		// 결과 DTO에 세팅
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
