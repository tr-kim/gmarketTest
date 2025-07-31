package com.web.gmarket.stat.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.web.gmarket.stat.dto.StatCodeDto;
import com.web.gmarket.stat.dto.StatDto;

@Mapper
public interface StatMapper {
	
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
	
	/**
	 * 정산/통계 목록 갯수 지마켓
	 * 
	 * @param statDto
	 * @return
	 */
	public int selectStatListGmarketCount(StatDto statDto);
	
	/**
	 * 정산/통계 목록 조회 지마켓
	 * 
	 * @param statDto
	 * @return
	 */
	public List<StatDto> selectStatListGmarket(StatDto statDto);
	
	/**
	 * 정산/통계 목록 갯수 옥션
	 * 
	 * @param statDto
	 * @return
	 */
	public int selectStatListAuctionCount(StatDto statDto);
	
	/**
	 * 정산/통계 목록 조회 옥션
	 * 
	 * @param statDto
	 * @return
	 */
	public List<StatDto> selectStatListAuction(StatDto statDto);

}
