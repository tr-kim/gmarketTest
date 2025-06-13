package com.web.gmarket;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController{
	
	@GetMapping("/login1")
	public String login1() {
		return "login1";
	}

	@GetMapping("/login2")
	public String login2() {
		return "login2";
	}

	@GetMapping("/login3")
	public String login3() {
		return "login3";
	}
}