package com.web.gmarket.bulk.hist.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.bulk.hist.dto.BulkHistDto;

@Mapper
public interface BulkHistMapper {
	
    List<BulkHistDto> selectBulkHistList(BulkHistDto bulkHistDto);
    
    int selectBulkHistCount(BulkHistDto bulkHistDto);
    
    Map<String, Integer> selectBulkHistStatusCount(BulkHistDto dto);

	List<String> selectTranPhoneList(BulkHistDto bulkHistDto);
}
