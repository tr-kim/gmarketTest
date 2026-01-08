package com.web.gmarket.real.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.web.gmarket.real.dto.RealDto;
import com.web.gmarket.real.dto.ServiceStatusDetailDto;
import com.web.gmarket.real.dto.ServiceStatusSummaryDto;
import com.web.gmarket.real.dto.SummaryProcCountDto;
import com.web.gmarket.real.dto.ServiceStatusFailoverDto;

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
	 * 옥션 및 G마켓 전체 테이블 현황
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
	public List<ServiceStatusSummaryDto> selectRealHistServiceStatusSummaryList(@Param(value = "tab") int tab);
	
	/**
	 * 서비스 / 프로세스 상세
	 * 
	 * @return
	 */
	public List<ServiceStatusDetailDto> selectRealHistServiceStatusDetailList(@Param(value = "tab") int tab);

	/**
	 * 서버 상태 목록 조회
	 * 
	 * @return
	 */
	public List<ServiceStatusFailoverDto> selectServerStatusList();

	/**
	 * 프로세스 다운 상태 조회
	 *
	 * @return
	 */
	int selectDownCount(ServiceStatusFailoverDto dto);

	/**
	 * 수동 절체 FLAG 업데이트
	 * 
	 * @return
	 */
	public void updateServerFlag(ServiceStatusFailoverDto dto);

	/**
	 * 서비스 상태별 카운트 조회
	 * 
	 * @return
	 */
	public List<SummaryProcCountDto> selectSummaryProcCount();

	/**
	 * 서비스 상태별 서비스명 조회
	 * 
	 * @return
	 */
	public List<SummaryProcCountDto> selectSummaryProcName();
	
}
