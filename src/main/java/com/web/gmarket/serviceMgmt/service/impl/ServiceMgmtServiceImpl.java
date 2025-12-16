package com.web.gmarket.serviceMgmt.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

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
        return commonService.getServiceMgmtMapper()
                            .selectServiceList(serviceMgmtDto);
    }

    @Override
    public void updateServiceCheckBit(List<ServiceMgmtDto> list) {

        for (ServiceMgmtDto dto : list) {
            commonService.getServiceMgmtMapper()
                         .updateServiceCheckBit(dto);
        }
    }
}

