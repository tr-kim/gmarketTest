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
	public RealDto selectRealHistTableList(int companyCode, int tableCode) {
		return  commonService.getRealMapper(DBUtils.getDBName(companyCode)).selectRealHistTableList(tableCode);
	}
	
	public List<Integer> getCodeList(List<StatCodeDto> list) {
		return list.stream().map(StatCodeDto::getTableCode).collect(Collectors.toList());
	}
}
