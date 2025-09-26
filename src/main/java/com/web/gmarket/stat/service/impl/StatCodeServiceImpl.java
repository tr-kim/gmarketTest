package com.web.gmarket.stat.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.stat.dto.StatCodeDto;
import com.web.gmarket.stat.service.StatCodeService;

@Service
public class StatCodeServiceImpl implements StatCodeService {

	@Autowired
	private CommonService commonService;

	@Override
	public int selectStatCodeListCount(int companyCode, int tableCode) {
		return commonService.getStatCodeMapper().selectStatCodeListCount(companyCode, tableCode);
	}

	@Override
	public List<StatCodeDto> selectStatCodeList(int companyCode, int tableCode) {
		return commonService.getStatCodeMapper().selectStatCodeList(companyCode, tableCode);
	}
}
