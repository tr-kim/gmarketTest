package com.web.gmarket.bulk.hist.service;

import java.util.List;

import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.web.gmarket.bulk.hist.dto.BulkHistDto;

public interface BulkHistService {
	
	List<BulkHistDto> getBulkHistList(BulkHistDto bulkHistDto);
	
	int getBulkHistCount(BulkHistDto bulkHistDto);

	StreamingResponseBody getBulkTextList(BulkHistDto bulkHistDto);
}
