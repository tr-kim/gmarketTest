package com.web.gmarket.serviceMgmt.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.web.gmarket.serviceMgmt.dto.ServiceMgmtDto;

@Mapper
public interface ServiceMgmtMapper {
	
    List<ServiceMgmtDto> selectServiceList(ServiceMgmtDto serviceMgmtDto);

    void updateServiceCheckBit(ServiceMgmtDto serviceMgmtDto);

    void allFalseServiceCheckBit(
        @Param("companyCode1") String companyCode1,
        @Param("companyCode2") String companyCode2
    );
}
