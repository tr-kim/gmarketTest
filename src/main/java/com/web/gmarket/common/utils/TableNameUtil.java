package com.web.gmarket.common.utils;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;

public class TableNameUtil {
	
	public static List<String> getMonthTableNames(Integer companyCode, String startMonth, String endMonth, String tablePrefix, JdbcTemplate jdbcTemplate) {
		List<String> tableNames = new ArrayList<>();
		
		// yyyyMM 형식의 문자열을 파싱하기 위한 Formatter
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMM");
		
		// 문자열을 YearMonth로 파싱
		YearMonth start = YearMonth.parse(startMonth, formatter);
		YearMonth end = YearMonth.parse(endMonth, formatter);
		
		// 테이블 이름 목록
		List<String> tablePrefixList = Arrays.asList(tablePrefix.split(","));
		
		while (!start.isAfter(end)) {
			
			for (String prefix : tablePrefixList) {
		        String tableName = String.format("%s_%s", prefix, start.format(formatter)); // SMSCLI_TBL_XXX_YYYYMM
		        if (tableExists(companyCode, tableName, jdbcTemplate)) tableNames.add(tableName); // 테이블 존재 여부 확인
		    }
			
			start = start.plusMonths(1);
		}
		
        // 발송 테이블을 마지막에 추가
		for (String prefix : tablePrefixList) {
		    if (tableExists(companyCode, prefix, jdbcTemplate)) tableNames.add(prefix); // SMSCLI_TBL_XXX
		}
		
		return tableNames;
	}
	
	public static boolean tableExists(Integer companyCode, String tableName, JdbcTemplate jdbcTemplate) {
		// String sql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ?";
		
		String schema = (companyCode == 0) ? "" : "msdbgm."; // 지마켓 스키마 구분(기존 GMARKET_HIST_DB: gmarket_hist)
		String sql = String.format("SELECT COUNT(*) FROM %sINFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ?", schema);
		
		Integer count = jdbcTemplate.queryForObject(sql, Integer.class, tableName);
		
		return count != null && count > 0;
	}
}
