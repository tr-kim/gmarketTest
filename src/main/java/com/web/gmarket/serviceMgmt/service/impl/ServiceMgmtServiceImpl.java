package com.web.gmarket.serviceMgmt.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.serviceMgmt.dto.ServiceMgmtDto;
import com.web.gmarket.serviceMgmt.service.ServiceMgmtService;

@Service
public class ServiceMgmtServiceImpl implements ServiceMgmtService {
	
	private final CommonService commonService;
	
	public ServiceMgmtServiceImpl(CommonService commonService) {
		this.commonService = commonService;
	}
	
	@Override
	public List<ServiceMgmtDto> getServiceMgmtList(ServiceMgmtDto serviceMgmtDto) {
		return commonService.getServiceMgmtMapper().selectServiceList(serviceMgmtDto);
	}
	
	@Transactional
	@Override
	public void updateServiceMgmt(List<ServiceMgmtDto> list) {
		// 전체 false
		commonService.getServiceMgmtMapper().updateFalseCheckBit(
			list.get(0).getCompanyCode1(),
			list.get(0).getCompanyCode2()
		);
		
		// 선택 대상만 true
		for (ServiceMgmtDto dto : list) {
			commonService.getServiceMgmtMapper().updateTrueCheckBit(dto);
		}
	}
}
