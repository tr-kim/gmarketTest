package com.web.gmarket.serviceMgmt.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.serviceMgmt.service.ServiceMgmtService;

@Service
public class ServiceMgmtServiceImpl implements ServiceMgmtService {

	@Autowired
	private CommonService commonService;
}
