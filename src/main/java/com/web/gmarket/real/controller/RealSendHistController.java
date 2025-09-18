package com.web.gmarket.real.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.web.gmarket.common.utils.ConstantsUtils;

@Controller
@RequestMapping("/view")
public class RealSendHistController {
	
	@GetMapping("/real")
	public String real(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/top_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.REAL);
		
		return "view/real_send_hist";
	}
	
	@GetMapping("/real/left")
	public String left(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/left_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.REAL);
		
		return "view/real_send_hist";
	}
	
	@GetMapping("/real/left2")
	public String left2(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/left_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.REAL);
		
		return "view/real_send_hist_old2";
	}
	
	@GetMapping("/real/left3")
	public String left3(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/left_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.REAL);
		
		return "view/real_send_hist_old3";
	}
	
	// 지마켓 상세
	@GetMapping("/real/detail/gmarket")
	public String gmarketDetail() {
		
		return "detailGmarket";
	}
	
	// 옥션 상세
	@GetMapping("/real/detail/auction")
	public String auctionDetail() {
		
		return "detailAuction";
	}
	
	// 스마일캐시 상세
	@GetMapping("/real/detail/smilecash")
	public String smilecashDetail() {
		
		return "detailSmilecash";
	}
}