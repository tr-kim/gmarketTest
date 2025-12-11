package com.web.gmarket.serviceMgmt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.common.utils.ConstantsUtils;

@Controller
@RequestMapping("/view")
public class ServiceMgmtController {
	
	@Autowired
	private CommonService commonService;
	
	@GetMapping("/service")
	public String service(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/top_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.SERVICE);
		
		return "view/service_mgmt";
	}
	
	@GetMapping("/service/left")
	public String left(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/left_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.SERVICE);
		
		return "view/service_mgmt";
	}
}