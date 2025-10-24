package com.web.gmarket.real.controller;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.common.utils.ConstantsUtils;

@Controller
@RequestMapping("/view")
public class RealSendHistController {

	@Autowired
	private CommonService commonService;

	@GetMapping("/real")
	public String real(Model model) {

		// 서비스 명 목록 전체 조회
		model.addAttribute(ConstantsUtils.LIST, commonService.getServiceInfoMapper().selectServiceNameList());
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/top_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.REAL);

		return "view/real_send_hist";
	}

	@GetMapping("/real/left")
	public String left(Model model) {

		// 서비스 명 목록 전체 조회
		model.addAttribute(ConstantsUtils.LIST, commonService.getServiceInfoMapper().selectServiceNameList());
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/left_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.REAL);

		return "view/real_send_hist";
	}

	// 기존 화면(요구사항 전)
	@GetMapping("/real/old")
	public String realOld(Model model) {

		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/top_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.REAL);

		return "view/real_send_hist_old";
	}

	@GetMapping("/real/old/left")
	public String leftOld(Model model) {

		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/left_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.REAL);

		return "view/real_send_hist_old";
	}

	// 지마켓 상세
	@GetMapping("/real/detail/gmarket")
	public String gmarketDetail(Model model) {

		model.addAttribute(ConstantsUtils.LIST, commonService.getServiceInfoMapper().selectServiceNameList().stream().filter(h -> h.getCompanyCode() == ConstantsUtils.GMARKET_CODE).collect(Collectors.toList()));
		
		return "/view/popup/detailGmarket";
	}

	// 옥션 상세
	@GetMapping("/real/detail/auction")
	public String auctionDetail(Model model) {

		model.addAttribute(ConstantsUtils.LIST, commonService.getServiceInfoMapper().selectServiceNameList().stream().filter(h -> h.getCompanyCode() == ConstantsUtils.AUCTION_CODE).collect(Collectors.toList()));
		
		return "/view/popup/detailAuction";
	}

	// 스마일캐시 상세
	@GetMapping("/real/detail/smilecash")
	public String smilecashDetail(Model model) {
		
		model.addAttribute(ConstantsUtils.LIST, commonService.getServiceInfoMapper().selectServiceNameList().stream().filter(h -> h.getCompanyCode() == ConstantsUtils.SMILE_CASH_CODE).collect(Collectors.toList()));

		return "/view/popup/detailSmilecash";
	}
}