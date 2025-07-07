package com.web.gmarket.real.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.web.gmarket.real.dto.RealDto;

@Mapper
public interface RealMapper {
	
	/**
	 * 전체 현황
	 * 
	 * @param totalMonTime
	 * @return
	 */
	public List<RealDto> selectRealHistTotalList(@Param(value = "totalMonTime") int totalMonTime, @Param(value = "alarmFlag") int alarmFlag);
	
	/**
	 * 옥션 및 지마켓 전체 테이블 현황
	 * 
	 * @param companyCode
	 * @return
	 */
	public RealDto selectRealHistList(@Param(value = "companyCode") int companyCode);
	
	/**
	 * 테이블별 현황
	 * 
	 * @param tableCode
	 * @return
	 */
	public RealDto selectRealHistTableList(@Param(value = "tableCode") int tableCode);

}
