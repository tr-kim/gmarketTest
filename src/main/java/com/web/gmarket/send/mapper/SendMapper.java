package com.web.gmarket.send.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.send.dto.SendDto;

@Mapper
public interface SendMapper {

	/**
	 * SMS 발송
	 * 
	 * @param dto
	 * @return
	 */
	/**
	 * @return
	 */
	public int insertSmsEvent(SendDto dto);
	
	/**
	 * LMS 발송
	 * 
	 * @param dto
	 * @return
	 */
	public int insertLmsEvent(SendDto dto);
	
	/**
	 * MMS 발송
	 * 
	 * @param dto
	 * @return
	 */
	public int insertMmsEvent(SendDto dto);
}
