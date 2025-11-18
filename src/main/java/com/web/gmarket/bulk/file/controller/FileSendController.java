package com.web.gmarket.bulk.file.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.web.gmarket.common.utils.ConstantsUtils;

@Controller
@RequestMapping("/view")
public class FileSendController {
	
	@GetMapping("/fileSend")
	public String fileSend(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/top_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.FILE_SEND);
		model.addAttribute("GMARKET_REJECT_NUM", ConstantsUtils.GMARKET_REJECT_NUM);
		model.addAttribute("AUCTION_REJECT_NUM", ConstantsUtils.AUCTION_REJECT_NUM);
		model.addAttribute("GMARKET_CALLBACK_NUM", ConstantsUtils.GMARKET_CALLBACK_NUM);
		model.addAttribute("AUCTION_CALLBACK_NUM", ConstantsUtils.AUCTION_CALLBACK_NUM);

		return "view/bulk/file_send";
	}
	
	@GetMapping("/fileSend/left")
	public String left(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/left_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.FILE_SEND);
		model.addAttribute("GMARKET_REJECT_NUM", ConstantsUtils.GMARKET_REJECT_NUM);
		model.addAttribute("AUCTION_REJECT_NUM", ConstantsUtils.AUCTION_REJECT_NUM);
		model.addAttribute("GMARKET_CALLBACK_NUM", ConstantsUtils.GMARKET_CALLBACK_NUM);
		model.addAttribute("AUCTION_CALLBACK_NUM", ConstantsUtils.AUCTION_CALLBACK_NUM);
		
		return "view/bulk/file_send";
	}
}