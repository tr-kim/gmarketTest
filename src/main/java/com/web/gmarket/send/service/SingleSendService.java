package com.web.gmarket.send.service;

import java.util.Map;

import com.web.gmarket.send.dto.SingleSendDto;

public interface SingleSendService {
	public Map<String, Integer> insertSingleSend(SingleSendDto singleSendDto) throws Exception;
}