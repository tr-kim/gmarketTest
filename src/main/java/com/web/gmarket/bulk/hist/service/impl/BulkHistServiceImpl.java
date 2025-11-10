package com.web.gmarket.bulk.hist.service.impl;

import java.io.BufferedWriter;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.web.gmarket.bulk.hist.dto.BulkHistDto;
import com.web.gmarket.bulk.hist.mapper.BulkHistMapper;
import com.web.gmarket.bulk.hist.service.BulkHistService;
import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.config.JdbcTemplateProvider;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.DBUtils;
import com.web.gmarket.common.utils.TableNameUtil;

@Service
public class BulkHistServiceImpl implements BulkHistService {
	private final JdbcTemplateProvider jdbcTemplateProvider;
	private final DynamicDataSourceService dynamicDataSourceService;
	
	public BulkHistServiceImpl(JdbcTemplateProvider jdbcTemplateProvider, DynamicDataSourceService dynamicDataSourceService) {
		this.jdbcTemplateProvider = jdbcTemplateProvider;
		this.dynamicDataSourceService = dynamicDataSourceService;
	}
	
	// 타입별 테이블명 치환
	private static final Map<String, String> SVC_TYPE_TABLE_MAP = new HashMap<>();
	static {
		SVC_TYPE_TABLE_MAP.put(ConstantsUtils.EXCEL_SMS, ConstantsUtils.SMSCLI_TBL_EVENT);
		SVC_TYPE_TABLE_MAP.put(ConstantsUtils.EXCEL_LMS, ConstantsUtils.LMSCLI_TBL_EVENT);
		SVC_TYPE_TABLE_MAP.put(ConstantsUtils.EXCEL_MMS, ConstantsUtils.MMSCLI_TBL_EVENT);
		SVC_TYPE_TABLE_MAP.put(ConstantsUtils.FILE_SMS, ConstantsUtils.SMSCLI_TBL_EVENT);
		SVC_TYPE_TABLE_MAP.put(ConstantsUtils.FILE_LMS, ConstantsUtils.LMSCLI_TBL_EVENT);
		SVC_TYPE_TABLE_MAP.put(ConstantsUtils.FILE_MMS, ConstantsUtils.MMSCLI_TBL_EVENT);
		SVC_TYPE_TABLE_MAP.put(ConstantsUtils.DB_SMS, ConstantsUtils.SMSCLI_TBL_LARGE);
		SVC_TYPE_TABLE_MAP.put(ConstantsUtils.DB_LMS, ConstantsUtils.LMSCLI_TBL_LARGE);
		SVC_TYPE_TABLE_MAP.put(ConstantsUtils.DB_MMS, ConstantsUtils.MMSCLI_TBL_LARGE);
		SVC_TYPE_TABLE_MAP.put(ConstantsUtils.SINGLE_SMS, ConstantsUtils.SMSCLI_TBL_EVENT);
		SVC_TYPE_TABLE_MAP.put(ConstantsUtils.SINGLE_LMS, ConstantsUtils.LMSCLI_TBL_EVENT);
		SVC_TYPE_TABLE_MAP.put(ConstantsUtils.SINGLE_MMS, ConstantsUtils.MMSCLI_TBL_EVENT);
	}
	
	// 목록 조회 후 상태 카운트 병합
	@Override
	public List<BulkHistDto> getBulkHistList(BulkHistDto bulkHistDto) {
		Integer companyCode = bulkHistDto.getCompanyCode();
		String dbName = DBUtils.getDBName(companyCode);
		
		// 목록 조회
		List<BulkHistDto> list = getMapper(dbName).selectBulkHistList(bulkHistDto);
		
		String startMonth = bulkHistDto.getStartDate();
		String endMonth = bulkHistDto.getEndDate();
		
		// 각 row 상태 카운트 조회 및 병합
		for (BulkHistDto row : list) {
			String svcType = row.getSvcType();
			String tableName = SVC_TYPE_TABLE_MAP.get(svcType);
			
			if (tableName == null) {
				throw new IllegalArgumentException("지원하지 않는 타입: " + svcType);
			}
			
			// 대량발송 메시지 키
			bulkHistDto.setBulkMsgKey(row.getBulkMsgKey());
			
			// 월별 테이블 존재 여부 확인 및 목록 생성
			List<String> tableList = TableNameUtil.getMonthTableNames(
					companyCode,
					startMonth,
					endMonth,
					tableName,
					jdbcTemplateProvider.getJdbcTemplate(dbName)
			);
			
			// 결과 DTO에 세팅
			bulkHistDto.setMonthTables(tableList);
			
			// 상태 카운트 조회
			Map<String, Integer> result = getMapper(dbName).selectBulkHistStatusCount(bulkHistDto);
			
			// 조회된 카운트 병합
			row.setCntStanby(result.getOrDefault(ConstantsUtils.CNT_STANBY, 0)); 			// 전송대기
			row.setCntTran(result.getOrDefault(ConstantsUtils.CNT_TRAN, 0)); 				// 전송중
			row.setCntSucc(result.getOrDefault(ConstantsUtils.CNT_SUCC, 0)); 				// 성공
			row.setCntDup(result.getOrDefault(ConstantsUtils.CNT_DUP, 0)); 					// 중복 전송으로 인한 실패
			row.setCntSendFail(result.getOrDefault(ConstantsUtils.CNT_SEND_FAIL, 0)); 		// 전송실패
		}
		
		return list;
	}
	
	@Override
	public int getBulkHistCount(BulkHistDto bulkHistDto) {
		Integer companyCode = bulkHistDto.getCompanyCode();
		String dbName = DBUtils.getDBName(companyCode);
		
		return getMapper(dbName).selectBulkHistCount(bulkHistDto);
	}
	
	public BulkHistMapper getMapper(String dbName) {
		return dynamicDataSourceService.getMapper(dbName, BulkHistMapper.class);
	}
	
	// 수신번호 조회 후 파일 생성
	@Override
	public StreamingResponseBody getBulkTextList(BulkHistDto bulkHistDto) {
		Integer companyCode = bulkHistDto.getCompanyCode();
		String dbName = DBUtils.getDBName(companyCode);
		
		// 월별 리스트 목록 계산
		String startMonth = bulkHistDto.getStartDate();
		String endMonth = bulkHistDto.getEndDate();
		String svcType = bulkHistDto.getSvcType();
		String tableName = SVC_TYPE_TABLE_MAP.get(svcType);
		
		if (tableName == null) {
			throw new IllegalArgumentException("지원하지 않는 타입: " + svcType);
		}
		
		// 월별 테이블 존재 여부 확인 및 목록 생성
		List<String> tableList = TableNameUtil.getMonthTableNames(
				companyCode,
				startMonth,
				endMonth,
				tableName,
				jdbcTemplateProvider.getJdbcTemplate(dbName)
		);
		
		// 결과 DTO에 세팅
		bulkHistDto.setMonthTables(tableList);
		
		// 수신번호 조회
		List<String> phoneList = getMapper(dbName).selectTranPhoneList(bulkHistDto);
		
		// TXT 파일 스트림 생성
		return outputStream -> {
	        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outputStream, StandardCharsets.UTF_8))) {
	            for (String phone : phoneList) {
	                writer.write(phone);
	                writer.newLine();
	            }
	            writer.flush();
	        }
		};
	}
}
