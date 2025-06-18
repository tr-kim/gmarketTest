package com.web.gmarket.stat.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/view")
public class StatController {
	
	@GetMapping("/stat")
	public String stat(Model model) {
		
		model.addAttribute("layout", "/layouts/top_layout");
		model.addAttribute("active", "stat");
		
		return "view/stat";
	}
	
	@GetMapping("/stat/left")
	public String left(Model model) {
		
		model.addAttribute("layout", "/layouts/left_layout");
		model.addAttribute("active", "stat");
		
		return "view/stat";
	}
}