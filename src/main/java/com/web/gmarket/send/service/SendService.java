package com.web.gmarket.send.service;

import com.web.gmarket.send.dto.SendDto;

public interface SendService {

	public int insertSmsEvent(SendDto dto);
	
	public int insertLmsEvent(SendDto dto);
	
	public int insertMmsEvent(SendDto dto);
}
