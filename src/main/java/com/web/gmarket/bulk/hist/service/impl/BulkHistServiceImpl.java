package com.web.gmarket.bulk.hist.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.web.gmarket.bulk.hist.dto.BulkHistDto;
import com.web.gmarket.bulk.hist.mapper.BulkHistMapper;
import com.web.gmarket.bulk.hist.service.BulkHistService;
import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.config.JdbcTemplateProvider;
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
	
	//타입별 테이블명 치환
	private static final Map<String, String> SVC_TYPE_TABLE_MAP = new HashMap<>();
	static {
		SVC_TYPE_TABLE_MAP.put("EXCEL_SMS", "SMSCLI_TBL_EVENT");
		SVC_TYPE_TABLE_MAP.put("EXCEL_LMS", "LMSCLI_TBL_EVENT");
		SVC_TYPE_TABLE_MAP.put("EXCEL_MMS", "MMSCLI_TBL_EVENT");
		SVC_TYPE_TABLE_MAP.put("FILE_SMS", "SMSCLI_TBL_EVENT");
		SVC_TYPE_TABLE_MAP.put("FILE_LMS", "LMSCLI_TBL_EVENT");
		SVC_TYPE_TABLE_MAP.put("FILE_MMS", "MMSCLI_TBL_EVENT");
		SVC_TYPE_TABLE_MAP.put("DB_SMS", "SMSCLI_TBL_LARGE");
		SVC_TYPE_TABLE_MAP.put("DB_LMS", "LMSCLI_TBL_LARGE");
		SVC_TYPE_TABLE_MAP.put("DB_MMS", "MMSCLI_TBL_LARGE");
		SVC_TYPE_TABLE_MAP.put("SINGLE_SMS", "SMSCLI_TBL_EVENT");
		SVC_TYPE_TABLE_MAP.put("SINGLE_LMS", "LMSCLI_TBL_EVENT");
		SVC_TYPE_TABLE_MAP.put("SINGLE_MMS", "MMSCLI_TBL_EVENT");
	}
	
	/*@Override
	public List<BulkHistDto> getBulkHistList(BulkHistDto bulkHistDto) {
		return bulkHistMapper.selectBulkHistList(bulkHistDto);
	}*/
	
	//목록 조회 후 상태 카운트 병합
	@Override
	public List<BulkHistDto> getBulkHistList(BulkHistDto bulkHistDto) {
		
		String dbName = DBUtils.getDBName(bulkHistDto.getCompanyCode());
		
		//목록 조회
		List<BulkHistDto> list = getMapper(dbName).selectBulkHistList(bulkHistDto);
		
		String startMonth = bulkHistDto.getStartDate();
		String endMonth = bulkHistDto.getEndDate();
		
		//각 row 상태 카운트 조회 및 병합
		for (BulkHistDto row : list) {
			String svcType = row.getSvcType();
			String tableName = SVC_TYPE_TABLE_MAP.getOrDefault(svcType, "SMSCLI_TBL_EVENT"); // 없을 경우 기본값
			
			//대량발송 메시지 키
			bulkHistDto.setBulkMsgKey(row.getBulkMsgKey());
			
			//월별 리스트 생성
			List<String> tableList = TableNameUtil.getMonthTableNames(startMonth, endMonth, tableName, jdbcTemplateProvider.getJdbcTemplate(dbName));
			
			bulkHistDto.setMonthTables(tableList);
			
			//상태 카운트 조회
			Map<String, Integer> result = getMapper(dbName).selectBulkHistStatusCount(bulkHistDto);
			
			//조회된 카운트 병합
			row.setCntStanby(result.getOrDefault("cntStanby", 0)); 			//전송대기
			row.setCntTran(result.getOrDefault("cntTran", 0)); 				//전송중
			row.setCntSucc(result.getOrDefault("cntSucc", 0)); 				//성공
			row.setCntDup(result.getOrDefault("cntDup", 0)); 				//중복 전송으로 인한 실패
			row.setCntSendFail(result.getOrDefault("cntSendFail", 0)); 		//전송실패
		}
		
		return list;
	}
	
	@Override
	public int getBulkHistCount(BulkHistDto bulkHistDto) {
		String dbName = DBUtils.getDBName(bulkHistDto.getCompanyCode());
		
		return getMapper(dbName).selectBulkHistCount(bulkHistDto);
	}
	
	public BulkHistMapper getMapper(String dbName) {
		return dynamicDataSourceService.getMapper(dbName, BulkHistMapper.class);
	}
	
}
