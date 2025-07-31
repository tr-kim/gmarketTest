package com.web.gmarket.stat.service;

import java.util.List;

import com.web.gmarket.stat.dto.StatDto;

public interface StatService {
	
	public int selectStatListGmarketCount(StatDto statDto);
	
	public List<StatDto> selectStatListGmarket(StatDto statDto);
	
	public int selectStatListAuctionCount(StatDto statDto);
	
	public List<StatDto> selectStatListAuction(StatDto statDto);
}
