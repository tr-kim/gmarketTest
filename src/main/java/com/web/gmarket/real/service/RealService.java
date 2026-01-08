package com.web.gmarket.real.service;

import java.util.List;
import java.util.Map;

import com.web.gmarket.real.dto.RealDto;
import com.web.gmarket.real.dto.ServiceStatusFailoverDto;

public interface RealService {

	public  Map<String, List<RealDto>> selectRealHistTotalList(int totalMonTime, int alarmFlag);
	
	public RealDto selectRealHistList(int companyCode);
	
	public List<RealDto> selectRealHistTableList(int companyCode, List<Integer> codeList);
	
	public List<?> selectProcStatusList(String view, int tab);

	public List<?> selectServerStatusList();

	public Map<String, Object> updateServerFlag(ServiceStatusFailoverDto dto);
	
	public List<?> selectSummaryProcCount();

	public List<?> selectSummaryProcName();
}
