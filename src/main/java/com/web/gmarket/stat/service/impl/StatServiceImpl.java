package com.web.gmarket.stat.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.stat.dto.StatDto;
import com.web.gmarket.stat.mapper.StatMapper;
import com.web.gmarket.stat.service.StatService;

@Service
public class StatServiceImpl implements StatService {
	
	@Autowired
	private StatMapper statMapper;
	
	@Override
	public int selectStatListGmarketCount(StatDto statDto) {
		return statMapper.selectStatListGmarketCount(statDto);
	}

	@Override
	public List<StatDto> selectStatListGmarket(StatDto statDto) {
		return statMapper.selectStatListGmarket(statDto);
	}

	@Override
	public int selectStatListAuctionCount(StatDto statDto) {
		return statMapper.selectStatListAuctionCount(statDto);
	}

	@Override
	public List<StatDto> selectStatListAuction(StatDto statDto) {
		return statMapper.selectStatListAuction(statDto);
	}

}
