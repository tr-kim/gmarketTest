package com.web.gmarket.real.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
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

@Service
public class RealServiceImpl implements RealService {

	@Autowired
	private DynamicDataSourceService dynamicDataSourceService;
	
	List<Integer> auctionCodeList = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 21, 22, 71, 72, 73));
	List<Integer> gmarketCodeList = new ArrayList<>(Arrays.asList(11, 12, 13, 14, 15, 16, 19, 20, 23, 24, 30, 31, 32));
	
	@Override
	public Map<String, List<RealDto>> selectRealHistTotalList(int totalMonTime, int alarmFlag) {
		Map<String, List<RealDto>> result = new HashMap<>();
		
		result.put(ConstantsUtils.AUCTION, getMapper(ConstantsUtils.DB_AUCTION).selectRealHistTotalList(totalMonTime, alarmFlag, auctionCodeList));
		result.put(ConstantsUtils.GMAREKT, getMapper(ConstantsUtils.DB_GMAREKT).selectRealHistTotalList(totalMonTime, alarmFlag, gmarketCodeList));
		
		return result;
	}

	@Override
	public RealDto selectRealHistList(int companyCode) {
		return getMapper(DBUtils.getDBName(companyCode)).selectRealHistList(companyCode == ConstantsUtils.AUCTION_CODE ? auctionCodeList : gmarketCodeList);
	}

	@Override
	public RealDto selectRealHistTableList(int companyCode, int tableCode) {
		return  getMapper(DBUtils.getDBName(companyCode)).selectRealHistTableList(tableCode);
	}
	
	public RealMapper getMapper(String dbName) {
		return dynamicDataSourceService.getMapper(dbName, RealMapper.class);
	}
}
