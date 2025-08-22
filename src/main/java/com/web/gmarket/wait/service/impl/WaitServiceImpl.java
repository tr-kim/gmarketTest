package com.web.gmarket.wait.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.DBUtils;
import com.web.gmarket.wait.dto.WaitDto;
import com.web.gmarket.wait.mapper.WaitMapper;
import com.web.gmarket.wait.service.WaitService;

@Service
public class WaitServiceImpl implements WaitService {
	
	@Autowired
	private DynamicDataSourceService dynamicDataSourceService;

	//타입별 테이블명 치환
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
	
    @Override
    public List<WaitDto> getWaitList(WaitDto waitDto) {
    	
    	String dbName = DBUtils.getDBName(waitDto.getCompanyCode());
    	
        return getMapper(dbName).selectWaitList(waitDto);
    }

    @Override
    public int getWaitCount(WaitDto waitDto) {
    	
    	String dbName = DBUtils.getDBName(waitDto.getCompanyCode());
    	
        return getMapper(dbName).selectWaitCount(waitDto);
    }
    
	@Override
	@Transactional // 예외 발생 시 전체 롤백
	public ResponseEntity<?> deleteWaitList(List<WaitDto> waitDtoList) {
		Map<String, Object> result = new HashMap<>();
		
		try {
			
			if (waitDtoList == null || waitDtoList.isEmpty()) {
				result.put(ConstantsUtils.CODE, ConstantsUtils.DATA_DOSE_NOT_EXIST);
				result.put(ConstantsUtils.RESULT, "삭제할 항목이 없습니다.");
				return ResponseEntity.badRequest().body(result);
			}
			
			for (WaitDto dto : waitDtoList) {
				
				String dbName = DBUtils.getDBName(dto.getCompanyCode());
				String bulkMsgKey = dto.getBulkMsgKey();
				String svcType = dto.getSvcType();
				
				String tableName = SVC_TYPE_TABLE_MAP.getOrDefault(svcType, ConstantsUtils.SMSCLI_TBL_EVENT); // 없을 경우 기본값
				
	            Map<String, Object> param = new HashMap<>();
	            param.put(ConstantsUtils.TABLE_NAME, tableName);
	            param.put(ConstantsUtils.BULK_MSG_KEY, bulkMsgKey);
	            
	            int deletedCount = getMapper(dbName).deleteWaitMsg(param);
	            
				if (deletedCount > 0) {
					getMapper(dbName).deleteBroadCastMsg(param);
				}
			}
			
			result.put(ConstantsUtils.CODE, ConstantsUtils.SUCCESS_CODE);
			result.put(ConstantsUtils.RESULT, "삭제되었습니다.");
			return ResponseEntity.ok(result);
			
		} catch (Exception e) {
			e.printStackTrace();
			result.put(ConstantsUtils.CODE, ConstantsUtils.ERROR_CODE);
			result.put(ConstantsUtils.RESULT, "삭제 중 오류가 발생했습니다.");
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}
	}
	
	public WaitMapper getMapper(String dbName) {
		return dynamicDataSourceService.getMapper(dbName, WaitMapper.class);
	}
	
}
