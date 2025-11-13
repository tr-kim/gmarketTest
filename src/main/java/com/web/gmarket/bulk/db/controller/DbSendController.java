package com.web.gmarket.bulk.db.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.web.gmarket.common.utils.ConstantsUtils;

@Controller
@RequestMapping("/view")
public class DbSendController {
	
	@GetMapping("/dbSend")
	public String dbSend(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/top_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.DB_SEND);
		model.addAttribute("GMARKET_REJECT_NUM", ConstantsUtils.GMARKET_REJECT_NUM);
		model.addAttribute("AUCTION_REJECT_NUM", ConstantsUtils.AUCTION_REJECT_NUM);
		
		return "view/bulk/db_send";
	}
	
	@GetMapping("/dbSend/left")
	public String left(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/left_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.DB_SEND);
		model.addAttribute("GMARKET_REJECT_NUM", ConstantsUtils.GMARKET_REJECT_NUM);
		model.addAttribute("AUCTION_REJECT_NUM", ConstantsUtils.AUCTION_REJECT_NUM);
		
		return "view/bulk/db_send";
	}
}