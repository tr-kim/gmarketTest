package com.web.gmarket.bulk.broad.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

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
	
	/**
	 * 대량 발송 성공 / 실패 카운트 업데이트
	 * 
	 * @param dto
	 * @return
	 */
	public int updateBroadcastMsg(@Param("bMsgKey") String bMsgKey, @Param("cnt") int cnt, @Param("cntType") String cntType);
}
