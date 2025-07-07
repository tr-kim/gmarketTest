package com.web.gmarket.real.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.real.dto.RealDto;
import com.web.gmarket.real.mapper.RealMapper;
import com.web.gmarket.real.service.RealService;

@Service
public class RealServiceImpl implements RealService {

	@Autowired
	private RealMapper realMapper;
	
	@Override
	public List<RealDto> selectRealHistTotalList(int totalMonTime, int alarmFlag) {
		return realMapper.selectRealHistTotalList(totalMonTime, alarmFlag);
	}

	@Override
	public RealDto selectRealHistList(int companyCode) {
		return realMapper.selectRealHistList(companyCode);
	}

	@Override
	public RealDto selectRealHistTableList(int tableCode) {
		return realMapper.selectRealHistTableList(tableCode);
	}

}
