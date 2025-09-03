package com.web.gmarket.bulk.broad.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.bulk.broad.dto.BroadcastMsgDto;

@Mapper
public interface BroadcastMsgMapper {

	/**
	 * 대량 발송 등록
	 * 
	 * @param dto
	 * @return
	 */
	public int insertBroadcastMsg(BroadcastMsgDto dto);
}
