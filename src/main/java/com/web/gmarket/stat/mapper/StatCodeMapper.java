package com.web.gmarket.stat.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.web.gmarket.stat.dto.StatCodeDto;

@Mapper
public interface StatCodeMapper {
	
	/**
	 * 통계 코드 목록 갯수
	 * 
	 * @param companyCode
	 * @param tableCode
	 * @return
	 */
	public int selectStatCodeListCount(@Param("companyCode") int companyCode, @Param("tableCode") int tableCode);
	
	/**
	 * 통계 코드 목록 조회
	 * 
	 * @param companyCode
	 * @param tableCode
	 * @return
	 */
	public List<StatCodeDto> selectStatCodeList(@Param("companyCode") int companyCode, @Param("tableCode") int tableCode);

}
