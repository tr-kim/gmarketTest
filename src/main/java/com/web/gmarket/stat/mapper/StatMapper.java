package com.web.gmarket.stat.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.stat.dto.StatDto;

@Mapper
public interface StatMapper {
	
	/**
	 * 옥션 정산/통계 목록 갯수
	 * 
	 * @param statDto
	 * @return
	 */
	public int selectAuctionStatListCount(StatDto statDto);
	
	/**
	 * 옥션 정산/통계 목록 조회
	 * 
	 * @param statDto
	 * @return
	 */
	public List<StatDto> selectAuctionStatList(StatDto statDto);
	
	
	/**
	 * 정산/통계 목록 갯수
	 * 
	 * @param statDto
	 * @return
	 */
	public int selectGmarketStatListCount(StatDto statDto);
	
	/**
	 * 지마켓 정산/통계 목록 조회
	 * 
	 * @param statDto
	 * @return
	 */
	public List<StatDto> selectGmarketStatList(StatDto statDto);

}
