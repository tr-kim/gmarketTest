package com.web.gmarket;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController{
	
	@GetMapping("/")
	public String redirectToIndex() {
		return "redirect:/index";
	}
	
	@GetMapping("/index")
	public String index() {
		return "index"; // templates/index.html 렌더링
	}
}