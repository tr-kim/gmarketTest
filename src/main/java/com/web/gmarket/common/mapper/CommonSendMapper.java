package com.web.gmarket.common.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.common.dto.CommonSendDto;

@Mapper
public interface CommonSendMapper {

	public int insertSmsEvent(CommonSendDto dto);
	
	public int insertLmsEvent(CommonSendDto dto);
	
	public int insertMmsEvent(CommonSendDto dto);
}
