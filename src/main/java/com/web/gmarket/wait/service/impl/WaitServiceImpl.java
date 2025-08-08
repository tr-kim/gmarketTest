package com.web.gmarket.wait.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.wait.dto.WaitDto;
import com.web.gmarket.wait.mapper.WaitMapper;
import com.web.gmarket.wait.service.WaitService;

@Service
public class WaitServiceImpl implements WaitService {

    private final WaitMapper waitMapper;

    public WaitServiceImpl(WaitMapper waitMapper) {
        this.waitMapper = waitMapper;
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
	
    @Override
    public List<WaitDto> getWaitList(WaitDto waitDto) {
        return waitMapper.selectWaitList(waitDto);
    }

    @Override
    public int getWaitCount(WaitDto waitDto) {
        return waitMapper.selectWaitCount(waitDto);
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
				String bulkMsgKey = dto.getBulkMsgKey();
				String svcType = dto.getSvcType();
				
				String tableName = SVC_TYPE_TABLE_MAP.getOrDefault(svcType, "SMSCLI_TBL_EVENT"); // 없을 경우 기본값
				
	            Map<String, Object> param = new HashMap<>();
	            param.put("tableName", tableName);
	            param.put("bulkMsgKey", bulkMsgKey);
	            
	            int deletedCount = waitMapper.deleteWaitMsg(param);
	            
				if (deletedCount > 0) {
					waitMapper.deleteBroadCastMsg(param);
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
	
}
