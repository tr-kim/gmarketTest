package com.web.gmarket.bulk.hist.service;

import java.util.List;

import com.web.gmarket.bulk.hist.dto.BulkHistDto;

public interface BulkHistService {
	
	List<BulkHistDto> getBulkHistList(BulkHistDto bulkHistDto);
	
	int getBulkHistCount(BulkHistDto bulkHistDto);
}
