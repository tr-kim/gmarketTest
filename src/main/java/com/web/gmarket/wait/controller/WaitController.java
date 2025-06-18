package com.web.gmarket.wait.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/view")
public class WaitController {
	
	@GetMapping("/wait")
	public String waitSmsHist(Model model) {
		
		model.addAttribute("layout", "/layouts/top_layout");
		model.addAttribute("active", "wait");
		
		return "view/wait_sms_hist";
	}
	
	@GetMapping("/wait/left")
	public String left(Model model) {
		
		model.addAttribute("layout", "/layouts/left_layout");
		model.addAttribute("active", "wait");
		
		return "view/wait_sms_hist";
	}
}