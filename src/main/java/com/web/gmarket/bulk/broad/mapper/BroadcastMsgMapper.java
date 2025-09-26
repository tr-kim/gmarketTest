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
	 * 대량 발송 타입별 성공 / 실패 카운트 업데이트
	 * 
	 * @param dto
	 * @return
	 */
	public int updateBroadcastMsgCountByType(@Param("bMsgKey") String bMsgKey, @Param("cnt") int cnt, @Param("cntType") String cntType);
	
	
	/**
	 * 대량 발송 성공 / 실패 카운트 업데이트
	 * 
	 * @param bMsgKey
	 * @param succCnt
	 * @param failCnt
	 * @param cntType
	 * @return
	 */
	public int updateBroadcastMsgCount(@Param("bMsgKey") String bMsgKey, @Param("succCnt") int succCnt, @Param("failCnt") int failCnt, @Param("cntType") String cntType);
}
