package com.web.gmarket.serviceMgmt.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.serviceMgmt.dto.ServiceMgmtDto;

@Mapper
public interface ServiceMgmtMapper {
	
    List<ServiceMgmtDto> selectServiceList(ServiceMgmtDto serviceMgmtDto);

    void updateServiceCheckBit(ServiceMgmtDto serviceMgmtDto);
}
