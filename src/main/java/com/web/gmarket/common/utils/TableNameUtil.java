package com.web.gmarket.common.utils;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;

public class TableNameUtil {
	
	public static List<String> getMonthTableNames(String startMonth, String endMonth, String tablePrefix, JdbcTemplate jdbcTemplate) {
		List<String> tableNames = new ArrayList<>();
		
		// yyyyMM 형식의 문자열을 파싱하기 위한 Formatter
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMM");
		
		// 문자열을 YearMonth로 파싱
		YearMonth start = YearMonth.parse(startMonth, formatter);
		YearMonth end = YearMonth.parse(endMonth, formatter);
		
		while (!start.isAfter(end)) {
			String tableName = tablePrefix + "_" + start.format(formatter); // SMSCLI_TBL_XXX_YYYYMM
			
			// 테이블 존재 여부 확인
			if (tableExists(tableName, jdbcTemplate)) {
				tableNames.add(tableName);
			}
			
			start = start.plusMonths(1);
		}
		
		// 발송 테이블을 마지막에 추가
		tableNames.add(tablePrefix); // SMSCLI_TBL_XXX
		
		return tableNames;
	}
	
	public static boolean tableExists(String tableName, JdbcTemplate jdbcTemplate) {
		String sql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ?";
		Integer count = jdbcTemplate.queryForObject(sql, Integer.class, tableName);
		
		return count != null && count > 0;
	}
}
