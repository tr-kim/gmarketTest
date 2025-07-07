package com.web.gmarket.hist.service;

import java.util.List;

import com.web.gmarket.hist.dto.HistDto;

public interface HistService {
	
	List<HistDto> getHistList(HistDto histDto);
	
	int getHistCount(HistDto histDto);
}
