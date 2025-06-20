package com.web.gmarket;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ErrorController{
	
	@GetMapping("/error/redirect")
	public String redirectToIndex() {
		return "redirect";
	}
}