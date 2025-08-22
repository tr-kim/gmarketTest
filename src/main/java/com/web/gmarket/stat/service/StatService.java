package com.web.gmarket.stat.service;

import java.util.List;

import com.web.gmarket.stat.dto.StatDto;

public interface StatService {
	
	public int selectStatListCount(StatDto statDto);
	
	public List<StatDto> selectStatList(StatDto statDto);
}
