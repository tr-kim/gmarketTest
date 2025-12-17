package com.web.gmarket.serviceMgmt.service;

import java.util.List;

import com.web.gmarket.serviceMgmt.dto.ServiceMgmtDto;

public interface ServiceMgmtService {

    List<ServiceMgmtDto> getServiceMgmtList(ServiceMgmtDto serviceMgmtDto);

    void updateTrueCheckBit(List<ServiceMgmtDto> list);
	
}
