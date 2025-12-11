package com.web.gmarket.serviceMgmt.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.web.gmarket.common.dto.ServiceInfoDto;
import com.web.gmarket.common.mapper.ServiceInfoMapper;
import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.common.utils.ConstantsUtils;

@Controller
@RequestMapping("/view")
public class ServiceMgmtController {
	
	@Autowired
	private CommonService commonService;
	
	@GetMapping("/service")
	public String service(Model model) {
		// 회사별 서비스 목록 조회
		ServiceInfoMapper mapper = commonService.getServiceInfoMapper();
		
		List<ServiceInfoDto> auctionList = mapper.selectServiceGroupList(ConstantsUtils.AUCTION_CODE);
		List<ServiceInfoDto> gmarketList = mapper.selectServiceGroupList(ConstantsUtils.GMARKET_CODE);
		List<ServiceInfoDto> smileList = mapper.selectServiceGroupList(ConstantsUtils.SMILE_CASH_CODE);
		
		model.addAttribute("auctionList", auctionList);
		model.addAttribute("gmarketList", gmarketList);
		model.addAttribute("smileList", smileList);
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/top_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.SERVICE);
		
		return "view/service_mgmt";
	}
	
	@GetMapping("/service/left")
	public String left(Model model) {
		// 회사별 서비스 목록 조회
		ServiceInfoMapper mapper = commonService.getServiceInfoMapper();
		
		List<ServiceInfoDto> auctionList = mapper.selectServiceGroupList(ConstantsUtils.AUCTION_CODE);
		List<ServiceInfoDto> gmarketList = mapper.selectServiceGroupList(ConstantsUtils.GMARKET_CODE);
		List<ServiceInfoDto> smileList = mapper.selectServiceGroupList(ConstantsUtils.SMILE_CASH_CODE);
		
		model.addAttribute("auctionList", auctionList);
		model.addAttribute("gmarketList", gmarketList);
		model.addAttribute("smileList", smileList);
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/left_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.SERVICE);
		
		return "view/service_mgmt";
	}
}