package com.web.gmarket.common.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.common.dto.ServiceInfoDto;

@Mapper
public interface ServiceInfoMapper {

	/**
	 * 서비스명 목록 조회(중복 제거)
	 * 
	 * @param companyCode
	 * @return
	 */
	public List<ServiceInfoDto> selectServiceNameList();
	
}
