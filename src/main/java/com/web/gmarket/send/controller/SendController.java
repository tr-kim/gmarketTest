package com.web.gmarket.send.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.web.gmarket.common.utils.ConstantsUtils;

@Controller
@RequestMapping("/view")
public class SendController {
	
	@GetMapping("/send")
	public String send(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/top_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.SEND);
		
		return "view/send";
	}
	
	@GetMapping("/send/left")
	public String left(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/left_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.SEND);
		
		return "view/send";
	}
}