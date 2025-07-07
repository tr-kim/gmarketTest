package com.web.gmarket.real.service;

import com.web.gmarket.real.dto.RealDto;

public interface RealService {

	public RealDto selectRealHistTotalList(int totalMonTime, int alarmFlag);
	
	public RealDto selectRealHistList(int companyCode);
	
	public RealDto selectRealHistTableList(int tableCode);
}
