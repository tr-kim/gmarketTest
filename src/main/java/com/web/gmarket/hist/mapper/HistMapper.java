package com.web.gmarket.hist.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.hist.dto.HistDto;

@Mapper
public interface HistMapper {
	
	List<HistDto> selectHistList(HistDto histDto);
	
	int selectHistCount(HistDto histDto);
}
