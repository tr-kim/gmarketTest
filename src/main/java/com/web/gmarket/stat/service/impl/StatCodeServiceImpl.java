package com.web.gmarket.stat.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.stat.dto.StatCodeDto;
import com.web.gmarket.stat.mapper.StatCodeMapper;
import com.web.gmarket.stat.service.StatCodeService;

@Service
public class StatCodeServiceImpl implements StatCodeService {

	@Autowired
	private DynamicDataSourceService dynamicDataSourceService;

	@Override
	public int selectStatCodeListCount(int companyCode, int tableCode) {
		return getMapper().selectStatCodeListCount(companyCode, tableCode);
	}

	@Override
	public List<StatCodeDto> selectStatCodeList(int companyCode, int tableCode) {
		return getMapper().selectStatCodeList(companyCode, tableCode);
	}
	
	public StatCodeMapper getMapper() {
		return dynamicDataSourceService.getMapper(ConstantsUtils.DB_GMAREKT, StatCodeMapper.class);
	}
}
