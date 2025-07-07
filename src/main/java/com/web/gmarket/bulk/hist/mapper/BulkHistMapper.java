package com.web.gmarket.bulk.hist.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.bulk.hist.dto.BulkHistDto;

@Mapper
public interface BulkHistMapper {
    List<BulkHistDto> selectBulkHistList(BulkHistDto bulkHistDto);	

    int selectBulkHistCount(BulkHistDto bulkHistDto);

}
