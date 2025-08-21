package com.web.gmarket.real.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.DBUtils;
import com.web.gmarket.real.dto.RealDto;
import com.web.gmarket.real.mapper.RealMapper;
import com.web.gmarket.real.service.RealService;
import com.web.gmarket.stat.dto.StatCodeDto;
import com.web.gmarket.stat.service.StatCodeService;

@Service
public class RealServiceImpl implements RealService {

	@Autowired
	private DynamicDataSourceService dynamicDataSourceService;
	
	@Autowired
	private StatCodeService statCodeService;
	
	@Override
	public Map<String, List<RealDto>> selectRealHistTotalList(int totalMonTime, int alarmFlag) {
		Map<String, List<RealDto>> result = new HashMap<>();
		
		List<Integer> codeList = new ArrayList<>();
		List<StatCodeDto> auctionCodeList = statCodeService.selectStatCodeList(0, 0);
		List<StatCodeDto> gmarketCodeList = statCodeService.selectStatCodeList(1, 0);
		
		for(StatCodeDto code : auctionCodeList) {
			codeList.add(code.getTableCode());
		}
		
		result.put(ConstantsUtils.AUCTION, getMapper(ConstantsUtils.DB_AUCTION).selectRealHistTotalList(totalMonTime, alarmFlag, codeList));
		
		codeList = new ArrayList<>();
		for(StatCodeDto code : gmarketCodeList) {
			codeList.add(code.getTableCode());
		}
		
		result.put(ConstantsUtils.GMAREKT, getMapper(ConstantsUtils.DB_GMAREKT).selectRealHistTotalList(totalMonTime, alarmFlag, codeList));
		
		return result;
	}

	@Override
	public RealDto selectRealHistList(int companyCode) {
		List<Integer> codeList = new ArrayList<>();
		
		switch (companyCode) {
			case ConstantsUtils.AUCTION_CODE:
				List<StatCodeDto> auctionCodeList = statCodeService.selectStatCodeList(0, 0);
				
				for(StatCodeDto code : auctionCodeList) {
					codeList.add(code.getTableCode());
				}
				break;
			case ConstantsUtils.GMAREKT_CODE:
				List<StatCodeDto> gmarketCodeList = statCodeService.selectStatCodeList(1, 0);
				
				for(StatCodeDto code : gmarketCodeList) {
					codeList.add(code.getTableCode());
				}
				break;
			default:
				List<StatCodeDto> defaultCodeList = statCodeService.selectStatCodeList(0, 0);
				
				for(StatCodeDto code : defaultCodeList) {
					codeList.add(code.getTableCode());
				}
				break;
		}
		
		return getMapper(DBUtils.getDBName(companyCode)).selectRealHistList(codeList);
	}

	@Override
	public RealDto selectRealHistTableList(int companyCode, int tableCode) {
		return  getMapper(DBUtils.getDBName(companyCode)).selectRealHistTableList(tableCode);
	}
	
	public RealMapper getMapper(String dbName) {
		return dynamicDataSourceService.getMapper(dbName, RealMapper.class);
	}
}
