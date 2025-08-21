package com.web.gmarket.stat.service;

import java.util.List;

import com.web.gmarket.stat.dto.StatCodeDto;

public interface StatCodeService {
	
	public int selectStatCodeListCount(int companyCode, int tableCode);
	
	public List<StatCodeDto> selectStatCodeList(int companyCode, int tableCode);
}
