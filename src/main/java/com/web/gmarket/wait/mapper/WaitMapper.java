package com.web.gmarket.wait.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.wait.dto.WaitDto;

@Mapper
public interface WaitMapper {

    List<WaitDto> selectWaitList(WaitDto waitDto);

    int selectWaitCount(WaitDto waitDto);

	int deleteWaitMsg(Map<String, Object> param);
	
	int deleteBroadCastMsg(Map<String, Object> param);
}
