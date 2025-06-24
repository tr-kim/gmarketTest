package com.web.gmarket;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpSession;

@Controller
public class LoginController{
	
	@GetMapping("/login")
	public String login(Authentication authentication, HttpSession session, Model model) {
		
		// 이미 로그인된 사용자면 /index 으로 리다이렉트
		if (authentication != null && authentication.isAuthenticated()) {
	        return "redirect:/index";
	    }
		
		Boolean duplicated = (Boolean) session.getAttribute("DUPLICATE_LOGIN");
	    if (Boolean.TRUE.equals(duplicated)) {
	        model.addAttribute("duplicateLogin", true);
	        session.removeAttribute("DUPLICATE_LOGIN"); // 1회성 메시지
	    }
		
		return "login";
	}
	
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