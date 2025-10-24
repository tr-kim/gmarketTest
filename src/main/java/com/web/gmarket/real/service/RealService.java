package com.web.gmarket.real.service;

import java.util.List;
import java.util.Map;

import com.web.gmarket.real.dto.RealDto;

public interface RealService {

	public  Map<String, List<RealDto>> selectRealHistTotalList(int totalMonTime, int alarmFlag);
	
	public RealDto selectRealHistList(int companyCode);
	
	public List<RealDto> selectRealHistTableList(int companyCode, List<Integer> codeList);
}
