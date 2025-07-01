package com.web.gmarket;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
	
	@GetMapping("/")
	public String redirectToIndex() {
		return "redirect:/index";
	}
	
	@GetMapping("/index")
	public String index(Model model) {
		
		model.addAttribute("layout", "/layouts/top_layout");
		return "index"; // templates/index.html 렌더링
	}
	
	@GetMapping("/index/left")
	public String left(Model model) {
		
		model.addAttribute("layout", "/layouts/left_layout");
		return "index"; // templates/index.html 렌더링
	}
}