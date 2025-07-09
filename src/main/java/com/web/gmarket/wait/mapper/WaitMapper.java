package com.web.gmarket.wait.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.wait.dto.WaitDto;

@Mapper
public interface WaitMapper {

    List<WaitDto> selectWaitList(WaitDto waitDto);

    int selectWaitCount(WaitDto waitDto);
}
