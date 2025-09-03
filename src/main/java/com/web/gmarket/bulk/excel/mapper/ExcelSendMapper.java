package com.web.gmarket.bulk.excel.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.bulk.excel.dto.ExcelSendDto;

@Mapper
public interface ExcelSendMapper {

	/**
	 * 엑셀 발송
	 * 
	 * @param dto
	 * @return
	 */
	public int insertExcelSend(ExcelSendDto dto);
}
