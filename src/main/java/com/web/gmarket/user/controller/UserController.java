package com.web.gmarket.user.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/view")
public class UserController {
	
	@GetMapping("/user")
	public String user(Model model) {
		
		model.addAttribute("layout", "/layouts/top_layout");
		model.addAttribute("active", "user");
		
		return "view/user";
	}
	
	@GetMapping("/user/left")
	public String left(Model model) {
		
		model.addAttribute("layout", "/layouts/left_layout");
		model.addAttribute("active", "user");
		
		return "view/user";
	}
}