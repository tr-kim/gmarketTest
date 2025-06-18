package com.web.gmarket.real.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/view")
public class RealSendHistController {
	
	@GetMapping("/real")
	public String real(Model model) {
		
		model.addAttribute("layout", "/layouts/top_layout");
		model.addAttribute("active", "real");
		
		return "view/real_send_hist";
	}
	
	@GetMapping("/real/left")
	public String left(Model model) {
		
		model.addAttribute("layout", "/layouts/left_layout");
		model.addAttribute("active", "real");
		
		return "view/real_send_hist";
	}
}