package com.web.gmarket;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.web.gmarket.common.utils.ConstantsUtils;

import jakarta.servlet.http.HttpSession;

@Controller
public class LoginController{
	
	@GetMapping("/login")
	public String login(Authentication authentication, HttpSession session, Model model) {
		
		// 이미 로그인된 사용자면 /index 으로 리다이렉트
		if (authentication != null && authentication.isAuthenticated()) {
	        return "redirect:/index";
	    }
		
		Boolean duplicated = (Boolean) session.getAttribute(ConstantsUtils.DUPLICATE_LOGIN);
	    if (Boolean.TRUE.equals(duplicated)) {
	        model.addAttribute(ConstantsUtils.DUPLICATE_LOGIN, true);
	        session.removeAttribute(ConstantsUtils.DUPLICATE_LOGIN); // 1회성 메시지
	    }
	    
	    Boolean notUse = (Boolean) session.getAttribute(ConstantsUtils.NOT_USE);
	    if (Boolean.TRUE.equals(notUse)) {
	        model.addAttribute(ConstantsUtils.NOT_USE, true);
	        session.removeAttribute(ConstantsUtils.NOT_USE);
	    }
	    
	    Boolean notUser = (Boolean) session.getAttribute(ConstantsUtils.NOT_USER);
	    if (Boolean.TRUE.equals(notUser)) {
	        model.addAttribute(ConstantsUtils.NOT_USER, true);
	        session.removeAttribute(ConstantsUtils.NOT_USER);
	    }
	    
	    Boolean notMatch = (Boolean) session.getAttribute(ConstantsUtils.PASSWORD_NOT_MATCH);
	    if (Boolean.TRUE.equals(notMatch)) {
	        model.addAttribute(ConstantsUtils.PASSWORD_NOT_MATCH, true);
	        session.removeAttribute(ConstantsUtils.PASSWORD_NOT_MATCH);
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