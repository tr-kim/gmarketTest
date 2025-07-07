package com.web.gmarket.real.service;

import java.util.List;

import com.web.gmarket.real.dto.RealDto;

public interface RealService {

	public List<RealDto> selectRealHistTotalList(int totalMonTime, int alarmFlag);
	
	public RealDto selectRealHistList(int companyCode);
	
	public RealDto selectRealHistTableList(int tableCode);
}
