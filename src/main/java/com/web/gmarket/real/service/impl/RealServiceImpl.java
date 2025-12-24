package com.web.gmarket.real.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.DBUtils;
import com.web.gmarket.real.dto.RealDto;
import com.web.gmarket.real.dto.ServiceStatusFailoverDto;
import com.web.gmarket.real.service.RealService;
import com.web.gmarket.stat.dto.StatCodeDto;
import com.web.gmarket.stat.service.StatCodeService;

@Service
public class RealServiceImpl implements RealService {

	@Autowired
	private CommonService commonService;
	
	@Autowired
	private StatCodeService statCodeService;
	
	@Override
	public Map<String, List<RealDto>> selectRealHistTotalList(int totalMonTime, int alarmFlag) {
		Map<String, List<RealDto>> result = new HashMap<>();
		
		List<StatCodeDto> auctionCodeList = statCodeService.selectStatCodeList(ConstantsUtils.AUCTION_CODE, 0);
		List<StatCodeDto> gmarketCodeList = statCodeService.selectStatCodeList(ConstantsUtils.GMARKET_CODE, 0);
		
		result.put(ConstantsUtils.AUCTION, commonService.getRealMapper(ConstantsUtils.DB_AUCTION).selectRealHistTotalList(totalMonTime, alarmFlag, getCodeList(auctionCodeList)));
		result.put(ConstantsUtils.GMAREKT, commonService.getRealMapper(ConstantsUtils.DB_GMARKET).selectRealHistTotalList(totalMonTime, alarmFlag, getCodeList(gmarketCodeList)));
		
		return result;
	}

	@Override
	public RealDto selectRealHistList(int companyCode) {
		List<Integer> codeList = new ArrayList<>();
		
		switch (companyCode) {
			case ConstantsUtils.AUCTION_CODE:
				codeList = getCodeList(statCodeService.selectStatCodeList(ConstantsUtils.AUCTION_CODE, 0));
				break;
			case ConstantsUtils.GMARKET_CODE:
				codeList = getCodeList(statCodeService.selectStatCodeList(ConstantsUtils.GMARKET_CODE, 0));
				break;
			default:
				codeList = getCodeList(statCodeService.selectStatCodeList(ConstantsUtils.AUCTION_CODE, 0));
				break;
		}
		
		return commonService.getRealMapper(DBUtils.getDBName(companyCode)).selectRealHistList(codeList);
	}

	@Override
	public List<RealDto> selectRealHistTableList(int companyCode, List<Integer> codeList) {
		return commonService.getRealMapper(DBUtils.getDBName(companyCode)).selectRealHistTableList(codeList);
	}
	
	public List<Integer> getCodeList(List<StatCodeDto> list) {
		return list.stream().map(StatCodeDto::getTableCode).collect(Collectors.toList());
	}
	
	@Override
	public List<?> selectProcStatusList(String view, String tab) {
		
		// TODO tab에 따라 데이터 변경
		if(ConstantsUtils.SUMMARY.equals(view)) {
//			
//			List<ServiceStatusSummaryDto> auctionList = commonService.getRealMapper(ConstantsUtils.DB_AUCTION).selectRealHistServiceStatusSummaryList();
//			List<ServiceStatusSummaryDto> gmarketList = commonService.getRealMapper(ConstantsUtils.DB_GMARKET).selectRealHistServiceStatusSummaryList();
//			List<ServiceStatusSummaryDto> smailcashList = commonService.getRealMapper(ConstantsUtils.DB_AUCTION).selectRealHistServiceStatusSummaryList();	// 확인 필요
			
			return commonService.getRealMapper(ConstantsUtils.DB_GMARKET).selectRealHistServiceStatusSummaryList();
			
		} else if(ConstantsUtils.DETAIL.equals(view)) {
			
//			List<ServiceStatusDetailDto> auctionList = commonService.getRealMapper(ConstantsUtils.DB_AUCTION).selectRealHistServiceStatusDetailList();
//			List<ServiceStatusDetailDto> gmarketList = commonService.getRealMapper(ConstantsUtils.DB_GMARKET).selectRealHistServiceStatusDetailList();
//			List<ServiceStatusDetailDto> smailcashList = commonService.getRealMapper(ConstantsUtils.DB_AUCTION).selectRealHistServiceStatusDetailList();	// 확인 필요
			
			return commonService.getRealMapper(ConstantsUtils.DB_GMARKET).selectRealHistServiceStatusDetailList();
		}
		
		return new ArrayList<>();
	}

	@Override
	public List<?> selectServerStatusList() {
		return commonService.getRealMapper(ConstantsUtils.DB_GMARKET).selectServerStatusList();
	}

    @Override
	public Map<String, Object> updateServerFlag(ServiceStatusFailoverDto dto) {

		Map<String, Object> result = new HashMap<>();

		// 프로세스 다운(비정상) 카운트 조회
		int downCount = commonService.getRealMapper(ConstantsUtils.DB_GMARKET).selectDownCount(dto);

		// 조회 결과가 있으면 절체 차단
		if (downCount == 0) {
			commonService.getRealMapper(ConstantsUtils.DB_GMARKET).updateServerFlag(dto);

			result.put("success", true);
			result.put("message", "수동 절체 성공");
		} else {
			result.put("success", false);
			result.put("message", "수동 절체 실패");
		}

		return result;
	}
}
