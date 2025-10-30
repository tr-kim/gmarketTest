package com.web.gmarket.real.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.web.gmarket.real.dto.RealDto;
import com.web.gmarket.real.dto.ServiceStatusDetailDto;
import com.web.gmarket.real.dto.ServiceStatusSummaryDto;

@Mapper
public interface RealMapper {
	
	/**
	 * 전체 현황
	 * 
	 * @param totalMonTime
	 * @return
	 */
	public List<RealDto> selectRealHistTotalList(@Param(value = "totalMonTime") int totalMonTime, @Param(value = "alarmFlag") int alarmFlag, @Param(value = "codeList") List<Integer> codeList);
	
	/**
	 * 옥션 및 지마켓 전체 테이블 현황
	 * 
	 * @param companyCode
	 * @return
	 */
	public RealDto selectRealHistList(@Param(value = "codeList") List<Integer> codeList);
	
	/**
	 * 테이블별 현황
	 * 
	 * @param tableCode
	 * @return
	 */
	public List<RealDto> selectRealHistTableList(@Param(value = "codeList") List<Integer> codeList);
	
	/**
	 * 서비스 / 프로세스 요약
	 * 
	 * @return
	 */
	public List<ServiceStatusSummaryDto> selectRealHistServiceStatusSummaryList();
	
	/**
	 * 서비스 / 프로세스 상세
	 * 
	 * @return
	 */
	public List<ServiceStatusDetailDto> selectRealHistServiceStatusDetailList();

}
